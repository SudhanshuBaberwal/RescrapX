import express from "express";
import proxy from "express-http-proxy";
import env from "./config/env.ts";
import { proxyRoutes } from "./routes/proxyRoute.ts";
import cors from "cors";
import { protect } from "./middleware/auth.middleware.ts";
import cookieParser from "cookie-parser";

const app = express();

app.get("/", (req, res) => {
  res.send("Gateway Running 🚀");
});
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(
  "/api/auth",
  proxy(env.AUTH_SERVICE_URL, {
    parseReqBody: false,
  }),
);

app.use(
  "/api/notification",
  proxy(env.NOTIFICATION_SERVICE_URL, {
    parseReqBody: false,
  }),
);
app.use("/api/user", protect, proxyRoutes(env.USER_SERVICE_URL));

app.use("/api/vehicle", protect, proxyRoutes(env.VEHICLE_SERVICE_URL));

app.use("/api/auction", protect, proxyRoutes(env.AUCTION_SERVICE_URL));

export default app;
