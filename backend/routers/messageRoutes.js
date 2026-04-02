const express = require("express");
const router  = express.Router();
const Message = require("../models/message");
const authMiddleware = require("../middleware/authMiddleware");

// 💾 SAVE a message
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const msg = await Message.create({
      sender:   req.userId,
      receiver: receiverId,
      message,
    });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📜 GET chat history between two users
router.get("/history/:peerId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId,        receiver: req.params.peerId },
        { sender: req.params.peerId, receiver: req.userId        },
      ],
    }).sort({ createdAt: 1 }); // oldest first

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;