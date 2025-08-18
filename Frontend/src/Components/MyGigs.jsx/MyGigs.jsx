import React, { useEffect, useState } from "react";
import axios from "axios";

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const { data } = await axios.get("http://localhost:9000/api/gigs"); 
        setGigs(data);
      } catch (error) {
        console.error("Error fetching gigs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading gigs...</p>;
  }

  return (
    <div className="px-6 py-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Available Gigs</h2>
        {gigs.length === 0 ? (
        <p className="text-center text-gray-500">No gigs found.</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
            <div
                key={gig._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition"
            >
                <h3 className="text-xl font-bold text-indigo-700">{gig.title}</h3>
                <p className="text-gray-600 mt-2">{gig.description}</p>
                <p className="mt-2">
                <span className="font-semibold">Skills:</span>{" "}
                {gig.skillsRequired}
                </p>
                <p className="mt-2">
                <span className="font-semibold">Budget:</span> ₹{gig.budget}
                </p>
                <p className="mt-2">
                <span className="font-semibold">Location:</span> {gig.location}
                </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGigs;
