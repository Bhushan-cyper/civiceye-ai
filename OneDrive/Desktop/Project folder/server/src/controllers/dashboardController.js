import Complaint from "../models/Complaint.js";
import { getDashboardStats } from "../services/dashboardService.js";

export async function getStats(_req, res, next) {
  try {
    res.json({ success: true, data: await getDashboardStats() });
  } catch (error) {
    next(error);
  }
}

export async function getMapComplaints(_req, res, next) {
  try {
    const complaints = await Complaint.find({
      latitude: { $gte: -90, $lte: 90 },
      longitude: { $gte: -180, $lte: 180 }
    }).sort({ createdAt: -1 }).limit(500).lean();
    res.json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
}
