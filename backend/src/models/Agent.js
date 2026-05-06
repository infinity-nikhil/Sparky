import mongoose, { Schema } from "mongoose";
import { symbol } from "zod";

const agentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        symbol: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        twitter: {
            type: String,
            unique: true
        },
        telegram: {
            type: String,
            unique: true
        },
        website: {
            type: true,
            unique: true
        },
        personality: {
            type: String,
            required: true
        },
        image: {
            type: String,
        }
    },
    { timestamps: true }
)

const Agent = mongoose.model("Agent", agentSchema);

export default Agent;
