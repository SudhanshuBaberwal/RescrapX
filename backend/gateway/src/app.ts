import express from "express";
import proxy from "express-http-proxy";
import { env } from "./config/env.ts";
import proxyRoutes from "./routes/route.ts";
import cors from "cors"
const app = express();

app.get("/", (req, res) => {
  res.send("Gateway Running 🚀");
});
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  "/api/auth",
  proxy(env.AUTH_SERVICE_URL, {
    parseReqBody: false,
  })
);

app.use(
  "/api/notification",
  proxy(env.NOTIFICATION_SERVICE_URL, {
    parseReqBody: false,
  })
);
app.use("/api/notification", proxy(env.NOTIFICATION_SERVICE_URL));

export default app;
