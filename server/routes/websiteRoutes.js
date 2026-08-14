import express from "express";
import isAuth from "../middlewears/isAuth.js";
import {
  changes,
  deploy,
  generateWebdite,
  getAll,
  getBySlug,
  getWebsiteById,
} from "../controller/websiteController.js";

const websiteRouter = express.Router();

websiteRouter.post("/generate", isAuth, generateWebdite); // user details pela middle wear ma jse token cookie ma hse toj server pase jse cookie mathi id kadhi user ne req obj ma nakhi dese middlewear a nakhi

websiteRouter.post("/update/:id", isAuth, changes);

websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById);

websiteRouter.get("/get-all", isAuth, getAll);

websiteRouter.get("/deploy/:id", isAuth, deploy);

websiteRouter.get("/get-by-slug/:slug", isAuth, getBySlug);

export default websiteRouter;
