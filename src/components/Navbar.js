import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Updated path
import { Button } from './ui/button'; // Updated path
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // For user avatar
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"; // For user dropdown
import { toast } from 'sonner';
import { logoutUser as apiLogout } from '../services/api'; // Updated path

/**
 * Navigation bar component.
 * Displays navigation links appropriate to user authentication state.
 * @returns {JSX.Element} The Navbar component.
 */
const Navbar = () => {
  const { user, logout: contextLogout, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (token) {
        await apiLogout(token); // Call backend logout if implemented
      }
    } catch (error) {
      // Log error but proceed with client-side logout
      console.error("Backend logout failed:", error);
    } finally {
      contextLogout(); // Clears client-side auth state
      toast.success('Logged out successfully.');
      navigate('/login');
    }
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="text-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-card text-card-foreground shadow-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
              ForkMyFolio
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/skills">Skills</NavLink>
            <NavLink to="/contact">Contact</NavLink>

            {user ? (
              <>
                {user.roles?.includes('admin') && (
                  <NavLink to="/admin">Admin</NavLink>
                )}
                {/* Placeholder for Avatar Dropdown */}
                <div className="flex items-center space-x-2">
                   {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                          <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.username}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link to="/profile">Profile</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to="/my-projects">My Projects</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                  <NavLink to="/profile">{user.username || 'Profile'}</NavLink>
                  <Button variant="ghost" onClick={handleLogout} size="sm">
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Button asChild size="sm">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          {/* TODO: Mobile menu button and drawer/panel */}
          <div className="md:hidden">
            {/* Mobile Menu Button Placeholder */}
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
