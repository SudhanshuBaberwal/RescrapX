import http from "http";

import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(env.PORT, () => {
      console.log(`
====================================================
🚗 Vehicle Service Started Successfully
====================================================
Environment : ${env.NODE_ENV}
Port        : ${env.PORT}
Health      : http://localhost:${env.PORT}/health
====================================================
`);
    });
  } catch (error) {
    console.error("Failed to start Vehicle Service");
    console.error(error);
    process.exit(1);
  }
};

startServer();

/**
 * Graceful Shutdown
 */

process.on("SIGINT", () => {
  console.log("Stopping Vehicle Service...");
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  console.log("Stopping Vehicle Service...");
  server.close(() => process.exit(0));
});