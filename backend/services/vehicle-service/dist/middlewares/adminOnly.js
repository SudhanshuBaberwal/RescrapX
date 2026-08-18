import ApiError from "../lib/ApiError.js";
const adminOnly = (req, _res, next) => {
    try {
        const userId = req.headers["x-user-id"];
        const role = req.headers["x-user-role"];
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }
        if (role !== "ADMIN") {
            throw new ApiError(403, "Only admin can access this resource");
        }
        next();
    }
    catch (error) {
        throw new ApiError(500, "Only Admin Can Access This Route");
        console.log(error);
    }
};
export default adminOnly;
