import mongoose from "mongoose";

 const EventSchema = new mongoose.Schema({
    eventName: {
      type: String,
      required: true,
    },

    eventTagline: String,
    eventImageUrl: {
      type: String,
    },

    eventDescription: String,
    groupMinParticipants: Number,
    groupMaxParticipants: Number,

    evetFees: {
      type: Number,
      required: true,
    },

    eventFirstPrice: String,
    eventSecondPrice: String,
    eventThirdPrice: String,

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  
    eventCoOrdinatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  
    eventMainStudentCoordinator: {
      name: String,
      phone: String,
      email: String,
    },

    eventLocation: String,

    maxGroupsAllowed: {
      type: Number,
      required: true,
    },

    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  }, { timestamps: true });
  export const Events = mongoose.model('Events',EventSchema)