import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";
import { protect } from "./middleware/auth.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import cityRoutes from "./modules/cities/city.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import weatherRoutes from "./modules/weather/weather.routes.js";


import { env } from "./config/env.config.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.get("/api/protected", protect, (req, res) => {
  res.json({
    success: true,
    message: "You are authorized",
    user: req.user,
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});


app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/weather", weatherRoutes);

app.use(errorHandler);

export default app;