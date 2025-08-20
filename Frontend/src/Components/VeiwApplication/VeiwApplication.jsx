// src/Components/Client/ViewApplications.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewApplications = () => {
  const { id } = useParams(); // gigId
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");
  const [review, setReview] = useState({ rating: 0, comment: "" });

  const token = localStorage.getItem("token");

  const fetchGig = async () => {
    try {
      const { data } = await axios.get(`http://localhost:9000/api/gigs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGig(data);
    } catch (err) {
      setAlert("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGig();
  }, [id]);

  const handleDecision = async (freelancerId, action) => {
    try {
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
      const res = await axios.post(
        `http://localhost:9000/api/gigs/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlert(res.data.message);
      fetchGig();
    } catch (err) {
      setAlert(err.response?.data?.message || "Error completing gig");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:9000/api/gigs/${id}/review`,
        review,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlert(res.data.message);
      setReview({ rating: 0, comment: "" });
      fetchGig();
    } catch (err) {
      setAlert(err.response?.data?.message || "Error submitting review");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">
        Applications for {gig?.title}
      </h1>

      {alert && <p className="text-center text-red-600 mb-4">{alert}</p>}

      {/* Applications */}
      {gig?.appliedFreelancers?.length === 0 ? (
        <p className="text-center text-gray-600">No applications yet.</p>
      ) : (
        <div className="grid gap-4">
          {gig.appliedFreelancers.map((freelancer) => (
            <div key={freelancer.user._id} className="bg-white shadow rounded-lg p-4">
              <h2 className="text-lg font-semibold">{freelancer.user.name}</h2>
              <p className="text-gray-600">{freelancer.user.email}</p>
              <p className="text-gray-600">
                <strong>Status:</strong> {freelancer.status}
              </p>

              {gig.assignedFreelancer &&
              gig.assignedFreelancer._id === freelancer.user._id ? (
                <p className="text-green-600 font-bold mt-2">✅ Assigned</p>
              ) : (
                <div className="mt-3 space-x-3">
                  <button
                    onClick={() => handleDecision(freelancer.user._id, "accept")}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecision(freelancer.user._id, "reject")}
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

      {/* Mark complete */}
      {gig.status === "In Progress" && (
        <div className="text-center mt-6">
          <button
            onClick={handleComplete}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Mark as Completed
          </button>
        </div>
      )}

      {/* Submit Review */}
      {gig.status === "Completed" && gig.assignedFreelancer && (
        <div className="mt-6 bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            {/* Star Rating */}
            <div className="flex space-x-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setReview({ ...review, rating: star })}
                  className={`cursor-pointer text-2xl ${
                    review.rating >= star ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <label className="block mb-2">
              Comment:
              <textarea
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                required
                className="border p-2 w-full mt-1"
              />
            </label>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {/* Show Existing Reviews */}
      {gig.reviews && gig.reviews.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Reviews</h3>
          {gig.reviews.map((r) => (
            <div key={r._id} className="border-b py-2">
              <p className="text-yellow-600 font-semibold">⭐ {r.rating}/5</p>
              <p className="text-gray-800">{r.comment}</p>
              <p className="text-sm text-gray-500">
                by {r.client?.name || "Client"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
