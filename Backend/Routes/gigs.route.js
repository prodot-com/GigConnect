import { Router } from "express";
import protect from "../middlewares/authMiddleware.js";
import { getAllGig, deleteGig, updateGig, createGig } from "../Controllers/gig.controllers.js";

const router = Router()

router.route('/').post(protect, createGig)
router.route('/').get(getAllGig)
router.route('/:id').put(protect, updateGig)
router.route('/:id').delete(protect, deleteGig)


export default router