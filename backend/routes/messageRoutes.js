import express from "express";
import Message from "../models/Message.js";
import auth from "../middleware/authMiddleware.js";
// import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a new message
router.post("/", auth, async (req, res) => {
  try {
    const { roomId, text } = req.body;
    const newMsg = await Message.create({
      roomId,
      text,
      senderId: req.user.id,
      senderRole: req.user.role === "client" ? "Client" : "Freelancer",
    });
    res.status(201).json(newMsg);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all messages for a room
router.get("/:roomId", auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
