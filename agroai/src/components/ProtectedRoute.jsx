import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import useAuth hook

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Get authentication status from context

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    // 'replace' prop replaces the current entry in the history stack,
    // so the user can't go back to the protected page using the browser's back button.
    return <Navigate to="/Login" replace />;
  }

  // If authenticated, render the children (the protected component)
  return children;
};

export default ProtectedRoute;
