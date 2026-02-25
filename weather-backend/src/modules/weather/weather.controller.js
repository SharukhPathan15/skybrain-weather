import {
  getCoordinates,
  getCurrentWeather,
  getForecastWeather,
} from "./weather.service.js";

// POST /api/weather/bulk
export const getBulkWeather = async (req, res, next) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities)) {
      return res.status(400).json({ message: "Cities array is required" });
    }

    const results = await Promise.all(
      cities.map(async (city) => {
        try {
          const lat = city.lat ?? null;
          const lon = city.lon ?? null;

          const { latitude, longitude } =
            lat && lon
              ? { latitude: lat, longitude: lon }
              : await getCoordinates(city.name);

          const weather = await getCurrentWeather(latitude, longitude);

          return { cityId: city._id, data: weather };
        } catch {
          return { cityId: city._id, data: null };
        }
      })
    );

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

// GET /api/weather/forecast
export const getForecast = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const { latitude, longitude } = await getCoordinates(city);
    const forecast = await getForecastWeather(latitude, longitude);

    res.json({ success: true, data: { forecast } });
  } catch (err) {
    next(err);
  }
};