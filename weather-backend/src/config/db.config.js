import mongoose from "mongoose";
import { env } from "./env.config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};