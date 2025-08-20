// index.js
import 'dotenv/config';
import connect_db from "./src/db/Index.js";
import { app } from "./App.js";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Message } from "./models/Message.model.js";

const PORT = process.env.PORT || 9000;

const httpServer = createServer(app);

// ————— Socket.IO setup —————
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Keep track of online users
const onlineUsers = new Map();

// Authenticate socket connection with JWT (sent via auth.token)
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { _id: decoded.id || decoded._id };
    return next();
  } catch (e) {
    return next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user?._id?.toString();
  if (userId) {
    onlineUsers.set(userId, socket.id);
  }

  // Join a gig chat room (roomId = gigId)
  socket.on("join_room", (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
  });

  /**
   * payload = {
   *   roomId: <gigId>,
   *   text: string,
   *   toUserId: <receiver user id>,
   *   gigId: <gigId>  // duplicate of roomId (for persistence)
   * }
   */
  socket.on("send_message", async (payload) => {
    try {
      const { roomId, text, toUserId, gigId } = payload || {};
      if (!roomId || !text || !gigId) return;

      // Persist in DB
      const msg = await Message.create({
        gig: gigId,
        sender: socket.user._id,
        receiver: toUserId || null,
        text
      });

      const out = {
        _id: msg._id,
        gig: gigId,
        sender: socket.user._id,
        receiver: toUserId || null,
        text,
        createdAt: msg.createdAt
      };

      // Emit to room (gig room)
      io.to(roomId).emit("receive_message", out);

      // Optional: direct notify receiver if online (badge/preview)
      const toSock = toUserId ? onlineUsers.get(toUserId.toString()) : null;
      if (toSock) {
        io.to(toSock).emit("notify_message", out);
      }
    } catch (err) {
      console.error("send_message error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    if (userId) onlineUsers.delete(userId);
  });
});

// ————— Start server after DB connects —————
connect_db()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`App + Socket.IO listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Connection failed", err);
  });
