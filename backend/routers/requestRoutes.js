const express = require("express");
const Request = require("../models/Request");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// 📩 SEND SWAP REQUEST
router.post("/send/:userId", authMiddleware, async (req, res) => {
  try {
    const newRequest = new Request({
      sender: req.userId,
      receiver: req.params.userId
    });

    await newRequest.save();

    res.json({ msg: "Request sent successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 📥 GET INCOMING REQUESTS
router.get("/incoming", authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({
      receiver: req.userId,
      status: "pending"
    }).populate("sender", "name email skillsOffered skillsWanted");

    res.json(requests);

  } catch (error) {
    res.status(500).json({error: error.message });
  }
});

// 🤝 GET ACCEPTED MATCHES
router.get("/accepted", authMiddleware, async (req, res) => {
  try {
    const matches = await Request.find({
      status: "accepted",
      $or: [
        { sender: req.userId },
        { receiver: req.userId }
      ]
    })
    .populate("sender", "name email skillsOffered skillsWanted")
    .populate("receiver", "name email skillsOffered skillsWanted");

    res.json(matches);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📤 GET SENT REQUESTS
router.get("/sent", authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find({
      sender: req.userId
    }).populate("receiver", "name email skillsOffered skillsWanted");

    res.json(requests);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ ACCEPT REQUEST
router.put("/accept/:requestId", authMiddleware, async (req, res) => {
  try {
    await Request.findByIdAndUpdate(req.params.requestId, {
      status: "accepted"
    });

    res.json({ msg: "Request accepted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ❌ REJECT REQUEST
router.put("/reject/:requestId", authMiddleware, async (req, res) => {
  try {
    await Request.findByIdAndUpdate(req.params.requestId, {
      status: "rejected"
    });

    res.json({ msg: "Request rejected" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;