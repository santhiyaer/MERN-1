import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import requestRoute from "./routes/requestRoute.js";
import bookingRoutes from "./routes/bookingRoutes.js";
// import intRoutes from "./routes/intRoutes.js";


import gigRoutes from "./routes/gigRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import profileRoutes from "./routes/profileRoutes.js";





import Message from "./models/Message.js";

dotenv.config();


//  Auto-detect available port
const DEFAULT_PORT = process.env.PORT || 5001;

const app = express();
// create http server so socket.io can attach
const server = http.createServer(app);

// configure middleware
app.use(express.json());

app.use(cors({origin: process.env.FRONTEND_URL || "*",credentials: true,})); //set FRONTEND_URL in backend/.env

import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));// serve uploads

//  MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

//  Routes 
app.use("/api", authRoutes);



app.use("/api/posts", postRoutes);
app.use("/api/requests", requestRoute);
app.use("/api/bookings", bookingRoutes);
// app.use("/api/bookings", intRoutes);


app.use('/api/profile', profileRoutes);

 
app.use("/api/gigs", gigRoutes);
app.use("/api/proposals", proposalRoutes);

// app.use('/api/payment', paymentRoutes);





app.use("/api/messages", messageRoutes);



//  Default route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});







// * ------------------ Socket.IO real-time chat ------------------ *
// * This attaches Socket.IO to the existing HTTP server and listens for:
  //  - 'join-room' to let sockets join a room 
  //  - 'chat-message' to persist message to DB and broadcast to room

const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", ({ roomId }) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("chat-message", async ({ roomId, text, senderId, senderRole }) => {
    try {
      // persist message to MongoDB
      const msg = await Message.create({
        roomId,
        text,
        senderId,
        senderRole,
      });

      // broadcast to everyone in the same room
      io.to(roomId).emit("receive-message", {
        _id: msg._id,
        roomId: msg.roomId,
        text: msg.text,
        senderId: msg.senderId,
        senderRole: msg.senderRole,
        createdAt: msg.createdAt,
      });
    } catch (err) {
      console.error("Error saving chat message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});
/* ---------------------------------------------------------------- */

/* Keep your original startServer logic  */
function startServer(port) {
  const runningServer = server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });

  // If port is already in use, try the next one
  runningServer.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${port} is busy. Trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("Server Error:", err);
    }
  });
}

startServer(Number(DEFAULT_PORT));
















// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";


// import authRoutes from "./routes/authRoutes.js";
// import postRoutes from "./routes/postRoutes.js";
// import requestRoute from './routes/requestRoute.js';

// import bookingRoutes from "./routes/bookingRoutes.js";
// import intRoutes from "./routes/intRoutes.js"; 


// dotenv.config();

// //  Auto-detect available port
// const DEFAULT_PORT = process.env.PORT || 5001;


// const app = express();
// app.use(express.json());
// app.use(cors());

// //  MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log(" MongoDB Connected"))
//   .catch((err) => console.log(" MongoDB Error:", err));

// //  Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/requests", requestRoute);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/bookings", intRoutes); 
// app.use("/api/bookings", intRoutes); 

// // app.use("/api/gigs", gigRoutes); 

// // app.use('/api/proposals', routes/proposalRoutes);
// // app.use('/api/messages', messageRoutes);

// //  Default route
// app.get("/", (req, res) => {
//   res.send("Backend Running Successfully");
// });


// function startServer(port) {
//   const server = app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
    
//   });

//   //  If port is already in use, try the next one
//   server.on("error", (err) => {
//     if (err.code === "EADDRINUSE") {
//       console.warn(`Port ${port} is busy. Trying port ${port + 1}...`);
//       startServer(port + 1);
//     } else {
//       console.error(" Server Error:", err);
//     }
//   });
// }

// startServer(Number(DEFAULT_PORT));
