import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyGigs = async () => {
      try {
        const token = localStorage.getItem("token");
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

  if (loading) {
    return <p className="text-center mt-10">Loading your gigs...</p>;
  }

  return (
    <div className="px-6 py-4 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center">My Gigs</h2>

      {gigs.length === 0 ? (
        <p className="text-center text-gray-500">You haven’t created any gigs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition relative"
            >
              <h3 className="text-xl font-bold text-indigo-700">{gig.title}</h3>
              <p className="text-gray-600 mt-2">{gig.description}</p>
              <p className="mt-2">
                <span className="font-semibold">Skills:</span>{" "}
                {Array.isArray(gig.skillsRequired)
                  ? gig.skillsRequired.join(", ")
                  : gig.skillsRequired}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Budget:</span> ₹{gig.budget}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Location:</span> {gig.location}
              </p>

              {/* Applications Button */}
              <div className="mt-4">
                <button
                  onClick={() => navigate(`/gig/${gig._id}/applications`)}
                  className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
                >
                  View Applications
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;
