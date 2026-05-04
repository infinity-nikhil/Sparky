import express from "express";

const router = express.Router();

router.get("/connectwallet", (req,res) => {
    res.send("connet-wallet logic coming soon");
})

router.get("/disconnect-wallet", (req,res) => {
    res.send("disconnect wallet comming soon")
})


export default router;
