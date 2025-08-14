import { registerUser, signIn } from "../Controllers/User.controllers.js";
import { Router } from "express";


const router = Router()

router.route('/signup').post(registerUser)
router.route('/signin').post(signIn)

export default router