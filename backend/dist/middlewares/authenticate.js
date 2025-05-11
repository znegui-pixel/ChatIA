import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../utils/constants.js";

export const authenticate = (req, res, next) => {
  const token = req.signedCookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "Non authentifié" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.jwtData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
