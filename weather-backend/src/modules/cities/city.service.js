import { City } from "./city.model.js";

export const addCity = async ({ name, country, lat, lon }, userId) => {
  const existing = await City.findOne({ name, userId });

  if (existing) {
    const error = new Error("City already exists");
    error.statusCode = 400;
    throw error;
  }

  const city = await City.create({ name, country, lat, lon, userId });

  return city;
};

export const getUserCities = async (userId) => {
  return await City.find({ userId }).sort({ createdAt: -1 });
};

export const deleteCity = async (cityId, userId) => {
  const city = await City.findOneAndDelete({
    _id: cityId,
    userId,
  });

  if (!city) {
    const error = new Error("City not found or not authorized");
    error.statusCode = 404;
    throw error;
  }

  return city;
};

export const toggleFavorite = async (cityId, userId) => {
  const city = await City.findOne({
    _id: cityId,
    userId,
  });

  if (!city) {
    const error = new Error("City not found or not authorized");
    error.statusCode = 404;
    throw error;
  }

  city.isFavorite = !city.isFavorite;
  await city.save();

  return city;
};
