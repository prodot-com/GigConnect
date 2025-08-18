import { getAllFreelancer, updateUser, specificUser, loggedInUser } from "../Controllers/users.controllers.js";
import { Router } from "express";
import protect from "../middlewares/authMiddleware.js";

const router = Router();

router.route('/me').get(protect, loggedInUser);
router.route('/me').put(protect, updateUser); 
router.route('/:id').get(specificUser);         
router.route('/').get(getAllFreelancer);       

export default router;
