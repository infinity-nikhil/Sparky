import express from "express";
import { connectwallet, disconnectWallet } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/connectWallet", connectwallet);

router.post("/disconnectWallet", disconnectWallet);


export default router;
