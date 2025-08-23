import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FreelancerProfile = () => {
  const navigate = useNavigate();
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
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
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center px-6 py-4 shadow-md bg-white mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">GigConnect</h2>
        <button
          onClick={() => navigate("/freelancer-dashboard")}
          className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800"
        >
          Dashboard
        </button>
      </div>

      
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-3xl font-bold text-white bg-indigo-600">
            {freelancer?.name?.charAt(0)}
          </div>

         
          <div className="md:ml-8 mt-4 md:mt-0 w-full">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">
                {freelancer?.name}
              </h1>
              <button
                onClick={() => navigate("/edit-freelancer-profile")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </div>
            <p className="text-gray-500 mt-1">{freelancer?.email}</p>
            <p className="text-gray-500">{freelancer?.location || "Location not set"}</p>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-indigo-700">About</h2>
              <p className="text-gray-700 mt-2">
                {freelancer?.bio || "No bio added yet."}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-indigo-700">Skills</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {freelancer?.skills?.length > 0 ? (
                  freelancer.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
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
              <h2 className="text-xl font-semibold text-indigo-700">Portfolio</h2>
              <p className="text-gray-700 mt-2">
                {freelancer?.portfolio || "No portfolio link added yet."}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-indigo-700">
                Service Rate
              </h2>
              <p className="text-gray-700 mt-2">
                {freelancer?.rate
                  ? `₹${freelancer.rate} / hour`
                  : "Rate not set"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
