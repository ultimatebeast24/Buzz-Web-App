import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getSmartReplies, getAutoSuggestions, analyzeSentiment, detectToxicity } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/smart-replies", protectRoute, getSmartReplies);
router.post("/auto-suggestions", protectRoute, getAutoSuggestions);
router.post("/sentiment-analysis", protectRoute, analyzeSentiment);
router.post("/toxicity-detection", protectRoute, detectToxicity);

export default router;
