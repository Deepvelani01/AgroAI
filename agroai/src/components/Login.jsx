import React, { useState } from 'react';
import '../index.css'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
    const [formData, setFormData] = useState({
        
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
    setMessage('')
    try {
      const response = await fetch('https://agroai-wc39.onrender.com/login', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok){
        setMessage('Login successfil!');
        console.log('Login successful:', data);

        localStorage.setItem('access_token', data.access_token);
        navigate('/Home');
      } else{
        setMessage(data.message || 'Login failed. Invalid credentials.');
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Network error during login:', error);
      setMessage('Failed to connect to the server. Please ensure the backend is running.');
    } 

    // Add your register logic (API call) here
  };
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[url('./assets/leaves.jpeg')]" 
        
    >
    <h1 className=" text-3xl font-bold text-white">AgroAI</h1>
    
    
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mt-6 ">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600 ">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
        {message && <p className="text-center mt-4 text-sm text-red-500">{message}</p>}
        <p>
        You Don't have an account?{' '}
        <Link to="/">
           <button className='text-green-600'>
             Register
           </button>
        </Link>
        
      </p>
      </div>
    
    </div>
  )
}

export default Login
