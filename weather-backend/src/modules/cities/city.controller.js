import {
  addCity,
  getUserCities,
  deleteCity,
  toggleFavorite,
} from "./city.service.js";
import { createCitySchema } from "./city.validation.js";

export const createCity = async (req, res, next) => {
  try {
   const validatedData = createCitySchema.parse(req.body);
const { name, country, lat, lon } = req.body;

    if (!name) {
      const error = new Error("City name is required");
      error.statusCode = 400;
      throw error;
    }

    const city = await addCity({ name, country, lat, lon }, req.user._id);

    res.status(201).json({
      success: true,
      city,
    });
  } catch (error) {
    next(error);
  }
};

export const getCities = async (req, res, next) => {
  try {
    const cities = await getUserCities(req.user._id);

    res.status(200).json({
      success: true,
      cities,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCity = async (req, res, next) => {
  try {
    const { cityId } = req.params;

    await deleteCity(cityId, req.user._id);

    res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const favoriteCity = async (req, res, next) => {
  try {
    const { cityId } = req.params;

    const city = await toggleFavorite(cityId, req.user._id);

    res.status(200).json({
      success: true,
      city,
    });
  } catch (error) {
    next(error);
  }
};
