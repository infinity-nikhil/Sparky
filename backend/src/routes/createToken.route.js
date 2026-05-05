import express from "express";
import { createToken, uploadMiddleware } from "../controller/token.controller";

const router = express.Router();

router.get("/createToken", uploadMiddleware, createToken);

export default router;