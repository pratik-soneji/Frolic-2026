import { Router } from "express";
import { addUser, deleteUser, getAllEvents, getAllUsers, getInstitutes, addInstitute, updateUserRole, updateInstituteCoordinator, getDepartments, addDepartment, updateDepartmentCoordinator, getAllParticipants, getEventParticipants, getDashboardStats, getWinners, declareWinners, deleteWinners } from "../controllers/admin.controller.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import { refreshIfExpired } from "../middlewares/refreshIfRequired.middleware.js";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
const router = Router();

router.route("/getallusers").get(VerifyJWT, refreshIfExpired, requireAuth, getAllUsers);
router.route("/getallevents").get(VerifyJWT, refreshIfExpired, requireAuth, getAllEvents);
router.route("/addUser").post(VerifyJWT, refreshIfExpired, requireAuth, addUser);
router.route("/deleteUser/:userid").delete(VerifyJWT, refreshIfExpired, requireAuth, deleteUser);
router.route("/getinstitutes").get(VerifyJWT, refreshIfExpired, requireAuth, getInstitutes);
router.route("/addinstitute").post(VerifyJWT, refreshIfExpired, requireAuth, addInstitute);
router.route("/updateUserRole/:userid").patch(VerifyJWT, refreshIfExpired, requireAuth, updateUserRole);
router.route("/updateInstituteCoordinator/:instituteid").patch(VerifyJWT, refreshIfExpired, requireAuth, updateInstituteCoordinator);
router.route("/getdepartments").get(VerifyJWT, refreshIfExpired, requireAuth, getDepartments);
router.route("/adddepartment").post(VerifyJWT, refreshIfExpired, requireAuth, addDepartment);
router.route("/updateDepartmentCoordinator/:departmentid").patch(VerifyJWT, refreshIfExpired, requireAuth, updateDepartmentCoordinator);

router.route("/participants").get(VerifyJWT, refreshIfExpired, requireAuth, getAllParticipants);
router.route("/events/:eventId/participants").get(VerifyJWT, refreshIfExpired, requireAuth, getEventParticipants);

router.route("/dashboard-stats").get(VerifyJWT, refreshIfExpired, requireAuth, getDashboardStats);

router.route("/winners").get(VerifyJWT, refreshIfExpired, requireAuth, getWinners);
router.route("/winners/:eventId").post(VerifyJWT, refreshIfExpired, requireAuth, declareWinners);
router.route("/winners/:eventId").delete(VerifyJWT, refreshIfExpired, requireAuth, deleteWinners);

export default router;



