import { GoogleGenerativeAI } from "@google/generative-ai";

export const categories = [
  "Road Damage / Potholes",
  "Garbage Accumulation",
  "Water Leakage",
  "Air Pollution",
  "Drainage Problems",
  "Streetlight Issues",
  "Other Civic Issues"
];

const severities = ["LOW", "MEDIUM", "HIGH"];

function parseAnalysis(text) {
  const json = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  const result = JSON.parse(json);
  if (
    !categories.includes(result.category) ||
    !severities.includes(result.severity) ||
    typeof result.description !== "string" ||
    typeof result.recommendedAction !== "string" ||
    !Number.isFinite(result.confidence) ||
    result.confidence < 0 ||
    result.confidence > 1
  ) {
    throw new Error("AI returned data that did not match the expected analysis format.");
  }
  return {
    category: result.category,
    severity: result.severity,
    confidence: result.confidence,
    description: result.description.slice(0, 500),
    recommendedAction: result.recommendedAction.slice(0, 500)
  };
}

function getModel() {
  if (!process.env.GEMINI_API_KEY) return null;
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return client.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-2.5-flash" });
}

export async function analyzeImage(buffer, mimeType) {
  const model = getModel();
  if (!model) return null;
  const response = await model.generateContent([
    `Analyze this image for a civic infrastructure issue. Return only JSON with keys category, severity, confidence, description, recommendedAction. category must be exactly one of: ${categories.join("; ")}. severity must be LOW, MEDIUM, or HIGH. confidence must be a number from 0 to 1. Do not claim certainty beyond visible evidence.`,
    { inlineData: { data: buffer.toString("base64"), mimeType } }
  ]);
  return parseAnalysis(response.response.text());
}

export async function classifyDescription(description) {
  const model = getModel();
  if (!model) return null;
  const response = await model.generateContent(
    `Classify this citizen-reported civic issue. Return only JSON with keys category, severity, confidence, description, recommendedAction. category must be exactly one of: ${categories.join("; ")}. severity must be LOW, MEDIUM, or HIGH. confidence must be a number from 0 to 1. Description: ${description}`
  );
  return parseAnalysis(response.response.text());
}
