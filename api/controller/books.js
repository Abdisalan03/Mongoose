// Create endpoints for books, make sure to use the middleware to authenticate the token
import express from "express";
import userauthenticate from "../middleware/user_authenticate.js";
import bookModel from "../models/bookModel.js";
import ratingModel from "../models/ratingModel.js";
const router = express.Router();

router.get("/",userauthenticate,  async (req, res) => {
  try {
    const books = await bookModel.find().populate("admin", "-password");
    if (books.length === 0) {
      return res.status(404).json({ status: 404, message: "Books not found!" });
    }

    res.json(books);
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
});

router.get("/:id", userauthenticate ,async (req, res) => {
  try {
    const { id } = req.params;

    const book = await bookModel.findById(id)
    const reviews = await ratingModel.find({
      book: id
    });

    if (!book) {
      return res.status(404).json({ status: 404, message: "Book not found" });
    }

    res.json({...book, reviews: reviews});
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

router.post("/", userauthenticate, async (req, res) => {
  try {
    const { title, author, year, description,price,image } = req.body;
    // user role 
    const userRole = req.user.role

    const adminId = req.user.id
    if(userRole=== "user"){
      return res.status(403)
      .json({ status: 403, messsage: "most be Admin !" });
    }

    const newBook = await bookModel.create({
  
        title,
        author,
        year,
        admin:adminId,
        description,
        price,
        image,
    
    });

    if (!newBook) {
      return res
        .status(400)
        .json({ status: 400, messsage: "Book was not created!" });
    }

    res
      .status(200)
      .json({ status: 200, message: "Book successFully created!" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});
/// Update book
router.put("/:id",userauthenticate , async (req, res) => {
  try {
    const adminId = req.user.id
    const { id } = req.params;
    const { title, author, year,description,price,image  } = req.body;

    const updateBook = await bookModel.findByIdAndUpdate(
      {        _id:id
      },

     {
        title,
        price,
        author,
        admin:adminId,
        description,
        year,
        image,

      },
    );

    if (!updateBook) {
      return res
        .status(400)
        .json({ status: 400, message: "Book was not updated!" });
    }

    res.status(200).json({ status: 200, message: "Book successFully update" });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});
/// Delete book
router.delete("/:id", userauthenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const deleteBook = await bookModel.findByIdAndDelete(id)

    if (!deleteBook) {
      return res
        .status(400)
        .json({ status: 400, message: "Book was not deleted!" });
    }

    res
      .status(200)
      .json({ status: 200, message: `Book ${id} successFully deleted` });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

export default router;