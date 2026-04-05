import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateUser } from "../controllers/user.controller.js";
import { userExists } from "../middlewares/userExists.middleware.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import { refreshIfExpired } from "../middlewares/refreshIfRequired.middleware.js";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import { blockIfAuthenticated } from "../middlewares/blockIfAuthenticated..middleware.js";

import { uploadAvatar } from "../controllers/upload.controller.js";
import { upload } from "../middlewares/multer/multer.middleeware.js";

const router = Router()

router.route("/register").post(userExists, registerUser)
router.route("/login").post(VerifyJWT, blockIfAuthenticated, loginUser)
router.route("/me").get(VerifyJWT, refreshIfExpired, requireAuth, getCurrentUser)
router.route("/logout").post(VerifyJWT, logoutUser)
router.route("/refresh").post(refreshAccessToken)
router.route("/updateUser").patch(VerifyJWT, refreshIfExpired, requireAuth, updateUser);
router.route("/avatar").post(VerifyJWT, refreshIfExpired, requireAuth, upload.single("avatar"), uploadAvatar);


export default router;  