// src/Components/Client/ViewApplications.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ViewApplications = () => {
  const { id } = useParams(); // gig id
  const navigate = useNavigate();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAlert("Please login as Client to view applications");
          return;
        }

        const res = await axios.get(
          `http://localhost:9000/api/gigs/${id}/applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setFreelancers(res.data);
      } catch (err) {
        setAlert(err.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading applications...</p>;

  return (
    <div className="px-6 py-4 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-700">Applications</h2>
        <button
          onClick={() => navigate("/client-dashboard")}
          className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
        >
          Dashboard
        </button>
      </div>

      {alert && (
        <p className="text-center text-red-600 font-semibold mb-4">{alert}</p>
      )}

      {freelancers.length === 0 ? (
        <p className="text-center text-gray-500">
          No freelancers have applied yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {freelancers.map((f) => (
            <div
              key={f._id}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col"
            >
              <h3 className="text-xl font-bold text-indigo-700">{f.name}</h3>
              <p className="text-gray-600">{f.email}</p>
              <p className="text-gray-600">
                <strong>Skills:</strong>{" "}
                {f.skills && f.skills.length > 0
                  ? f.skills.join(", ")
                  : "Not specified"}
              </p>
              <p className="text-gray-600">
                <strong>Rate:</strong> ₹{f.rate || "N/A"}
              </p>
              {f.portfolio && (
                <a
                  href={f.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mt-2"
                >
                  View Portfolio
                </a>
              )}

              <div className="mt-4 space-x-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Accept
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
