import { ApiError } from "../utills/ApiError.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../model/Users.js";
export const VerifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.headers?.authorization?.split(" ")[1];

        if (!token) {
            console.log("No token");
            req.authState = "NO_TOKEN";
            return next();
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id)
            .select("-userPassword -refreshToken");

        if (!user) {
            req.authState = "INVALID";
            return next();
        }

        req.user = user;
        req.authState = "VALID";

        return next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            req.authState = "EXPIRED";
            return next();
        }

        req.authState = "INVALID";
        return next();
    }
});