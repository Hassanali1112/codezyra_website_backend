import { request } from "express";
import { Portfolio } from "../models/portfolio.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiError } from "../utils/ApiError.util.js";
import { uploadToCloudinary } from "../utils/cloudinaryConfig.util.js";
import fs from "fs";
import { User } from "../models/user.model.js";

// get portfolios
export const getPortfolioHandler = asyncHandler(async (req, res) => {
  const porfolios = await Portfolio.find();

  return res
    .status(200)
    .json(new ApiResponse(200, porfolios, "Portolio fetched successfully"));
});

// add portfolio
export const addPortfolioHandler = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.role.toLowerCase() !== "admin") {
    throw new ApiError(403, "Unauthorized to perform this action");
  }

  const { title, description, tag, link } = req.body;

  console.log("body data : ", req.body);

  if ([title, description, tag, link].some((fields) => fields === "")) {
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

  if (!portfolioImageFile) {
    throw new ApiError(400, "Portfolio image file is required");
  }

  console.log("profile image is here");

  const portfolio = await Portfolio.create({
    title,
    description,
    tag,
    link,
    image: portfolioImageFile.secure_url,
  });

  console.log("portfolio data", portfolio);

  return res
    .status(200)
    .json(new ApiResponse(200, portfolio, "Uploaded succussfully"));
});

// delete portfolio
export const deletePortfolioHandler = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.role.toLowerCase() !== "admin") {
    throw new ApiError(403, "Unauthorized to perform this action");
  }
  // const { _id } = req.body;

  // if (!_id) {
  //   throw new ApiError(400, "Portfolio title is required");
  // }

  // const portfolioToBeDeleted = await Portfolio.findByIdAndDelete({ title });
  // --------------------------------------------
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

// update portfolio
const updatePortfolioHandler = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.role.toLowerCase() !== "admin") {
    throw new ApiError(403, "Unauthorized to perform this action");
  }

  const { tag, link } = req.body;

  const imageFileLocalPath = req.file?.path;

  if (!(link && (tag || imageFileLocalPath))) {
    throw new ApiError(
      400,
      "Portfolio link and atleast one field is required!"
    );
  }

  let portfolioImageFile;
  if (imageFileLocalPath) {
    if (!req.file.mimetype.startsWith("image/")) {
      fs.unlinkSync(localFilePath);
      throw new ApiError(400, "Only image file is allowed");
    } else {
      portfolioImageFile = await uploadToCloudinary(imageFileLocalPath);
    }
  }

  const portfolioToUpdate = await Portfolio.findOneAndUpdate(
    { link },
    {
      $set: { link, tag, image: portfolioImageFile.secure_url },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, portfolioToUpdate, "Updated successfully"));
});
