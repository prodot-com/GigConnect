import { getKey, order, verify_payment } from "../Controllers/razorpay.controllers.js";
import { Router } from "express";

const router = Router()

router.route('/create-order').post(order)
router.route("/get-key").get(getKey);
router.route("/verify-payment").post(verify_payment);

export default router