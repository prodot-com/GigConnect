import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const SOCKET_URL = "http://localhost:9000"; // backend port
const API_BASE = "http://localhost:9000/api";

const GigChat = () => {
  const { id: gigId } = useParams(); // roomId = gigId
  const navigate = useNavigate();
  const location = useLocation();
  // Optional: pass ?to=<userId> to direct a 1:1 chat inside the gig room
  const toUserId = new URLSearchParams(location.search).get("to") || null;

  const user = JSON.parse(localStorage.getItem("userDetails"));
  const token = localStorage.getItem("token");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  // one socket instance per component lifetime
  const socket = useMemo(
    () =>
      io(SOCKET_URL, {
        auth: { token },
        autoConnect: false,
      }),
    [token]
  );

  // Fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const url = toUserId
          ? `${API_BASE}/chat/${gigId}/history?with=${toUserId}`
          : `${API_BASE}/chat/${gigId}/history`;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(data || []);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [gigId, toUserId, token]);

  // Socket lifecycle
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    socket.connect();
    socket.emit("join_room", gigId);

    socket.on("receive_message", (msg) => {
      // if 1:1 mode and message receiver doesn't match, still show broadcast (receiver null)
      if (toUserId) {
        if (msg.receiver === null || msg.sender?._id === toUserId || msg.sender === toUserId) {
          setMessages((prev) => [...prev, msg]);
        }
      } else {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [socket, gigId, token, navigate, toUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const payload = {
      roomId: gigId,
      text,
      toUserId,
      gigId,
    };

    // optimistic UI
    const temp = {
      _id: `temp-${Date.now()}`,
      gig: gigId,
      sender: { _id: user?._id, name: user?.name, email: user?.email },
      receiver: toUserId,
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, temp]);

    socket.emit("send_message", payload);
    setText("");
  };

  if (loading) {
    return <p className="text-center mt-10">Loading chat...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Topbar */}
      <div className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
        <h2
          className="text-2xl font-bold text-indigo-700 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          GigConnect — Chat
        </h2>
        <button
          className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800"
          onClick={() => navigate(`/gig/${gigId}`)}
        >
          Back to Gig
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col h-[75vh]">
          <div className="flex-1 overflow-y-auto space-y-3">
            {messages.map((m) => {
              const senderId = (m.sender?._id || m.sender || "").toString();
              const isMe = senderId === (user?._id || "").toString();
              return (
                <div
                  key={m._id}
                  className={`max-w-[70%] px-3 py-2 rounded-lg ${
                    isMe
                      ? "ml-auto bg-indigo-600 text-white"
                      : "mr-auto bg-gray-200 text-gray-900"
                  }`}
                >
                  {!isMe && (
                    <div className="text-xs font-semibold opacity-75 mb-1">
                      {m.sender?.name || "User"}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <div className="text-[10px] opacity-70 mt-1 text-right">
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Composer */}
          <div className="mt-3 flex">
            <input
              className="flex-1 border rounded-l-lg px-3 py-2 outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-indigo-700 text-white rounded-r-lg hover:bg-indigo-800"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigChat;
