import { rateLimit, type Options } from "express-rate-limit";

const baseOptions: Partial<Options> = {
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },

  ipv6Subnet: 56,
};
export const generalLimiter = rateLimit({
  ...baseOptions,

  windowMs: 15 * 60 * 1000,

  limit: 300,

  identifier: "general-api",
});

export const authLimiter = rateLimit({
  ...baseOptions,

  windowMs: 15 * 60 * 1000,

  limit: 10,

  identifier: "auth-api",
});

export const otpLimiter = rateLimit({
  ...baseOptions,

  windowMs: 15 * 60 * 1000,

  limit: 5,

  identifier: "otp-api",
});

export const uploadLimiter = rateLimit({
  ...baseOptions,

  windowMs: 15 * 60 * 1000,

  limit: 10,

  identifier: "upload-api",
});

export const bidLimiter = rateLimit({
  ...baseOptions,

  windowMs: 60 * 1000,

  limit: 60,

  identifier: "bid-api",
});
export const adminLimiter = rateLimit({
  ...baseOptions,

  windowMs: 15 * 60 * 1000,

  limit: 300,

  identifier: "admin-api",
});