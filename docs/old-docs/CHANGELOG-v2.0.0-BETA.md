# Changelog - v2.0.0-BETA

This version marks a significant architectural and visual overhaul of the frontend application, focusing on a more modern user experience, improved state management, and more robust features.

### ✨ Features

-   **New Download Center**: The public portfolio page now features a multi-file download button group, allowing visitors to download the portfolio as a PDF, a Markdown file, or a vCard contact file.
-   **Data & Exports Dashboard Card**: A new "Data & Exports" card has been added to the user dashboard, providing a clear entry point for managing downloadable assets.
-   **User-Facing Export Page**: Added a dedicated 'Data & Exports' page for authenticated users to download their portfolio files (PDF, Markdown, vCard).

### 🚀 Enhancements & User Experience

-   **Complete UI Overhaul**: Implemented a premium "glassmorphic" design across the entire application, including cards, modals, and the navigation bar, for a sleek, modern, and theme-aware aesthetic.
-   **Enhanced Animations**: Added fluid `fade-in-up` animations and interactive lift/shadow effects to all cards and buttons for a more dynamic and engaging user experience.
-   **Slug-Based URLs**: All user-facing and management pages now use a user-specific slug (e.g., `/:slug/manage/dashboard`), creating cleaner, more personalized URLs.
-   **User-Facing Export Page**: Added a dedicated 'Data & Exports' page for authenticated users to download their portfolio files (PDF, Markdown, vCard).
-   **Resolved a critical bug**  where file downloads (PDF, etc.) would fail due to the API client attempting to parse file data as JSON.
-   **Fixed an issue**  where downloaded files had a trailing underscore in their filename due to an imprecise regex.

### ⚙️ Architecture & Technical

-   **Centralized State Management**: Introduced a Pinia-like store (`usePublicPortfolioStore`) to manage the state of the public-facing portfolio, eliminating redundant API calls and ensuring data consistency across pages.
-   **Refactored API Services**: Split API functions into logical modules (`public.api.js`, `user.api.js`, `admin.api.js`) for better organization and maintenance.
-   **Reusable Composables & Utilities**: Created a `usePortfolioDownloader` composable and a `downloadUtils.js` utility to centralize and streamline file download logic.
-   **Robust Routing Guard**: The `beforeEach` navigation guard in `router/index.js` now intelligently fetches data based on the route context, ensuring the portfolio store is always correctly populated.

### 🐞 Bug Fixes

-   Resolved a critical bug where file downloads (PDF, etc.) would fail due to the API client attempting to parse file data as JSON.
-   Fixed an issue where downloaded files had a trailing underscore in their filename due to an imprecise regex.