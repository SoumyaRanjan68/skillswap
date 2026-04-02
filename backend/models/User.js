const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  password:      { type: String, required: true },
  skillsOffered: { type: [String], default: [] },
  skillsWanted:  { type: [String], default: [] },
});

module.exports = mongoose.model("User", userSchema);
// console.logmongoose.model("User", userSchema);

// const user = await User.create({
//   name,
//   email,
//   password: hashedPassword,
//   skillsOffered: skillsOffered || [],
//   skillsWanted:  skillsWanted  || [],
// });

// console.log("USER SAVED:", user); // ← ADD THIS