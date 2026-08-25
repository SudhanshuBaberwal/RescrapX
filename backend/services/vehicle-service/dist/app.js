import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import vehicleRoutes from "./routes/vehicle.route.js";
const app = express();
app.use(helmet());
const allowedOrigins = [
    process.env.GATEWAY_URL || "http://localhost:8000",
    "https://www.rescrapx.com",
    "http://localhost:3000",
];
if (process.env.ALLOWED_ORIGINS) {
    const customOrigins = process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
    allowedOrigins.push(...customOrigins);
}
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
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
app.get("/", (req, res) => {
    return res.status(200).json({ message: "Vehicle Service" });
});
app.use("/register", vehicleRoutes);
app.use((err, req, res, next) => {
    console.error("Vehicle SERVICE ERROR:", err);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: {
            code: err.code || "INTERNAL_SERVER_ERROR",
        },
    });
});
export default app;
