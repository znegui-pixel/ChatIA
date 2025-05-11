import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js"; 
import { requireAdmin } from "../middlewares/requireAdmin.js";
import * as Admin from "../controllers/admin-controllers.js";
const router = Router();

router.use(authenticate);
router.use(requireAdmin);
// Reporting
router.get("/analytics/questions-per-tag", Admin.questionsPerTag);
router.get("/analytics/daily-volume", Admin.dailyVolume);
router.get("/analytics/global-stats", Admin.getGlobalStats);
router.get("/users", Admin.getAllUsers);
// NLP
router.get("/intents", Admin.getIntents);
router.post("/intents", Admin.addIntent);
export default router;
