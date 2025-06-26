import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * @typedef {object} User
 * @property {string} id - User ID.
 * @property {string} username - Username.
 * @property {string} email - User email.
 * @property {string[]} roles - User roles (e.g., ['user', 'admin']).
 */

/**
 * @typedef {object} AuthContextType
 * @property {User|null} user - The current authenticated user, or null if not authenticated.
 * @property {string|null} token - The JWT token.
 * @property {boolean} isLoading - Whether the authentication state is currently being loaded.
 * @property {(userData: User, token: string) => void} login - Function to log in a user.
 * @property {() => void} logout - Function to log out a user.
 */

/**
 * Context for managing authentication state.
 * @type {React.Context<AuthContextType|undefined>}
 */
const AuthContext = createContext(undefined);

/**
 * Provider component for the AuthContext.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The AuthProvider component.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load token and user from localStorage on initial load
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Logs in a user and stores token and user data.
   * @param {User} userData - The user data.
   * @param {string} authToken - The JWT token.
   */
  const login = (userData, authToken) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  /**
   * Logs out the current user and clears token and user data.
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    // Here you might also want to call the backend /api/v1/auth/logout endpoint
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the AuthContext.
 * @returns {AuthContextType} The authentication context.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
