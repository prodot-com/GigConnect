import { Router } from "express";
import protect from "../middlewares/authMiddleware.js";
import { getGigHistory } from "../Controllers/chat.controllers.js";

const router = Router();

router.get("/:gigId/history", protect, getGigHistory);

export default router;
