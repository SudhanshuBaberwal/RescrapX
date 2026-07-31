import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { env } from "../config/env.ts";

const proxyRoutes = Router();

proxyRoutes.use(
  "/auth",
  createProxyMiddleware({
    target: env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/auth": "/api/auth",
    },
  })
);



export default proxyRoutes;