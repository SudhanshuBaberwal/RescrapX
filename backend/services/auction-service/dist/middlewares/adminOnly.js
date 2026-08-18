import ApiError from "../lib/ApiError.js";
const adminOnly = (req, _res, next) => {
    const userId = req.headers["x-user-id"];
    const userRole = req.headers["x-user-role"];
    console.log("Auction Service userId:", userId);
    console.log("Auction Service role:", userRole);
    if (!userId || !userRole) {
        throw new ApiError(401, "Unauthorized");
    }
    if (userRole !== "ADMIN") {
        throw new ApiError(403, "Only admin can access this resource");
    }
    next();
};
export default adminOnly;
