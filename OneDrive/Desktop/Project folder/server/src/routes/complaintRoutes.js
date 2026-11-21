import { Router } from "express";
import { upload } from "../middleware/upload.js";
import {
  getComplaint,
  getComplaints,
  patchComplaintStatus,
  submitComplaint,
  trackComplaint
} from "../controllers/complaintController.js";
import { getStats } from "../controllers/dashboardController.js";

const router = Router();

router.post("/", upload.single("image"), submitComplaint);
router.get("/", getComplaints);
router.get("/stats", getStats);
router.get("/track/:complaintId", trackComplaint);
router.patch("/:id/status", patchComplaintStatus);
router.get("/:id", getComplaint);

export default router;
