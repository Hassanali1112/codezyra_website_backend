import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// user router
import userRouter from "./routes/user.route.js";
app.use("/api/v1/users/auth", userRouter)

// contact routes
import contactRouter from "./routes/contact.router.js";
app.use("/api/v1", contactRouter);

// portfolio routes
import portfolioRouter from "./routes/portfolio.route.js";
app.use("/api/v1/portfolio", portfolioRouter);

export { app };
