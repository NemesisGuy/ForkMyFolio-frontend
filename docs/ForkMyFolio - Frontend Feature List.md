# ForkMyFolio - Frontend Feature List

This document outlines the key features and architectural highlights of the ForkMyFolio Vue.js frontend application.

## Core Architecture

- **Vue 3 & Composition API**: The entire application is built using the modern Composition API, leading to better code organization, reusability, and maintainability.
- **Vite Build Tool**: Provides a lightning-fast development server and optimized production builds.
- **Service-as-Store Pattern**: Global state (like user authentication and application settings) is managed in reactive service files (e.g., `authService.js`, `settingsService.js`). This avoids the need for a heavy-weight state management library like Vuex or Pinia while providing centralized, reactive state management.
- **Centralized API Client**: A single `apiClient.js` handles all communication with the backend. It's responsible for:
    - Attaching the JWT `Authorization` header to all necessary requests.
    - Intercepting `401 Unauthorized` responses to trigger an automatic and seamless token refresh.
    - Preventing token refresh race-conditions when multiple API calls fail at once.

## Global Settings Management

A key feature is the robust, application-wide settings management handled by `settingsService.js`.

- **Centralized Hub**: The service acts as the single source of truth for all application settings.
- **Initial Fetch**: On application load, it fetches all public settings from the backend (`/api/v1/settings`) and stores them in a reactive map.
- **Reactive Access**: Components can easily access settings reactively. For example, `Navbar.vue` uses a computed property `settingsService.isEnabled.value('SHOW_PROJECTS')` to dynamically show or hide navigation links.
- **Live Updates**: Admin pages can push updates to the service after saving changes. The service intelligently merges these (even partial) updates, and all components across the application that depend on those settings will update instantly without a page reload.

## Admin Panel

A central dashboard (`AdminDashboardPage.vue`) provides access to all management functions.

-   **Secure Routing**: The `router/index.js` file uses navigation guards (`beforeEnter`) to protect all `/admin` routes, ensuring only authenticated and authorized users can access them.
-   **Comprehensive CRUD Interfaces**: Every manageable content type has a dedicated set of Vue components for creating, reading, updating, and deleting data:
    -   Portfolio Profile
    -   Projects
    -   Skills
    -   Experience
    -   Qualifications
    -   Testimonials
-   **Live Site Configuration**:
    -   **Visibility Settings (`AdminVisibilitySettings.vue`)**: Allows for real-time toggling of public portfolio sections.
    -   **PDF Settings (`AdminPdfSettings.vue`)**: Lets the admin select the default PDF template for public downloads.
-   **Statistics Dashboard (`AdminStats.vue`)**:
    -   Visualizes all analytics data from the `/api/v1/admin/stats` endpoint.
    -   Uses a reusable `StatCard.vue` component for a clean and consistent UI.
    -   Intelligently maps project UUIDs (from stats) to project names (from the projects list) for a user-friendly display.
-   **Contact Message Inbox**: A dedicated page to view and manage messages submitted through the public contact form.
-   **Backup & Restore (`AdminBackupRestore.vue`)**: A powerful utility to download a full JSON backup of all portfolio data and restore it from a file, ensuring data safety and portability.
-   **Interactive Forms**: All forms include client-side validation and provide clear feedback to the user on success or failure using dedicated modal components.

## Public Portfolio

- **Fully Dynamic Rendering**: All content is fetched from the backend API. All sections (`Projects`, `Skills`, etc.) are dynamically shown or hidden based on the settings managed by the `settingsService`.
- **Dynamic PDF Generation**: The homepage features a prominent download button that generates a PDF of the portfolio.
    - The PDF template used (e.g., "modern", "classic") is not hardcoded; it's determined by the `DEFAULT_PDF_TEMPLATE` setting fetched from the backend.
    - The download button itself is only rendered if a profile exists and the default template setting is configured, preventing user-facing errors.

## Authentication Flow

- **Login/Register/Logout**: Provides clear and simple forms for all standard authentication actions.
- **Session Initialization (`initAuth`)**: On application startup, the `authService` automatically attempts to refresh the user's session.
- **Live Profile Updates**: After a successful session refresh, it fetches the latest user profile from the server, ensuring that any changes made (e.g., name update) are immediately reflected in the UI without needing to log out and back in.
- **Reactive State**: The user's authentication status (`isAuthenticated`) and profile data (`user`) are reactive Vue `ref`s, meaning any component using them will automatically update when they change.