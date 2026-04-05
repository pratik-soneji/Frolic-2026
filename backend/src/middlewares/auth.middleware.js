import { ApiError } from "../utills/ApiError.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../model/Users.js";
export const VerifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // console.log("Auth hit");

        const token = req.cookies?.accessToken

        if (!token) {
            console.log("Authentication Failed: No accessToken found in cookies.");
            req.authState = "NO_TOKEN";
            return next();
        }

        console.log("Authentication Attempt: Token found, verifying...");
        // console.log('decoding token');

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("decodedToken");
        console.log(decodedToken);

        const user = await User.findById(decodedToken._id).select("-userPassword -refreshToken")

        if (!user) {
            req.authState = "INVALID";

            return next();
        }

        req.user = user
        req.authState = "VALID"

        console.log("req.authState : " + req.authState);

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