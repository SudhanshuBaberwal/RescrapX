import { rateLimit, type Options } from "express-rate-limit";

const baseOptions: Partial<Options> = {
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please slow down and try again later.",
    });
  },

  ipv6Subnet: 56,
};
export const generalLimiter = rateLimit({
  ...baseOptions,

  windowMs: 15 * 60 * 1000,

  limit: 300,

  identifier: "gateway-general",
});