import { analyzeImage, classifyDescription } from "../services/aiService.js";
import { detectImageType } from "../middleware/upload.js";

export async function analyzeUploadedImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "Choose an image to analyze." });
    const mimeType = detectImageType(req.file.buffer);
    if (!mimeType) return res.status(400).json({ success: false, error: "The uploaded file is not a valid JPEG, PNG, or WebP image." });
    const analysis = await analyzeImage(req.file.buffer, mimeType);
    res.json({
      success: true,
      data: analysis,
      available: Boolean(analysis),
      message: analysis ? "" : "AI is not configured. You can still submit this report manually."
    });
  } catch (error) {
    console.warn("Gemini image analysis failed:", error.message);
    res.json({ success: true, data: null, available: false, message: "AI analysis is unavailable. You can still submit this report manually." });
  }
}

export async function classifyText(req, res, next) {
  try {
    const description = typeof req.body.description === "string" ? req.body.description.trim() : "";
    if (!description || description.length > 2000) {
      return res.status(400).json({ success: false, error: "Enter a description of 1–2,000 characters." });
    }
    const analysis = await classifyDescription(description);
    res.json({
      success: true,
      data: analysis,
      available: Boolean(analysis),
      message: analysis ? "" : "AI is not configured. You can still submit this report manually."
    });
  } catch (error) {
    console.warn("Gemini text classification failed:", error.message);
    res.json({ success: true, data: null, available: false, message: "AI classification is unavailable. You can still submit this report manually." });
  }
}
