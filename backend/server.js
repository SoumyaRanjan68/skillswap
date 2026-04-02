// require("dotenv").config();


// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const userRoutes = require("./routers/userRoutes");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected 🚀"))
//   .catch(err => console.log(err));


// const authRoutes = require("./routers/authRoute");
// app.use("/api/auth", authRoutes);

// // Test route
// app.get("/", (req, res) => {
//   res.send("SkillSwap API Running");
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on ${PORT}`));

// //calling  user routes
// app.use("/api/user", userRoutes);

// const requestRoutes = require("./routers/requestRoutes");
// app.use("/api/request", requestRoutes);

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: { origin: "*" }
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("sendMessage", (data) => {
//     io.emit("receiveMessage", data);
//   });
// });

// // server.listen(5000, () => {
// //   console.log("Server running on port 5000");
// // });

// require("dotenv").config();

// const express    = require("express");
// const cors       = require("cors");
// const mongoose   = require("mongoose");
// const http       = require("http");
// const { Server } = require("socket.io");

// const app = express();

// // ── MIDDLEWARE ──
// app.use(cors({
//   origin: "http://localhost:5173",  // your React frontend
//   credentials: true
// }));
// app.use(express.json());

// // ── DATABASE ──
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected 🚀"))
//   .catch(err => console.log(err));

// // ── ROUTES ──
// const authRoutes    = require("./routers/authRoute");
// const userRoutes    = require("./routers/userRoutes");
// const requestRoutes = require("./routers/requestRoutes");

// app.use("/api/auth",    authRoutes);
// app.use("/api/user",    userRoutes);
// app.use("/api/request", requestRoutes);

// // ── TEST ROUTE ──
// app.get("/", (req, res) => {
//   res.send("Peerskill API Running ✦");
// });

// // ── SOCKET.IO ──
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173" }
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join", (userId) => {
//     socket.join(userId);
//   });

//   socket.on("sendMessage", (data) => {
//     io.to(data.receiverId).emit("receiveMessage", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

// // ── START SERVER ──
// const PORT = 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT} ✦`));


require("dotenv").config();
 
const express    = require("express");
const cors       = require("cors");
const mongoose   = require("mongoose");
const http       = require("http");
const { Server } = require("socket.io");
 
const app = express();
 
// ── MIDDLEWARE ──
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://skillswap-17d7.onrender.com"
  ],
  credentials: true
}));
app.use(express.json());
 
// ── DATABASE ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch(err => console.log(err));
 
// ── ROUTES ──
const authRoutes    = require("./routers/authRoute");
const userRoutes    = require("./routers/userRoutes");
const requestRoutes = require("./routers/requestRoutes");
const messageRoutes = require("./routers/messageRoutes");
 
app.use("/api/auth",    authRoutes);
app.use("/api/user",    userRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/message", messageRoutes);
 
// ── TEST ROUTE ──
app.get("/", (req, res) => res.send("Peerskill API Running ✦"));
 
// ── SOCKET.IO ──
const server = http.createServer(app);
const Message = require("./models/message");
 
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173" }
// });

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://skillswap-17d7.onrender.com"
    ]
  }
});
 
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
 
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
 
  // Save message to DB then emit to receiver
  socket.on("sendMessage", async (data) => {
    try {
      // Save to MongoDB
      await Message.create({
        sender:   data.senderId,
        receiver: data.receiverId,
        message:  data.message,
      });
    } catch (err) {
      console.error("Message save error:", err.message);
    }
    // Emit to receiver's room
    io.to(data.receiverId).emit("receiveMessage", data);
  });
 
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
 
// ── START ──
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT} ✦`));
 