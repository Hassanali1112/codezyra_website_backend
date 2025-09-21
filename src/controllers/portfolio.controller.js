import { request } from "express";
import { Portfolio } from "../models/portfolio.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { uploadToCloudinary } from "../utils/cloudinaryConfig.util.js";
import fs from "fs";
import { User } from "../models/user.model.js";

export const addPortfolioHandler = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id)

  if( user.role.toLowerCase() !== "admin"){
    throw new ApiError(403, "Unauthorized to perform this action")
  }

  const { tag, link } = req.body;

  if ([tag, link].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const localFilePath = req.file?.path;

  if (!localFilePath) {
    throw new ApiError(400, "Portfolio image file is required");
  }

  if (!req.file.mimetype.startsWith("image/")) {
    fs.unlinkSync(localFilePath);
    throw new ApiError(400, "Only image file is allowed");
  }

  const portfolioImageFile = await uploadToCloudinary(localFilePath);
  console.log(portfolioImageFile);
  if (!portfolioImageFile) {
    throw new ApiError(400, "Portfolio image file is required");
  }

  const portfolio = await Portfolio.create({
    tag,
    link,
    image: portfolioImageFile.secure_url,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, portfolio, "Uploaded succussfully"));
});

export const deletePortfolioHandler = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id);

   if (user.role.toLowerCase() !== "admin") {
     throw new ApiError(403, "Unauthorized to perform this action");
   }
  const { _id } = req.body;

  if (!_id) {
    throw new ApiError(400, "Portfolio Id is required");
  }

  const portfolioToBeDeleted = await Portfolio.findByIdAndDelete(_id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        portfolioToBeDeleted,
        "Portfolio deleted successfully"
      )
    );
});
