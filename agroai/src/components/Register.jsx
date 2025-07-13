import React, { useState } from 'react';
import '../index.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


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
    console.log('Form submitted:', formData);
    // navigate('/Login');
    // Add your register logic (API call) here
    setMessage('')

    try {
      const response = await fetch('https://agroai-wc39.onrender.com/register',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      const data = await response.json();

      if (response.ok){
        setMessage(data.message);
        console.log('Registration Successful:', data.message);
        navigate('/Login');
      } else{
        setMessage(data.message || 'Registration failed. Please try again.')
        console.log('Registration failed', data.message);
      }
    } catch (error){
      console.error('Network error during registration:', error);
      setMessage('Failed to connect to server. Please ensure the backend is running.');
      
    }
    
  };

  return (
    
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[url('./assets/leaves.jpeg')]" 
        
    >
    <h1 className=" text-3xl font-bold text-white">AgroAI</h1>
    
    
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mt-6 ">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600 ">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

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
            Register
          </button>
        </form>
           {message && <p className="text-center mt-4 text-sm text-red-500">{message}</p>}
        <p >Already have an account   <Link to='/Login' className='text-green-600'>Login</Link>
        </p>
      </div>
    
    </div>
   
  );
}
