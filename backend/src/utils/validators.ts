import { NextFunction , Request, Response } from "express";
import {body , ValidationChain, validationResult} from "express-validator";

export const validate = (validations : ValidationChain[]) => {
    return async (req : Request , res : Response , next : NextFunction) => {

        for (let validation of validations){
            const result = await validation.run(req);
            if (!result.isEmpty()){
                break;
            }
        }
        const errors = validationResult(req);
        if (errors.isEmpty()){
            return next();
        }
        return res.status(422).json({errors : errors.array()});
    };


};


export const LoginValidator = [

    body ("email").trim().isEmail().withMessage("Email is required"),
    body ("password").trim().isLength({min :6}).withMessage("Passwoed should contain atlest 6 chracters"),
    
    
    
    
    
    ];

export const signupValidator = [
body ("name").notEmpty().withMessage("Name is required"),
...LoginValidator,
];

export const chatCompletionValidator = [
    body ("message").notEmpty().withMessage("message is required"),
    


];