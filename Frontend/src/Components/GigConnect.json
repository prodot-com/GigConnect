import React, { useState } from 'react';

const mockGigs = [
  { id: 1, title: 'Logo Design for a new Cafe', description: 'Need a modern and minimalist logo for a new coffee shop. Experience with branding is a plus.', budget: 150, location: 'Downtown', skills: ['Graphic Design', 'Logo Design', 'Branding'] },
  { id: 2, title: 'Build a simple landing page', description: 'Looking for a developer to create a responsive one-page website for a local bakery.', budget: 300, location: 'Uptown', skills: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { id: 3, title: 'Content Writer for a Tech Blog', description: 'Seeking a writer to produce 4 articles per month on the topic of AI and machine learning.', budget: 400, location: 'Remote', skills: ['Writing', 'SEO', 'Tech'] },
  { id: 4, title: 'Social Media Manager', description: 'Manage Instagram and Facebook accounts for a small fashion boutique. Must have experience with content creation and scheduling.', budget: 250, location: 'Midtown', skills: ['Social Media', 'Marketing', 'Content Creation'] },
];

const mockFreelancer = {
  name: 'Jane Doe',
  title: 'Full-Stack Web Developer',
  location: 'Uptown',
  rate: '$50/hr',
  skills: ['React', 'Node.js', 'Express', 'MongoDB', 'UI/UX Design'],
  portfolio: [
    { id: 1, title: 'E-commerce Site', description: 'Built a full-featured online store for a local artist.' },
    { id: 2, title: 'Booking System', description: 'Developed a reservation system for a restaurant.' },
  ],
  reviews: [
    { id: 1, client: 'Coffee House', rating: 5, comment: 'Jane was amazing! Delivered a fantastic logo ahead of schedule.' },
  ]
};

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const MoneyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8.433 7.418c.158-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.134 0V7.418zM11.567 7.151c.22.071.409.164.567.267v1.698a2.5 2.5 0 01-1.134 0V7.151z" />
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.5 4.5 0 00-1.876.654l.26.953a3.5 3.5 0 011.616-.52V9a3.5 3.5 0 01-1.616.52l-.26.953A4.5 4.5 0 008 11.092V12a1 1 0 102 0v-.092a4.5 4.5 0 001.876-.654l-.26-.953a3.5 3.5 0 01-1.616.52V9a3.5 3.5 0 011.616-.52l.26-.953A4.5 4.5 0 0012 6.908V6a1 1 0 10-2 0v.092z" clipRule="evenodd" />
  </svg>
);

function Header({ setPage }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div onClick={() => setPage('home')} className="text-2xl font-bold text-indigo-600 cursor-pointer">
          GigConnect
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" onClick={() => setPage('gigs')} className="text-gray-600 hover:text-indigo-600">Find Gigs</a>
          <a href="#" onClick={() => setPage('profile')} className="text-gray-600 hover:text-indigo-600">My Profile</a>
          <a href="#" onClick={() => setPage('chat')} className="text-gray-600 hover:text-indigo-600">Messages</a>
          <button onClick={() => setPage('login')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
            Log In
          </button>
          <button onClick={() => setPage('register')} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-6 py-4 text-center text-gray-600">
        <p>&copy; 2025 GigConnect. All rights reserved.</p>
      </div>
    </footer>
  );
}

function Home({ setPage }) {
  return (
    <div className="text-center py-16 px-4 bg-gray-50">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Find Local Freelance Talent</h1>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        GigConnect is the easiest way to find skilled freelancers in your community for any project.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <button onClick={() => setPage('gigs')} className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">
          Browse Gigs
        </button>
        <button onClick={() => setPage('post-gig')} className="px-8 py-3 text-lg font-semibold text-indigo-600 bg-white border border-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 transition duration-300">
          Post a Gig
        </button>
      </div>
    </div>
  );
}

function Login({ setPage }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Log in to your account</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
            <input id="email" name="email" type="email" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
              Log In
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <a href="#" onClick={() => setPage('register')} className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
