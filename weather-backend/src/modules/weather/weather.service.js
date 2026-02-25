import axios from "axios";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const weatherCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000;

export const getCoordinates = async (cityName) => {
  const response = await axios.get(GEO_URL, {
    params: { name: cityName, count: 1 },
  });

  if (!response.data.results || response.data.results.length === 0) {
    throw new Error(`Coordinates not found for ${cityName}`);
  }

  const { latitude, longitude, country_code } = response.data.results[0];
  return { latitude, longitude, country: country_code };
};

// Find closest hour index in hourly data
const getCurrentHourIndex = (hourlyTimes) => {
  const now = new Date();
  return hourlyTimes.findIndex((t) => {
    const d = new Date(t);
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate() &&
      d.getHours() === now.getHours()
    );
  });
};

export const getCurrentWeather = async (latitude, longitude) => {
  const cacheKey = `${latitude}-${longitude}`;
  const now = Date.now();

  if (weatherCache.has(cacheKey)) {
    const cached = weatherCache.get(cacheKey);
    if (now - cached.timestamp < CACHE_DURATION) return cached.data;
    weatherCache.delete(cacheKey);
  }

  const response = await axios.get(WEATHER_URL, {
    params: {
      latitude,
      longitude,
      current_weather: true,
      hourly: "relativehumidity_2m,apparent_temperature,visibility",
      timezone: "auto",
      forecast_days: 1,
    },
  });

  const cw = response.data.current_weather;
  const hourlyTimes = response.data.hourly?.time ?? [];
  const idx = getCurrentHourIndex(hourlyTimes);
  const safeIdx = idx >= 0 ? idx : 0;

  const data = {
    main: {
      temp: cw.temperature,
      feels_like:
        response.data.hourly?.apparent_temperature?.[safeIdx] ?? cw.temperature,
      humidity: response.data.hourly?.relativehumidity_2m?.[safeIdx] ?? 0,
    },
    wind: {
      speed: cw.windspeed,
      deg: cw.winddirection,
    },
    visibility: response.data.hourly?.visibility?.[safeIdx] ?? 10000,
    weather: [
      {
        description: getDesc(cw.weathercode),
        icon: getIcon(cw.weathercode),
      },
    ],
  };

  weatherCache.set(cacheKey, { data, timestamp: now });
  return data;
};

export const getForecastWeather = async (latitude, longitude) => {
  const response = await axios.get(WEATHER_URL, {
    params: {
      latitude,
      longitude,
      daily: "temperature_2m_max,temperature_2m_min,weathercode",
      timezone: "auto",
      forecast_days: 5,
    },
  });

  const daily = response.data.daily;
  return daily.time.map((date, i) => ({
    dt: new Date(date).getTime() / 1000,
    main: {
      temp_max: daily.temperature_2m_max[i],
      temp_min: daily.temperature_2m_min[i],
    },
    weather: [
      {
        description: getDesc(daily.weathercode[i]),
        icon: getIcon(daily.weathercode[i]),
      },
    ],
  }));
};

export function getDesc(code) {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Icy fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Heavy drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate showers",
    82: "Violent showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm heavy hail",
  };
  return map[code] ?? "Unknown";
}

export function getIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌨️";
  return "⛈️";
}