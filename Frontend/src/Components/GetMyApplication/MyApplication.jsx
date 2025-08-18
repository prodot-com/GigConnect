import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyApplications = () => {
  const [gigs, setGigs] = useState([]);
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
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setGigs(res.data);
      } catch (err) {
        setAlert("Failed to load applications");
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Navbar with Dashboard button */}
      <div className="flex justify-between items-center px-6 py-4 shadow-md mb-6">
        <h2 className="text-2xl font-bold">GigConnect</h2>
        <button
          onClick={() => navigate("/freelancer-dashboard")}
          className="px-4 py-2 cursor-pointer bg-indigo-700 text-white rounded-lg hover:bg-blue-600"
        >
          Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        My Applications
      </h1>

      {alert && (
        <p className="text-center text-red-600 font-semibold mb-4">{alert}</p>
      )}

      {gigs.length === 0 && !alert && (
        <p className="text-center text-gray-600">
          You haven’t applied to any gigs yet.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gigs.map((gig) => (
          <div
            key={gig._id}
            className="bg-white shadow-lg rounded-xl p-6 flex flex-col"
          >
            <h2 className="text-xl font-bold text-indigo-700">{gig.title}</h2>
            <p className="text-gray-600">{gig.description}</p>
            <p className="text-gray-600">
              <strong>Budget:</strong> ₹{gig.budget}
            </p>
            <p className="text-gray-600">
              <strong>Location:</strong> {gig.location}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Client:</strong> {gig.client?.name} ({gig.client?.email})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
