import { asyncHandler } from "../utills/asyncHandler.js";
import { User } from "../model/Users.js";
import jwt from 'jsonwebtoken'
export const refreshIfExpired = asyncHandler(async (req, res, next) => {
  console.log("refreshIfExpired hit");

  if (req.authState !== "EXPIRED") {
    return next();
  }

  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    req.authState = "REFRESH_MISSING";
    return next();
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const newAccessToken = jwt.sign(
      { _id: decoded._id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRY)
      }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge:
        Number(process.env.ACCESS_TOKEN_EXPIRY) * 1000
    });

    // IMPORTANT FIX
    const user = await User.findById(decoded._id)
      .select("-userPassword -refreshToken");

    if (!user) {
      req.authState = "INVALID";
      return next();
    }

    req.user = user;
    req.authState = "REFRESHED";

    console.log("Token refreshed");

    return next();

  } catch (err) {
    req.authState = "REFRESH_INVALID";
    return next();
  }
});
