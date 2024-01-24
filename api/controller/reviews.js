import express from "express"
import prisma from "../server.js";
const router = express.Router();
import userauthenticate from "../middleware/user_authenticate.js";
import reviewModel from "../models/Review Model.js";

// get all Review
router.get('/',userauthenticate, async (req, res) => {
    try {
      const reviews = await reviewModel.find().populate([{path:"user", select:"-password"},{path:"book"}]) ;
      if (reviews) {
        res.status(200).json(reviews);
      } else {
          res.status(404).json({ message: 'reviewes not found' });
      }
      } catch(err) {
        res.status(500).json({ message: 'Failed to get reviewes ' });
      }
  });
  
  // Get ID Review
  router.get('/:id',userauthenticate, async (req, res) => {
      try {
        const { id } = req.params;
          const reviewe = await reviewModel.findById(id)
        
  
          if(reviewe) {
              res.status(200).json(reviewe);
          } else {
              res.status(404).json({ message: 'reviewes  not found' });
          }
      } catch(err) {
          res.status(500).json({ message: 'Failed to get reviewes ' });
      }
  });
  
  // Add Review
  router.post('/:id', userauthenticate, async (req, res) => {
    try {
      const { review } = req.body;
      const bookId= req.params.id
      // user role 
      const adminRole = req.user.role;
  
      const userId = req.user.id;
      if (adminRole === "admin") {
        return res.status(403).json({ status: 403, message: "must be user!" });
      }
  
      const reviewe = await reviewModel.create({
        review,
        user: userId,
        book:bookId,
      });
  
      if (!reviewe) {
     
     return   res.status(400).json({ message: 'reviews not created' });
      }
      res.status(200).json({message:'reviewas was created'})
    } catch (err) {
      res.status(500).json({ message: 'Failed to add reviews', errmessage:err });
    }
  });
  
  // Update Review
  router.put("/:id",userauthenticate , async (req, res) => {
    try {
      const userId = req.user.id
      const { id } = req.params;
      const {  review } = req.body;
  
      const updateReview = await reviewModel.findByIdAndUpdate(
        {        _id:id
        },
  
       {
        review,
          user:userId
        
  
        },
      );
  
      if (!updateReview) {
        return res
          .status(400)
          .json({ status: 400, message: "Review was not updated!" });
      }
  
      res.status(200).json({ status: 200, message: "Review successFully update" });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  });
  /// Delete book
  router.delete("/:id", userauthenticate, async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleteReview = await reviewModel.findByIdAndDelete(id)
  
      if (!deleteReview) {
        return res
          .status(400)
          .json({ status: 400, message: "Review was not deleted!" });
      }
  
      res
        .status(200)
        .json({ status: 200, message: `Review ${id} successFully deleted` });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  });


export default router