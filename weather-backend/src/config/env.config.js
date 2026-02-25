import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["PORT", "MONGO_URI", "JWT_SECRET"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL,
};