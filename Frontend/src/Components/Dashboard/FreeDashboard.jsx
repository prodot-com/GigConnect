import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GigConnect_logo from '../../assets/GigConnect_logo.png'
import { Copyright } from "lucide-react";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancer = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const res = await axios.get("https://gigconnect-sq1z.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFreelancer(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching freelancer:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancer();
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (loading) return <p className="text-center mt-10 text-gray-600 text-lg">Loading...</p>;

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
    
        <div className=" relative z-10 flex flex-col min-h-screen  font-mono">
      <nav className="w-full bg-gray-100 border-b-4 border-black cursor-pointer  py-4 flex justify-between items-center">
        <h1 className="text-4xl flex font-extrabold items-center text-indigo-700">
            <img src={GigConnect_logo} alt="logo" className="h-15 w-auto "/>GigConnect</h1>
        <div className="space-x-4">
            <button
                onClick={logout}
            className="px-7 mr-5 py-2 border-2 border-black cursor-pointer bg-green-400 hover:bg-green-500 font-bold"
          >
            Logout
          </button>
          
        </div>
      </nav>
      <div className="flex">
        <div className="w-full md:w-1/4   p-6 sticky top-0 h-screen md:h-auto">
        <h2 className="text-2xl font-bold mb-6 text-indigo-600 tracking-tight">
          Freelancer-Dashboard
        </h2>
        <div className="bg-white border-2 shadow-xl p-6 mb-8">
          <ul className="space-y-7">
          
          <li>
            <button
              onClick={() => navigate("/all-gigs")}
              className="w-full text-left px-4 py-3 hover:shadow-lg bg-blue-600 text-white border-2 border-black cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              Browse Gigs
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/my-applications")}
              className="w-full text-left px-4 py-3 hover:shadow-lg bg-green-600 text-white border-2 border-black cursor-pointer hover:bg-green-700 transition-colors duration-200 shadow-sm"
            >
              My Applications
            </button>
          </li>
          
        </ul>
        </div>

        <div className="relative min-h-1/2 border-2 p-10 overflow-hidden flex items-center justify-center">
  <div
    className="absolute inset-0 opacity-60"
    style={{
      background:
        'radial-gradient(1200px 600px at 0% 0%, #a78bfa33, transparent 60%), radial-gradient(800px 500px at 100% 0%, #60a5fa33, transparent 55%), radial-gradient(900px 500px at 100% 100%, #34d39933, transparent 55%), radial-gradient(700px 400px at 0% 100%, #f472b633, transparent 55%)'
    }}
  />
  <div className="relative text-center">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
      "Connect. Work. Grow."
    </h1>
  </div>
</div>

      </div>

      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-6 tracking-tight">
          Welcome,{freelancer?.name} 👋
        </h1>

        <div className="bg-white border-2 shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold text-gray-800">{freelancer?.name}</h2>
            {/* <button
              onClick={() => navigate("/edit-freelancer-profile")}
              className="px-4 py-2 bg-indigo-600 text-white border-2 border-black cursor-pointer hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
            >
              Edit Profile
            </button> */}
          </div>
          <p className="text-gray-500 mt-2">{freelancer?.email}</p>
          <p className="text-gray-500">{freelancer?.location || "Location not set"}</p>

          {/* <div className="mt-6">
            <h3 className="text-xl font-semibold text-indigo-700">About</h3>
            <p className="text-gray-700 mt-2 leading-relaxed">
              {freelancer?.bio || "No bio added yet."}
            </p>
          </div> */}

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-indigo-700">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {freelancer?.skills?.length > 0 ? (
                freelancer.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-600">No skills added yet.</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-indigo-700">Portfolio</h3>
            <p className="text-gray-700 mt-2">
              {freelancer?.portfolio ? (
                <a
                  href={freelancer.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {freelancer.portfolio}
                </a>
              ) : (
                "No portfolio link added yet."
              )}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-indigo-700">Service Rate</h3>
            <p className="text-gray-700 mt-2">
              {freelancer?.rate ? `₹${freelancer.rate} / hour` : "Rate not set"}
            </p>
          </div>
        </div>


        <div className="flex gap-6 w-full">
  <div
    className="flex-1 p-6 bg-gray-200 border-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
    onClick={() => navigate("/all-gigs")}
  >
    <h3 className="text-xl font-semibold text-gray-800">Browse Gigs</h3>
    <p className="text-gray-600 mt-2">
      Explore available gigs and apply directly.
    </p>
  </div>

  <div
    className="flex-1 p-6 bg-gray-200 border-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
    onClick={() => navigate("/my-applications")}
  >
    <h3 className="text-xl font-semibold text-gray-800">My Applications</h3>
    <p className="text-gray-600 mt-2">
      Track the gigs you’ve applied for.
    </p>
  </div>
</div>

      </div>
      </div>
      <div className="flex items-center justify-center 
        border-t-3 border-black font-bold bg-gray-400">
            <Copyright />
            <p className="p-2 pl-0">2025 GigConnect. All rights reserved.</p>
        </div>
    </div>

</div>




//     <div className="flex flex-col min-h-screen bg-gray-50 font-mono">
//       <nav className="w-full bg-gray-100 border-b-4 border-black cursor-pointer  py-4 flex justify-between items-center">
//         <h1 className="text-4xl flex font-extrabold items-center text-indigo-700">
//             <img src={GigConnect_logo} alt="logo" className="h-15 w-auto "/>GigConnect</h1>
//         <div className="space-x-4">
//             <button
//                 onClick={logout}
//             className="px-7 mr-5 py-2 border-2 border-black cursor-pointer bg-green-400 hover:bg-green-500 font-bold"
//           >
//             Logout
//           </button>
          
//         </div>
//       </nav>
//       <div className="flex">
//         <div className="w-full md:w-1/4 bg-gray-50  p-6 sticky top-0 h-screen md:h-auto">
//         <h2 className="text-2xl font-bold mb-6 text-indigo-600 tracking-tight">
//           Freelancer-Dashboard
//         </h2>
//         <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
//           <ul className="space-y-7">
          
//           <li>
//             <button
//               onClick={() => navigate("/all-gigs")}
//               className="w-full text-left px-4 py-3 hover:shadow-lg bg-blue-600 text-white border-2 border-black cursor-pointer hover:bg-blue-700 transition-colors duration-200 shadow-sm"
//             >
//               Browse Gigs
//             </button>
//           </li>
//           <li>
//             <button
//               onClick={() => navigate("/my-applications")}
//               className="w-full text-left px-4 py-3 hover:shadow-lg bg-green-600 text-white border-2 border-black cursor-pointer hover:bg-green-700 transition-colors duration-200 shadow-sm"
//             >
//               My Applications
//             </button>
//           </li>
          
//         </ul>
//         </div>

//         <div className="relative min-h-1/2 rounded-xl p-10 overflow-hidden flex items-center justify-center">
//   <div
//     className="absolute inset-0 opacity-60"
//     style={{
//       background:
//         'radial-gradient(1200px 600px at 0% 0%, #a78bfa33, transparent 60%), radial-gradient(800px 500px at 100% 0%, #60a5fa33, transparent 55%), radial-gradient(900px 500px at 100% 100%, #34d39933, transparent 55%), radial-gradient(700px 400px at 0% 100%, #f472b633, transparent 55%)'
//     }}
//   />
//   <div className="relative text-center">
//     <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
//       "Connect. Work. Grow."
//     </h1>
//   </div>
// </div>

//       </div>

//       <div className="flex-1 p-6 md:p-10">
//         <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-6 tracking-tight">
//           Welcome,{freelancer?.name} 👋
//         </h1>

//         <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
//           <div className="flex justify-between items-center">
//             <h2 className="text-3xl font-semibold text-gray-800">{freelancer?.name}</h2>
//             <button
//               onClick={() => navigate("/edit-freelancer-profile")}
//               className="px-4 py-2 bg-indigo-600 text-white border-2 border-black cursor-pointer hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
//             >
//               Edit Profile
//             </button>
//           </div>
//           <p className="text-gray-500 mt-2">{freelancer?.email}</p>
//           <p className="text-gray-500">{freelancer?.location || "Location not set"}</p>

//           {/* <div className="mt-6">
//             <h3 className="text-xl font-semibold text-indigo-700">About</h3>
//             <p className="text-gray-700 mt-2 leading-relaxed">
//               {freelancer?.bio || "No bio added yet."}
//             </p>
//           </div> */}

//           <div className="mt-6">
//             <h3 className="text-xl font-semibold text-indigo-700">Skills</h3>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {freelancer?.skills?.length > 0 ? (
//                 freelancer.skills.map((skill, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors duration-200"
//                   >
//                     {skill}
//                   </span>
//                 ))
//               ) : (
//                 <p className="text-gray-600">No skills added yet.</p>
//               )}
//             </div>
//           </div>

//           <div className="mt-6">
//             <h3 className="text-xl font-semibold text-indigo-700">Portfolio</h3>
//             <p className="text-gray-700 mt-2">
//               {freelancer?.portfolio ? (
//                 <a
//                   href={freelancer.portfolio}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-indigo-600 hover:underline"
//                 >
//                   {freelancer.portfolio}
//                 </a>
//               ) : (
//                 "No portfolio link added yet."
//               )}
//             </p>
//           </div>

//           <div className="mt-6">
//             <h3 className="text-xl font-semibold text-indigo-700">Service Rate</h3>
//             <p className="text-gray-700 mt-2">
//               {freelancer?.rate ? `₹${freelancer.rate} / hour` : "Rate not set"}
//             </p>
//           </div>
//         </div>


//         <div className="flex gap-6 w-full">
//   <div
//     className="flex-1 p-6 bg-gray-200 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
//     onClick={() => navigate("/all-gigs")}
//   >
//     <h3 className="text-xl font-semibold text-gray-800">Browse Gigs</h3>
//     <p className="text-gray-600 mt-2">
//       Explore available gigs and apply directly.
//     </p>
//   </div>

//   <div
//     className="flex-1 p-6 bg-gray-200 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
//     onClick={() => navigate("/my-applications")}
//   >
//     <h3 className="text-xl font-semibold text-gray-800">My Applications</h3>
//     <p className="text-gray-600 mt-2">
//       Track the gigs you’ve applied for.
//     </p>
//   </div>
// </div>

//       </div>
//       </div>
//       <div className="flex items-center justify-center 
//         border-t-3 border-black font-bold bg-gray-400">
//             <Copyright />
//             <p className="p-2 pl-0">2025 GigConnect. All rights reserved.</p>
//         </div>
//     </div>
  );
};

export default FreelancerDashboard;