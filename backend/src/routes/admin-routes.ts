import { Router } from "express";
import { requireAdmin } from "../middlewares/requireAdmin.js";
import * as Admin from "../controllers/admin-controllers.js";

const router = Router();
router.use(requireAdmin);

// Reporting
router.get("/analytics/questions-per-tag", Admin.questionsPerTag);
router.get("/analytics/daily-volume", Admin.dailyVolume);

// NLP
router.get("/intents", Admin.getIntents);
router.post("/intents", Admin.addIntent);

export default router;
