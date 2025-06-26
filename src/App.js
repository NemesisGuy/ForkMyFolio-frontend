/**
 * @fileoverview Main application component.
 * Sets up the main router, layout, and global components like Navbar and Toaster.
 * Implements lazy loading for page components.
 */
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes as ReactRoutes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Toaster } from './components/ui/sonner.jsx';
import ProtectedRoute from './components/ProtectedRoute';
// import { Skeleton } from './components/ui/skeleton.jsx'; // Example for a more specific loader

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MyProjectsPage = lazy(() => import('./pages/MyProjectsPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

/**
 * A simple page loading fallback component.
 * @returns {JSX.Element}
 */
const PageLoader = () => (
  <div className="flex justify-center items-center h-[calc(100vh-10rem)]"> {/* Adjust height as needed */}
    <p className="text-xl text-muted-foreground">Loading page...</p>
    {/* Or use Skeleton components for a more structured loader:
    <div className="container mx-auto p-4">
      <Skeleton className="h-8 w-1/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    */}
  </div>
);

/**
 * Main application component.
 * Sets up routing and global layout.
 * @returns {JSX.Element} The App component.
 */
export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />
        <Toaster richColors position="top-right" />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<PageLoader />}>
            <ReactRoutes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Authenticated Routes */}
            <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
            <Route path="/my-projects" element={<ProtectedRoute element={<MyProjectsPage />} />} />
            <Route path="/admin" element={<ProtectedRoute element={<AdminDashboardPage />} requiredRole="admin" />} />

            {/* Add more routes as needed */}
          </ReactRoutes>
          </Suspense>
        </main>
        <footer className="bg-card text-card-foreground border-t border-border p-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} ForkMyFolio. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}
