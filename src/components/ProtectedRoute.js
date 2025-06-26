import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * A component to protect routes that require authentication and optionally specific roles.
 *
 * @param {object} props - The component props.
 * @param {React.ReactElement} props.element - The React element to render if access is allowed.
 * @param {string} [props.requiredRole] - An optional role required to access the route (e.g., "admin").
 * @returns {React.ReactNode} The protected element, a redirect, or a loading indicator.
 */
const ProtectedRoute = ({ element, requiredRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You might want to render a global loading spinner here,
    // or null if App.js handles initial loading state.
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;
  }

  if (!user) {
    // User not logged in, redirect to login page
    // Pass the current location so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && (!user.roles || !user.roles.includes(requiredRole))) {
    // User is logged in but does not have the required role
    // Redirect to a "forbidden" page or home page. For now, home.
    // Consider creating a dedicated /403 page later.
    return <Navigate to="/" replace />;
  }

  // User is authenticated and (if applicable) authorized
  return element;
};

export default ProtectedRoute;
