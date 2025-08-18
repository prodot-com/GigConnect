import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const [freelancerDetails, setFreelancerDetails] = useState({});

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem("userDetails"));
    const token = localStorage.getItem("token");

    if (!token || !details || details.role !== "Freelancer") {
      navigate("/"); // redirect if not a freelancer
    } else {
      setFreelancerDetails(details);
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4 shadow-md">
        <h2 className="text-3xl font-bold">GigConnect</h2>
        <div className="space-x-4">
          <button
            onClick={logout}
            className="px-4 py-2 cursor-pointer bg-indigo-700 text-white rounded-lg hover:bg-blue-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex flex-col mt-28 items-center space-y-5 text-center">
        <h1 className="text-3xl font-bold pb-7 text-indigo-700">
          {`Welcome Freelancer ${freelancerDetails.name || ""}`}
        </h1>
        <p className="text-lg text-gray-600">
          Manage your profile, browse gigs, and apply for opportunities.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-12 pt-12">
        <div>
          <button
            onClick={() => navigate("/freelancer-profile")}
            className="px-6 py-3 cursor-pointer bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg"
          >
            My Profile
          </button>
        </div>
        <div>
          <button
            onClick={() => navigate("/all-gigs")}
            className="px-6 py-3 cursor-pointer bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 shadow-lg"
          >
            Browse Gigs
          </button>
        </div>
        <div>
          <button
            onClick={() => navigate("/my-applications")}
            className="px-6 py-3 cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-lg"
          >
            My Applications
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
