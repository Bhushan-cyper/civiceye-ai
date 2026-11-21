import mongoose from "mongoose";

const adminActionSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  remarks: { type: String, default: "", maxlength: 1000 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AdminAction", adminActionSchema);
