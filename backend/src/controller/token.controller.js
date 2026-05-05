import { VersionedTransaction, Connection, Keypair } from "@solana/web3.js";
import { z } from "zod";
import "dotenv/config";
import bs58 from "bs58";
import multer from "multer"; // Handles multipart/form-data from the frontend

// Store file in memory as a buffer instead of saving to disk
const upload = multer({ storage: multer.memoryStorage() });
export const uploadMiddleware = upload.single("image"); // "image" = field name from frontend

const agentDetailsSchema = z.object({
    name: z.string(),
    symbol: z.string(),
    initialBuyAmount: z.number(),
    description: z.string(),
    twitter: z.string(),
    telegram: z.string(),
    website: z.string(),
    personality: z.string(),
    // NOTE: "image" is no longer in the schema — it comes via req.file (multer), not req.body
});

const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const web3Connection = new Connection(RPC_ENDPOINT, "confirmed");

export const createToken = async (req, res) => {
    try {
        // "image" field is now in req.file, all other fields in req.body
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required" });
        }

        const parsedData = agentDetailsSchema.parse({
            ...req.body,
            initialBuyAmount: Number(req.body.initialBuyAmount), // body fields are strings, coerce to number
        });

        const secretKey = process.env.PRIVATE_KEYPAIR;
        if (!secretKey) {
            return res.status(500).json({ error: "Missing PRIVATE_KEYPAIR environment variable" });
        }

        const signerKeyPair = Keypair.fromSecretKey(bs58.decode(secretKey));
        const mintKeypair = Keypair.generate();

        // Prepare metadata upload
        const FormData = (await import("form-data")).default;
        const formData = new FormData();

        // Use the buffer from multer directly — no filesystem needed
        formData.append("file", req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });
        formData.append("name", parsedData.name);
        formData.append("symbol", parsedData.symbol);

        const modifiedDescription = `${parsedData.description}\n\nPowered by Sparky`;
        formData.append("description", modifiedDescription);

        const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
            method: "POST",
            body: formData,
            headers: formData.getHeaders(),
        });

        if (!metadataResponse.ok) {
            throw new Error(`Failed to upload metadata: ${metadataResponse.statusText}`);
        }

        const metadataResponseJSON = await metadataResponse.json();

        const response = await fetch("https://pumpportal.fun/api/trade-local", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                publicKey: signerKeyPair.publicKey.toBase58(),
                action: "create",
                tokenMetadata: {
                    name: metadataResponseJSON.metadata.name,
                    symbol: metadataResponseJSON.metadata.symbol,
                    uri: metadataResponseJSON.metadataUri,
                },
                mint: mintKeypair.publicKey.toBase58(),
                denominatedInSol: "true",
                amount: parsedData.initialBuyAmount,
                slippage: 10,
                priorityFee: 0.0005,
                pool: "pump",
            }),
        });

        if (response.ok) {
            const data = await response.arrayBuffer();
            const tx = VersionedTransaction.deserialize(new Uint8Array(data));
            tx.sign([mintKeypair, signerKeyPair]);
            const signature = await web3Connection.sendTransaction(tx);

            console.log(`Transaction successful: https://solscan.io/tx/${signature}`);
            return res.status(200).json({
                success: true,
                signature,
                explorerUrl: `https://solscan.io/tx/${signature}`,
            });
        } else {
            const errorText = await response.text();
            throw new Error(`Trade API error: ${errorText}`);
        }

    } catch (error) {
        console.error("createToken error:", error);
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
};