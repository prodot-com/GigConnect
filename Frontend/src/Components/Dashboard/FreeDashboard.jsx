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
      } catch (err) {
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
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at center, #8fffe5, transparent)`
        }}
      />
      <div className="relative z-10 flex flex-col min-h-screen font-mono">
        <nav className="w-full bg-gray-100 border-b-4 border-black py-4 flex justify-between items-center px-4 md:px-10">
          <h1 className="text-3xl md:text-4xl flex font-extrabold items-center text-indigo-700">
            <img src={GigConnect_logo} alt="logo" className="h-10 md:h-15 w-auto mr-2"/>GigConnect
          </h1>
          <button
            onClick={logout}
            className="px-4 md:px-7 py-2 border-2 border-black bg-green-400 hover:bg-green-500 font-bold text-sm md:text-base"
          >
            Logout
          </button>
        </nav>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 p-4 md:p-6 sticky top-0 h-auto md:h-screen bg-gray-50">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600 tracking-tight">Freelancer Dashboard</h2>
            <div className="bg-white border-2 shadow-xl p-4 md:p-6 mb-6">
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => navigate("/all-gigs")}
                    className="w-full text-left px-3 py-2 md:px-4 md:py-3 bg-blue-600 text-white border-2 border-black hover:bg-blue-700 transition-colors duration-200"
                  >
                    Browse Gigs
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/my-applications")}
                    className="w-full text-left px-3 py-2 md:px-4 md:py-3 bg-green-600 text-white border-2 border-black hover:bg-green-700 transition-colors duration-200"
                  >
                    My Applications
                  </button>
                </li>
              </ul>
            </div>
            <div className="relative min-h-32 md:min-h-1/2 border-2 p-4 md:p-10 overflow-hidden flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background:
                    'radial-gradient(1200px 600px at 0% 0%, #a78bfa33, transparent 60%), radial-gradient(800px 500px at 100% 0%, #60a5fa33, transparent 55%), radial-gradient(900px 500px at 100% 100%, #34d39933, transparent 55%), radial-gradient(700px 400px at 0% 100%, #f472b633, transparent 55%)'
                }}
              />
              <div className="relative text-center">
                <h1 className="text-xl md:text-3xl font-bold text-gray-800">"Connect. Work. Grow."</h1>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-6 tracking-tight">
              Welcome, {freelancer?.name} 👋
            </h1>

            <div className="bg-white border-2 shadow-xl p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">{freelancer?.name}</h2>
              </div>
              <p className="text-gray-500 mt-1">{freelancer?.email}</p>
              <p className="text-gray-500">{freelancer?.location || "Location not set"}</p>

              <div className="mt-4">
                <h3 className="text-xl font-semibold text-indigo-700">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {freelancer?.skills?.length > 0 ? (
                    freelancer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No skills added yet.</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-semibold text-indigo-700">Portfolio</h3>
                <p className="text-gray-700 mt-1">
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

              <div className="mt-4">
                <h3 className="text-xl font-semibold text-indigo-700">Service Rate</h3>
                <p className="text-gray-700 mt-1">
                  {freelancer?.rate ? `₹${freelancer.rate} / hour` : "Rate not set"}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div
                className="flex-1 p-4 md:p-6 bg-gray-200 border-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
                onClick={() => navigate("/all-gigs")}
              >
                <h3 className="text-xl font-semibold text-gray-800">Browse Gigs</h3>
                <p className="text-gray-600 mt-2">Explore available gigs and apply directly.</p>
              </div>

              <div
                className="flex-1 p-4 md:p-6 bg-gray-200 border-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
                onClick={() => navigate("/my-applications")}
              >
                <h3 className="text-xl font-semibold text-gray-800">My Applications</h3>
                <p className="text-gray-600 mt-2">Track the gigs you’ve applied for.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center border-t-3 border-black font-bold bg-gray-400 p-2 md:p-4">
          <Copyright />
          <p className="pl-2 text-sm md:text-base">2025 GigConnect. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
