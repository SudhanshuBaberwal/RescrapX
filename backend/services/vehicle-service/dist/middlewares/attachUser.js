export const attachUser = (req, res, next) => {
    req.user = {
        userId: req.headers["x-user-id"],
        role: req.headers["x-user-role"],
    };
    next();
};
