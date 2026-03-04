 const EventWiseWinnerSchema = new mongoose.Schema({
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    sequence: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  }, { timestamps: true });
  export const EventWiseWinners = mongoose.model('EventWiseWinners', EventWiseWinnerSchema)