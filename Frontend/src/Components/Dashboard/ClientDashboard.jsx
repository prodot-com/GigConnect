import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [clientDetails, setClientDetails] = useState({});

  useEffect(() => {
    const client = JSON.parse(localStorage.getItem("userDetails"));
    setClientDetails(client || {});
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (

    <div className="min-h-screen w-full relative bg-white">
 
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(circle at center, #8fffe5, transparent)
      `,
    }}
  />
     
        <div className="relative z-10 flex flex-col min-h-screen font-mono">

      <header className="flex justify-between items-center px-6 py-4 shadow-md bg-gray-100 border-b-2">
        <h2
          className="text-2xl sm:text-3xl font-bold text-indigo-700 cursor-pointer"
          onClick={() => navigate("/")}
        >
          GigConnect
        </h2>
        <div className="space-x-3 sm:space-x-4">
          <button
            onClick={logout}
            className="px-4 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
          >
            Logout
          </button>
        </div>
      </header>

     
      <main className="flex-grow px-6 py-10 ">
        <div className="max-w-5xl mx-auto">
     
          <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
            Welcome, {clientDetails?.name || "Client"}
          </h1>

          
          <div className="bg-white shadow-md border-2 border-black p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Your Profile
            </h2>
            <p className="text-gray-600">
              <strong>Email:</strong> {clientDetails?.email || "Not available"}
            </p>
            <p className="text-gray-600">
              <strong>Role:</strong> {clientDetails?.role || "Client"}
            </p>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              className="bg-white shadow-md border-2 border-black p-6 hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate("/my-gig")}
            >
              <h3 className="text-lg font-bold text-indigo-700 mb-2">
                📋 My Gigs
              </h3>
              <p className="text-gray-600">
                View and manage all gigs you have created.
              </p>
            </div>

            <div
              className="bg-white shadow-md border-2 border-black p-6 hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate("/create-gig")}
            >
              <h3 className="text-lg font-bold text-indigo-700 mb-2">
                ✨ Create Gig
              </h3>
              <p className="text-gray-600">
                Post a new gig and connect with freelancers.
              </p>
            </div>

            {/* <div className="bg-white shadow-md border-2 border-black p-6 hover:shadow-xl transition cursor-pointer">
              <h3 className="text-lg font-bold text-indigo-700 mb-2">
                🔔 Notifications
              </h3>
              <p className="text-gray-600">
                Stay updated with new applications & updates.
              </p>
            </div> */}

            {/* <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition cursor-pointer">
              <h3 className="text-lg font-bold text-indigo-700 mb-2">
                ⚙️ Settings
              </h3>
              <p className="text-gray-600">
                Update your profile and account preferences.
              </p>
            </div> */}
          </div>
        </div>
      </main>

      
      <footer className="bg-gray-400 border-t-4 border-black font-bold text-center py-4 mt-auto">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} GigConnect. All rights reserved.
        </p>
      </footer>
    </div>

</div>

  );
};

export default ClientDashboard;
