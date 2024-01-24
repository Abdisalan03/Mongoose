import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    avatar: {
        type: String,
        default: "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "user"]
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps: true})

const userModel = mongoose.model("User", userSchema)

export default userModel