import { Router } from "express";
import { getCurrentUser, loginUser, registerUser, updateUser } from "../controllers/user.controller.js";
import { userExists } from "../middlewares/userExists.middleware.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import { refreshIfExpired } from "../middlewares/refreshIfRequired.middleware.js";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import { blockIfAuthenticated } from "../middlewares/blockIfAuthenticated..middleware.js";

const router = Router()

router.route("/register").post(userExists,registerUser)
router.route("/login").post(VerifyJWT, blockIfAuthenticated,loginUser)
router.route("/me").get(VerifyJWT ,getCurrentUser)

router.route("/updateUser").patch(VerifyJWT, requireAuth, updateUser);



export default router;