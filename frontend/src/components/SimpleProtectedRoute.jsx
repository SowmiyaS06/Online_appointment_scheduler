import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SimpleProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no roles are required, allow access
  if (requiredRoles.length === 0) {
    return children;
  }

  // If roles are required, check if user has one of the required roles
  if (user && requiredRoles.includes(user.role)) {
    return children;
  }

  // If user doesn't have required role, redirect to unauthorized
  return <Navigate to="/unauthorized" replace />;
};

export default SimpleProtectedRoute;