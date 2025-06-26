# ForkMyFolio Frontend

This is the React-based frontend for ForkMyFolio, a digital portfolio platform.

## Project Overview

ForkMyFolio allows users to showcase their projects and skills. This frontend application provides the user interface for interacting with the platform, including public browsing, user authentication, profile management, and (for admins) content management.

## Tech Stack & Key Libraries

*   **React**: Latest stable version (using JavaScript, not TypeScript).
*   **React Router**: For client-side routing.
*   **Tailwind CSS**: For styling.
*   **shadcn/ui**: For UI components, built on top of Radix UI and Tailwind CSS.
*   **JSDoc**: For code documentation.
*   **Jest & React Testing Library**: For unit and component testing (Note: Test execution faced environment issues during development).
*   **Context API & React Hooks**: For state management (e.g., `AuthContext`).

## Features

*   **Public Pages**:
    *   Home
    *   Projects List
    *   Skills List
    *   Contact Form
    *   Login & Signup
*   **Authenticated Pages**:
    *   User Profile
    *   My Projects (placeholder, for users to manage their own projects)
    *   Admin Dashboard (placeholder, for admins to manage platform projects & skills)
*   **Authentication**: JWT-based authentication with tokens stored in `localStorage`.
*   **Styling**: Modern, responsive design using Tailwind CSS and shadcn/ui components. Mobile-first approach considered.
*   **Routing**: Client-side routing managed by React Router.
*   **API Integration**: Connects to a backend REST API for data.
*   **Code Quality**:
    *   Well-commented code with JSDoc annotations.
    *   Reusable UI components.
    *   Code splitting via `React.lazy` for route-based lazy loading.
*   **Error Handling**: User-friendly error messages and toast notifications (using `sonner`).
*   **Loading States**: UI feedback for asynchronous operations (e.g., form submissions, page loads, future data fetching).

## Project Structure

```
/public
  index.html
  ...other static assets
/src
  /assets
    (global assets if any, e.g. images - currently empty)
  /components
    /ui (shadcn/ui components, e.g., button.jsx, input.jsx)
    Navbar.js
    ProtectedRoute.js
    ...other shared components
  /contexts
    AuthContext.js
    ...other contexts
  /hooks
    (custom hooks - currently empty)
  /pages
    HomePage.js
    LoginPage.js
    ProjectsPage.js
    ...other page components
  /services
    api.js
    ...other API service modules
  /utils
    cn.js
    ...other utility functions
  App.js (main app component with routing)
  index.css (global styles, Tailwind directives)
  index.js (entry point)
components.json (shadcn/ui configuration)
jsconfig.json (for absolute imports like @/components)
tailwind.config.js
postcss.config.js
...other configuration files
```

## Getting Started

### Prerequisites

*   Node.js (version 16.x or later recommended)
*   npm (usually comes with Node.js)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd forkmyfolio-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

The application expects the backend API URL to be available via an environment variable. Create a `.env` file in the root of the project:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
```

Replace `http://localhost:5000/api/v1` with the actual URL of your running backend API if it's different. If this variable is not set, the app will default to `/api/v1` which assumes the frontend is served from the same domain as the backend or a proxy is set up.

### Running the Development Server

To start the application in development mode:

```bash
npm start
```

This will open the application in your default web browser, usually at `http://localhost:3000`. The page will reload if you make edits.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

This command bundles React in production mode and optimizes the build for the best performance. The build artifacts will be stored in the `build/` directory.

### Running Tests

To run the test suite (if environment issues are resolved):

```bash
npm test
```

Or, to run a specific test file:

```bash
npm test -- src/path/to/your/test-file.test.js --watchAll=false
# For example, to run the cn.test.js (if clsx module resolution is fixed):
# npx react-scripts test src/utils/cn.test.js --watchAll=false
```

**Note on Testing Environment:** During development, there were persistent issues with Jest's module resolution in the provided sandbox environment, specifically for `clsx` and `react` modules. The test files are written but could not be successfully run. This might require environment-specific troubleshooting (e.g., related to symlinks, `npx` behavior, or npm installation within the sandbox).

## API Integration Points

The frontend is designed to integrate with the following backend API endpoints (as per initial project description):

*   `POST /api/v1/auth/login`
*   `POST /api/v1/auth/logout`
*   `GET /api/v1/users/me/profile`
*   `GET /api/v1/projects`
*   `POST /api/v1/projects` (admin only)
*   `PUT /api/v1/projects/{id}` (admin only)
*   `DELETE /api/v1/projects/{id}` (admin only)
*   `GET /api/v1/skills`
*   `POST /api/v1/skills` (admin only)
*   `DELETE /api/v1/skills/{id}` (admin only)
*   `POST /api/v1/contact-messages`

(Further API integration for these endpoints is pending).

## Future Enhancements / To-Do

*   Complete API integration for all features (Projects, Skills, Contact form submission, Signup).
*   Implement full functionality for authenticated user areas (`MyProjectsPage`, `AdminDashboardPage`).
*   Develop the Signup page and its API integration.
*   Add mobile-responsive navigation (e.g., hamburger menu).
*   Implement user avatar display and dropdown menu in the Navbar.
*   Refine loading states with more detailed skeleton components where appropriate.
*   Add a dedicated "403 Forbidden" or "Not Authorized" page.
*   Resolve testing environment issues to ensure all unit tests can run.
*   Consider more advanced form validation if needed (e.g., using `react-hook-form`).
*   Implement dark mode theme switching if `sonner`'s current theme detection is not sufficient or a manual toggle is desired.

This README provides a comprehensive overview of the ForkMyFolio frontend project.
