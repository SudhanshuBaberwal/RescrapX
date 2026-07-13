import express, { Application } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import notificationRoutes from "./routes/notification.route.js";
import errorHandler from "./middlewares/error.middleware.js";
import router from "./routes/notification.route.js";

const app: Application = express();
// app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:8000"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(compression());
app.use(cookieParser());
app.use("/" , router)

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "Notification Service",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
app.get("/", (_req, res) => {
  res.json({
    service: "RescrapX Notification Service",
    version: "v1",
    status: "Running 🚀",
  });
});
// app.use("/{*any}", (_req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route Not Found",
//   });
// });
app.use(errorHandler);

export default app;