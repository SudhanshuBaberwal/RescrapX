import express, { Application } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import vehicleRoutes from "./routes/vehicle.route.js";

import { env } from "./config/env.js";

const app: Application = express();
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:8000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "Vehicle Service",
    status: "Running",
    timestamp: new Date().toISOString(),
  });
});
app.get("/" , (req , res) => {
  return res.status(200).json({message:"Vehicle Service"})
})
app.use("/register", vehicleRoutes);

export default app;
