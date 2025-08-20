import { Message } from "../models/Message.model.js";

// GET /api/chat/:gigId/history
// Optional query: ?with=<userId> (to filter by participant)
const getGigHistory = async (req, res) => {
  try {
    const { gigId } = req.params;
    const { with: withUser } = req.query;

    const filter = { gig: gigId };
    if (withUser) {
      // Only messages where current user or withUser is involved
      filter.$or = [
        { sender: req.user._id, receiver: withUser },
        { sender: withUser, receiver: req.user._id },
        // also include broadcast messages (no receiver)
        { receiver: null }
      ];
    }

    const messages = await Message.find(filter)
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { getGigHistory };
