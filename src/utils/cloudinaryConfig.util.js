import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

console.log(process.env.CLOUDINARY_CLOUD_NAME);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (loclFilePath) => {
  try {

    if (!loclFilePath) return null;
    console.log("local file", loclFilePath)

    const response = await cloudinary.uploader.upload(
      loclFilePath,{
      resource_type: "auto",
    });
    
    console.log("response",response)

    if (response && response.url) {
      fs.unlinkSync(loclFilePath);
      return response;
    }
  } catch (error) {
    fs.unlinkSync(loclFilePath);
    console.log("cloudinary upload error", error);
  }
};