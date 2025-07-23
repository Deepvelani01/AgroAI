import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/background1.jpg';
import stockManagementImage from '../assets/stock_management.png';
import taskManagementImage from '../assets/taskmanage.png';
import weatherImage from '../assets/weather.png';
import profile from '../assets/profile1.png';
import AgroaiImage from '../assets/Agroai.png';
import scanPlantImage from '../assets/scanplant.png';

const Icon = ({ src, alt }) => (
  <img src={src} alt={alt} className="w-16 h-16 object-contain" />
);

const Home = () => {
  const userName = "Farmer John";
  const userLocation = "Rajkot, Gujarat";

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Header */}
          <header className="bg-white/10 backdrop-blur-lg shadow-md flex justify-between items-center p-4">
        <img src={AgroaiImage} alt="AgroAI Logo" className="h-20 ml-2" />
        <div className="flex items-center space-x-6">
          <nav className="flex space-x-6">
            <Link to="/about" className="text-white hover:underline text-md">About</Link>
            <Link to="/contact" className="text-white hover:underline text-md">Contact</Link>
            <Link to="/weather" className="text-white hover:underline text-md">Weather</Link>
            <Link to="/tasks" className="text-white hover:underline text-md">Tasks</Link>
          </nav>
          <Link to="/profile" className="hover:bg-agro-green-dark rounded-full p-1 transition-colors">
            <Icon src={profile} alt="User Profile" />
          </Link>
        </div>
      </header>
           {/* Welcome Section */}
          <div className="text-center mt-8 text-white">
            <h1 className="text-3xl font-bold">Welcome, {userName}</h1>
            <p className="text-lg text-green-100">Location: {userLocation}</p>
          </div>

      

      {/* Main Content */}
      <main className="flex-grow p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mt-10">
        
        {/* Cards */}
        {[
          {
            icon: weatherImage,
            title: "Weather Report",
            text: "Current: 30°C, Sunny",
            extra: `Location: ${userLocation}`,
            link: "/weather",
            cta: "View Details"
          },
          {
            icon: scanPlantImage,
            title: "Scan Plant",
            text: "Identify diseases & pests.",
            link: "/SelectCrop",
            cta: "Start Scan"
          },
          {
            icon: taskManagementImage,
            title: "Task Management",
            text: "Upcoming: Irrigate Field 1 (Tomorrow)",
            link: "/tasks",
            cta: "View All Tasks"
          },
          {
            icon: stockManagementImage,
            title: "Stock Management",
            text: "Fertilizer: Low (10 bags)",
            link: "/stock",
            cta: "Manage Stock"
          }
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-md border border-green-200 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform"
          >
            <Icon src={card.icon} alt={card.title} />
            <h2 className="text-xl font-bold mt-4 text-green-800">{card.title}</h2>
            <p className="text-gray-700 text-sm mt-2">{card.text}</p>
            {card.extra && <p className="text-gray-600 text-sm">{card.extra}</p>}
            <Link
              to={card.link}
              className="mt-4 text-green-700 font-medium hover:underline"
            >
              {card.cta}
            </Link>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm text-gray-700 p-6 mt-12 text-center shadow-inner">
        <div className="flex flex-col items-center mb-4">
          <img src={AgroaiImage} alt="Footer Logo" className="w-20 object-contain mb-2" />
        </div>
        <p className="text-sm text-gray-500">
          Empowering farmers with AI-driven insights for smarter agriculture.
          <br />
          &copy; {new Date().getFullYear()} AgroAI. All rights reserved.
        </p>
        <div className="flex justify-center mt-3 space-x-6 text-gray-600 text-sm">
          <Link to="/about" className="hover:text-green-700">About Us</Link>
          <Link to="/contact" className="hover:text-green-700">Contact</Link>
          <Link to="/privacy" className="hover:text-green-700">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
