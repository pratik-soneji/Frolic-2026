import { User } from "../model/Users.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { asyncHandler } from "../utills/asyncHandler.js";
import fs from 'fs'
import bcrypt from 'bcrypt'
import path from "path";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
    //check validation
    //check if user already exist
    //add middleware to upload the avatar and coverImage in localstorage 
    //check if its uploaded in local server=>avatar
    //upload them in cloudinary
    //check if they are uploaded in cloudinary
    //make a object and do a dataentry
    //check if user is added in database
    //if user added successfully then give a response without password and token
    console.log("RegisterUser End point hit");

    const { email, password, userName, phone } = req.body;
    if (req.user) {
        console.log('exists');
        return res.status(200)

            .json(new ApiResponse(200, { user: req.user }, "User Already Logged In Successfully"))
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Creating User");
    const response = await User.create({
        email,
        userPassword: hashedPassword,
        userName,
        phone
    })


    console.log("User Created");

    const user = await User.findById(response._id).select("-userPassword -refreshToken")

    if (!user) {
        throw new ApiError(505, "Something went wrong when creating a user")
    }

    console.log("response");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }
    console.log("User Registred");

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: user }, "User Registered In Successfully"))
})

export const generateAccessAndRefreshToken = async (userid) => {
    try {
        const user = await User.findById(userid)
        console.log(user);

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating token")
    }
}

const loginUser = asyncHandler(async (req, res) => {
    console.log('loginUser hit');

    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and Password both are required")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    console.log('isPasswordValid ' + isPasswordValid);

    const isAdmin = password === process.env.ADMIN_PASS
    console.log("----");

    console.log(password);
    console.log(process.env.ADMIN_PASS);



    if (!isPasswordValid && !isAdmin) {
        throw new ApiError(400, "Invalid Password")
    }
    user.isAdmin = isAdmin

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    console.log("token generated");

    const userLogged = await User.findById(user._id).select("-userPassword -refreshToken")
    console.log("User logged: " + userLogged);
    userLogged.isAdmin = user.isAdmin


    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    }

    await user.save({ validateBeforeSave: false })
    console.log('Poachi gyo');

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: userLogged }, "User Logged In Successfully"))

})
const getCurrentUser = asyncHandler(async (req, res) => {
    console.log(req.user);

    return res.status(200).json(new ApiResponse(200, { user: req.user }, "Provided User"))
})

const updateUser = asyncHandler(async (req, res) => {
    console.log("UpdateUser By Admin End point hit");

    const { userName, phone } = req.body;
    console.log(userName);

    const response = await User.updateOne({ _id: req.user._id }, {
        userName: userName,
        phone: phone
    })
    console.log(response);

    console.log("User Updated");

    console.log("response");

    return res.status(200)
        .json(new ApiResponse(200, {
            success: true
        }, "User Registered Successfully"))
})
const refreshAccessToken = asyncHandler(async (req, res) => {

    console.log("Refresh token endpoint hit");

    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token not found");
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token expired or used");
    }

    const { accessToken, refreshToken } =
        await generateAccessAndRefreshToken(user._id);

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken },
                "Access token refreshed"
            )
        );
});
const logoutUser = asyncHandler(async (req, res) => {

    console.log("Logout endpoint hit");
    console.log(req.user);

    if (req.user) {
        await User.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: 1 } }
        );
    }

    console.log("DB updated");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});
export { registerUser, loginUser, getCurrentUser, updateUser, logoutUser, refreshAccessToken }