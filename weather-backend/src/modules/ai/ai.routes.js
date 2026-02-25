import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { chatAI, getInsight, getSummary } from "./ai.controller.js";

const router = express.Router();

router.post("/chat", protect, chatAI);
router.post("/insight", protect, getInsight);
router.post("/summary", protect, getSummary);

export default router;