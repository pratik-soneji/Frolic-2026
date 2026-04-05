import { asyncHandler } from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";
import { Events } from "../model/Events.js";
import { Groups } from "../model/Groups.js";
import { EventWiseWinners } from "../model/EventWinners.js";
import { Participants } from "../model/Participant.js";
import cloudinary from "../configs/cloudinary.config.js";

export const createEvent = asyncHandler(async (req, res) => {
  console.log("createEvent hit", req.body);

  const file = req.file;
  let imageUrl = null;

  if (file) {
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "events" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        ).end(file.buffer);
      });

    const result = await uploadStream();

    if (!result?.secure_url) {
      throw new ApiError(500, "Cloudinary upload failed");
    }
    imageUrl = result.secure_url;
  }

  // Handle nested object parsing securely
  let eventMainStudentCoordinator = req.body.eventMainStudentCoordinator;
  if (typeof eventMainStudentCoordinator === 'string') {
    try {
      eventMainStudentCoordinator = JSON.parse(eventMainStudentCoordinator);
    } catch (e) {
      console.error("Failed to parse eventMainStudentCoordinator", e);
    }
  }

  const newEventData = {
    ...req.body,
    eventMainStudentCoordinator,
    imageUrl, // The new imageUrl required field
    eventImageUrl: imageUrl, // for backward compatibility
  };

  const createdEvent = await Events.create(newEventData);

  return res.status(201).json(
    new ApiResponse(201, createdEvent, "Event created successfully")
  );
});

export const getEventById = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

  const event = await Events.findById(eventId)
    .populate("departmentId", "departmentName")
    .populate("eventCoOrdinatorId", "userName email");

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return res.status(200).json(
    new ApiResponse(200, event, "Event fetched successfully")
  );
});

export const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

  const file = req.file;
  let imageUrl = undefined;

  if (file) {
    const base64 = file.buffer.toString("base64");
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${base64}`,
      { folder: "events" }
    );

    if (!result?.secure_url) {
      throw new ApiError(500, "Cloudinary upload failed");
    }
    imageUrl = result.secure_url;
  }

  let eventMainStudentCoordinator = req.body.eventMainStudentCoordinator;
  if (typeof eventMainStudentCoordinator === 'string') {
    try {
      eventMainStudentCoordinator = JSON.parse(eventMainStudentCoordinator);
    } catch (e) {
      console.error("Failed to parse eventMainStudentCoordinator", e);
    }
  }

  const updateData = {
    ...req.body,
  };

  if (eventMainStudentCoordinator) {
    updateData.eventMainStudentCoordinator = eventMainStudentCoordinator;
  }

  if (imageUrl) {
    updateData.imageUrl = imageUrl;
    updateData.eventImageUrl = imageUrl;
  }

  const updatedEvent = await Events.findByIdAndUpdate(eventId, updateData, { new: true, runValidators: true });

  if (!updatedEvent) {
    throw new ApiError(404, "Event not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedEvent, "Event updated successfully")
  );
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

  const deletedEvent = await Events.findByIdAndDelete(eventId);

  if (!deletedEvent) {
    throw new ApiError(404, "Event not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Event deleted successfully")
  );
});

export const getAllPublicEvents = asyncHandler(async (req, res) => {
  const events = await Events.find();
  
  const eventsWithDetails = await Promise.all(events.map(async (event) => {
    // A slot is a Group (Team). Number of registered groups = registered slots.
    const registeredParticipantsCount = await Groups.countDocuments({ eventId: event._id });
    
    // totalSlots is maxGroupsAllowed
    const totalSlots = event.maxGroupsAllowed || 0;
    const remainingSlots = Math.max(0, totalSlots - registeredParticipantsCount);
    const status = remainingSlots === 0 ? "Full" : "Open";

    return {
      eventId: event._id,
      title: event.eventName,
      description: event.eventDescription,
      date: event.createdAt,
      time: "TBD",
      venue: event.eventLocation || "Not specified",
      totalSlots,
      registeredParticipantsCount,
      remainingSlots,
      status,
      groupMinParticipants: event.groupMinParticipants || 1,
      groupMaxParticipants: event.groupMaxParticipants || 1,
      imageUrl: event.imageUrl || event.eventImageUrl
    };
  }));

  return res.status(200).json(
    new ApiResponse(200, eventsWithDetails, "Events fetched successfully")
  );
});

export const getPublicEventById = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    throw new ApiError(400, "Event ID is required");
  }

  const event = await Events.findById(eventId);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const registeredParticipantsCount = await Groups.countDocuments({ eventId: event._id });
  const totalSlots = event.maxGroupsAllowed || 0;
  const remainingSlots = Math.max(0, totalSlots - registeredParticipantsCount);
  const status = remainingSlots === 0 ? "Full" : "Open";

  const eventDetails = {
    eventId: event._id,
    title: event.eventName,
    description: event.eventDescription,
    date: event.createdAt,
    time: "TBD",
    venue: event.eventLocation || "Not specified",
    totalSlots,
    registeredParticipantsCount,
    remainingSlots,
    status,
    groupMinParticipants: event.groupMinParticipants || 1,
    groupMaxParticipants: event.groupMaxParticipants || 1,
    imageUrl: event.imageUrl || event.eventImageUrl
  };

  const winnersData = await EventWiseWinners.find({ eventId: event._id })
    .populate("groupId", "groupName")
    .sort({ sequence: 1 });

  if (winnersData && winnersData.length > 0) {
    eventDetails.winners = await Promise.all(winnersData.map(async (w) => {
      const groupParticipants = await Participants.find({ groupId: w.groupId._id }).select("participantName isGroupLeader");
      return {
        sequence: w.sequence,
        groupName: w.groupId ? w.groupId.groupName : "Unknown Group",
        participants: groupParticipants.map(p => ({
            name: p.participantName,
            isLeader: p.isGroupLeader
        }))
      };
    }));
  }

  return res.status(200).json(
    new ApiResponse(200, eventDetails, "Event fetched successfully")
  );
});

