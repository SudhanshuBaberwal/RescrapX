import ApiError from "../lib/ApiError.js";
const partnerOnly = (req, _res, next) => {
    const userId = req.headers["x-user-id"];
    const userRole = req.headers["x-user-role"];
    if (!userId || !userRole) {
        throw new ApiError(401, "Unauthorized");
    }
    if (userRole !== "PARTNER") {
        throw new ApiError(403, "Only Partner can access this resource");
    }
    next();
};
export default partnerOnly;
