import { User} from "../models/user.js";
import bcrypt from "bcrypt";
import type { Request,Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { RegisterBody } from "../types/authTypes.js";

export const registerUser = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {

  try{
    const{userName,email,password}=req.body;
    
    
    
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const checkExistingUser=await User.findOne({email});
    if(checkExistingUser){
      return res.status(409).json({
        success: false,
        message: 'User already exists with this username or email'
      })
    }
    const salt=await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt);
const newUser = new User({
  userName,
  email,
  passwordHash: hashedPassword,
});

await newUser.save();
    if(newUser){
        return res.status(201).json({
          success: true,
          message: 'User Registered Succesfully'
        });
      }
      else{
        return res.status(400).json({
          success: true,
          message: 'Could not Register User'
        });

      }
  }catch(e){
    console.log(e);
    res.status(500).json({
      success:false,
      message:'Some Error Ocurred!'
    })
  }
}

export const loginUser = async (
  req: Request<{}, {},RegisterBody >,
  res: Response
) => {
  try{

     const{userName,email,password}=req.body;
     if ((!email && !userName) || !password) {
  return res.status(400).json({
    success: false,
    message: "Email or username and password are required",
  });
}

const checkExistingUser = await User.findOne({
  $or: [
    ...(email ? [{ email: email.toLowerCase().trim() }] : []),
    ...(userName ? [{ userName: userName.trim() }] : []),
  ],
});
    
    if(!checkExistingUser){
      return res.status(401).json({
        success: false,
        message: 'User does not exist. Please Signup with this Email'
      });
    }
    const matchedPassword = await bcrypt.compare(password, checkExistingUser.passwordHash);
    
    if (!matchedPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
     const accessToken=jwt.sign(
      { userId: checkExistingUser._id,userName:checkExistingUser.userName},
      process.env.JWT_SECRET_KEY as string,
      {expiresIn:'24h'}
    )  
     return res.status(200).json({
          success: true,
          message: 'User Logged In Succesfully',
          token: accessToken,
          user: {
            userId: checkExistingUser._id,
            userName: checkExistingUser.userName,
            email: checkExistingUser.email
          }
        });
}
catch(e){
    console.log(e);
    res.status(500).json({
      success:false,
      message:'Some Error Ocurred!'
    })
  }
}