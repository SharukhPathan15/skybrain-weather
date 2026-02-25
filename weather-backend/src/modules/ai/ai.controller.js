import { askWeatherAI } from "./ai.service.js";

export const chatAI = async (req, res, next) => {
  try {
    const { message, cities, history, weatherMap } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }

    const weatherContext = cities?.map((city) => ({
      city: city.name,
      country: city.country,
      weather: weatherMap?.[city._id] ?? null,
    }));

    const response = await askWeatherAI(message, weatherContext, history || []);

    res.json({ success: true, data: { response } });
  } catch (err) {
    next(err);
  }
};

export const getInsight = async (req, res, next) => {
  try {
    const { cityName, weather } = req.body;

    const insight = await askWeatherAI(
      `Give a 2-sentence practical weather insight for ${cityName} based on: ${JSON.stringify(weather)}`,
      null,
      [],
    );

    res.json({ success: true, data: { insight } });
  } catch (err) {
    next(err);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const { cities, weatherMap } = req.body;

    const weatherContext = cities?.map((city) => ({
      city: city.name,
      country: city.country,
      weather: weatherMap?.[city._id] ?? null,
    }));

    const summary = await askWeatherAI(
      `Give a detailed weather summary comparing these cities and highlight the best and worst weather right now:`,
      weatherContext,
      [],
    );

    res.json({ success: true, data: { summary } });
  } catch (err) {
    next(err);
  }
};
