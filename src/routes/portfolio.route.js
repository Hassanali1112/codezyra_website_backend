import { Router } from "express";
import { addPortfolioHandler } from "../controllers/portfolio.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/add-portfolio")
  .post(upload.single("image"), addPortfolioHandler);

export default router;
