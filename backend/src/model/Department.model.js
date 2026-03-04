import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
  },
  departmentImageUrl: {
    type: String,
  },
  departmentDescription: {
    type: String,
  },
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institutes",
    required: true,
  },
  departmentCoOrdinatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });
export const Departments = mongoose.model("Departments", DepartmentSchema)