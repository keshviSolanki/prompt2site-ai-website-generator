import express from "express";
import { getCurrent } from "../controller/userController.js";
import isAuth from "../middlewears/isAuth.js";

const userRouter = express.Router();

userRouter.get("/me", isAuth, getCurrent); // user details pela middle wear ma jse token cookie ma hse toj server pase jse cookie mathi id kadhi user ne req obj ma nakhi dese middlewear a nakhi

export default userRouter;
