import { User } from '../models/User.models.js';
// import ApiError from '../utils/ApiError.js';

export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return next(new ApiError(404, 'Profile not found'));
        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        next(error);
    }
};
