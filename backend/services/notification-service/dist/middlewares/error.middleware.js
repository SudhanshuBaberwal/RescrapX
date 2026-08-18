import ApiError from "../lib/ApiError.js";
const errorHandler = (err, _req, res, _next) => {
    console.error(err);
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
export default errorHandler;
