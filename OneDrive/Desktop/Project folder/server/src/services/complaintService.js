import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Complaint from "../models/Complaint.js";
import StatusHistory from "../models/StatusHistory.js";
import AdminAction from "../models/AdminAction.js";
import { analyzeImage, categories, classifyDescription } from "./aiService.js";
import { detectImageType } from "../middleware/upload.js";

const uploadDirectory = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : fileURLToPath(new URL("../../uploads/", import.meta.url));
const priorities = { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH" };

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function createComplaint(input, file) {
  const citizenName = normalizeText(input.citizenName);
  const category = normalizeText(input.category);
  const description = normalizeText(input.description);
  const locationName = normalizeText(input.locationName);
  const latitude = input.latitude === undefined || input.latitude === null || input.latitude === "" ? NaN : Number(input.latitude);
  const longitude = input.longitude === undefined || input.longitude === null || input.longitude === "" ? NaN : Number(input.longitude);
  if (!citizenName || citizenName.length > 100) throw Object.assign(new Error("Enter a name of 1–100 characters."), { status: 400 });
  if (!categories.includes(category) || !description || description.length > 2000) throw Object.assign(new Error("Select a valid category and enter a description of up to 2,000 characters."), { status: 400 });
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw Object.assign(new Error("Select a valid location on the map."), { status: 400 });
  }

  let ai = null;
  let mimeType = "";
  if (file) {
    mimeType = detectImageType(file.buffer);
    if (!mimeType) throw Object.assign(new Error("The uploaded file is not a valid JPEG, PNG, or WebP image."), { status: 400 });
    try {
      ai = await analyzeImage(file.buffer, mimeType);
    } catch (error) {
      console.warn("Gemini image analysis unavailable:", error.message);
    }
  } else {
    try {
      ai = await classifyDescription(description);
    } catch (error) {
      console.warn("Gemini text classification unavailable:", error.message);
    }
  }

  let imageUrl = "";
  if (file) {
    await mkdir(uploadDirectory, { recursive: true });
    const extension = mimeType === "image/jpeg" ? ".jpg" : mimeType === "image/png" ? ".png" : ".webp";
    const filename = `${randomUUID()}${extension}`;
    await writeFile(path.join(uploadDirectory, filename), file.buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const complaintId = `CE-${new Date().getFullYear()}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
  const complaint = await Complaint.create({
    complaintId,
    citizenName,
    category,
    description,
    locationName,
    latitude,
    longitude,
    imageUrl,
    aiCategory: ai?.category || "",
    aiSeverity: ai?.severity || "",
    aiConfidence: ai?.confidence ?? null,
    aiDescription: ai?.description || "",
    recommendedAction: ai?.recommendedAction || "",
    aiAvailable: Boolean(ai),
    priority: priorities[ai?.severity] || "MEDIUM"
  });
  await StatusHistory.create({ complaintId, previousStatus: "", newStatus: "SUBMITTED", remarks: "Complaint submitted." });
  return complaint;
}

export async function getComplaintById(id) {
  const query = /^[a-f\d]{24}$/i.test(id) ? { _id: id } : { complaintId: id.toUpperCase() };
  const complaint = await Complaint.findOne(query).lean();
  if (!complaint) return null;
  const statusHistory = await StatusHistory.find({ complaintId: complaint.complaintId }).sort({ changedAt: 1 }).lean();
  const adminActions = await AdminAction.find({ complaintId: complaint.complaintId }).sort({ createdAt: -1 }).lean();
  return { ...complaint, statusHistory, adminActions };
}

export async function listComplaints(filters = {}) {
  const query = {};
  if (filters.category) query.category = filters.category;
  if (filters.severity) query.priority = filters.severity;
  if (filters.search) query.complaintId = { $regex: filters.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  return Complaint.find(query).sort({ createdAt: -1 }).limit(200).lean();
}

export async function updateComplaintStatus(id, status, priority, remarks) {
  const allowed = ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED", "REJECTED"];
  if (!allowed.includes(status)) throw Object.assign(new Error("Invalid complaint status."), { status: 400 });
  if (!["LOW", "MEDIUM", "HIGH"].includes(priority)) throw Object.assign(new Error("Invalid complaint priority."), { status: 400 });
  if (typeof remarks !== "string" || remarks.length > 1000) throw Object.assign(new Error("Remarks must be 1,000 characters or fewer."), { status: 400 });
  const existing = await Complaint.findOne({ complaintId: id.toUpperCase() });
  if (!existing) return null;
  const previousStatus = existing.status;
  const previousPriority = existing.priority;
  existing.status = status;
  existing.priority = priority;
  existing.adminRemarks = remarks.trim();
  if (status === "RESOLVED" && previousStatus !== "RESOLVED") existing.resolvedAt = new Date();
  if (status !== "RESOLVED") existing.resolvedAt = null;
  const complaint = await existing.save();
  const actions = [
    AdminAction.create({
      complaintId: complaint.complaintId,
      action: `Review saved: status ${previousStatus} to ${status}, priority ${previousPriority} to ${priority}`,
      remarks: remarks.trim()
    })
  ];
  if (previousStatus !== status) {
    actions.push(StatusHistory.create({
      complaintId: complaint.complaintId,
      previousStatus,
      newStatus: status,
      remarks: remarks.trim()
    }));
  }
  await Promise.all(actions);
  return complaint;
}
