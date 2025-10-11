import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GigConnect_logo from '../../assets/GigConnect_logo.png';
import { Copyright } from "lucide-react";

const CreateGig = () => {
  const navigate = useNavigate();
  const [Alert, setAlert] = useState('');
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
    setAlert('')
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
      const res = await axios.post("https://gigconnect-sq1z.onrender.com/api/gigs",
        gig,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data) setAlert("Gig created successfully");
    } catch (err) {
      console.error(err.response.data.message);
      setAlert(err.response.data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
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
     
        <div className="relative z-10 min-h-screen flex flex-col font-mono">

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
            onClick={logout}
            className="px-7 py-2 border-2 border-black cursor-pointer bg-green-400 hover:bg-green-500 font-bold"
          >
            Logout
          </button>
        </div>
      </nav>

      
      <main className="flex-grow flex items-center justify-center">
  <div className="w-[90%] max-w-6xl bg-white border-2 shadow-xl p-7">
    <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
      Create a Gig
    </h2>

    {Alert && (
      <p className="text-center mt-4 font-semibold text-green-700">{Alert}</p>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
    
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="title"
          value={gig.title}
          onChange={handleChange}
          required
          className="px-2 py-2 border focus:ring-2 focus:ring-indigo-700 outline-none"
          placeholder="e.g. Website Development"
        />

        <input
          type="text"
          name="location"
          value={gig.location}
          onChange={handleChange}
          required
          className="px-4 py-2 border  focus:ring-2 focus:ring-indigo-700 outline-none"
          placeholder="Kolkata, India"
        />

        
        <input
          type="number"
          name="budget"
          value={gig.budget}
          onChange={handleChange}
          required
          className="px-4 py-2 border  focus:ring-2 focus:ring-indigo-700 outline-none"
          placeholder="500"
        />
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="skillsRequired"
          onChange={handleChange}
          className="px-4 py-2 border  focus:ring-2 focus:ring-indigo-700 outline-none"
          placeholder="React, Node.js, MongoDB"
        />

        <textarea
          name="description"
          value={gig.description}
          onChange={handleChange}
          required
          className="px-4 py-2 border  focus:ring-2 focus:ring-indigo-700 outline-none"
          placeholder="Describe the gig..."
        />
      </div>


      <button
        type="submit"
        className="w-full cursor-pointer bg-indigo-700 text-white py-2 border-2 border-black hover:bg-indigo-800 transition"
      >
        Create Gig
      </button>
    </form>
  </div>
</main>


      
      <footer className="flex items-center justify-center border-t-2 border-black font-bold bg-gray-400 py-3 mt-6">
        <Copyright />
        <p className="p-2 pl-0">2025 GigConnect. All rights reserved.</p>
      </footer>
    </div>

</div>


    // <div className="min-h-screen flex flex-col bg-gray-100 font-mono">

    //   <nav className="w-full bg-gray-100 border-b-4 border-black cursor-pointer py-4 flex justify-between items-center px-6">
    //     <h1 className="text-4xl flex font-extrabold items-center text-indigo-700">
    //       <img src={GigConnect_logo} alt="logo" className="h-15 w-auto mr-2"/>
    //       GigConnect
    //     </h1>
    //     <div className="space-x-7">
    //       <button
    //         onClick={() => navigate("/client")}
    //         className="px-7 py-2 bg-indigo-700 text-white border-2 border-black hover:bg-indigo-800 transition"
    //       >
    //         Dashboard
    //       </button>
    //       <button
    //         onClick={logout}
    //         className="px-7 py-2 border-2 border-black cursor-pointer bg-green-400 hover:bg-green-500 font-bold"
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   </nav>

      
    //   <main className="flex-grow flex items-center justify-center py-12 px-6">
    //     <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
    //       <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
    //         Create a Gig
    //       </h2>

    //       {Alert && (
    //           <p className="text-center mt-4 font-semibold text-green-700">{Alert}</p>
    //         )}

    //       <form onSubmit={handleSubmit} className="space-y-4">
    //         <div>
    //           <label className="block text-sm font-medium text-gray-700">Title</label>
    //           <input
    //             type="text"
    //             name="title"
    //             value={gig.title}
    //             onChange={handleChange}
    //             required
    //             className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-700 outline-none"
    //             placeholder="e.g. Website Development"
    //           />
    //         </div>

    //         <div>
    //           <label className="block text-sm font-medium text-gray-700">Description</label>
    //           <textarea
    //             name="description"
    //             value={gig.description}
    //             onChange={handleChange}
    //             required
    //             className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-700 outline-none"
    //             placeholder="Describe the gig..."
    //           />
    //         </div>

    //         <div>
    //           <label className="block text-sm font-medium text-gray-700">
    //             Skills Required (comma separated)
    //           </label>
    //           <input
    //             type="text"
    //             name="skillsRequired"
    //             onChange={handleChange}
    //             className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-700 outline-none"
    //             placeholder="React, Node.js, MongoDB"
    //           />
    //         </div>

    //         <div>
    //           <label className="block text-sm font-medium text-gray-700">Budget</label>
    //           <input
    //             type="number"
    //             name="budget"
    //             value={gig.budget}
    //             onChange={handleChange}
    //             required
    //             className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-700 outline-none"
    //             placeholder="500"
    //           />
    //         </div>

    //         <div>
    //           <label className="block text-sm font-medium text-gray-700">Location</label>
    //           <input
    //             type="text"
    //             name="location"
    //             value={gig.location}
    //             onChange={handleChange}
    //             required
    //             className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-700 outline-none"
    //             placeholder="Kolkata, India"
    //           />
    //         </div>

    //         <button
    //           type="submit"
    //           className="w-full cursor-pointer bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-800 transition"
    //         >
    //           Create Gig
    //         </button>

            
    //       </form>
    //     </div>
    //   </main>

      
    //   <footer className="flex items-center justify-center border-t-2 border-black font-bold bg-gray-400 py-3 mt-6">
    //     <Copyright />
    //     <p className="p-2 pl-0">2025 GigConnect. All rights reserved.</p>
    //   </footer>
    // </div>
  );
};

export default CreateGig;
