import ApiError from "../lib/ApiError.js";
export const authenticate = (req, _res, next) => {
    const userId = req.headers["x-user-id"];
    const role = req.headers["x-user-role"];
    if (!userId) {
        return next(new ApiError(401, "Unauthorized"));
    }
    req.user = {
        userId,
        role,
    };
    next();
};
