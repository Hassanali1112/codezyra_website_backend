import { Router } from "express";
import { loginHandler } from "../controllers/user.controller.js";

const router = Router();

router.route("/login").post(loginHandler);

export default router;
