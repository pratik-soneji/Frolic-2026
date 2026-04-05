import { asyncHandler } from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { User } from "../model/Users.js";
import { Events } from "../model/Events.js";
import { Institutes } from "../model/Institue.js";
import { Departments } from "../model/Department.model.js";
import { Participants } from "../model/Participant.js";
import { Groups } from "../model/Groups.js";
import { EventWiseWinners } from "../model/EventWinners.js";
import bcrypt from 'bcrypt'
import { generateAccessAndRefreshToken } from "./user.controller.js";
const getAllUsers = asyncHandler(async (req, res) => {
    console.log("getAll hit");
    // console.log(req);
    console.log(req.user);

    // const { user } = req;
    // console.log(user);

    // if(!user.isAdmin){
    //     throw new ApiError(403, "Unauthorized");
    // }
    console.log('fvd');

    const users = await User.find().select("-userPassword -refreshToken");
    console.log(users);
    console.log("got all the users");

    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
})
const getAllEvents = asyncHandler(async (req, res) => {
    console.log("getAllEvents hit");
    // console.log(req);
    // console.log(req.user);

    // const { user } = req;
    // console.log(user);

    // if(!user.isAdmin){
    //     throw new ApiError(403, "Unauthorized");
    // }
    console.log('fvd');

    const events = await Events.find();
    console.log(events);

    return res.status(200).json(new ApiResponse(200, events, "Events fetched successfully"));

})
const addUser = asyncHandler(async (req, res) => {
    console.log("RegisterUser By Admin End point hit");

    const { email, password, userName, phone } = req.body;
    console.log(email);

    if (req.user) {
        console.log('exists');
        return res.status(200).json(new ApiResponse(200, { user: req.user }, "User Already Logged In Successfully"))
    }
    console.log('Hashing');

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
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    }
    console.log("User Registred");

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: user, accessToken, refreshToken
        }, "User Registered Successfully"))
})
const deleteUser = asyncHandler(async (req, res) => {
    const { userid } = req.params;

    if (!userid) {
        throw new ApiError(505, "User id required !")
    }

    const deletedUser = await User.findByIdAndDelete(userid);

    if (!deletedUser) {
        throw new ApiError(505, "User  not found or already deleted")
    }

    res.status(200).json(new ApiResponse(200, { success: true }, "User Deleted"));
});

const getInstitutes = asyncHandler(async (req, res) => {
    const institutes = await Institutes.find().populate("instituteCoOrdinatorId", "userName email");
    return res.status(200).json(new ApiResponse(200, institutes, "Institutes fetched successfully"));
});

const addInstitute = asyncHandler(async (req, res) => {
    const { instituteName, instituteDescription, instituteCoOrdinatorId } = req.body;

    if (!instituteName) {
        throw new ApiError(400, "Institute name is required");
    }

    const existing = await Institutes.findOne({ instituteName });
    if (existing) {
        throw new ApiError(409, "Institute with this name already exists");
    }

    const institute = await Institutes.create({
        instituteName,
        instituteDescription,
        instituteCoOrdinatorId: instituteCoOrdinatorId || undefined,
    });

    return res.status(201).json(new ApiResponse(201, institute, "Institute created successfully"));
});

const updateUserRole = asyncHandler(async (req, res) => {
    const { userid } = req.params;
    const { isCordinator, coordinatorType } = req.body;

    if (!userid) {
        throw new ApiError(400, "User id is required");
    }

    if (typeof isCordinator !== "boolean") {
        throw new ApiError(400, "isCordinator must be a boolean");
    }

    const updateData = {
        isCordinator,
        coordinatorType: isCordinator ? (coordinatorType || null) : null,
    };

    const updated = await User.findByIdAndUpdate(
        userid,
        updateData,
        { new: true }
    ).select("-userPassword -refreshToken");

    if (!updated) {
        throw new ApiError(404, "User not found");
    }

    // ── Cascade: if unsetting coordinator, remove from all related documents ──
    if (!isCordinator) {
        await Promise.all([
            Institutes.updateMany(
                { instituteCoOrdinatorId: userid },
                { $unset: { instituteCoOrdinatorId: "" } }
            ),
            Departments.updateMany(
                { departmentCoOrdinatorId: userid },
                { $unset: { departmentCoOrdinatorId: "" } }
            ),
            Events.updateMany(
                { eventCoOrdinatorId: userid },
                { $unset: { eventCoOrdinatorId: "" } }
            ),
        ]);
    }

    return res.status(200).json(new ApiResponse(200, updated, `User role updated to ${isCordinator ? `Coordinator (${coordinatorType})` : "Student"} — related records updated`));
});

const updateInstituteCoordinator = asyncHandler(async (req, res) => {
    const { instituteid } = req.params;
    const { instituteCoOrdinatorId } = req.body;

    if (!instituteid) {
        throw new ApiError(400, "Institute id is required");
    }

    const updated = await Institutes.findByIdAndUpdate(
        instituteid,
        { instituteCoOrdinatorId: instituteCoOrdinatorId || null },
        { new: true }
    ).populate("instituteCoOrdinatorId", "userName email");

    if (!updated) {
        throw new ApiError(404, "Institute not found");
    }

    return res.status(200).json(new ApiResponse(200, updated, "Institute coordinator updated successfully"));
});

// ── Department Controllers ────────────────────────────────────
const getDepartments = asyncHandler(async (req, res) => {
    const departments = await Departments.find()
        .populate("instituteId", "instituteName")
        .populate("departmentCoOrdinatorId", "userName email");
    return res.status(200).json(new ApiResponse(200, departments, "Departments fetched successfully"));
});

const addDepartment = asyncHandler(async (req, res) => {
    const { departmentName, departmentDescription, instituteId, departmentCoOrdinatorId } = req.body;

    if (!departmentName) throw new ApiError(400, "Department name is required");
    if (!instituteId) throw new ApiError(400, "Institute is required");

    const existing = await Departments.findOne({ departmentName, instituteId });
    if (existing) throw new ApiError(409, "Department with this name already exists in this institute");

    const dept = await Departments.create({
        departmentName,
        departmentDescription,
        instituteId,
        departmentCoOrdinatorId: departmentCoOrdinatorId || undefined,
    });

    const populated = await dept.populate([
        { path: "instituteId", select: "instituteName" },
        { path: "departmentCoOrdinatorId", select: "userName email" },
    ]);

    return res.status(201).json(new ApiResponse(201, populated, "Department created successfully"));
});

const updateDepartmentCoordinator = asyncHandler(async (req, res) => {
    const { departmentid } = req.params;
    const { departmentCoOrdinatorId } = req.body;

    if (!departmentid) throw new ApiError(400, "Department id is required");

    const updated = await Departments.findByIdAndUpdate(
        departmentid,
        { departmentCoOrdinatorId: departmentCoOrdinatorId || null },
        { new: true }
    )
        .populate("instituteId", "instituteName")
        .populate("departmentCoOrdinatorId", "userName email");

    if (!updated) throw new ApiError(404, "Department not found");

    return res.status(200).json(new ApiResponse(200, updated, "Department coordinator updated successfully"));
});

const getAllParticipants = asyncHandler(async (req, res) => {
    const participants = await Participants.find().populate({
        path: "groupId",
        populate: {
            path: "eventId",
            select: "eventName createdAt"
        }
    });

    const formattedParticipants = participants.map(p => ({
        _id: p._id,
        participantName: p.participantName,
        participantEmail: p.participantEmail,
        participantMobile: p.participantMobile,
        isGroupLeader: p.isGroupLeader,
        event: p.groupId && p.groupId.eventId ? {
            eventId: p.groupId.eventId._id,
            eventName: p.groupId.eventId.eventName
        } : null,
        registrationDate: p.createdAt
    }));

    return res.status(200).json(new ApiResponse(200, formattedParticipants, "Participants fetched successfully"));
});

const getEventParticipants = asyncHandler(async (req, res) => {
    const { eventId } = req.params;

    if (!eventId) {
        throw new ApiError(400, "Event ID is required");
    }

    const eventGroups = await Groups.find({ eventId });
    const groupIds = eventGroups.map(g => g._id);

    const participants = await Participants.find({ groupId: { $in: groupIds } }).populate({
        path: "groupId",
        select: "groupName eventId"
    });

    const formattedParticipants = participants.map(p => ({
        _id: p._id,
        participantName: p.participantName,
        participantEmail: p.participantEmail,
        participantMobile: p.participantMobile,
        isGroupLeader: p.isGroupLeader,
        group: p.groupId ? { id: p.groupId._id, name: p.groupId.groupName } : null,
        registrationDate: p.createdAt
    }));

    return res.status(200).json(new ApiResponse(200, formattedParticipants, "Event participants fetched successfully"));
});

const getDashboardStats = asyncHandler(async (req, res) => {
    const totalEvents = await Events.countDocuments();
    const totalParticipants = await Participants.countDocuments();
    const totalInstitutes = await Institutes.countDocuments();
    const totalWinnersDeclared = await EventWiseWinners.distinct("eventId").then(res => res.length);
    
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    // Safety check fallback
    const recentActivity = await Participants.aggregate([
        { $match: { createdAt: { $gte: last7Days } } },
        { 
            $group: { 
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                count: { $sum: 1 } 
            } 
        },
        { $sort: { _id: 1 } }
    ]) || [];
    
    return res.status(200).json(new ApiResponse(200, {
        totalEvents,
        totalParticipants,
        totalInstitutes,
        totalWinnersDeclared,
        recentActivity
    }, "Stats fetched successfully"));
});

const getWinners = asyncHandler(async (req, res) => {
    const winners = await EventWiseWinners.find()
        .populate("eventId", "eventName eventLocation")
        .populate("groupId", "groupName")
        .sort({ eventId: 1, sequence: 1 });
        
    return res.status(200).json(new ApiResponse(200, winners, "Winners fetched successfully"));
});

const declareWinners = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const { winners } = req.body; 
    const adminId = req.user._id;

    if (!eventId || !winners || !winners.length) {
        throw new ApiError(400, "Event ID and winners array are required");
    }

    for (let w of winners) {
        const group = await Groups.findById(w.groupId);
        if (!group) throw new ApiError(404, `Group ${w.groupId} not found`);
        if (group.eventId.toString() !== eventId) {
            throw new ApiError(400, `Group ${w.groupId} did not participate in this event`);
        }
    }

    await EventWiseWinners.deleteMany({ eventId });

    const newWinners = winners.map(w => ({
        eventId,
        groupId: w.groupId,
        sequence: w.sequence,
        modifiedBy: adminId
    }));

    const savedWinners = await EventWiseWinners.insertMany(newWinners);

    return res.status(200).json(new ApiResponse(200, savedWinners, "Winners declared successfully"));
});

const deleteWinners = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    if (!eventId) throw new ApiError(400, "Event ID is required");

    await EventWiseWinners.deleteMany({ eventId });
    return res.status(200).json(new ApiResponse(200, null, "Winners revoked successfully"));
});

export { getAllUsers, getAllEvents, addUser, deleteUser, getInstitutes, addInstitute, updateUserRole, updateInstituteCoordinator, getDepartments, addDepartment, updateDepartmentCoordinator, getAllParticipants, getEventParticipants, getDashboardStats, getWinners, declareWinners, deleteWinners };
