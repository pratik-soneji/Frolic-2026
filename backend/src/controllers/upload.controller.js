import { asyncHandler } from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { User } from "../model/Users.js";
import cloudinary from "../configs/cloudinary.config.js";

export const uploadAvatar = asyncHandler(async (req, res) => {
  console.log("upload hit");

  const file = req.file;
  

  if (!file) {
    throw new ApiError(400, "Image is required");
  }

  // convert buffer → base64
  const base64 = file.buffer.toString("base64");
  console.log("vhere");
  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${base64}`,
    {
      folder: "avatars",
    }
  );
  console.log("here");
  if (!result?.secure_url) {
    throw new ApiError(500, "Cloudinary upload failed");
  }

  // save avatar in DB
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: result.secure_url,
    },
    { new: true }
  ).select("-userPassword -refreshToken");
  console.log("Img UPloaded");


  return res.status(200).json(
    new ApiResponse(
      200,
      {
        url: result.secure_url,
        public_id: result.public_id,
        user: updatedUser,
      },
      "Avatar uploaded successfully"
    )
  );
});