import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyApplications = () => {
  const [gigs, setGigs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAlert("Please login as Freelancer to view applications");
          return;
        }

        const res = await axios.get(
          "http://localhost:9000/api/gigs/my-applications",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGigs(res.data);
        console.log(res.data)

        const user = JSON.parse(localStorage.getItem("userDetails"));
        if (user?._id) {
          const reviewsRes = await axios.get(
            `http://localhost:9000/api/gigs/reviews/${user._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setReviews(reviewsRes.data);
        }
      } catch (err) {
        setAlert("Failed to load applications");
      }
    };

    fetchApplications();
  }, []);

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

        <div className="relative z-10 min-h-screen flex flex-col  font-mono">
      
      <nav className="w-full bg-gray-100 border-b-4 border-black py-4 flex justify-between items-center px-6">
        <h1
          onClick={() => navigate("/")}
          className="text-4xl font-extrabold text-indigo-700 cursor-pointer"
        >
          GigConnect
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/freelancer-dashboard")}
            className="px-6 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate("/"); }}
            className="px-7 py-2 border-2 border-black cursor-pointer bg-green-400 hover:bg-green-500 font-bold"
          >
            Logout
          </button>
        </div>
      </nav>

      
      <main className="flex-grow p-6">
        <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
          My Applications
        </h1>

        {alert && <p className="text-center text-red-600 font-semibold mb-4">{alert}</p>}

        {gigs.length === 0 && !alert && (
          <p className="text-center text-gray-600">You haven’t applied to any gigs yet.</p>
        )}

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white border-2 border-black  shadow-lg p-6 flex flex-col transition hover:shadow-2xl relative"
            >
              <h2 className="text-3xl font-bold text-indigo-700">{gig.title}</h2>
              <p className="text-gray-600 mt-2">{gig.description}</p>
              <p className="text-gray-600 mt-2"><strong>Budget:</strong> ₹{gig.budget}</p>
              <p className="text-gray-600 mt-2"><strong>Location:</strong> {gig.location}</p>
              <p className="text-gray-600 mt-2"><strong>Client:</strong> {gig.client?.name}</p>

              {gig.gig_status === "Completed" && <button
                onClick={() => navigate(`/gig/${gig._id}/chat`)}
                className="mt-4 w-full bg-indigo-700 text-white py-2 border-2 border-black hover:bg-indigo-800 transition"
              >
                Chat with Client
              </button>}

              
              {gig.status && (
                <p
                  className={`mt-3 font-bold ${
                    gig.status === "Accepted"
                      ? "text-green-600"
                      : gig.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {gig.status}
                </p>
              )}

              {gig.gig_status === "Completed" && (
                <p className="mt-3 font-bold text-amber-600">{gig.gig_status}</p>
              )}

             
              {gig.review ? (
                <div className="mt-4 border-t pt-2">
                  <p className="text-gray-800"><strong>Review:</strong> {gig.review.comment}</p>
                  <p className="text-yellow-600 font-semibold">⭐ {gig.review.rating}/5</p>
                </div>
              ) : (
                gig.status === "Completed" && (
                  <p className="text-gray-500 mt-2 italic">Waiting for client review...</p>
                )
              )}

              {gig.isPaid  && 
              <div className="flex items-center justify-center">
                <h2
                className="mt-4 p-3 bg-indigo-700 text-white py-2 border-2 border-black"
              >
                Payment Received
              </h2>
              </div>
              }
            </div>
          ))}
        </div>

     
        {reviews.length > 0 && (
          <div className="mt-10 bg-white shadow-lg border-2  p-6">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Reviews About Me</h2>
            {reviews.map((r) => (
              <div key={r._id} className="border-b py-3">
                <p className="text-yellow-600 font-semibold">⭐ {r.rating}/5</p>
                <p className="text-gray-800">{r.comment}</p>
                <p className="text-sm text-gray-500">by {r.client?.name || "Client"}</p>
              </div>
            ))}
          </div>
        )}
      </main>

     
      <footer className="flex items-center justify-center border-t-2 border-black font-bold bg-gray-400 py-3">
        <p className="p-2 pl-0">2025 GigConnect. All rights reserved.</p>
      </footer>
    </div>

</div>

    // <div className="min-h-screen flex flex-col bg-gray-100 font-mono">
      
    //   <nav className="w-full bg-gray-100 border-b-4 border-black py-4 flex justify-between items-center px-6">
    //     <h1
    //       onClick={() => navigate("/")}
    //       className="text-4xl font-extrabold text-indigo-700 cursor-pointer"
    //     >
    //       GigConnect
    //     </h1>
    //     <div className="space-x-4">
    //       <button
    //         onClick={() => navigate("/freelancer-dashboard")}
    //         className="px-6 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
    //       >
    //         Dashboard
    //       </button>
    //       <button
    //         onClick={() => { localStorage.clear(); navigate("/"); }}
    //         className="px-7 py-2 border-2 border-black cursor-pointer bg-green-400 hover:bg-green-500 font-bold"
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   </nav>

      
    //   <main className="flex-grow p-6">
    //     <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
    //       My Applications
    //     </h1>

    //     {alert && <p className="text-center text-red-600 font-semibold mb-4">{alert}</p>}

    //     {gigs.length === 0 && !alert && (
    //       <p className="text-center text-gray-600">You haven’t applied to any gigs yet.</p>
    //     )}

        
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //       {gigs.map((gig) => (
    //         <div
    //           key={gig._id}
    //           className="bg-white border-2 border-black  shadow-lg p-6 flex flex-col transition hover:shadow-2xl relative"
    //         >
    //           <h2 className="text-3xl font-bold text-indigo-700">{gig.title}</h2>
    //           <p className="text-gray-600 mt-2">{gig.description}</p>
    //           <p className="text-gray-600 mt-2"><strong>Budget:</strong> ₹{gig.budget}</p>
    //           <p className="text-gray-600 mt-2"><strong>Location:</strong> {gig.location}</p>
    //           <p className="text-gray-600 mt-2"><strong>Client:</strong> {gig.client?.name}</p>

    //           {gig.gig_status === "Completed" && <button
    //             onClick={() => navigate(`/gig/${gig._id}/chat`)}
    //             className="mt-4 w-full bg-indigo-700 text-white py-2 border-2 border-black hover:bg-indigo-800 transition"
    //           >
    //             Chat with Client
    //           </button>}

              
    //           {gig.status && (
    //             <p
    //               className={`mt-3 font-bold ${
    //                 gig.status === "Accepted"
    //                   ? "text-green-600"
    //                   : gig.status === "Rejected"
    //                   ? "text-red-600"
    //                   : "text-yellow-600"
    //               }`}
    //             >
    //               {gig.status}
    //             </p>
    //           )}

    //           {gig.gig_status === "Completed" && (
    //             <p className="mt-3 font-bold text-amber-600">{gig.gig_status}</p>
    //           )}

             
    //           {gig.review ? (
    //             <div className="mt-4 border-t pt-2">
    //               <p className="text-gray-800"><strong>Review:</strong> {gig.review.comment}</p>
    //               <p className="text-yellow-600 font-semibold">⭐ {gig.review.rating}/5</p>
    //             </div>
    //           ) : (
    //             gig.status === "Completed" && (
    //               <p className="text-gray-500 mt-2 italic">Waiting for client review...</p>
    //             )
    //           )}
    //         </div>
    //       ))}
    //     </div>

     
    //     {reviews.length > 0 && (
    //       <div className="mt-10 bg-white shadow-lg border-2  p-6">
    //         <h2 className="text-2xl font-bold text-indigo-700 mb-4">Reviews About Me</h2>
    //         {reviews.map((r) => (
    //           <div key={r._id} className="border-b py-3">
    //             <p className="text-yellow-600 font-semibold">⭐ {r.rating}/5</p>
    //             <p className="text-gray-800">{r.comment}</p>
    //             <p className="text-sm text-gray-500">by {r.client?.name || "Client"}</p>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </main>

     
    //   <footer className="flex items-center justify-center border-t-2 border-black font-bold bg-gray-400 py-3">
    //     <p className="p-2 pl-0">2025 GigConnect. All rights reserved.</p>
    //   </footer>
    // </div>
  );
};

export default MyApplications;
