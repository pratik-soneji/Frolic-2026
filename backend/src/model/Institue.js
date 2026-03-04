import mongoose from "mongoose";

 const InstituteSchema = new mongoose.Schema({
    instituteName: {
      type: String,
      required: true,
      unique: true,
    },
    instituteImageUrl: {
      type: String,
    },
    instituteDescription: {
      type: String,
    },
    instituteCoOrdinatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }, 
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  }, { timestamps: true });
  export const Institutes = mongoose.model('Institutes',InstituteSchema)