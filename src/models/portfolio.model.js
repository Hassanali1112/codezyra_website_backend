import mongoose, { Schema } from "mongoose";

const portfolioShema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    tag: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Portfolio = mongoose.model("Portfolio", portfolioShema);
