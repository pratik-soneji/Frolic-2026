import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  participantName: {
    type: String,
    required: true,
  },

  participantEnrollmentNumber: String,

  participanInstituteName: String,
  participantCity: String,

  participantMobile: String,
  participantEmail: String,

  isGroupLeader: {
    type: Boolean,
    default: false,
  },

  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Groups",
    required: true,
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });
export const Participants = mongoose.model('Participants', ParticipantSchema)