import jwt from "jsonwebtoken";
// Replace line 2 with:
import env from "../config/env.js";
export const protect = (req, res, next) => {
    try {
        let token = req.cookies?.accessToken;
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        console.log("JWT ERROR:", err);
        return res.status(401).json({
            success: false,
            message: "Invalid Token",
        });
    }
};
