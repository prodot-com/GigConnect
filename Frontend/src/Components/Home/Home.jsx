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

    useEffect(() => setAlert(""), [form]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://gigconnect-sq1z.onrender.com/api/auth/register", form);
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
                if (res.data.user.role === "Client") navigate("/client");
                else navigate("/freelancer-dashboard");
            }, 2000);
        } catch (error) {
            setAlert("Login failed, check credentials");
        }
    };

    return (
        <div className="min-h-screen w-full bg-white relative">
           
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)`,
                    backgroundSize: "100% 100%",
                }}
            />

            <div className="relative z-10 font-mono min-h-screen flex flex-col">
                
                <nav className="w-full bg-gray-100 border-b-4 border-black py-4 flex flex-col sm:flex-row justify-between items-center px-4 sm:px-10">
                    <h1 className="text-3xl sm:text-4xl flex font-extrabold items-center text-indigo-700 mb-2 sm:mb-0">
                        <img src={GigConnect_logo} alt="logo" className="h-10 sm:h-15 w-auto mr-2"/>GigConnect
                    </h1>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => { setShowSignin(!showSignin); setShowSignup(false); }}
                            className="px-5 py-2 border-2 border-black bg-green-400 hover:bg-green-500 font-bold w-full sm:w-auto"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { setShowSignup(!showSignup); setShowSignin(false); }}
                            className="px-5 py-2 border-2 border-black bg-yellow-300 hover:bg-yellow-400 font-bold w-full sm:w-auto"
                        >
                            Sign Up
                        </button>
                    </div>
                </nav>

                
                <div className="flex-1 p-4 sm:p-10">
                    {!showSignin && !showSignup && (
                        <div className="text-center space-y-6 sm:space-y-8">
                            <h1 className="text-3xl sm:text-4xl font-bold text-indigo-700">Welcome to GigConnect</h1>
                            <div className="flex flex-col sm:flex-row justify-center items-center text-base sm:text-lg">
                                <p className="font-extrabold mr-0 sm:mr-2 mb-2 sm:mb-0">A hyperlocal freelance marketplace</p>
                                <p>to connect clients and freelancers in your community.</p>
                            </div>
                            <p className="text-base sm:text-lg">Get started by registering or logging in.</p>

                            
                            <section className="mt-8 sm:mt-16">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10">Why Choose GigConnect?</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                                    {[{
                                        icon: <Search className="text-blue-600 w-10 h-10 mx-auto mb-4"/>,
                                        title: "Easy Discovery",
                                        desc: "Find the perfect freelancer for your project with our advanced search and filtering system."
                                    }, {
                                        icon: <Users className="text-blue-600 w-10 h-10 mx-auto mb-4"/>,
                                        title: "Local Focus",
                                        desc: "Connect with talented professionals in your local area for better collaboration."
                                    }, {
                                        icon: <ShieldCheck className="text-blue-600 w-10 h-10 mx-auto mb-4"/>,
                                        title: "Secure Platform",
                                        desc: "Built-in messaging, secure payments, and verified profiles ensure safe transactions."
                                    }, {
                                        icon: <Star className="text-blue-600 w-10 h-10 mx-auto mb-4"/>,
                                        title: "Quality Assurance",
                                        desc: "Review and rating system helps you make informed decisions and build trust."
                                    }].map((item, idx) => (
                                        <div key={idx} className="p-4 sm:p-6 border-2 border-black bg-gray-300 hover:shadow-lg transition">
                                            {item.icon}
                                            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                            <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            
                            <section className="bg-gray-200 border-2 hover:shadow-lg transition mt-8 sm:mt-16 p-6 sm:p-10">
                                <div className="flex flex-col justify-center items-center space-y-4">
                                    <h1 className="font-extrabold text-3xl sm:text-4xl">Ready to get started?</h1>
                                    <p className="text-amber-600 font-bold">Join other professionals already using GigConnect to grow.</p>
                                    <button
                                        onClick={()=> setShowSignup(true)}
                                        className="bg-amber-300 p-3 border-2 border-black font-bold hover:bg-amber-400 w-full sm:w-auto"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            </section>
                        </div>
                    )}

                    
                    {showSignin && (
                        <div className="border-4 border-black bg-white p-6 sm:p-8 max-w-md mx-auto mt-6 sm:mt-10">
                            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
                            <form onSubmit={handleSignIn} className="space-y-4">
                                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border-2 border-black px-4 py-2" />
                                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full border-2 border-black px-4 py-2" />
                                <button type="submit" className="w-full bg-orange-400 border-2 border-black py-2 font-bold hover:bg-orange-500">
                                    Sign In
                                </button>
                                {Alert && <p className="text-center text-red-600 font-bold">{Alert}</p>}
                            </form>
                        </div>
                    )}

                    
                    {showSignup && (
                        <div className="border-4 border-black bg-white p-6 sm:p-8 max-w-md mx-auto mt-6 sm:mt-10">
                            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border-2 border-black px-4 py-2" />
                                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border-2 border-black px-4 py-2" />
                                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full border-2 border-black px-4 py-2" />
                                <input type="text" name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="Portfolio link" className="w-full border-2 border-black px-4 py-2" />
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

                
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between border-t-4 border-black font-bold text-lg sm:text-xl bg-gray-300 p-4 sm:px-10">
                    <Copyright />
                    <p className="p-2 sm:p-0">2025 GigConnect. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
