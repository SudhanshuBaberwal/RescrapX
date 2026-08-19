import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";
import router from "./routes/notification.route.js";
const app = express();
// app.use(helmet());
const allowedOrigins = [
    process.env.GATEWAY_URL || "http://localhost:8000",
    "https://rescrap-x.vercel.app",
    "http://localhost:3000"
];
if (process.env.ALLOWED_ORIGINS) {
    const customOrigins = process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim());
    allowedOrigins.push(...customOrigins);
}
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(compression());
app.use(cookieParser());
app.use("/", router);
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
// Example for health check or root endpoints:
app.get("/health", (_req, res) => {
    res.status(200).json({ status: "OK" });
});
// app.use("/{*any}", (_req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route Not Found",
//   });
// });
app.use(errorHandler);
export default app;
