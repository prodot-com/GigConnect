
import { Router } from "express";
import protect from "../middlewares/authMiddleware.js";
import { getMessages } from "../Controllers/messages.controller.js";

const router = Router();

router.route("/:gigId").get(protect, getMessages);

export default router;