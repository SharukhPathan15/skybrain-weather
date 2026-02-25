import { z } from "zod";

export const createCitySchema = z.object({
  name: z.string().min(2, "City name must be at least 2 characters"),
});