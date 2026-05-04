import express from "express";

const router = express.Router();

router.get("/create-token", (req,res) => {
    res.send("You can create a token from here")
})

export default router;