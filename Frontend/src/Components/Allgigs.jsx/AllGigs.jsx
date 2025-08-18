import React, { useEffect, useState } from "react";
import axios from "axios";

const AllGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/gigs");
        setGigs(res.data);
      } catch (err) {
        setAlert("Failed to load gigs");
      }
    };
    fetchGigs();
  }, []);

  const handleApply = async (gigId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAlert("Please login as Freelancer to apply");
        return;
      }

      const res = await axios.post(
        `http://localhost:9000/api/gigs/${gigId}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAlert(res.data.message);
    } catch (err) {
      setAlert(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        All Gigs
      </h1>

      {alert && (
        <p className="text-center text-red-600 font-semibold mb-4">{alert}</p>
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
              <strong>Skills:</strong> {gig.skillsRequired.join(", ")}
            </p>
            <p className="text-gray-600">
              <strong>Budget:</strong> ₹{gig.budget}
            </p>
            <p className="text-gray-600">
              <strong>Location:</strong> {gig.location}
            </p>

            <button
              onClick={() => handleApply(gig._id)}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllGigs;
