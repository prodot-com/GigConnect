import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GigConnect_logo from '../../assets/GigConnect_logo.png';
import { Copyright } from "lucide-react";

const ViewApplications = () => {
  const { id } = useParams(); // gigId
  const navigate = useNavigate();

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
      console.error(err);
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

      if (action === "reject") {
        setGig((prev) => ({
          ...prev,
          appliedFreelancers: prev.appliedFreelancers.filter(
            (app) =>
              (app.user?._id || app.user).toString() !== freelancerId.toString()
          ),
        }));
      } else {
        setGig(res.data.gig);
      }
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

  if (loading) {
    return <p className="text-center mt-10 font-mono">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-mono">
      {/* Navbar */}
      <nav className="w-full bg-gray-100 border-b-4 border-black cursor-pointer py-4 flex justify-between items-center px-6">
        <h1 className="text-4xl flex font-extrabold items-center text-indigo-700">
          <img src={GigConnect_logo} alt="logo" className="h-15 w-auto mr-2"/>
          GigConnect
        </h1>
        <div className="space-x-7">
          <button
            onClick={() => navigate("/client")}
            className="px-7 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate("/"); }}
            className="px-7 py-2 border-2 border-black cursor-pointer bg-green-400 hover:bg-green-500 font-bold"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Applications for {gig?.title}
        </h1>

        {alert && <p className="text-center text-red-600 mb-4">{alert}</p>}

        {(!gig?.appliedFreelancers || gig.appliedFreelancers.length === 0) ? (
          <p className="text-center text-gray-600">No applications yet.</p>
        ) : (
          <div className="grid gap-4">
            {gig.appliedFreelancers.map((application) => {
              const freelancerUser = application.user?._id ? application.user : { _id: application.user };
              const fid = freelancerUser._id.toString();

              return (
                <div key={fid} className="flex justify-center items-center">
                  <div className="w-2/3  bg-white border-2 border-black flex flex-col items-start justify-center p-4">
                    <h2 className="text-lg font-semibold">{application.user?.name || "Freelancer"}</h2>
                  <p className="text-gray-600">{application.user?.email || ""}</p>
                  <p className="text-gray-600"><strong>Status:</strong> {application.status}</p>

                  {gig.assignedFreelancer &&
                  (gig.assignedFreelancer._id || gig.assignedFreelancer).toString() === fid ? (
                    <p className="text-green-600 font-bold mt-2">Assigned</p>
                  ) : (
                    <div className="mt-3 space-x-3 flex flex-wrap">
                      <button
                        onClick={() => handleDecision(fid, "accept")}
                        className="px-4 py-2 bg-green-600 text-white border-2 border-black hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecision(fid, "reject")}
                        className="px-4 py-2 bg-red-600 text-white border-2 border-black hover:bg-red-700"
                      >
                        Reject
                      </button>
                      {/* <button
                        onClick={() => navigate(`/gig/${id}/chat?to=${fid}`)}
                        className="px-4 py-2 bg-indigo-600 text-white border-2 border-black hover:bg-indigo-700"
                      >
                        Chat
                      </button> */}
                    </div>
                  )}
                  </div>
                  <div className="w-1/3 flex justify-center items-center">
                    {gig?.status === "Completed" && gig?.assignedFreelancer && (
                      <div className= "   flex flex-col items-start justify-center p-6">
                          <h3 className="text-lg font-semibold mb-2">Chat with Assigned Freelancer</h3>
                            <button
                            onClick={() => navigate(`/gig/${id}/chat?to=${gig.assignedFreelancer._id}`)}
                            className="px-6 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
                          >
      Open Chat
    </button>
  </div>
)}

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {gig?.status === "In Progress" && (
          <div className="text-center mt-6">
            <button
              onClick={handleComplete}
              className="px-6 py-2 bg-blue-600 text-white border-2 border-black hover:bg-blue-700"
            >
              Mark as Completed
            </button>
          </div>
        )}

        

        {gig?.status === "Completed" && gig.assignedFreelancer && (
          <div className="mt-6 bg-white p-4 shadow-lg border-2 border-black">
            <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="flex space-x-2 mb-3">
                {[1,2,3,4,5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setReview({ ...review, rating: star })}
                    className={`cursor-pointer text-2xl ${review.rating >= star ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                required
                className="p-2 w-full mb-3 border-2 border-black focus:ring-2 focus:ring-indigo-700 outline-none"
                placeholder="Write your comment..."
              />
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}

       


        {gig?.reviews && gig.reviews.length > 0 && (
          <div className="mt-6 bg-gray-100 p-4 border-2 border-black">
            <h3 className="text-lg font-semibold mb-3">Reviews</h3>
            {gig.reviews.map((r) => (
              <div key={r._id} className="border-b py-2">
                <p className="text-yellow-600 font-semibold">⭐ {r.rating}/5</p>
                <p className="text-gray-800">{r.comment}</p>
                <p className="text-sm text-gray-500">by {r.client?.name || "Client"}</p>
              </div>
            ))}
          </div>
        )}
      </main>


      <footer className="flex items-center justify-center border-t-2 border-black font-bold bg-gray-400 py-3 mt-6">
        <Copyright />
        <p className="p-2 pl-0">2025 GigConnect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ViewApplications;
