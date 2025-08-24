import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GigConnect_logo from "../../assets/GigConnect_logo.png";
import { Copyright } from "lucide-react";

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");
  const [applied, setApplied] = useState(false);

  const user = JSON.parse(localStorage.getItem("userDetails"));

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const { data } = await axios.get(`https://gigconnect-sq1z.onrender.com/api/gigs/${id}`);
        setGig(data);

        const alreadyApplied =
          Array.isArray(data.appliedFreelancers) &&
          data.appliedFreelancers.some((a) => {
            const uid = a.user?._id ? a.user._id.toString() : a.user?.toString();
            return user && uid === user._id;
          });

        setApplied(Boolean(alreadyApplied));
      } catch (error) {
        console.error("Error fetching gig details:", error);
        setAlert("Failed to load gig details");
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id, user?._id]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAlert("Please login as Freelancer to apply");
        return;
      }

      const res = await axios.post(
        `https://gigconnect-sq1z.onrender.com/api/gigs/${id}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlert(res.data.message || "Applied successfully!");
      setApplied(true);

      setGig((prev) => {
        if (!prev) return prev;
        const newApp = {
          user: { _id: user._id, name: user.name, email: user.email },
          status: "Pending",
        };
        return { ...prev, appliedFreelancers: [...(prev.appliedFreelancers || []), newApp] };
      });
    } catch (err) {
      setAlert(err.response?.data?.message || "Failed to apply for gig");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-lg">Loading gig details...</p>;
  }

  if (!gig) {
    return <p className="text-center mt-10 text-red-600 text-lg">Gig not found</p>;
  }

  return (
    <div className="min-h-screen w-full relative bg-white">
      {/* Soft Green Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundImage: "radial-gradient(circle at center, #8fffe5, transparent)" }}
      />

      <div className="relative z-10 min-h-screen flex flex-col font-mono">
        {/* Navbar */}
        <nav className="w-full bg-gray-100 shadow-md border-b border-gray-200 py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl flex font-extrabold items-center text-indigo-700 gap-2">
            <img src={GigConnect_logo} alt="logo" className="h-10 sm:h-12 w-auto" />
            GigConnect
          </h1>
          <div className="flex gap-2 sm:gap-4 flex-wrap">
            <button
              onClick={() => navigate("/all-gigs")}
              className="px-4 sm:px-6 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition w-full sm:w-auto"
            >
              Back to Gigs
            </button>
            <button
              onClick={logout}
              className="px-4 sm:px-6 py-2 bg-green-500 text-white border-2 border-black hover:bg-green-600 font-bold w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </nav>

        {alert && (
          <div className="max-w-3xl mx-auto mt-4">
            <p className="text-center bg-red-100 text-red-600 border-red-400 py-2 font-semibold">{alert}</p>
          </div>
        )}

        {/* Gig Info */}
        <div className="flex-grow flex justify-center mt-6 px-4 sm:px-6">
          <div className="w-full max-w-3xl bg-white shadow-xl border-2 p-6 sm:p-8 border-black">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700">{gig.title}</h1>
            <p className="text-gray-600 mt-3 leading-relaxed">{gig.description}</p>

            {/* Skills */}
            <div className="mt-5">
              <span className="font-semibold">Skills Required:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {(Array.isArray(gig.skillsRequired) ? gig.skillsRequired : gig.skillsRequired?.split(",") || []).map(
                  (skill, i) => (
                    <span
                      key={i}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill.trim()}
                    </span>
                  )
                )}
              </div>
            </div>

            <p className="mt-4 text-lg">
              <span className="font-semibold">💰 Budget:</span> ₹{gig.budget}
            </p>
            <p className="mt-2 text-lg">
              <span className="font-semibold">📍 Location:</span> {gig.location}
            </p>

            {gig.client && (
              <p className="mt-2 text-lg">
                <span className="font-semibold">👤 Posted by:</span> {gig.client.name} ({gig.client.email})
              </p>
            )}

            {/* Status */}
            <div className="flex justify-center mt-6">
              {gig.status === "Completed" ? (
                <div className="bg-yellow-300 px-4 py-2 rounded-lg border border-black">
                  <p className="text-lg font-semibold">{gig.status}</p>
                </div>
              ) : (
                gig.appliedFreelancers[0]?.status && (
                  <div className="bg-gray-200 px-4 py-2 rounded-lg border border-black">
                    <p className="text-lg font-semibold">{gig.appliedFreelancers[0].status}</p>
                  </div>
                )
              )}
            </div>

            {/* Buttons */}
            <div className="mt-5 flex flex-col gap-3">
              {applied ? (
                <button
                  disabled
                  className="w-full bg-green-600 text-white py-3 border-2 border-black text-lg cursor-not-allowed"
                >
                  Already Applied
                </button>
              ) : (
                <button
                  onClick={handleApply}
                  className="w-full bg-indigo-700 text-white py-3 border-2 border-black text-lg hover:bg-indigo-800 transition"
                >
                  Apply Now
                </button>
              )}

              {gig.status === "Completed" && (
                <button
                  onClick={() => navigate(`/gig/${gig._id}/chat`)}
                  className="w-full bg-gray-700 text-white py-3 border-2 border-black text-lg hover:bg-gray-800 transition"
                >
                  Open Chat Room
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-center border-t-2 border-black font-bold bg-gray-400 py-3 mt-6">
          <Copyright />
          <p className="p-2 pl-0">2025 GigConnect. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default GigDetails;
