import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { currentUser, loading, isAuthenticated } = useContext(AuthContext);

  // Show loading state
  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if user has required role (if roles are specified)
  if (roles.length > 0 && !roles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;