// Profile.routes.js
import express from 'express';
import { getProfile, updateProfile } from '../Controllers/Profile.controllers.js';

const router = express.Router();

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;
