import { Router } from "express";
import { addUser, deleteUser, getAllEvents, getAllUsers, getInstitutes, addInstitute, updateUserRole, updateInstituteCoordinator, getDepartments, addDepartment, updateDepartmentCoordinator } from "../controllers/admin.controller.js";
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


export default router;



