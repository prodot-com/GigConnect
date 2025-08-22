// src/Components/GigChat/GigChat.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const GigChat = () => {
  const { id: gigId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));

    if (!token || !userDetails || !userDetails._id) {
      setError("Please log in to access the chat");
      navigate("/login");
      return;
    }

    setUser(userDetails);
    console.log("User Details:", { id: userDetails._id, name: userDetails.name, raw: userDetails });

    // Check if user is client or applied freelancer
    const checkAccess = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/api/gigs/${gigId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const gig = res.data;
        const isClient = gig.client._id === userDetails._id;
        const isApplied = gig.appliedFreelancers.some(
          (a) => a.user._id === userDetails._id
        );
        if (!isClient && !isApplied) {
          setError("You must be the client or an applied freelancer to access this chat");
          navigate(`/gig/${gigId}`);
        }
      } catch (err) {
        setError("Failed to verify access");
        navigate(`/gig/${gigId}`);
      }
    };
    checkAccess();

    // Connect to Socket.IO
    const socketInstance = io("http://localhost:9000", {
      auth: { token },
    });

    setSocket(socketInstance);

    socketInstance.on("connect_error", (err) => {
      setError("Chat connection failed: " + err.message);
      navigate(`/gig/${gigId}`);
    });

    socketInstance.emit("joinGigChat", gigId);

    socketInstance.on("receiveMessage", (message) => {
      console.log("Received real-time message:", message);
      setMessages((prev) => [...prev, message]);
    });

    // Fetch past messages
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/api/messages/${gigId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched messages:", res.data);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      socketInstance.disconnect();
    };
  }, [gigId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit("sendMessage", { gigId, message: newMessage });
    setNewMessage("");
  };

  if (loading) return <p className="text-center mt-10">Loading chat...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">Chat for Gig</h2>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => navigate(`/gig/${gigId}`)}
              className="px-3 sm:px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 text-sm sm:text-base"
            >
              Back to Gig
            </button>
            <button
              onClick={() => navigate("/freelancer-dashboard")}
              className="px-3 sm:px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 text-sm sm:text-base"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <div className="h-[60vh] sm:h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
          {messages.map((msg, index) => {
            // Normalize sender ID for comparison
            const senderId = typeof msg.sender === 'object' && msg.sender && msg.sender._id
              ? msg.sender._id.toString()
              : typeof msg.sender === 'string'
              ? msg.sender
              : '';
            const isOutgoing = senderId === user._id.toString();

            console.log(`Message ${index}:`, {
              rawSender: msg.sender,
              normalizedSender: senderId,
              userId: user._id.toString(),
              isOutgoing,
              messageContent: msg.content,
              senderName: isOutgoing ? "You" : msg.sender?.name || "Unknown",
              source: msg.sender?.name ? 'Database' : 'Socket.IO',
            });

            return (
              <div
                key={index}
                className={`mb-4 flex ${isOutgoing ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`w-[95%] sm:w-[90%] p-4 rounded-lg shadow-md ${
                    isOutgoing
                      ? "bg-indigo-700 text-white rounded-br-none"
                      : "bg-green-200 text-green-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm font-semibold">
                    {isOutgoing ? "You" : msg.sender?.name || "Unknown"}
                  </p>
                  <p className="text-base mt-1">{msg.content}</p>
                  <p className={`text-xs ${isOutgoing ? "text-gray-300" : "text-green-600"} mt-2`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700 text-sm sm:text-base"
          />
          <button
            type="submit"
            className="px-3 sm:px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 text-sm sm:text-base"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default GigChat;