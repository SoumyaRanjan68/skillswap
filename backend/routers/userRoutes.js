const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");


// 👤 GET LOGGED-IN USER PROFILE
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all", authMiddleware, async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userId } },         // exclude self
      "name email skillsOffered skillsWanted" // only send needed fields
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
// ✏️ UPDATE USER SKILLS
router.put("/skills", authMiddleware, async (req, res) => {
  try {
    const { skillsOffered, skillsWanted } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { skillsOffered, skillsWanted },
      { new: true }
    ).select("-password");

    res.json(updatedUser);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🤝 FIND MATCHING USERS
router.get("/matches", authMiddleware, async (req, res) => {
  try {
    // Get current user
    const currentUser = await User.findById(req.userId);

    // Find users with complementary skills
    const matches = await User.find({
      _id: { $ne: req.userId }, // exclude yourself

      skillsOffered: { $in: currentUser.skillsWanted }, // they offer what you want
      skillsWanted: { $in: currentUser.skillsOffered }  // they want what you offer
    }).select("-password");

    res.json(matches);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});