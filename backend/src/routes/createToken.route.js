import express from "express";
import { createToken, uploadMiddleware } from "../controller/token.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/createToken",protectRoute, uploadMiddleware, createToken);

export default router;