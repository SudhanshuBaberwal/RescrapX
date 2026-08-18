import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
// Replace line 2 with:
import env from "../config/env.js";
const proxyRoutes = Router();

proxyRoutes.use(
  "/auth",
  createProxyMiddleware({
    target: env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/auth": "/api/auth",
    },
  }),
);



export default proxyRoutes;
