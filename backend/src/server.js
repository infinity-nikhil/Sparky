import dotenv from "dotenv";
import express from "express";

dotenv.config();

import authRoutes from "./routes/auth.route.js";
import tokenRoutes from "./routes/createToken.route.js";
import { connectDB } from "./lib/db.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", tokenRoutes);
app.get('/', (req, res) => res.send("hello"))

app.listen(process.env.PORT, () => {
    console.log("server started"),
    connectDB()
})