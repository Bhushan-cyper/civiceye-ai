import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true, index: true },
    citizenName: { type: String, required: true, trim: true, maxlength: 100 },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    locationName: { type: String, trim: true, maxlength: 160, default: "" },
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    imageUrl: { type: String, default: "" },
    aiCategory: { type: String, default: "" },
    aiSeverity: { type: String, enum: ["LOW", "MEDIUM", "HIGH", ""], default: "" },
    aiConfidence: { type: Number, min: 0, max: 1, default: null },
    aiDescription: { type: String, default: "" },
    recommendedAction: { type: String, default: "" },
    aiAvailable: { type: Boolean, default: false },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "MEDIUM" },
    status: {
      type: String,
      enum: ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "SUBMITTED"
    },
    resolvedAt: { type: Date, default: null },
    adminRemarks: { type: String, default: "", maxlength: 1000 }
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
