import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import {hash , compare} from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
   )   => {

    try {
        //get all users
        const users = await User.find();
        return res.status(200).json({ message: "OK", users });
      } catch (error: any) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message }
            
        );
      }   
};
export const userSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
   )   => {

    try {
        //get user signup
        const {name , email , password} = req.body ;
        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(401).send("User already registered");
        const hashedPassword = await hash(password , 10);
        const user = new User({name , email,password:hashedPassword });
        await user.save ();
        // create token and store cookie
        res.clearCookie(COOKIE_NAME ,{httpOnly: true ,domain : "localhost", signed : true , path:"/", }); 
        

        const token = createToken (user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie (COOKIE_NAME,token , {path : "/" , domain : "localhost",expires , httpOnly: true , signed : true ,});



        return res.status(201).json({ message: "OK", name : user.name , email: user.email });
      } catch (error: any) {
        console.log(error);
        return res.status(200).json({ message: "ERROR", cause: error.message }
            
        );
      }   
};
import jwt from "jsonwebtoken"; // ajoute cet import si besoin

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("📦 REQ BODY:", req.body);
    
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    console.log("📦 Email reçu:", `"${email}"`);
    console.log("📦 Password reçu:", `"${password}"`);

    if (!email || !password) {
      return res.status(422).send("Invalid data");
    }

    // 🛑 Tester admin en dur
    if (email === "admin@gmail.com" && password === "admin123") {
      console.log("💬 Admin login detected!");

      const adminToken = jwt.sign(
        { role: 'admin', email },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.clearCookie(COOKIE_NAME, { httpOnly: true, signed: true, path: "/" });

      const expires = new Date();
      expires.setDate(expires.getDate() + 1);

      res.cookie(COOKIE_NAME, adminToken, {
        path: "/",
        expires,
        httpOnly: true,
        signed: true,
      });

      return res.status(200).json({
        message: "OK",
        role: "admin",
        redirect: "/admin",
        name: "Admin",
        email,
      });
    }

    // 📦 Chercher dans MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User not registered");
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Incorrect password");
    }

    res.clearCookie(COOKIE_NAME, { httpOnly: true, signed: true, path: "/" });

    const userToken = createToken(user._id.toString(), user.email, "7d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, userToken, {
      path: "/",
      expires,
      httpOnly: true,
      signed: true,
    });

    return res.status(200).json({
      message: "OK",
      role: "user",
      redirect: "/chat",
      name: user.name,
      email: user.email,
    });

  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};


export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.signedCookies[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Cas spécial: ADMIN
    if (decoded.role === "admin") {
      return res.status(200).json({
        message: "OK",
        name: "Admin",
        email: decoded.email,
        role: "admin",
      });
    }

    // Cas normal: Utilisateur en base
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }

    return res.status(200).json({
      message: "OK",
      name: user.name,
      email: user.email,
      role: "user",
    });
  } catch (error: any) {
    console.log(error);
    return res.status(401).json({ message: "ERROR", cause: error.message });
  }
};


export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "localhost",
      signed: true,
      path: "/",
    });

    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error:any) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};