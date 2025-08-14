import { registerUser, loginUser } from "../Controllers/auth.controllers.js";
import { Router } from "express";


const router = Router()

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router