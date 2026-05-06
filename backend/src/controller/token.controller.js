import { VersionedTransaction, Connection, Keypair } from "@solana/web3.js";
import { z } from "zod";
import "dotenv/config";
import bs58 from "bs58";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";
import Agent from "../models/Agent.js";

// ─────────────────────────────────────────────
// Multer — store uploaded file in memory buffer
// ─────────────────────────────────────────────
const upload = multer({ storage: multer.memoryStorage() });
export const uploadMiddleware = upload.single("image"); // "image" = field name from frontend

// ─────────────────────────────────────────────
// Zod schema — validates incoming request body
// ─────────────────────────────────────────────
const agentDetailsSchema = z.object({
    name:              z.string().min(1),
    symbol:            z.string().optional().default(""),
    initialBuyAmount:  z.number().optional().default(0),
    description:       z.string().min(1),
    twitter:           z.string().optional().default(""),
    telegram:          z.string().optional().default(""),
    website:           z.string().optional().default(""),   // fixed: .optional() not .optional
    personality:       z.string().min(1),
    // NOTE: "image" is NOT in the schema — it arrives via req.file (multer), not req.body
});

// ─────────────────────────────────────────────
// Solana RPC connection
// ─────────────────────────────────────────────
const RPC_ENDPOINT  = "https://api.mainnet-beta.solana.com";
const web3Connection = new Connection(RPC_ENDPOINT, "confirmed");

// ─────────────────────────────────────────────
// Main controller
// ─────────────────────────────────────────────
export const createToken = async (req, res) => {
    try {

        // ── 1. Validate image upload ──────────────────────────────────────
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }

        // Convert multer buffer to base64 data URI for Cloudinary
        const agentImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        // ── 2. Validate and parse request body ───────────────────────────
        const parsedData = agentDetailsSchema.parse({
            ...req.body,
            initialBuyAmount: Number(req.body.initialBuyAmount), // body values are strings, coerce to number
        });

        // ── 3. Check for duplicate agent name ────────────────────────────
        const existingAgent = await Agent.findOne({ name: parsedData.name });
        if (existingAgent) {
            return res.status(400).json({ message: "An agent with this name already exists, please try another." });
        }

        // ── 4. Load private key from environment ─────────────────────────
        const secretKey = process.env.PRIVATE_KEYPAIR;
        if (!secretKey) {
            return res.status(500).json({ error: "Missing PRIVATE_KEYPAIR environment variable" });
        }

        const signerKeyPair = Keypair.fromSecretKey(bs58.decode(secretKey));
        const mintKeypair   = Keypair.generate();

        // ── 5. Build metadata form and upload to IPFS via pump.fun ───────
        const FormData = (await import("form-data")).default;
        const formData  = new FormData();

        formData.append("file", req.file.buffer, {
            filename:    req.file.originalname,
            contentType: req.file.mimetype,
        });
        formData.append("name",        parsedData.name);
        formData.append("symbol",      parsedData.symbol);
        formData.append("description", `${parsedData.description}\n\nPowered by Sparky`);

        const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
            method:  "POST",
            body:    formData,
            headers: formData.getHeaders(),
        });

        if (!metadataResponse.ok) {
            throw new Error(`Failed to upload metadata: ${metadataResponse.statusText}`);
        }

        const metadataJSON = await metadataResponse.json();

        // ── 6. Request signed transaction from PumpPortal ─────────────────
        const tradeResponse = await fetch("https://pumpportal.fun/api/trade-local", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                publicKey:      signerKeyPair.publicKey.toBase58(),
                action:         "create",
                tokenMetadata: {
                    name:   metadataJSON.metadata.name,
                    symbol: metadataJSON.metadata.symbol,
                    uri:    metadataJSON.metadataUri,
                },
                mint:              mintKeypair.publicKey.toBase58(),
                denominatedInSol:  "true",
                amount:            parsedData.initialBuyAmount,
                slippage:          10,
                priorityFee:       0.0005,
                pool:              "pump",
            }),
        });

        if (!tradeResponse.ok) {
            const errorText = await tradeResponse.text();
            throw new Error(`Trade API error: ${errorText}`);
        }

        // ── 7. Deserialize, sign and broadcast transaction ────────────────
        const txData    = await tradeResponse.arrayBuffer();
        const tx        = VersionedTransaction.deserialize(new Uint8Array(txData));
        tx.sign([mintKeypair, signerKeyPair]);
        const signature = await web3Connection.sendTransaction(tx);

        console.log(`Transaction successful: https://solscan.io/tx/${signature}`);

        // ── 8. Only persist agent AFTER the transaction is confirmed ──────
        const newAgent   = new Agent({ ...parsedData });
        const savedAgent = await newAgent.save();

        // ── 9. Upload image to Cloudinary and update agent record ─────────
        const uploadResponse = await cloudinary.uploader.upload(agentImage);

        const updatedAgent = await Agent.findByIdAndUpdate(
            savedAgent._id,
            { image: uploadResponse.secure_url },
            { new: true }
        );

        // ── 10. Return success response ───────────────────────────────────
        return res.status(200).json({
            success:          true,
            signature,
            explorerUrl:      `https://solscan.io/tx/${signature}`,
            agentId:          updatedAgent._id,
            agentName:        updatedAgent.name,
            agentPersonality: updatedAgent.personality,
            agentImage:       updatedAgent.image,
        });

    } catch (error) {
        console.error("createToken error:", error);
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
};