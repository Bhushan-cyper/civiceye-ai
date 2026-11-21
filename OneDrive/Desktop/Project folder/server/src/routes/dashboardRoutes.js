import { Router } from "express";
import { getMapComplaints } from "../controllers/dashboardController.js";

const router = Router();
router.get("/complaints", getMapComplaints);

export default router;
