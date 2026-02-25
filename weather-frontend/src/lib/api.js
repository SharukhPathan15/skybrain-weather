import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ─── Auth ───────────────────────────────────────────
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const logout = () => API.post("/auth/logout");
export const getMe = () => API.get("/auth/me");

// ─── Cities ─────────────────────────────────────────
export const getCities = () => API.get("/cities");
export const addCity = (data) => API.post("/cities", data);
export const deleteCity = (cityId) => API.delete(`/cities/${cityId}`);
export const toggleFavorite = (cityId) => API.patch(`/cities/${cityId}/favorite`);
export const searchCities = (query) => API.get(`/cities/search?q=${query}`);

// ─── Weather ─────────────────────────────────────────
export const getBulkWeather = (cities) => API.post("/weather/bulk", { cities });
export const getForecast = (cityName) => API.get(`/weather/forecast?city=${cityName}`);

// ─── AI ──────────────────────────────────────────────
export const aiChat = (message, cities, history, weatherMap) =>
  API.post("/ai/chat", { message, cities, history, weatherMap });
export const getAiInsights = (cityName, weather) =>
  API.post("/ai/insight", { cityName, weather });
export const getWeeklySummary = (cities,weatherMap) =>
  API.post("/ai/summary", { cities,weatherMap  });

export default API;