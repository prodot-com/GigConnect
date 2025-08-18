import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateGig = () => {
  const navigate = useNavigate();

  const [Alert, setAlert] = useState('')

  const [gig, setGig] = useState({
    client: "",
    title: "",
    description: "",
    skillsRequired: [],
    budget: "",
    location: "",
    status: "open",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if (user) {
      setGig((prev) => ({ ...prev, client: user._id }));
    } else {
      navigate("/"); 
    }
  }, [navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;


    if (name === "skillsRequired") {
      setGig({ ...gig, [name]: value.split(",").map((s) => s.trim()) });
    } else {
      setGig({ ...gig, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      console.log(token)

      const res = await axios.post(
        "http://localhost:9000/api/gigs",
        gig,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data) {
        setAlert("Gig created successfully");
        // navigate("/client-dashboard");
      }
    } catch (err) {
      console.error(err);
      setAlert("Error creating gig");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    navigate("/");
  };

  return (
    <div className="">
      <div className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
        <h2 className="text-3xl font-bold text-indigo-700">GigConnect</h2>
        <button
          onClick={logout}
          className="px-4 py-2 cursor-pointer bg-indigo-700 text-white rounded-lg hover:bg-blue-600"
        >
          Logout
        </button>
      </div>

      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create a Gig
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={gig.title}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Website Development"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={gig.description}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Describe the gig..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skills Required (comma separated)
              </label>
              <input
                type="text"
                name="skillsRequired"
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Budget
              </label>
              <input
                type="number"
                name="budget"
                value={gig.budget}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={gig.location}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Kolkata, India"
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Create Gig
            </button>

            <div className="flex justify-center mt-6 text-xl font-medium text-blue-700">
            <h2>{Alert}</h2>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGig;
