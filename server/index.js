import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import websiteRouter from "./routes/websiteRoutes.js";
import billingRouter from "./routes/billingRoute.js";
import { stripWebhook } from "./controller/stripeWebhookController.js";

dotenv.config();

const app = express();
const port = 8000;

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripWebhook,
);

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://prompt2site-ai-website-generator-1.onrender.com",
    credentials: true,
  }),
);

// Request logger (for debugging)
app.use((req, res, next) => {
  // console.log("REQUEST:", req.method, req.url);
  next();
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/billing", billingRouter);

app.get("/test", (req, res) => {
  res.send("Backend Working");
});

app.get("/", (req, res) => {
  res.send("hello");
});

// Start Server
app.listen(port, () => {
  console.log("SERVER STARTED ON PORT:", port);
  connectDB();
});
