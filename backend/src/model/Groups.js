import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Events",
    required: true,
  },

  isPaymentDone: {
    type: Boolean,
    default: false,
  },

  isPresent: {
    type: Boolean,
    default: false,
  },

  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });
export const Groups = mongoose.model('Groups', GroupSchema)