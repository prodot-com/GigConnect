import React, { useEffect, useState } from "react";
import axios from "axios";

const FreelancerProfile = () => {
  const [freelancer, setFreelancer] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    portfolio: "",
    serviceRate: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");

  // Fetch logged-in user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:9000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFreelancer(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          skills: res.data.skills ? res.data.skills.join(", ") : "",
          portfolio: res.data.portfolio || "",
          serviceRate: res.data.serviceRate || "",
        });
      } catch (err) {
        setAlert("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  // Handle input changes in edit mode
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:9000/api/users/me",
        {
          ...form,
          skills: form.skills.split(",").map((s) => s.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setFreelancer(res.data);
      setEditMode(false);
      setAlert("Profile updated successfully ");
    } catch (err) {
      setAlert(err.response?.data?.message || "Update failed ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        {/* Header Section */}
        <div className="flex items-center space-x-6 border-b pb-6">
          <div className="w-24 h-24 rounded-full bg-indigo-300 flex items-center justify-center text-3xl font-bold text-white">
            {freelancer?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-indigo-700">
              {freelancer?.name}
            </h1>
            <p className="text-gray-600">{freelancer?.email}</p>
            <p className="text-gray-600 font-semibold">
              Service Rate: ₹{freelancer?.serviceRate || "Not set"}
            </p>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <p className="text-center text-sm text-red-600 mt-3">{alert}</p>
        )}

        {/* Profile Info */}
        {!editMode ? (
          <div className="mt-6 space-y-4">
            <div>
              <h2 className="font-semibold">Portfolio</h2>
              <a
                href={freelancer?.portfolio}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {freelancer?.portfolio || "Not provided"}
              </a>
            </div>
            <div>
              <h2 className="font-semibold">Skills</h2>
              <p>{freelancer?.skills?.join(", ") || "No skills added"}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Portfolio
              </label>
              <input
                type="text"
                name="portfolio"
                value={form.portfolio}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service Rate (₹)
              </label>
              <input
                type="number"
                name="serviceRate"
                value={form.serviceRate}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FreelancerProfile;
