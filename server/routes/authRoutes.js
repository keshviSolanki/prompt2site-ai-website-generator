import express from "express";
import { gooleAuth, logout } from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/google", gooleAuth); // login with google

authRouter.get("/logout", logout);

export default authRouter;
