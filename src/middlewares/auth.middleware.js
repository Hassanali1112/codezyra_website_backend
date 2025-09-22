import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import jwt from "jsonwebtoken";


export const verifyJwt = asyncHandler(async (req, _, next)=>{

  const token = req.cookies?.token || req.header("Authorization").replace("Bearer ", "")

  if(!token){
    throw new ApiError(400, "Token not provided")
  }

 const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET)

 const user = await User.findById(decodedToken._id).select("-password")

 if(!user){
  throw new ApiError(401, "Invalid token")
 }

 req.user = user
 next()
})