import ApiError from "../lib/ApiError.js";
const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return next(new ApiError(400, result.error.issues.map((err) => err.message).join(", ")));
    }
    req.body = result.data;
    next();
};
export default validate;
