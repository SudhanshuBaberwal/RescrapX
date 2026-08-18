class ApiResponse {
    static success(res, statusCode, message, data) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
    static error(res, statusCode, message, errors) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
        });
    }
}
export default ApiResponse;
