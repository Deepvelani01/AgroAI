import React, { useState } from 'react';
import '../index.css';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/background1.jpg';
import AgroaiImage from '../assets/Agroai.png';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('https://agroai-wc39.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        navigate('/Login');
      } else {
        setMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Network error during registration:', error);
      setMessage('Failed to connect to server. Please ensure the backend is running.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-xl max-w-lg w-full">
        <div className="flex flex-col items-center mb-6">
          <img src={AgroaiImage} alt="AgroAI Logo" className="w-32 h-auto mb-2" />
          <h2 className="text-3xl font-bold text-green-700">Create Your Account</h2>
          <p className="text-gray-600 text-sm mt-1">Join AgroAI – smarter farming starts here.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-800">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-red-500">{message}</p>
        )}

        <p className="text-center mt-6 text-sm text-gray-700">
          Already have an account?{' '}
          <Link to="/Login" className="text-green-700 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
