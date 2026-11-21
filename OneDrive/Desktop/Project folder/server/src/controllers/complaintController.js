import {
  createComplaint,
  getComplaintById,
  listComplaints,
  updateComplaintStatus
} from "../services/complaintService.js";

export async function submitComplaint(req, res, next) {
  try {
    const complaint = await createComplaint(req.body, req.file);
    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
}

export async function getComplaints(req, res, next) {
  try {
    const complaints = await listComplaints({
      category: req.query.category,
      severity: req.query.severity,
      search: req.query.search
    });
    res.json({ success: true, data: complaints });
  } catch (error) {
    next(error);
  }
}

export async function getComplaint(req, res, next) {
  try {
    const complaint = await getComplaintById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, error: "Complaint not found." });
    res.json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
}

export async function trackComplaint(req, res, next) {
  try {
    const complaint = await getComplaintById(req.params.complaintId);
    if (!complaint) return res.status(404).json({ success: false, error: "No complaint matches that tracking ID." });
    res.json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
}

export async function patchComplaintStatus(req, res, next) {
  try {
    const complaint = await updateComplaintStatus(req.params.id, req.body.status, req.body.priority, req.body.remarks ?? "");
    if (!complaint) return res.status(404).json({ success: false, error: "Complaint not found." });
    res.json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
}
