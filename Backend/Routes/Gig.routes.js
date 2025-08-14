import express from 'express';
import { createGig, updateGig, getGigs,deleteGig } from '../Controllers/Gig.controllers.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect(['client']), createGig);
router.get('/', getGigs);
router.put('/:id', protect(['client']), updateGig);
router.delete('/:id', protect(['client']), deleteGig);

export default router;
