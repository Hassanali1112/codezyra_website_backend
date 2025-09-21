import Contact from "../models/contact.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const contactUsHandler = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  if ([firstName, lastName, email, message].some((field) => field === "")) {
    throw new ApiError(401, "All fields are required!!");
  }

  const newContactRequest = await Contact.create({
    firstName,
    lastName,
    email,
    message,
  });
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // or 587
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: "biut liem oydh gvmu",
    },
  });

  const info = await transporter.sendMail({
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact Message`,
    html: `
        <h3>New Contact Request</h3>
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Message send successfully", ""));
});

export { contactUsHandler };
