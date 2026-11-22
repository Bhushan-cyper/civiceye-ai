import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDatabase } from "./config/db.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT) || 5000;
const rootDirectory = fileURLToPath(new URL("../", import.meta.url));
const uploadDirectory = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(rootDirectory, "uploads");
const clientOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || clientOrigins.includes(origin));
  }
}));
app.use(express.json({ limit: "1mb" }));
app.use(
  "/uploads",
  (_req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadDirectory)
);
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));
app.get("/api/health", (_req, res) => res.json({ success: true, status: "ok" }));
app.use("/api/complaints", complaintRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/map", dashboardRoutes);
app.use((_req, res) => res.status(404).json({ success: false, error: "Endpoint not found." }));
app.use(errorHandler);

connectDatabase()
  .then(() => app.listen(port, () => console.log(`CivicEye API listening on http://localhost:${port}`)))
  .catch((error) => {
    console.error("Could not start CivicEye API:", error.message);
    process.exitCode = 1;
  });
