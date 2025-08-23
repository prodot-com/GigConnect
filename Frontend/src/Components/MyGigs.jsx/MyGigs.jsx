import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GigConnect_logo from '../../assets/GigConnect_logo.png';
import { Copyright } from "lucide-react";

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyGigs = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token)
        if (!token) {
          navigate("/");
          return;
        }

        const { data } = await axios.get("http://localhost:9000/api/gigs/my-gigs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGigs(data);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyGigs();
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 font-mono">
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center mt-10 font-mono">Loading your gigs...</p>
        </div>
        <footer className="flex items-center justify-center border-t-2 border-black font-bold bg-gray-400 py-3">
          <Copyright />
          <p className="p-2 pl-0">2025 GigConnect. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (

    <div className="min-h-screen w-full relative bg-white">
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(circle at center, #8fffe5, transparent)
      `,
    }}
  />

        <div className="relative z-10 min-h-screen flex flex-col font-mono">
      <nav className="w-full bg-gray-100 border-b-4 border-black cursor-pointer py-4 flex justify-between items-center px-6">
        <h1 className="text-4xl flex font-extrabold items-center text-indigo-700">
          <img src={GigConnect_logo} alt="logo" className="h-15 w-auto mr-2"/>
          GigConnect
        </h1>
        <div className="space-x-7">
          <button
            onClick={() => navigate("/client")}
            className="px-7 cursor-pointer py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
          >
            Dashboard
          </button>
          <button
            onClick={logout}
            className="px-7 py-2 border-2 border-black cursor-pointer bg-green-400 hover:bg-green-500 font-bold"
          >
            Logout
          </button>
        </div>
      </nav>

      
      <main className="flex-grow px-6 py-6">
        <h2 className="text-3xl font-bold mb-6 text-center">My Gigs</h2>

        {gigs.length === 0 ? (
          <p className="text-center text-gray-500">You haven’t created any gigs yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="bg-white border-2 border-black shadow-lg p-6 hover:shadow-2xl transition relative group "
              >
                <h3 className="text-2xl font-bold text-indigo-700">{gig.title}</h3>
                <p className="text-gray-600 text-lg mt-2">{gig.description}</p>

                <div className="mt-2">
                  <span className="font-semibold">Skills:</span>{" "}
                  {(Array.isArray(gig.skillsRequired)
                    ? gig.skillsRequired
                    : gig.skillsRequired?.split(",") || []
                  ).map((skill, i) => (
                    <span
                      key={i}
                      className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm mr-1 mt-1 inline-block"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>

                <p className="mt-2">
                  <span className="font-semibold">Budget:</span> ₹{gig.budget}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Location:</span> {gig.location}
                </p>

                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/gig/${gig._id}/applications`)}
                    className="px-4 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
                  >
                    View Applications
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="flex items-center justify-center border-t-2 border-black font-bold bg-gray-400 py-3 mt-6">
        <Copyright />
        <p className="p-2 pl-0">2025 GigConnect. All rights reserved.</p>
      </footer>
    </div>

</div>

    // <div className="min-h-screen flex flex-col bg-gray-100 font-mono">
    //   {/* Navbar */}
    //   <nav className="w-full bg-gray-100 border-b-4 border-black cursor-pointer py-4 flex justify-between items-center px-6">
    //     <h1 className="text-4xl flex font-extrabold items-center text-indigo-700">
    //       <img src={GigConnect_logo} alt="logo" className="h-15 w-auto mr-2"/>
    //       GigConnect
    //     </h1>
    //     <div className="space-x-7">
    //       <button
    //         onClick={() => navigate("/client")}
    //         className="px-7 cursor-pointer py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
    //       >
    //         Dashboard
    //       </button>
    //       <button
    //         onClick={logout}
    //         className="px-7 py-2 border-2 border-black cursor-pointer bg-green-400 hover:bg-green-500 font-bold"
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   </nav>

    //   {/* Main Content */}
    //   <main className="flex-grow px-6 py-6">
    //     <h2 className="text-3xl font-bold mb-6 text-center">My Gigs</h2>

    //     {gigs.length === 0 ? (
    //       <p className="text-center text-gray-500">You haven’t created any gigs yet.</p>
    //     ) : (
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //         {gigs.map((gig) => (
    //           <div
    //             key={gig._id}
    //             className="bg-white border-2 border-black shadow-lg p-6 hover:shadow-2xl transition relative group "
    //           >
    //             <h3 className="text-2xl font-bold text-indigo-700">{gig.title}</h3>
    //             <p className="text-gray-600 text-lg mt-2">{gig.description}</p>

    //             <div className="mt-2">
    //               <span className="font-semibold">Skills:</span>{" "}
    //               {(Array.isArray(gig.skillsRequired)
    //                 ? gig.skillsRequired
    //                 : gig.skillsRequired?.split(",") || []
    //               ).map((skill, i) => (
    //                 <span
    //                   key={i}
    //                   className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm mr-1 mt-1 inline-block"
    //                 >
    //                   {skill.trim()}
    //                 </span>
    //               ))}
    //             </div>

    //             <p className="mt-2">
    //               <span className="font-semibold">Budget:</span> ₹{gig.budget}
    //             </p>
    //             <p className="mt-2">
    //               <span className="font-semibold">Location:</span> {gig.location}
    //             </p>

    //             <div className="mt-4">
    //               <button
    //                 onClick={() => navigate(`/gig/${gig._id}/applications`)}
    //                 className="px-4 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
    //               >
    //                 View Applications
    //               </button>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </main>

    //   {/* Footer */}
    //   <footer className="flex items-center justify-center border-t-2 border-black font-bold bg-gray-400 py-3 mt-6">
    //     <Copyright />
    //     <p className="p-2 pl-0">2025 GigConnect. All rights reserved.</p>
    //   </footer>
    // </div>
  );
};

export default MyGigs;
