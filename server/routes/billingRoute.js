import express from "express";
import isAuth from "../middlewears/isAuth.js";
import { billing } from "../controller/billingController.js";

const billingRouter = express.Router();

billingRouter.post("/", isAuth, billing);
export default billingRouter;
