import express from 'express';
import { getGlobalStats, dailyVolume, questionsPerTag, getAllQuestions } from "../controllers/statsController.js";
const router = express.Router();

router.get('/global', getGlobalStats);
router.get('/daily-volume', dailyVolume);
router.get('/questions-per-tag', questionsPerTag);
router.get("/questions", getAllQuestions);

export default router;
