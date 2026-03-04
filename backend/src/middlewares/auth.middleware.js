import { ApiError } from "../utills/ApiError.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../model/Users.js";
export const VerifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // console.log("Auth hit");
        
        const token = req.cookies?.accessToken 
        
        // console.log(token);
        
        
        if (!token) {
            req.authState = "NO_TOKEN";
            return next();
        }
        // console.log('decoding token');
        
        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log("decodedToken"+decodedToken);
        req.user = decodedToken
        req.authState = "VALID"
        
        
        return next()

    } catch (error) {
        // console.log(error);
        // console.log("Epxired b");
          if (error.name === "TokenExpiredError") {
            req.authState = "EXPIRED";
            
            
            return next();
            }
            // console.log("Epxired");
            req.authState = "INVALID";
            return next();
    }
})