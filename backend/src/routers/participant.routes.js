import { Router } from "express";
import { registerParticipant } from "../controllers/participant.controller.js";

const router = Router();

router.route("/register").post(registerParticipant);

export default router;
