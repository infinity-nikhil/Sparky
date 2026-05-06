import express from "express";
import { connectwallet, disconnectWallet } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/connectWallet", connectwallet);

router.post("/disconnectWallet", disconnectWallet);

router.get('/check', protectRoute, (req, res) => res.status(200).json(req.user));


export default router;
