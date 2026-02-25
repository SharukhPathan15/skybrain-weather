import { City } from "../cities/city.model.js";
import { getCoordinates, getCurrentWeather } from "../weather/weather.service.js";

export const getUserDashboard = async (userId) => {
  const cities = await City.find({ userId }).lean();

  if (!cities.length) {
    return [];
  }

  const enrichedCities = await Promise.all(
    cities.map(async (city) => {
      try {
        const { latitude, longitude } = await getCoordinates(city.name);
        const weather = await getCurrentWeather(latitude, longitude);

        return {
          ...city,
          weather,
        };
      } catch (error) {
        return {
          ...city,
          weather: null,
          weatherError: "Unable to fetch weather data",
        };
      }
    })
  );

  return enrichedCities;
};