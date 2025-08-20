import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const fetchMyGigs = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:9000/api/gigs/my-gigs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGigs(data);
    } catch (error) {
      console.error("Error fetching my gigs:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchMyGigs();
}, []);


  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:9000/api/gigs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGigs(gigs.filter((gig) => gig._id !== id));
    } catch (err) {
      setAlert("Failed to delete gig");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading gigs...</p>;

  return (
    <div className="px-6 py-4 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-center">My Gigs</h2>

      {alert && <p className="text-center text-red-600">{alert}</p>}

      {gigs.length === 0 ? (
        <p className="text-center text-gray-500">You haven’t posted any gigs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div key={gig._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
              <h3 className="text-xl font-bold text-indigo-700">{gig.title}</h3>
              <p className="text-gray-600 mt-2">{gig.description}</p>
              <p className="mt-2"><span className="font-semibold">Skills:</span> {gig.skillsRequired.join(", ")}</p>
              <p className="mt-2"><span className="font-semibold">Budget:</span> ₹{gig.budget}</p>
              <p className="mt-2"><span className="font-semibold">Location:</span> {gig.location}</p>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => navigate(`/gig/${gig._id}/applicants`)}
                  className="px-3 py-1 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800"
                >
                  View Applicants
                </button>
                <button
                  onClick={() => navigate(`/gig/${gig._id}/edit`)}
                  className="px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(gig._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
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
