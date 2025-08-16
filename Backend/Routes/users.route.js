import { getAllFreelancer, updateUser, specificUser,loggedInUser } from "../Controllers/users.controllers.js";
import { Router } from "express";
import protect from "../middlewares/authMiddleware.js";


const router = Router()


router.route('/me').get(protect, loggedInUser)
router.route('/:id').get(specificUser)
router.route('/me').put(updateUser)
router.route('/').get(getAllFreelancer)


export default router