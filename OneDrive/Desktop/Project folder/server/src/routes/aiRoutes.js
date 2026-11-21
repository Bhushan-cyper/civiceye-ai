import { Router } from "express";
import { analyzeUploadedImage, classifyText } from "../controllers/aiController.js";
import { upload } from "../middleware/upload.js";

const router = Router();
router.post("/analyze", upload.single("image"), analyzeUploadedImage);
router.post("/classify", classifyText);

export default router;
