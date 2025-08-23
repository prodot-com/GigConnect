import Razorpay from "razorpay";
import "dotenv/config";
import crypto from "crypto";
import { Gig } from "../models/Gig.model.js";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const order = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, 
      currency: "INR",
      receipt: `gig_${req.body.gigId}_${Date.now()}`.slice(0, 40),

    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getKey = (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
};

const verify_payment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      gigId,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      const updatedGig = await Gig.findByIdAndUpdate(
        gigId,
        { isPaid: true },
        { new: true } 
      );

      return res.json({
        success: true,
        message: "Payment verified successfully",
        gig: updatedGig, 
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature, payment verification failed",
      });
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
};


export { order, getKey, verify_payment };
