import express from "express";
import proxy from "express-http-proxy";
import env from "./config/env.js";
import { proxyRoutes } from "./routes/proxyRoute.js";
import cors from "cors";
import { protect } from "./middleware/auth.middleware.js";
import cookieParser from "cookie-parser";
import router from "./routes/newRoute.js";
const app = express();
app.get("/", (req, res) => {
    res.send("Gateway Running 🚀");
});
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use("/api/auth", proxy(env.AUTH_SERVICE_URL, {
    parseReqBody: false,
}));
app.use("/api/notification", proxy(env.NOTIFICATION_SERVICE_URL, {
    parseReqBody: false,
}));
app.use("/", router);
app.use("/api/user", protect, proxyRoutes(env.USER_SERVICE_URL));
app.use("/api/vehicle", protect, proxyRoutes(env.VEHICLE_SERVICE_URL));
app.use("/api/auction", protect, proxyRoutes(env.AUCTION_SERVICE_URL));
export default app;
