import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

        const res = await axios.get("http://localhost:9000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFreelancer(res.data);
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 text-indigo-700">
          {freelancer?.name || "Freelancer"}
        </h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => navigate("/freelancer-profile")}
              className="w-full text-left px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              My Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/all-gigs")}
              className="w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse Gigs
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/my-applications")}
              className="w-full text-left px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              My Applications
            </button>
          </li>
          <li>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Section */}
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">
          Welcome, {freelancer?.name} 👋
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="p-6 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl"
            onClick={() => navigate("/freelancer-profile")}
          >
            <h2 className="text-xl font-semibold">My Profile</h2>
            <p className="text-gray-600 mt-2">
              View and update your freelancer profile details.
            </p>
          </div>

          <div
            className="p-6 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl"
            onClick={() => navigate("/all-gigs")}
          >
            <h2 className="text-xl font-semibold">Browse Gigs</h2>
            <p className="text-gray-600 mt-2">
              Explore available gigs and apply directly.
            </p>
          </div>

          <div
            className="p-6 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl"
            onClick={() => navigate("/my-applications")}
          >
            <h2 className="text-xl font-semibold">My Applications</h2>
            <p className="text-gray-600 mt-2">
              Track the gigs you’ve applied for.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
