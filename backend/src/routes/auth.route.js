import express from "express";
import { connectwallet } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/connectWallet", connectwallet);

router.get("/disconnect-wallet", (req,res) => {
    res.send("disconnect wallet comming soon")
})


export default router;
