import { Router } from "express";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
import { upload } from "../middlewares/multer/multer.middleeware.js";
import { createEvent, getEventById, updateEvent, deleteEvent, getAllPublicEvents, getPublicEventById } from "../controllers/event.controller.js";

const router = Router();

// Public routes for assignments/frontend views
router.route("/all").get(getAllPublicEvents);
router.route("/public/:eventId").get(getPublicEventById);

router.route("/").post(VerifyJWT, requireAuth, upload.single("image"), createEvent);
router.route("/:eventId")
  .get(VerifyJWT, requireAuth, getEventById)
  .put(VerifyJWT, requireAuth, upload.single("image"), updateEvent)
  .delete(VerifyJWT, requireAuth, deleteEvent);

export default router;
