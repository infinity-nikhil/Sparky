import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        walletAddress: {
            type: String,
            required: true,
            unique: true,
        }
    },
    { timestamps: true } //created at and updated at 
)

const User = mongoose.model('user', userSchema);

export default User;