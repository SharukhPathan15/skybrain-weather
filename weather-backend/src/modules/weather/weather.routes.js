import express from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { getBulkWeather, getForecast } from "./weather.controller.js";

const router = express.Router();

router.post("/bulk", protect, getBulkWeather);
router.get("/forecast", protect, getForecast);

export default router;