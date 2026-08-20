import express, { Application } from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import notificationRouter from "./routes/notification.route.js";

const app: Application = express();
// app.use(helmet());

const allowedOrigins = [
  process.env.GATEWAY_URL || "http://localhost:8000", "http://localhost:8001",
  "https://rescrap-x.vercel.app",
  "http://localhost:3000",
];

if (process.env.ALLOWED_ORIGINS) {
  const customOrigins = process.env.ALLOWED_ORIGINS.split(",").map((o) =>
    o.trim(),
  );
  allowedOrigins.push(...customOrigins);
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(compression());
app.use(cookieParser());

// Health & root endpoints (registered first to avoid being shadowed by routers)
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

// API routes
app.use("/", notificationRouter);

app.use(errorHandler);

export default app;
