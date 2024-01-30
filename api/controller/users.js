import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import nodemailer from "nodemailer"
import userModel from "../models/usersModel.js";
import userauthenticate from "../middleware/user_authenticate.js";

const SECRET_KEY = process.env.SECTRET_KEY;

const router = express.Router();
// User Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ status: 409, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
// create user
    const newUser = await userModel.create({
      name: name,
      email: email,
      role: role,
      password: hashedPassword
    });

    res
      .status(201)
      .json({ status: 201, message: "User created successfully", newUser });
  } catch (error) {
    res
      .status(500)
      .json({
        status: 500,
        message: "Something went wrong",
        error: error.message,
      });
  }
});

/// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isCorrectPassword) {
      return res
        .status(401)
        .json({ status: 401, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      SECRET_KEY,
      { expiresIn: "7w" }
    );

    res
      .status(200)
      .json({ status: 200, message: "User logged in successfully", token });
  } catch (error) {
    res
      .status(500)
      .json({
        status: 500,
        message: "Something went wrong",
        error: error.message,
      });
  }
});

/// User Forgot - Password
router.post('/forgot-password', (req, res) => {
  const {email} = req.body;
  userModel.findOne({email: email})
  .then(user => {
      if(!user) {
          return res.send({Status: "User not existed"})
      } 
      const token = jwt.sign({id: user._id},SECRET_KEY
        , {expiresIn: "1d"})
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: "mafiobio700@gmail.com",
            pass: "aolp patjoxnivuwe",
          }
        });
        
        var mailOptions = {
          from: 'youremail@gmail.com',
          to: user.email,
          subject: 'Reset Password Link',
          text: `http://localhost:5173/reset_password/${user._id}/${token}`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            return res.send({Status: "Success"})
          }
     });
})
})



// User Reset - Password

router.post('/reset-password/:id/:token', (req, res) => {
  const {id, token} = req.params
  const {password} = req.body

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if(err) {
          return res.json({Status: "Error with token"})
      } else {
          bcrypt.hash(password, 10)
          .then(hash => {
              userModel.findByIdAndUpdate({_id: id}, {password: hash})
              .then(u => res.send({Status: "Success"}))
              .catch(err => res.send({Status: err}))
          })
          .catch(err => res.send({Status: err}))
 }
})
})



// User - GET
router.get("/user",userauthenticate,  async (req, res) => {
  try {

    const user = await userModel.findById(req.user.id).select("-password")

    if(!user) {
        return res.status(404).json({status: 404, message: "User not found"})
    }

    res.json(user)
} catch (error) {
    res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
}
});


// User Update - PUT
router.put("/update",userauthenticate,  async (req, res) => {
  try {

      const userId = req.user.id
      const {name, email, avatar} = req.body

      const updatedUser = await userModel.findByIdAndUpdate(
          {_id: userId},
          {
              name: name,
              email: email,
              avatar: avatar
          },
          { new: true } 
      )

      if(!updatedUser) {
          return res.status(400).json({status: 400, message: "User was not updated!"})
      }

      res.status(200).json({status: 200, message: "User updated successfully"})

  } catch (error) {
      res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
  }
})

// User Delete - DELETE
// export const userDelete = async (req, res) => {
//   try {
      
//       const userId = req.user.id

//       const deletedUser = await userModel.findByIdAndDelete({_id: userId})

//       if(!deletedUser) {
//           return res.status(400).json({status: 400, message: "User was not deleted!"})
//       }

//       res.status(200).json({status: 200, message: "User deleted successfully"})

//   } catch (error) {
//       res.status(500).json({status: 500, message: "Internal Server Error", error: error.message})
//   }
// }

export default router;
