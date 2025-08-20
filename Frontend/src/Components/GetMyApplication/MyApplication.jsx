// src/Components/Freelancer/MyApplications.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyApplications = () => {
  const [gigs, setGigs] = useState([]);
  const [reviews, setReviews] = useState([]); // ✅ store all reviews
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

        // ✅ Get gigs applied by this freelancer
        const res = await axios.get("http://localhost:9000/api/gigs/my-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGigs(res.data);

        // ✅ Get all reviews for this freelancer
        const user = JSON.parse(localStorage.getItem("user")); // assuming you stored logged-in user
        if (user?._id) {
          const reviewsRes = await axios.get(
            `http://localhost:9000/api/gigs/freelancer/${user._id}/reviews`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setReviews(reviewsRes.data);
        }
      } catch (err) {
        setAlert("Failed to load applications");
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
        <h2
          onClick={() => navigate("/")}
          className="text-3xl font-bold text-indigo-700 cursor-pointer"
        >
          GigConnect
        </h2>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/freelancer-dashboard")}
            className="px-4 py-2 cursor-pointer bg-indigo-700 text-white rounded-lg hover:bg-blue-600"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          My Applications
        </h1>

        {alert && <p className="text-center text-red-600 font-semibold mb-4">{alert}</p>}

        {gigs.length === 0 && !alert && (
          <p className="text-center text-gray-600">You haven’t applied to any gigs yet.</p>
        )}

        {/* Applications List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col"
            >
              <h2 className="text-xl font-bold text-indigo-700">{gig.title}</h2>
              <p className="text-gray-600 mt-2">{gig.description}</p>
              <p className="text-gray-600 mt-1">
                <strong>Budget:</strong> ₹{gig.budget}
              </p>
              <p className="text-gray-600 mt-1">
                <strong>Location:</strong> {gig.location}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Client:</strong> {gig.client?.name} ({gig.client?.email})
              </p>

              {/* ✅ Show Status */}
              <p
                className={`mt-3 font-bold ${
                  gig.status === "Accepted"
                    ? "text-green-600"
                    : gig.status === "Rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {gig.status}
              </p>

              {/* ✅ If this gig has reviews */}
              {gig.review ? (
                <div className="mt-4 border-t pt-2">
                  <p className="text-gray-800">
                    <strong>Review:</strong> {gig.review.comment}
                  </p>
                  <p className="text-yellow-600 font-semibold">
                    ⭐ {gig.review.rating}/5
                  </p>
                </div>
              ) : (
                gig.status === "Completed" && (
                  <p className="text-gray-500 mt-2 italic">
                    Waiting for client review...
                  </p>
                )
              )}
            </div>
          ))}
        </div>

        {/* ✅ All Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-10 bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              Reviews About Me
            </h2>
            {reviews.map((r) => (
              <div key={r._id} className="border-b py-3">
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
    </div>
  );
};

export default MyApplications;
