import express, { Application } from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import authrouter from "./routes/auth.route.js";
import errorHandler from "./middleware/error.middleware.js";
import partnerRoutes from "./routes/partner.route.js";
import adminRouter from "./routes/admin.route.js";
import documentRouter from "./routes/userDocuments.route.js";

const app: Application = express();

/**
 * Middlewares
 */
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);
app.use(errorHandler);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use("/", authrouter);
app.use("/partner", partnerRoutes);
app.use("/admin", adminRouter);
app.use("/", documentRouter);
/**
 * Health Check
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "Auth Service",
    status: "Running 🚀",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default app;
