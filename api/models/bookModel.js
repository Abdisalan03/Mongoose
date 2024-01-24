import mongoose from "mongoose";
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        
    },
    price: {
        type: Number,
        required: true,
      
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps: true})

const bookModel = mongoose.model("Book", bookSchema)

export default bookModel