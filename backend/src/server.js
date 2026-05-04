import express from "express";

import authRoutes from "./routes/auth.route.js";
import tokenRoutes from "./routes/createToken.route.js";

const app = express();

app.use("/api/auth", authRoutes);
app.use("/api", tokenRoutes);
app.get('/', (req, res) => res.send("hello"))

app.listen(5000, () => console.log("server started"))