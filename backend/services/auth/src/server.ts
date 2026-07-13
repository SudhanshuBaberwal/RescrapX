import app from "./app.js";
import { env } from "./config/env.js";
import connectDB from "./config/db.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`
=========================================
🔐 Auth Service Started
=========================================
Environment : ${env.NODE_ENV}
Port        : ${env.PORT}
URL         : http://localhost:${env.PORT}
Health      : http://localhost:${env.PORT}/health
=========================================
`);
    });
  } catch (error) {
    console.error("❌ Failed to start Auth Service");
    console.error(error);
    process.exit(1);
  }
};

startServer();