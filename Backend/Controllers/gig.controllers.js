import {Gig} from '../models/Gig.model.js'
// import ApiError from 

export const createGig = async (req, res, next) => {
    try {
        const gig = await Gig.create({ ...req.body, client: req.user.id });
        res.status(201).json({ success: true, gig });
    } catch (error) {
        next(error);
    }
};

export const getGigs = async (req, res, next) => {
    try {
        const gigs = await Gig.find().populate('client', 'name email');
        res.json({ success: true, gigs });
    } catch (error) {
        next(error);
    }
};

export const updateGig = async (req, res, next) => {
    try {
        const gig = await Gig.findOneAndUpdate(
            { _id: req.params.id, client: req.user.id },
            req.body,
            { new: true }
        );
        if (!gig) return next(new ApiError(404, 'Gig not found'));
        res.json({ success: true, gig });
    } catch (error) {
        next(error);
    }
};

export const deleteGig = async (req, res, next) => {
    try {
        const gig = await Gig.findOneAndDelete({ _id: req.params.id, client: req.user.id });
        if (!gig) return next(new ApiError(404, 'Gig not found'));
        res.json({ success: true, message: 'Gig deleted' });
    } catch (error) {
        next(error);
    }
};
