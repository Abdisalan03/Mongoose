import mongoose from "mongoose";
const ratingSchema = new mongoose.Schema({

    rating  : {
        type: Number,
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

const ratingModel = mongoose.model("Rating", ratingSchema)

export default ratingModel