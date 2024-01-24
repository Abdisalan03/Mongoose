import express from "express";
import userauthenticate from "../middleware/user_authenticate.js";
import ratingModel from "../models/ratingModel.js";
const router = express.Router();

// get all Rating
router.get('/', userauthenticate,async (req, res) => {
    try {
        const ratings = await ratingModel.find().populate([{path:"user", select:"-password"},{path:"book"}]) ;
      if (ratings) {
        res.status(200).json(ratings);
      } else {
          res.status(404).json({ message: 'ratings not found' });
      }
      } catch(err) {
        res.status(500).json({ message: 'Failed to get ratings' });
      }
      
  });
  
  // Get ID Rating
  router.get('/:id',userauthenticate, async (req, res) => {
      try {
          const rating = await prisma.rating.findUnique({
              where: {
                  id: Number(req.params.id),
              },
          });
  
          if(rating) {
              res.status(200).json(rating);
          } else {
              res.status(404).json({ message: 'rating not found' });
          }
      } catch(err) {
          res.status(500).json({ message: 'Failed to get rating' });
      }
  });
  
  // Add Rating
  router.post('/:id',userauthenticate, async (req, res) => {
      try {
        const { rating,  review} = req.body;
        const bookId= req.params.id
        // user role 
        const adminRole = req.user.role;
    
        const userId = req.user.id;
        if (adminRole === "admin") {
          return res.status(403).json({ status: 403, message: "must be user!" });
        }
    
        const ratings = await ratingModel.create({
          rating,
          review,
          user: userId,
          book:bookId,
        });
    
        if (!ratings) {
       
       return   res.status(400).json({ message: 'rating not created' });
        }
        res.status(200).json({message:'rating was created'})
      } catch (err) {
        res.status(500).json({ message: 'Failed to add rating', errmessage:err });
      }
    });
  // Update Rating
  router.put("/:id",userauthenticate , async (req, res) => {
    try {
      const userId = req.user.id
      const { id } = req.params;
        const bookId= req.params.id
      const {  rating , review } = req.body;
  
      const updateRating= await ratingModel.findByIdAndUpdate(
        {        _id:id
        },
  
       {
        rating,
        review,
        user:userId
        
  
        },
      );
  
      if (!updateRating) {
        return res
          .status(400)
          .json({ status: 400, message: "Rating was not updated!" });
      }
  
      res.status(200).json({ status: 200, message: "Rating successFully update" });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  });
  /// Delete Rating
  router.delete("/:id", userauthenticate, async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleteRating = await ratingModel.findByIdAndDelete(id)
  
      if (!deleteRating) {
        return res
          .status(400)
          .json({ status: 400, message: "Rating was not deleted!" });
      }
  
      res
        .status(200)
        .json({ status: 200, message: `Rating ${id} successFully deleted` });
    } catch (error) {
      res.status(500).json({ status: 500, message: error.message });
    }
  });

export default router;