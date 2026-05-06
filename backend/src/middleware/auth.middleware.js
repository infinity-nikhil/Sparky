import jwt from "jsonwebtoken";
import User from "../models/User.js";
import "dotenv/config";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if(!token) return res.status(400).json({ message: "You are not authorizrd"})

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(400).json({ message: "You request has been denied"})

        const user = await User.findById(decoded.userId)
        if(!user) return res.status(400).json({ message: "user not found"});

        req.user =user;
        next();
    } catch (error) {
        console.log(`There were some error from auth.middleware.js ${error}`)
        res.status(500).json({ message: "Internal server error in protect route"})
    }
}