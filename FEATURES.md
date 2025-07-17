# ForkMyFolio - Frontend Feature List

This document outlines the key features and architectural highlights of the ForkMyFolio Vue.js frontend application.

## Core Architecture

- **Vue 3 & Composition API**: The entire application is built using the modern Composition API, leading to better code organization, reusability, and maintainability.
- **Vite Build Tool**: Provides a lightning-fast development server and optimized production builds.
- **Service-as-Store Pattern**: Global state (like user authentication) is managed in reactive service files (e.g., `authService.js`), avoiding the need for a heavy-weight state management library like Vuex or Pinia.
- **Centralized API Client**: A single `apiClient.js` handles all communication with the backend. It's responsible for:
  - Attaching the JWT `Authorization` header to all necessary requests.
  - Intercepting `401 Unauthorized` responses to trigger an automatic and seamless token refresh.
  - Preventing token refresh race-conditions when multiple API calls fail at once.

## Admin Panel

- **Secure Routing**: The `router/index.js` file uses navigation guards (`beforeEnter`) to protect all `/admin` routes, ensuring only authenticated and authorized users can access them.
- **Comprehensive CRUD Interfaces**: Every manageable content type (Profile, Projects, Skills, etc.) has a dedicated set of Vue components for creating, reading, updating, and deleting data.
- **Statistics Dashboard (`AdminStats.vue`)**:
  - Visualizes all analytics data from the `/api/v1/admin/stats` endpoint.
  - Uses a reusable `StatCard.vue` component for a clean and consistent UI.
  - Intelligently maps project UUIDs (from stats) to project names (from the projects list) for a user-friendly display.
- **Interactive Forms**: All forms include client-side validation and provide clear feedback to the user on success or failure.

## Public Portfolio

- **Fully Dynamic Rendering**: All content is fetched from the backend API, meaning no hardcoded portfolio data exists in the frontend code.
- **Component-Based Structure**: The public page is built from modular components (`HeroSection.vue`, `ProjectsSection.vue`, etc.) that are dynamically shown or hidden based on the settings fetched from the backend.
- **PDF Generation**: Integrates a library (like jsPDF) to create a downloadable PDF resume from the dynamic portfolio data.

## Authentication Flow

- **Login/Register/Logout**: Provides clear and simple forms for all standard authentication actions.
- **Session Initialization (`initAuth`)**: On application startup, the `authService` automatically attempts to refresh the user's session.
- **Live Profile Updates**: After a successful session refresh, it fetches the latest user profile from the server, ensuring that any changes made (e.g., name update) are immediately reflected in the UI without needing to log out and back in.
- **Reactive State**: The user's authentication status (`isAuthenticated`) and profile data (`user`) are reactive Vue `ref`s, meaning any component using them will automatically update when they change.