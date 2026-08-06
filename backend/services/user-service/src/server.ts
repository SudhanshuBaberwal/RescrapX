import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";

const PORT = env.PORT || 8003;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
====================================================
🚗 User Service Started Successfully
====================================================
Environment : ${env.NODE_ENV}
Port        : ${env.PORT}
Health      : http://localhost:${env.PORT}/health
====================================================
`);
  });
};

start();
