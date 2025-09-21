import { ApiError } from "../utils/ApiError.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";

const options = {
  httpOnly: true,
  secure: true,
};

export const loginHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "Email and password are required");
  }
  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    throw new ApiError(404, "Incorrect email, user not found");
  }

  const validatePassword = await foundUser.isPasswordCorrect(password);

  if (!validatePassword) {
    throw new ApiError(404, "Incorrect password");
  }

  const token = await foundUser.generateToken();

  if (!token) {
    throw new ApiError(500, "Something went wrong while generating token");
  }

  const user = await User.findById(foundUser._id).select("-password");

  return res
    .status(200)
    .cookie("token", token, options)
    .json(
      new ApiResponse(200, { user, token }, "logged in successfully", token)
    );
});
