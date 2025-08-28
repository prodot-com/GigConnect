import 'dotenv/config';
import connect_db from "./src/db/Index.js";
import { app } from "./App.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Message } from './models/Message.model.js';

const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => {
  console.log(`App + Socket.IO listening at port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: [
    "http://localhost:5173", 
    "https://gig-connect-eight.vercel.app",
    "https://gigconnect-sq1z.onrender.com/",
    "https://gig-connect-7jr8.vercel.app/"
  ],
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error: No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`User ${socket.user.id} connected`);

  socket.on("joinGigChat", (gigId) => {
    socket.join(`gig-${gigId}`);
    console.log(`User ${socket.user.id} joined room gig-${gigId}`);
  });

  socket.on("sendMessage", async ({ gigId, message }) => {
    try {
      const chatMessage = {
        gigId,
        sender: socket.user.id,
        content: message,
        timestamp: new Date(),
      };

      // Broadcast message to the gig room
      io.to(`gig-${gigId}`).emit("receiveMessage", {
        sender: socket.user.id,
        content: message,
        timestamp: chatMessage.timestamp,
      });

      // Save to database
      await Message.create(chatMessage); // Uncommented
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.user.id} disconnected`);
  });
});

connect_db()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection failed", err);
  });