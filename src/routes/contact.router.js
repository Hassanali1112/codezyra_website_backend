import { Router } from "express";
import { contactUsHandler } from "../controllers/contact.controller.js";

const router = Router();

router.route("/contact-us").post(contactUsHandler);

export default router;
