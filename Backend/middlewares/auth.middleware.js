import jwt from 'jsonwebtoken';
// import ApiError from '../utils/ApiError.js';

export const protect = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return next(new ApiError(401, 'No token, authorization denied'));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            if (roles.length && !roles.includes(req.user.role)) {
                return next(new ApiError(403, 'Access denied'));
            }
            next();
        } catch (error) {
            next(new ApiError(401, 'Invalid token'));
        }
    };
};
