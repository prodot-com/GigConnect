import express from 'express'
const router = express.Router();
import {User} from '../models/User.model.js'
import protect  from '../middlewares/authMiddleware.js'

// Get current logged-in user's profile
// router.get('/me', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

const loggedInUser =  async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a specific user by ID (public)
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//     } catch (err) {
//     res.status(500).json({ message: err.message });
//     }
// });

const specificUser =  async (req, res) => {
    try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
};

// Update logged-in user's profile
// router.put('/me', protect, async (req, res) => {
//   try {
//     const updates = req.body;

//     // Optional: Hash new password if provided
//     if (updates.password) {
//       const bcrypt = require('bcryptjs');
//       const salt = await bcrypt.genSalt(10);
//       updates.password = await bcrypt.hash(updates.password, salt);
//     }

//     const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    // Optional: Hash new password if provided
    if (updates.password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all freelancers (public)
// router.get('/', async (req, res) => {
//   try {
//     const freelancers = await User.find({ role: 'Freelancer' }).select('-password');
//     res.json(freelancers);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

const getAllFreelancer =  async (req, res) => {
  try {
    const freelancers = await User.find({ role: 'Freelancer' }).select('-password');
    res.json(freelancers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export  {loggedInUser, specificUser, updateUser, getAllFreelancer}