import express from "express";
import proxy from "express-http-proxy";
import { env } from "./config/env.ts";
import proxyRoutes from "./routes/route.ts";
const app = express();

app.get("/", (req, res) => {
  res.send("Gateway Running 🚀");
});

app.use("/api/auth", proxy(env.AUTH_SERVICE_URL));
app.use("/api/notification", proxy(env.NOTIFICATION_SERVICE_URL));

export default app;
