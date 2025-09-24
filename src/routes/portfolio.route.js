import { Router } from "express";
import {
  addPortfolioHandler,
  deletePortfolioHandler,
  getPortfolioHandler,
} from "../controllers/portfolio.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/add-portfolio")
  .post(verifyJwt, upload.single("image"), addPortfolioHandler);

router.route("/delete-portfolio").post(verifyJwt, deletePortfolioHandler);

router.route("/get-portfolios").get(getPortfolioHandler);

export default router;
