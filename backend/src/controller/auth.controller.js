import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";

export const connectwallet = async (req, res) => {
    const { walletAddress } = req.body;
    try {
        if (!walletAddress) {
            return res.status(400).json({ message: "Please provide the wallet address"});
        }

        const user = await User.findOne({ walletAddress });

        if(!user) {
            const newUser = new User({ walletAddress });
            const savedUser = await newUser.save(); //if this throws an error catch will handle it 
            
            generateToken(savedUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                walletAddress: savedUser.walletAddress,
            })
        } else {
            generateToken(user._id,res)

            res.status(200).json({
                _id: user._id,
                walletAddress: user.walletAddress,
            })
        }
    } catch (error) {
        console.log("Something wnet wrong", error);
        res.status(500).json({ message: "internal server error"});
    }
}

export const disconnectWallet = async (_, res) => {
    res.cookie("jwt","", {maxAge:0})
    res.status(200).json({ message: "Logout was success"})
}