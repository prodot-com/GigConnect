// src/Components/Client/ViewApplications.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewApplications = () => {
  const { id } = useParams(); // gigId
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:9000/api/gigs/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGig(data);
      } catch (err) {
        setAlert("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [id]);

  const handleDecision = async (freelancerId, action) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:9000/api/gigs/${id}/${action}/${freelancerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlert(res.data.message);
      setGig(res.data.gig);
    } catch (err) {
      setAlert(err.response?.data?.message || "Error processing request");
    }
  };

  const handleComplete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:9000/api/gigs/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlert(res.data.message);
      setGig(res.data.gig);
    } catch (err) {
      setAlert(err.response?.data?.message || "Error completing gig");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        Applications for {gig?.title}
      </h1>

      {alert && <p className="text-center text-red-600 mb-4">{alert}</p>}

      {gig?.appliedFreelancers?.length === 0 ? (
        <p className="text-center text-gray-600">No applications yet.</p>
      ) : (
        <div className="grid gap-4">
          {gig.appliedFreelancers.map((app) => (
            <div
              key={app.user._id}
              className="bg-white shadow rounded-lg p-4"
            >
              <h2 className="text-lg font-semibold">{app.user.name}</h2>
              <p className="text-gray-600">{app.user.email}</p>
              <p className="text-gray-600">
                <strong>Skills:</strong>{" "}
                {app.user.skills?.length
                  ? app.user.skills.join(", ")
                  : "N/A"}
              </p>
              <p className="mt-2 font-medium">
                Status:{" "}
                {app.status === "Accepted" ? (
                  <span className="text-green-600">✅ Accepted</span>
                ) : app.status === "Rejected" ? (
                  <span className="text-red-600">❌ Rejected</span>
                ) : (
                  <span className="text-gray-600">⏳ Pending</span>
                )}
              </p>

              {/* Show buttons only for pending */}
              {app.status === "Pending" && gig.status === "Open" && (
                <div className="mt-3 space-x-3">
                  <button
                    onClick={() => handleDecision(app.user._id, "accept")}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecision(app.user._id, "reject")}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Show Complete button if gig is in progress */}
      {gig?.status === "In Progress" && (
        <div className="text-center mt-6">
          <button
            onClick={handleComplete}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Mark as Completed
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
