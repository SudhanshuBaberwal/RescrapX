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
const allowedOrigins = [
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
const proxyOptions = {
    parseReqBody: false,
    userResHeaderDecorator(headers, userReq, userRes) {
        // Preserve Gateway's own CORS headers
        const allowedOrigin = userRes.getHeader("access-control-allow-origin");
        const allowedCredentials = userRes.getHeader("access-control-allow-credentials");
        const allowedMethods = userRes.getHeader("access-control-allow-methods");
        const allowedHeaders = userRes.getHeader("access-control-allow-headers");
        // Remove downstream headers
        delete headers["access-control-allow-origin"];
        delete headers["access-control-allow-credentials"];
        delete headers["access-control-allow-methods"];
        delete headers["access-control-allow-headers"];
        // Re-apply Gateway's CORS headers
        if (allowedOrigin)
            headers["access-control-allow-origin"] = allowedOrigin;
        if (allowedCredentials)
            headers["access-control-allow-credentials"] = allowedCredentials;
        if (allowedMethods)
            headers["access-control-allow-methods"] = allowedMethods;
        if (allowedHeaders)
            headers["access-control-allow-headers"] = allowedHeaders;
        return headers;
    }
};
app.use("/api/auth", proxy(env.AUTH_SERVICE_URL, proxyOptions));
app.use("/api/notification", proxy(env.NOTIFICATION_SERVICE_URL, proxyOptions));
app.use("/", router);
app.use("/api/vehicle", protect, proxyRoutes(env.VEHICLE_SERVICE_URL));
app.use("/api/auction", protect, proxyRoutes(env.AUCTION_SERVICE_URL));
export default app;
