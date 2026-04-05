import { asyncHandler } from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { Events } from "../model/Events.js";
import { Groups } from "../model/Groups.js";
import { Participants } from "../model/Participant.js";
import mongoose from "mongoose";

export const registerParticipant = asyncHandler(async (req, res) => {
  const { eventId, groupName, participants } = req.body;
  console.log('registering partici');


  // 1. Validate Input Fields
  if (!eventId || !participants || !Array.isArray(participants) || participants.length === 0) {
    throw new ApiError(400, "Event ID and at least one participant are required.");
  }

  for (const p of participants) {
    if (!p.name || !p.email || !p.phone) {
      throw new ApiError(400, "All participants must have name, email, and phone");
    }
  }

  // 2. Check if event exists
  const event = await Events.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (participants.length > (event.groupMaxParticipants || 1)) {
    throw new ApiError(400, `Maximum allowed participants per group is ${event.groupMaxParticipants || 1}`);
  }

  // 3. Check if any participant is already registered for this event
  const eventGroups = await Groups.find({ eventId });
  const eventGroupIds = eventGroups.map(g => g._id);

  const emails = participants.map(p => p.email);
  const existingParticipant = await Participants.findOne({
    participantEmail: { $in: emails },
    groupId: { $in: eventGroupIds }
  });

  if (existingParticipant) {
    throw new ApiError(400, `Participant with email ${existingParticipant.participantEmail} is already registered for this event`);
  }

  // 4. Check slot availability (1 Slot = 1 Group/Team)
  const registeredGroupsCount = eventGroups.length;
  const totalSlots = event.maxGroupsAllowed || 0;

  if (registeredGroupsCount >= totalSlots) {
    return res.status(400).json({ message: "Event is Full" });
  }
console.log('dvhud1');
  // Workaround: Find an admin user to attribute this public registration
  let adminDocs = null;
  if (mongoose.models.User) {
    adminDocs = await mongoose.models.User.findOne();
  } else if (mongoose.models.Users) {
    adminDocs = await mongoose.models.Users.findOne();
  }
  console.log('dvhud');


  let modifiedById = adminDocs ? adminDocs._id : (event.modifiedBy || event.departmentId);
  if (!modifiedById) {
    modifiedById = new mongoose.Types.ObjectId("000000000000000000000000"); // default fallback
  }

  // Create single Group (Team)
  const newGroup = await Groups.create({
    groupName: groupName || `${participants[0].name}'s Team`,
    eventId: event._id,
    modifiedBy: modifiedById
  });

  // Create Participants linked to that Group
  const participantDocs = participants.map((p, index) => ({
    participantName: p.name,
    participantEmail: p.email,
    participantMobile: p.phone,
    isGroupLeader: index === 0, // first participant is group leader
    groupId: newGroup._id,
    modifiedBy: modifiedById
  }));

  await Participants.insertMany(participantDocs);

  // Calculate remaining
  const remainingSlots = Math.max(0, totalSlots - (registeredGroupsCount + 1));

  return res.status(201).json({
    message: "Registration Successful",
    remainingSlots
  });
});
