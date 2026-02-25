import express from "express";
import {
  createCity,
  getCities,
  removeCity,
  favoriteCity,
} from "./city.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createCity);
router.get("/", protect, getCities);
router.get("/search", protect, async (req, res, next) => {
  try {
    const { q } = req.query;
    const axios = (await import("axios")).default;
    const response = await axios.get("https://geocoding-api.open-meteo.com/v1/search", {
      params: { name: q, count: 5 }
    });
    const results = (response.data.results || []).map(r => ({
      name: r.name,
      country: r.country_code,
      state: r.admin1,
      lat: r.latitude,
      lon: r.longitude
    }));
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
});
router.delete("/:cityId", protect, removeCity);
router.patch("/:cityId/favorite", protect, favoriteCity);



export default router;