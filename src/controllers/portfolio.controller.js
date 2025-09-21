import { request } from "express";
import { Portfolio } from "../models/portfolio.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { uploadToCloudinary } from "../utils/cloudinaryConfig.util.js";

export const addPortfolioHandler = asyncHandler(async (req, res) => {
  const {tag, link} = req.body
  

  if([tag, link].some(fields => fields.trim() === "")){
    throw new ApiError(401, "All fields are required")
  }

  const localFilePath = req.file?.path

  if(!localFilePath){
    throw new ApiError(401, "Portfolio image file is required");
  }

  const portfolioImageFile = await uploadToCloudinary(localFilePath)
  console.log(portfolioImageFile)
  if(!portfolioImageFile){
    throw new ApiError(401, "Portfolio image file is required");
  }

  const portfolio = await Portfolio.create({
    tag,
    link,
    image: portfolioImageFile.secure_url,
  });
  
  return res.status(200).json(new ApiResponse(200, portfolio, "Uploaded succussfully" ));
});


