import { Router } from "express";
import { addUser, deleteUser, getAllEvents, getAllUsers, getInstitutes, addInstitute, updateUserRole, updateInstituteCoordinator, getDepartments, addDepartment, updateDepartmentCoordinator, getAllParticipants, getEventParticipants, getDashboardStats, getWinners, declareWinners, deleteWinners } from "../controllers/admin.controller.js";
import { VerifyJWT } from "../middlewares/auth.middleware.js";
import { requireAuth } from "../middlewares/requireAuth.middleware.js";
const router = Router();

router.route("/getallusers").get(VerifyJWT, requireAuth, getAllUsers);
router.route("/getallevents").get(VerifyJWT, requireAuth, getAllEvents);
router.route("/addUser").post(VerifyJWT, requireAuth, addUser);
router.route("/deleteUser/:userid").delete(VerifyJWT, requireAuth, deleteUser);
router.route("/getinstitutes").get(VerifyJWT, requireAuth, getInstitutes);
router.route("/addinstitute").post(VerifyJWT, requireAuth, addInstitute);
router.route("/updateUserRole/:userid").patch(VerifyJWT, requireAuth, updateUserRole);
router.route("/updateInstituteCoordinator/:instituteid").patch(VerifyJWT, requireAuth, updateInstituteCoordinator);
router.route("/getdepartments").get(VerifyJWT, requireAuth, getDepartments);
router.route("/adddepartment").post(VerifyJWT, requireAuth, addDepartment);
router.route("/updateDepartmentCoordinator/:departmentid").patch(VerifyJWT, requireAuth, updateDepartmentCoordinator);

router.route("/participants").get(VerifyJWT, requireAuth, getAllParticipants);
router.route("/events/:eventId/participants").get(VerifyJWT, requireAuth, getEventParticipants);

router.route("/dashboard-stats").get(VerifyJWT, requireAuth, getDashboardStats);

router.route("/winners").get(VerifyJWT, requireAuth, getWinners);
router.route("/winners/:eventId").post(VerifyJWT, requireAuth, declareWinners);
router.route("/winners/:eventId").delete(VerifyJWT, requireAuth, deleteWinners);

export default router;



