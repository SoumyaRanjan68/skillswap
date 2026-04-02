// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");


// // Register
// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await User.create({
//     name,
//     email,
//     password: hashedPassword
//   });

//   res.json(user);
// });

// module.exports = router;





// const express = require("express");
// const router = express.Router();

// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");


// // =======================
// // 🔐 REGISTER USER
// // =======================
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       skillsOffered: [],
//       skillsWanted: []
//     });

//     res.json(user);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// // =======================
// // 🔐 LOGIN USER (JWT)
// // =======================
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check user exists
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "User not found" });

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//     // Create JWT token
//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       msg: "Login successful",
//       token,
//       userId: user._id
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// module.exports = router;





const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =======================
// 🔐 REGISTER USER
// =======================
router.post("/register", async (req, res) => {
  try {
    console.log("BODY:",req.body)
    const { name, email, password, skillsOffered, skillsWanted } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user — now saving skills from frontend
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      skillsOffered: skillsOffered || [],
      skillsWanted:  skillsWanted  || [],
    });

    // Send back token so frontend logs in immediately
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, userId: user._id });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// =======================
// 🔐 LOGIN USER (JWT)
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;