import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Updated path

/**
 * User Profile page component.
 * Displays user information and allows editing (future).
 * @returns {JSX.Element} The ProfilePage component.
 */
const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="container mx-auto p-4">Loading profile or not authenticated...</div>;
    // Or redirect to login: return <Navigate to="/login" />; (requires Navigate from react-router-dom)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">My Profile</h1>
      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-lg"><strong className="text-card-foreground">Username:</strong> {user.username}</p>
        <p className="text-lg"><strong className="text-card-foreground">Email:</strong> {user.email}</p>
        <p className="text-lg"><strong className="text-card-foreground">Roles:</strong> {user.roles?.join(', ')}</p>
        {/* More profile details and edit functionality will go here */}
      </div>
    </div>
  );
};

export default ProfilePage;
