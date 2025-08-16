import express from 'express'
const router = express.Router();
import {Gig} from '../models/Gig.model.js'

const createGig =  async (req, res) => {
    const { title, description, skillsRequired, budget, location } = req.body;
    try {

        const checkTitle = await Gig.findOne({title})
        if(checkTitle){
            return res.status(403).json({
                message: "Title not available"
            })
        }

        const gig = new Gig({ client: req.user._id, title, description, skillsRequired, budget, location });
        await gig.save();
        res.status(201).json(gig);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const getAllGig = async (req, res) => {
    try {
    const gigs = await Gig.find().populate('client', 'name email');
    res.json(gigs);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};


const updateGig =  async (req, res) => {
    try {
    let gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    if (gig.client.toString() !== req.user._id.toString()) 
        
        return res.status(401).json({ message: 'Not authorized' });

    gig = await Gig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(gig);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};


const deleteGig = async (req, res) => {
    try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    if (gig.client.toString() !== req.user._id.toString()) 
        return res.status(401).json({ message: 'Not authorized' });

    await Gig.findByIdAndDelete(req.params._id)
    res.json({ message: 'Gig removed' });
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};

export {createGig, updateGig, getAllGig, deleteGig}