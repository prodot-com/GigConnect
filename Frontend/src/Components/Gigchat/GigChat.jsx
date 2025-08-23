import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import GigConnect_logo from "../../assets/GigConnect_logo.png";

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
    console.log(userDetails)

    if (!token || !userDetails || !userDetails._id) {
      setError("Please log in to access the chat");
      navigate("/login");
      return;
    }

    setUser(userDetails);

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
          setError(
            "You must be the client or an applied freelancer to access this chat"
          );
          navigate(`/gig/${gigId}`);
        }
      } catch (err) {
        setError("Failed to verify access");
        navigate(`/gig/${gigId}`);
      }
    };
    checkAccess();

    
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
      setMessages((prev) => [...prev, message]);
    });

    
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/api/messages/${gigId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

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
    
    <div className="min-h-screen w-full relative bg-white">
  {/* Soft Green Glow */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(circle at center, #8fffe5, transparent)
      `,
    }}
  />
     
        <div className="relative z-10 flex flex-col min-h-screen font-mono">
<nav className="w-full bg-gray-100 shadow-md border-b border-gray-200 py-4 px-6 flex justify-between items-center">
  <h1 className="text-3xl flex font-extrabold items-center text-indigo-700 gap-2">
    <img src={GigConnect_logo} alt="logo" className="h-12 w-auto" />
    GigConnect
  </h1>
  <div className="space-x-4">
    {user?.role === "Client" ? (
      <button
        onClick={() => navigate(`/gig/${gigId}/applications`)}
        className="px-6 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
      >
        Applications
      </button>
    ) : (
      <button
        onClick={() => navigate("/my-applications")}
        className="px-6 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
      >
        My Applications
      </button>
    )}

    <button
      onClick={logout}
      className="px-6 py-2 bg-green-500 text-white border-2 border-black hover:bg-green-600 font-bold"
    >
      Logout
    </button>
  </div>
</nav>


      
      <main className="flex-grow container mx-auto p-4 sm:p-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg border-2 border-black p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">
              Chat for Gig
            </h2>
          </div>
          <div className="h-[60vh] sm:h-96 overflow-y-auto mb-4 p-4 
                bg-gradient-to-b from-indigo-300 to-white 
                border-2 border-black ">
  {messages.map((msg, index) => {
    const senderId =
      typeof msg.sender === "object" && msg.sender && msg.sender._id
        ? msg.sender._id.toString()
        : typeof msg.sender === "string"
        ? msg.sender
        : "";
    const isOutgoing = senderId === user._id.toString();

    return (
      <div
        key={index}
        className={`mb-4 flex ${isOutgoing ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-xs sm:max-w-3xl p-3 pr-8 border-2 border-black shadow-md rounded-2xl ${
            isOutgoing
              ? "bg-indigo-700 text-white rounded-br-none"
              : "bg-green-200 text-green-900 rounded-bl-none"
          }`}
        >
          <p className="text-lg">{msg.content}</p>
          <p
            className={`text-xs mt-2 ${
              isOutgoing ? "text-gray-300" : "text-green-600"
            }`}
          >
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
              className="flex-1 p-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-indigo-700 text-sm sm:text-base"
            />
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 text-sm sm:text-base"
            >
              Send
            </button>
          </form>
        </div>
      </main>

      
      <footer className="bg-gray-400 font-bold p-4 text-center">
        <p>© 2025 GigConnect. All rights reserved.</p>
      </footer>
    </div>

</div>
    
    
    // <div className="flex flex-col min-h-screen font-mono bg-gray-100">
    //   {/* Navbar */}
    //   <nav className="w-full bg-gray-100 shadow-md border-b border-gray-200 py-4 px-6 flex justify-between items-center">
    //     <h1 className="text-3xl flex font-extrabold items-center text-indigo-700 gap-2">
    //       <img src={GigConnect_logo} alt="logo" className="h-12 w-auto" />
    //       GigConnect
    //     </h1>
    //     <div className="space-x-4">
    //       <button
    //         onClick={() => navigate("/all-gigs")}
    //         className="px-6 py-2 bg-indigo-700 text-white border-2  border-black hover:bg-indigo-800 transition"
    //       >
    //         Back to Gigs
    //       </button>
    //       <button
    //         onClick={logout}
    //         className="px-6 py-2 bg-green-500 text-white border-2  border-black hover:bg-green-600 font-bold"
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   </nav>

    //   {/* Chat Section */}
    //   <main className="flex-grow container mx-auto p-4 sm:p-8">
    //     <div className="max-w-3xl mx-auto bg-white shadow-lg border-2 border-black p-4 sm:p-6">
    //       <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
    //         <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700">
    //           Chat for Gig
    //         </h2>
    //       </div>
    //       <div className="h-[60vh] sm:h-96 overflow-y-auto mb-4 p-4 bg-gray-50">
    //         {messages.map((msg, index) => {
    //           const senderId =
    //             typeof msg.sender === "object" && msg.sender && msg.sender._id
    //               ? msg.sender._id.toString()
    //               : typeof msg.sender === "string"
    //               ? msg.sender
    //               : "";
    //           const isOutgoing = senderId === user._id.toString();

    //           return (
    //             <div
    //               key={index}
    //               className={`mb-4 flex ${
    //                 isOutgoing ? "justify-end" : "justify-start"
    //               }`}
    //             >
    //               <div
    //                 className={`max-w-xs sm:max-w-3xl p-3 pr-8 border-2 border-black shadow-md rounded-2xl ${
    //                   isOutgoing
    //                     ? "bg-indigo-700 text-white rounded-br-none"
    //                     : "bg-green-200 text-green-900 rounded-bl-none"
    //                 }`}
    //               >
    //                 <p className="text-lg">{msg.content}</p>
    //                 <p
    //                   className={`text-xs mt-2 ${
    //                     isOutgoing ? "text-gray-300" : "text-green-600"
    //                   }`}
    //                 >
    //                   {new Date(msg.timestamp).toLocaleTimeString()}
    //                 </p>
    //               </div>
    //             </div>
    //           );
    //         })}
    //         <div ref={messagesEndRef} />
    //       </div>

    //       {/* Input */}
    //       <form onSubmit={handleSendMessage} className="flex gap-2">
    //         <input
    //           type="text"
    //           value={newMessage}
    //           onChange={(e) => setNewMessage(e.target.value)}
    //           placeholder="Type a message..."
    //           className="flex-1 p-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-indigo-700 text-sm sm:text-base"
    //         />
    //         <button
    //           type="submit"
    //           className="px-3 sm:px-4 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 text-sm sm:text-base"
    //         >
    //           Send
    //         </button>
    //       </form>
    //     </div>
    //   </main>

    //   {/* Footer */}
    //   <footer className="bg-gray-400 font-bold p-4 text-center">
    //     <p>© 2025 GigConnect. All rights reserved.</p>
    //   </footer>
    // </div>
  );
};

export default GigChat;
