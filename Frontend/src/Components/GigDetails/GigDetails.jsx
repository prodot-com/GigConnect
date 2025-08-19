import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const GigDetails = () => {
  const { id } = useParams(); // gig id from route
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");
  const [applied, setApplied] = useState(false);

  const user = JSON.parse(localStorage.getItem("userDetails"));

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const { data } = await axios.get(`http://localhost:9000/api/gigs/${id}`);
        setGig(data);

        if (data.appliedFreelancers?.includes(user?._id)) {
          setApplied(true);
        }
      } catch (error) {
        console.error("Error fetching gig details:", error);
        setAlert("Failed to load gig details");
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id, user?._id]);

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAlert("Please login as Freelancer to apply");
        return;
      }

      const res = await axios.post(
        `http://localhost:9000/api/gigs/${id}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAlert(res.data.message || "Applied successfully!");
      setApplied(true);
    } catch (err) {
      setAlert(err.response?.data?.message || "Failed to apply for gig");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading gig details...</p>;
  }

  if (!gig) {
    return <p className="text-center mt-10 text-red-600">Gig not found</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-3xl font-bold cursor-pointer text-indigo-700"
          onClick={() => navigate("/freelancer-dashboard")}
        >
          GigConnect
        </h2>
        <button
          onClick={() => navigate("/browse-gigs")}
          className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800"
        >
          Back to Gigs
        </button>
      </div>

      {alert && (
        <p className="text-center text-red-600 font-semibold mb-4">{alert}</p>
      )}

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-indigo-700">{gig.title}</h1>
        <p className="text-gray-600 mt-2">{gig.description}</p>

        {/* Skills */}
        <div className="mt-4">
          <span className="font-semibold">Skills Required:</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {(Array.isArray(gig.skillsRequired)
              ? gig.skillsRequired
              : gig.skillsRequired?.split(",") || []
            ).map((skill, i) => (
              <span
                key={i}
                className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-4">
          <span className="font-semibold">Budget:</span> ₹{gig.budget}
        </p>
        <p className="mt-2">
          <span className="font-semibold">Location:</span> {gig.location}
        </p>

        {/* Client Info */}
        {gig.client && (
          <p className="mt-2">
            <span className="font-semibold">Posted by:</span> {gig.client.name} (
            {gig.client.email})
          </p>
        )}

        {/* Apply Button */}
        <div className="mt-6">
          {applied ? (
            <button
              disabled
              className="w-full bg-green-600 text-white py-2 rounded-lg cursor-not-allowed"
            >
              ✅ Already Applied
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="w-full bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-800 transition"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
