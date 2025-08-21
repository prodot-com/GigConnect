import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BrowseGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userDetails")); // Logged in user

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const { data } = await axios.get("http://localhost:9000/api/gigs");
        setGigs(data);
        setFilteredGigs(data); // initially show all gigs
      } catch (error) {
        console.error("Error fetching gigs:", error);
        setAlert("Failed to load gigs");
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  // Search filter logic
  useEffect(() => {
    if (!search.trim()) {
      setFilteredGigs(gigs);
      return;
    }

    const lower = search.toLowerCase();
    const filtered = gigs.filter((gig) => {
      const skills = Array.isArray(gig.skillsRequired)
        ? gig.skillsRequired.join(", ")
        : gig.skillsRequired;

      return (
        gig.title?.toLowerCase().includes(lower) ||
        gig.description?.toLowerCase().includes(lower) ||
        gig.location?.toLowerCase().includes(lower) ||
        skills?.toLowerCase().includes(lower)
      );
    });

    setFilteredGigs(filtered);
  }, [search, gigs]);

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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlert(res.data.message || "Applied successfully!");

      // Update UI
      const updated = gigs.map((g) =>
        g._id === gigId
          ? { ...g, appliedFreelancers: [...g.appliedFreelancers, user._id] }
          : g
      );
      setGigs(updated);
    } catch (err) {
      setAlert(err.response?.data?.message || "Failed to apply for gig");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading gigs...</p>;
  }

  return (
    <div className="px-6 py-4 min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Browse Gigs</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search gigs by title, skills, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={() => navigate("/freelancer-dashboard")}
          className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
        >
          Dashboard
        </button>
      </div>

      {alert && (
        <p className="text-center text-red-600 font-semibold mb-4">{alert}</p>
      )}

      {filteredGigs.length === 0 ? (
        <p className="text-center text-gray-500">No gigs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => {
            const alreadyApplied = gig.appliedFreelancers?.includes(user?._id);

            return (
              <div
                key={gig._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition relative group"
              >
                <h3 className="text-xl font-bold text-indigo-700">
                  {gig.title}
                </h3>
                <p className="text-gray-600 mt-2">{gig.description}</p>

                {/* Skills */}
                <div className="mt-2">
                  <span className="font-semibold">Skills:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
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

                <p className="mt-2">
                  <span className="font-semibold">Budget:</span> ₹{gig.budget}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Location:</span> {gig.location}
                </p>

                {/* Hover buttons */}
                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center space-y-3 opacity-0 group-hover:opacity-100 transition">
                  {alreadyApplied ? (
                    <span className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-not-allowed">
                      ✅ Already Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(gig._id)}
                      className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
                    >
                      Apply
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/gig/${gig._id}`)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseGigs;
