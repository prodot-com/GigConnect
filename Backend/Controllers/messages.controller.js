// src/Controllers/messages.controller.js
import { Message } from "../models/Message.model.js";

const getMessages = async (req, res) => {
  try {
    const { gigId } = req.params;
    const messages = await Message.find({ gigId })
      .populate("sender", "name email")
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getMessages };