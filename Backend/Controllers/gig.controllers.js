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

        console.log(req.user)

        const gig = new Gig({ client: req.user._id, title, description, skillsRequired, budget, location });
        await gig.save();
        res.status(201).json(gig);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

  const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("client", "name email");
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllGig = async (req, res) => {
  try {
    const { search, location, minBudget, maxBudget } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skillsRequired: { $regex: search, $options: "i" } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }

    const gigs = await Gig.find(filter).populate("client", "name email");
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

const applyToGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    if (gig.appliedFreelancers.includes(req.user._id)) {
      return res.status(400).json({ message: "You already applied to this gig" });
    }

    gig.appliedFreelancers.push(req.user._id);
    await gig.save();

    res.json({ message: "Applied successfully", gig });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get gigs applied by logged-in freelancer
const getMyApplications = async (req, res) => {
  try {
    const gigs = await Gig.find({ appliedFreelancers: req.user._id })
      .populate("client", "name email")
      .populate("appliedFreelancers", "name email");

    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getMyGigs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user missing" });
    }

    const gigs = await Gig.find({ client: req.user._id })
      .populate("appliedFreelancers", "name email skills");

    res.json(gigs);
  } catch (err) {
    console.error("Error in getMyGigs:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};




export {createGig, updateGig, getAllGig, deleteGig, applyToGig, getMyApplications, getGig, getMyGigs}