import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios'

const Home = () => {
    const [form, setForm] = useState({ name: "",email: "", password: "", portfolio: "", role: "", skills: []});
    const [showSignin, setShowSignin] = useState(false)
    const [showSignup, setShowSignup] = useState(false)
    const [Alert, setAlert ] = useState('')


    const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "skills") {
        

        setForm({ ...form, skills: value.split(",").map(skill => skill.trim()) });
    } else {
        setForm({ ...form, [name]: value });
    }
};

    useEffect(()=>{
        setAlert('')
    },[form])

    const handleSignUp = async (e)=>{
        e.preventDefault()
        try {
            console.log("Submitting form:", form);
            const res = await axios.post("http://localhost:9000/api/auth/register",
                form
            )

            console.log(res)
            setAlert(res.data.message)

        } catch (error) {
            setAlert(error.response.data.message)
        }
    }


    const handleSignIn = async (e)=>{

        e.preventDefault()

        try {
        
            // console.log('SignIn Form:', form  )
            const res = await axios.post("http://localhost:9000/api/auth/login",
                {
                    email: form.email,
                    password: form.password
                }
            )

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            console.log(res.data)
            setAlert(res.data.message)

        } catch (error) {
            console.log(error)
            setAlert('Login failed, Check credentials')
        }

    }

    return (
    <div className='font-mono '>
        <div className="flex justify-between items-center px-6 py-4 shadow-md">
        <h2 className="text-3xl font-bold">GigConnect</h2>

        <div className="space-x-4">
            <button onClick={()=>setShowSignin(!showSignin)} className="px-4 py-2 cursor-pointer bg-indigo-700 text-white rounded-lg hover:bg-blue-600">
            Login
            </button>
            <button onClick={()=>{
                setShowSignin(false),
                setShowSignup(!showSignup)
            }} className="px-4 py-2 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600">
            Sign Up
            </button>
        </div>
        </div>
        
        {showSignin ? (<div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>
        <p className="text-center text-gray-500 mb-6">Welcome back to GigConnect</p>

        <form onSubmit={handleSignIn} className="space-y-4">
            <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="you@example.com"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="********"
            />
            </div>


            <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
            Sign In
            </button>

            <div className="flex justify-center mt-6 text-xl font-medium text-gray-700">
            <h2>{Alert}</h2>
        </div>
        </form>

        {/* <p className="text-sm text-center text-gray-500 mt-6">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
            Sign Up
            </a>
        </p> */}
        </div>
    </div>) : showSignup? (<div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign Up</h2>
        <p className="text-center text-gray-500 mb-6">Welcome to GigConnect</p>

        <form onSubmit={handleSignUp} className="space-y-4">

            <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
                type="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="you@example.com"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="you@example.com"
            />
            </div>


            <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="********"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Portfolio</label>
            <input
                type="portfolio"
                name="portfolio"
                value={form.portfolio}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="you@example.com"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
                <option value="">Select a role</option>
                <option value="Client">Client</option>
                <option value="Freelancer">Freelancer</option>
            </select>
</div>


            <div>
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <input
                type="skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                required
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="you@example.com"
            />
            </div>

            <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
            Sign Up
            </button>
        </form>

        <div className="flex justify-center mt-6 text-xl font-medium text-gray-700">
            <h2>{Alert}</h2>
        </div>

        {/* <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <a onClick={()=>{
                setShowSignup(false),
                setShowSignin(true)
            }} className="text-blue-600 hover:underline">
            Sign In
            </a>
        </p> */}
        </div>
    </div>)
    :
        (<div>
            <div className='flex flex-col mt-28
            items-center h-screen space-y-5 text-center'>
            <h1 className='text-3xl font-bold pb-7 text-indigo-700'>Welcome to GigConnect</h1>
            <p className='text-2xl'>A hyperlocal freelance marketplace to connect clients and freelancers in your community.</p>
            <p className='text-2xl'>Get started by Registering or Logging in.</p>
            </div>
        </div>
    )}
    </div>
    )
}

export default Home
