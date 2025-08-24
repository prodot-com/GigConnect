import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GigConnect_logo from '../../assets/GigConnect_logo.png'
import { Copyright } from "lucide-react";

const BrowseGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userDetails"));

  useEffect(() => {
    fetchGigs();
  }, [search, location, minBudget, maxBudget]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchGigs = async () => {
    try {
      const { data } = await axios.get("https://gigconnect-sq1z.onrender.com/api/gigs", {
        params: { search, location, minBudget, maxBudget },
      });
      setGigs(data);
    } catch {
      setAlert("Failed to load gigs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (gigId) => {
    try {
      if (!gigId || !/^[0-9a-fA-F]{24}$/.test(gigId)) {
        setAlert("Invalid Gig ID format");
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        setAlert("Please login as Freelancer to apply");
        return;
      }
      const res = await axios.post(`https://gigconnect-sq1z.onrender.com/api/gigs/${gigId}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlert(res.data.message || "Applied successfully!");
      await fetchGigs();
    } catch (err) {
      setAlert(err.response?.data?.message || "Failed to apply for gig");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100 font-mono">
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center mt-10">Loading gigs...</p>
        </div>
        <footer className="flex items-center justify-center border-t-2 border-black font-bold bg-gray-400 py-3">
          <Copyright />
          <p className="p-2 pl-0">2025 GigConnect. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative bg-white">
      <div className="absolute inset-0 z-0" style={{ backgroundImage: `radial-gradient(circle at center, #8fffe5, transparent)` }} />
      <div className="relative z-10 min-h-screen flex flex-col font-mono">
        <nav className="w-full bg-gray-100 border-b-4 border-black py-4 flex flex-col md:flex-row justify-between items-center px-4 md:px-10 gap-4 md:gap-0">
          <h1 className="text-3xl md:text-4xl flex font-extrabold items-center text-indigo-700">
            <img src={GigConnect_logo} alt="logo" className="h-10 md:h-15 w-auto mr-2"/>GigConnect
          </h1>
          <div className="flex flex-col md:flex-row gap-3 md:gap-7 w-full md:w-auto">
            <button onClick={() => navigate("/freelancer-dashboard")} className="px-4 md:px-7 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition">
              Dashboard
            </button>
            <button onClick={logout} className="px-4 md:px-7 py-2 border-2 border-black bg-green-400 hover:bg-green-500 font-bold">
              Logout
            </button>
          </div>
        </nav>

        <main className="flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center m-6 gap-4 md:gap-0">
            <h2 className="text-3xl font-bold">Browse Gigs</h2>
          </div>

          {alert && <p className="text-center text-red-600 font-semibold mb-4">{alert}</p>}

          <div className="bg-white p-4 border-2 shadow-md m-6 flex flex-col md:flex-row flex-wrap gap-4">
            <input type="text" placeholder="Search gigs..." value={search} onChange={(e) => setSearch(e.target.value)} className="border px-3 py-2 w-full md:w-1/4" />
            <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="border px-3 py-2 w-full md:w-1/4" />
            <input type="number" placeholder="Min Budget" value={minBudget} onChange={(e) => setMinBudget(e.target.value)} className="border px-3 py-2 w-full md:w-1/4" />
            <input type="number" placeholder="Max Budget" value={maxBudget} onChange={(e) => setMaxBudget(e.target.value)} className="border px-3 py-2 w-full md:w-1/4" />
            <button onClick={fetchGigs} className="px-4 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition w-full md:w-auto">
              Apply Filters
            </button>
          </div>

          {gigs.length === 0 ? (
            <p className="text-center text-gray-500 m-6">No gigs found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 m-6">
              {gigs.map((gig) => {
                const alreadyApplied = gig.appliedFreelancers?.some(
                  (freelancer) => (freelancer.user?._id ? freelancer.user._id.toString() : freelancer.toString()) === user?._id.toString()
                );
                return (
                  <div
  key={gig._id}
  className="bg-white border-2 border-black shadow-lg p-6 relative group"
>
  <h3 className="text-2xl md:text-3xl font-bold text-indigo-700">{gig.title}</h3>
  <p className="text-gray-600 text-lg mt-2">{gig.description}</p>
  <div className="mt-2">
    <span className="font-semibold">Skills:</span>
    <div className="flex flex-wrap gap-2 mt-2">
      {(Array.isArray(gig.skillsRequired) ? gig.skillsRequired : gig.skillsRequired?.split(",") || []).map((skill, i) => (
        <span key={i} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-sm">{skill.trim()}</span>
      ))}
    </div>
  </div>
  <p className="mt-2"><span className="font-semibold">Budget:</span> ₹{gig.budget}</p>
  <p className="mt-2"><span className="font-semibold">Location:</span> {gig.location}</p>

  <div className="hidden md:flex absolute inset-0 flex-col items-center justify-center space-y-3
    bg-white/95 opacity-0 group-hover:opacity-100 transition">
    {alreadyApplied ? (
      <span className="px-4 py-2 bg-green-600 text-white border-2 border-black cursor-not-allowed">Already Applied</span>
    ) : (
      <button onClick={() => handleApply(gig._id)} className="px-4 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition">Apply</button>
    )}
    <button onClick={() => navigate(`/gig/${gig._id}`)} className="px-4 py-2 bg-gray-700 text-white border-2 border-black hover:bg-gray-800 transition">View Details</button>
  </div>

  <div className="flex flex-col gap-2 mt-4 md:hidden">
    {alreadyApplied ? (
      <span className="px-4 py-2 bg-green-600 text-white border-2 border-black cursor-not-allowed text-center">Already Applied</span>
    ) : (
      <button onClick={() => handleApply(gig._id)} className="px-4 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition">Apply</button>
    )}
    <button onClick={() => navigate(`/gig/${gig._id}`)} className="px-4 py-2 bg-gray-700 text-white border-2 border-black hover:bg-gray-800 transition">View Details</button>
  </div>
</div>

                );
              })}
            </div>
          )}
        </main>

        <footer className="flex flex-col md:flex-row items-center justify-center border-t-2 border-black font-bold bg-gray-400 py-3 gap-2 md:gap-4">
          <Copyright />
          <p>2025 GigConnect. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default BrowseGigs;
