import mongoose, { Schema } from "mongoose";

const portfolioShema = new Schema(
  {
    tag: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Portfolio = mongoose.model("Portfolio", portfolioShema);
