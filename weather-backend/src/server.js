import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import { env } from "./config/env.config.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();