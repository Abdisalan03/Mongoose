import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    review : {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    book: {
        type: mongoose.Types.ObjectId,
        ref: "Book",
        required: true,
    }
}, {timestamps: true})

const reviewModel = mongoose.model("Review", reviewSchema)

export default reviewModel