import express from "express"
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from 'cors'
// import adminRoutes from './admin.js'
import userRoutes from './controller/users.js';
import bookRoutes from './controller/books.js'
import reviewRoutes from './controller/reviews.js'
import ratingRoutes from './controller/rating.js'

const server = express()
dotenv.config()
server.use(cors());
// Middleware
server.use(express.json())
// connection mongodb
mongoose.connect(process.env.DATABASE_URL,
   
).then(() => {
    console.log("Connected MongoDB")
}).catch((error) => {
    console.log("Connecting MongoDB Error:", error)
})
// Routes
server.use('/users', userRoutes);
server.use('/books', bookRoutes);
server.use('/reviews', reviewRoutes);
server.use('/ratings', ratingRoutes);




export default server