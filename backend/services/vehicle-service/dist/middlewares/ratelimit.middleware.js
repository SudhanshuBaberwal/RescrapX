import { rateLimit } from "express-rate-limit";
const baseOptions = {
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
export const uploadLimiter = rateLimit({
    ...baseOptions,
    windowMs: 15 * 60 * 1000,
    limit: 10,
    identifier: "vehicle-upload",
});
export const vehicleMutationLimiter = rateLimit({
    ...baseOptions,
    windowMs: 15 * 60 * 1000,
    limit: 60,
    identifier: "vehicle-mutation",
});
