import express from "express";
import { createToken, uploadMiddleware } from "../controller/token.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validateAgentAndRespond } from "../controller/talkAgent.controller.js";
import { testing } from "../controller/fakeRoute.js";

const router = express.Router();

router.post("/createToken",protectRoute, uploadMiddleware, createToken); //can only be tested on main net, So just hoe that it works
router.post("/expolreAgent", protectRoute, validateAgentAndRespond); //fake route exist to test this 
router.post("/test", protectRoute, testing);

export default router;