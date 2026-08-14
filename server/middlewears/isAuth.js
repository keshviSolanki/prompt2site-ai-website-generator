import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const isAuth = async (req, res, next) => {
  try {
    // console.log("COOKIES RECEIVED:", req.cookies); // DEBUG
    // console.log("HEADERS:", req.headers.cookie);
    // console.log("COOKIES:", req.cookies);
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id); //request obj maj user nakhi didho atle badhe use kri saki
    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid token " });
  }
};

export default isAuth;
