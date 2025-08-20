import { Router } from "express";
import protect from "../middlewares/authMiddleware.js";
import { getAllGig, deleteGig, updateGig, createGig, applyToGig, getMyApplications, getGig, getMyGigs, getGigApplications, acceptApplication, rejectApplication, completeGig, addReview, getFreelancerReviews } from "../Controllers/gig.controllers.js";

const router = Router()

router.route('/').post(protect, createGig)
router.route('/').get(getAllGig)
router.route('/:id').put(protect, updateGig)
router.route('/:id').delete(protect, deleteGig)
router.route("/:id/apply").post(protect, applyToGig);
router.route("/my-applications").get(protect, getMyApplications); 
router.route("/my-gigs").get(protect, getMyGigs);
router.route('/:id').get(getGig)
router.route("/:id/applications").get(protect, getGigApplications);

router.route("/:id/accept/:freelancerId").post(protect, acceptApplication);
router.route("/:id/reject/:freelancerId").post(protect, rejectApplication);
router.route("/:id/complete").post(protect, completeGig);
router.route("/:id/review").post(protect, addReview);
router.route("/reviews/:freelancerId").get(getFreelancerReviews);





export default router