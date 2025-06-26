import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Updated path
import { loginUser } from '../services/api'; // Updated path
import { Button } from '../components/ui/button'; // Updated path
import { Input } from '../components/ui/input.jsx'; // Updated path
import { Label } from '../components/ui/label.jsx'; // Updated path
import { toast } from 'sonner';

/**
 * Login page component.
 * Handles user login form and authentication.
 * @returns {JSX.Element} The LoginPage component.
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { login: contextLogin, user: authUser } = useAuth();

  const from = location.state?.from?.pathname || '/';

  // If user is already logged in, redirect them
  React.useEffect(() => {
    if (authUser) {
      navigate(from, { replace: true });
    }
  }, [authUser, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser({ email, password });
      // Assuming the API returns { user: UserDetails, token: string }
      // And UserDetails contains { id, username, email, roles }
      // The actual structure of `data.user` needs to match what AuthContext expects.
      // For now, I'm assuming data itself is the user object and data.token is the token.
      // This needs to be confirmed with backend response structure.
      // A typical response might be: { "token": "...", "user": { "id": "...", "username": "...", "email": "...", "roles": ["user"] } }

      if (!data.user || !data.token) {
        console.error("Login response missing user or token:", data);
        throw new Error("Login failed: Invalid response from server.");
      }
      contextLogin(data.user, data.token);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login page error:", err);
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-primary">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              aria-invalid={!!error}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              aria-invalid={!!error}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="text-sm text-center mt-6 text-muted-foreground">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="font-medium text-primary hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
