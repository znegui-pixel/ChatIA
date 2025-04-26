import Jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { COOKIE_NAME } from "./constants.js";
import { resolve } from "path";
import { rejects } from "assert";
export const createToken = (id : string , email : string , expiresIn : string) =>{
    const payload = {id , email};
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables.");
      }
    const token = Jwt.sign(payload, process.env.JWT_SECRET , {expiresIn : "7d" ,});
    return token ;
};

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[`${COOKIE_NAME}`];
  if (!token || token.trim() === ""){
    return res.status(401).json({message : "Token Not Received"});
  }
  
  return new Promise <void>((resolve , reject) => {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }
    return Jwt.verify(token , process.env.JWT_SECRET , (err , success) => {
      if (err){
        reject(err.message);
        return res.status(401).json({message : "Token Expired"});
      } else {
        resolve();
        res.locals.jwtData = success ;
        return next();


      }
    });
  })
};