import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Search, Users, ShieldCheck, Star, Copyright } from "lucide-react";
import GigConnect_logo from '../../assets/GigConnect_logo.png'

const Home = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "", portfolio: "", role: "", skills: [] });
    const [showSignin, setShowSignin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [Alert, setAlert] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "skills") {
            setForm({ ...form, skills: value.split(",").map((skill) => skill.trim()) });
        } else {
        setForm({ ...form, [name]: value });
        }
    };

    useEffect(() => {
        setAlert("");
    }, [form]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:9000/api/auth/register", form);
            setAlert(res.data.message);
        } catch (error) {
            setAlert(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
    try {
      const res = await axios.post("https://gigconnect-sq1z.onrender.com/api/auth/login", {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userDetails", JSON.stringify(res.data.user));
      setAlert(res.data.message);

      setTimeout(() => {
        if (res.data.user.role === "Client") {
          navigate("/client");
        } else {
          navigate("/freelancer-dashboard");
        }
      }, 2000);
    } catch (error) {
      setAlert("Login failed, check credentials");
    }
  };

  return (
    <div className="font-mono min-h-screen bg-gray-100 flex flex-col">
        <nav className="w-full bg-gray-100 border-b-4 border-black  py-4 flex justify-between items-center">
        <h1 className="text-4xl flex font-extrabold items-center text-indigo-700">
            <img src={GigConnect_logo} alt="logo" className="h-15 w-auto "/>GigConnect</h1>
        <div className="space-x-4">
            <button
                onClick={() => {
                setShowSignin(!showSignin);
                setShowSignup(false);
            }}
            className="px-5 py-2 border-2 border-black bg-green-400 hover:bg-green-500 font-bold"
          >
            Login
          </button>
          <button
            onClick={() => {
              setShowSignup(!showSignup);
              setShowSignin(false);
            }}
            className="px-5 mr-4 py-2 border-2 border-black bg-yellow-300 hover:bg-yellow-400 font-bold"
          >
            Sign Up
          </button>
        </div>
      </nav>
    
      <div className="flex-1 p-10">
        {!showSignin && !showSignup && (
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold text-indigo-700">Welcome to GigConnect</h1>
            <div className="flex justify-center items-center">
                <p className="font-extrabold text-xl mr-2">A hyperlocal freelance marketplace</p>
            <p> to connect clients and freelancers in your community.</p>
            </div>
            <p className="text-lg">Get started by registering or logging in.</p>


            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-10">Why Choose GigConnect?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="p-6 border-2 border-black  bg-gray-300 hover:shadow-lg transition">
                  <Search className="text-blue-600 w-10 h-10 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Easy Discovery</h3>
                  <p className="text-gray-600 text-sm">
                    Find the perfect freelancer for your project with our advanced search and filtering system.
                  </p>
                </div>
                <div className="p-6 border-2 border-black  bg-gray-300 hover:shadow-lg transition">
                  <Users className="text-blue-600 w-10 h-10 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Local Focus</h3>
                  <p className="text-gray-600 text-sm">
                    Connect with talented professionals in your local area for better collaboration.
                  </p>
                </div>
                <div className="p-6 border-2 border-black  bg-gray-300 hover:shadow-lg transition">
                  <ShieldCheck className="text-blue-600 w-10 h-10 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Secure Platform</h3>
                  <p className="text-gray-600 text-sm">
                    Built-in messaging, secure payments, and verified profiles ensure safe transactions.
                  </p>
                </div>
                <div className="p-6 border-2 border-black  bg-gray-300 hover:shadow-lg transition">
                  <Star className="text-blue-600 w-10 h-10 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Quality Assurance</h3>
                  <p className="text-gray-600 text-sm">
                    Review and rating system helps you make informed decisions and build trust.
                  </p>
                </div>

              </div>
            </section>
            <section className="bg-gray-200 border-2 hover:shadow-lg transition">
                <div className="p-15 flex flex-col 
                justify-center items-center space-y-4 ">
                    <h1 className="font-extrabold text-4xl">Ready to get started?</h1>
                    <p className="text-amber-600 font-bold p-3">Join other professionals already using GigConnect to grow.</p>
                    <button onClick={()=>{
                        setShowSignup(true)
                    }} className="bg-amber-300 p-3 border-2 border-black text-center
                    font-bold hover:bg-amber-400 ">
                        Get Started
                    </button>
                </div>
            </section>
          </div>
        )}

        {showSignin && (
          <div className="border-4 border-black bg-white p-8 max-w-lg mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            <form onSubmit={handleSignIn} className="space-y-4">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border-2 border-black px-4 py-2"
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border-2 border-black px-4 py-2"
              />
              <button type="submit" className="w-full bg-orange-400 border-2 border-black py-2 font-bold hover:bg-orange-500">
                Sign In
              </button>
              {Alert && <p className="text-center text-red-600 font-bold">{Alert}</p>}
            </form>
          </div>
        )}

        {showSignup && (
          <div className="border-4 border-black bg-white p-8 max-w-lg mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border-2 border-black px-4 py-2" />
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border-2 border-black px-4 py-2" />
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full border-2 border-black px-4 py-2" />
              <input type="string" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="Portfolio link" className="w-full border-2 border-black px-4 py-2" />
              <select name="role" value={form.role} onChange={handleChange} className="w-full border-2 border-black px-4 py-2">
                <option value="">Select Role</option>
                <option value="Client">Client</option>
                <option value="Freelancer">Freelancer</option>
              </select>
              <input type="text" name="skills" value={form.skills} onChange={handleChange} placeholder="Skills (comma separated)" className="w-full border-2 border-black px-4 py-2" />
              <button type="submit" className="w-full bg-teal-400 border-2 border-black py-2 font-bold hover:bg-teal-500">
                Sign Up
              </button>
              {Alert && <p className="text-center text-green-600 font-bold">{Alert}</p>}
            </form>
          </div>
        )}
      </div>
      
        <div className="flex items-center justify-center 
        border-t-4 border-black font-bold text-xl bg-gray-300">
            <Copyright />
            <p className="p-9 pl-0">2025 GigConnect. All rights reserved.</p>
        </div>
    </div>
  );
};

export default Home;
