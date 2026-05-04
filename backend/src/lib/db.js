import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo DB connected successfully!")
    } catch (error) {
        console.error("Error connecting mongo DB", error);
        process.exit(1); // 1 status code means fail, 0 means success
    }
}