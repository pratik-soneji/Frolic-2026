import {User} from '../model/Users.js';
import { asyncHandler } from '../utills/asyncHandler.js';
import  { ApiResponse } from '../utills/ApiResponse.js'
import { ApiError } from '../utills/ApiError.js';
const userExists = asyncHandler(async (req, res, next) => {
    // console.log("Entered End point");
    // console.log("Body");
    
    // console.log(req.body);
    
    const { email, password, userName } = req.body;
    if ([email, password, userName].some(item => item?.trim() === "")) {
        throw new ApiError(400, "All fields are neccessary to sign up")
    }
    // console.log(email);
    // console.log(password);
    // console.log(username);
    
    
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json(new ApiResponse(200, false, "Enter valid Email"));
    }

    const userAlreadyExist = await User.findOne(
        {
            $or: [{ email }, { userName }]
        }
    )
    console.log("userAlreadyExist "+userAlreadyExist);
    
    if (userAlreadyExist != null) {
        // console.log("if");
        return res.status(409).json(new ApiResponse(200, false, "User exists"))
    }
        next();
})
export { userExists }