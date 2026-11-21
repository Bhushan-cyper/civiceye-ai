import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema({
  complaintId: { type: String, required: true, index: true },
  previousStatus: { type: String, default: "" },
  newStatus: { type: String, required: true },
  remarks: { type: String, default: "", maxlength: 1000 },
  changedAt: { type: Date, default: Date.now }
});

export default mongoose.model("StatusHistory", statusHistorySchema);
