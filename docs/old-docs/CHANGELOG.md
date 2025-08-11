# Changelog

All notable changes to this project will be documented in this file.

---

## [1.0.0] - Initial Release

This is the first stable, feature-complete release of ForkMyFolio. This version establishes the core platform for creating, managing, and showcasing a professional portfolio.

### ✨ Features

-   **Full Public Portfolio**: A completely dynamic and responsive public-facing site with dedicated pages for:
    -   Homepage / Profile Summary
    -   Projects Showcase with Detail Pages
    -   Skills & Proficiencies
    -   Work Experience Timeline
    -   Qualifications & Certifications
    -   Testimonials
    -   Contact Form
-   **Powerful Admin Dashboard**: A secure, centralized hub for all content management.
-   **Complete CRUD Operations**: Full Create, Read, Update, and Delete functionality for all portfolio sections: Profile, Projects, Skills, Experience, Qualifications, and Testimonials.
-   **Live Site Configuration**:
    -   **Visibility Settings**: Instantly show or hide entire portfolio sections from the public view.
    -   **PDF Settings**: Choose the default PDF template used for the public download button.
-   **Visitor Analytics**: A dashboard to view site engagement metrics, including page views, contact form submissions, and PDF downloads.
-   **Contact Message Inbox**: An interface to read and manage messages submitted through the contact form.
-   **Backup & Restore**: A powerful utility to download a full JSON backup of all portfolio data and restore it from a file.
-   **Secure Authentication**: Robust JWT-based authentication with a secure `HttpOnly` refresh token strategy.

### 🚀 Enhancements & User Experience

-   **Premium Glassmorphic UI**: A modern, theme-adaptive (light/dark) design system with fluid animations, hover effects, and a consistent look and feel across all pages.
-   **Dynamic PDF Generation**: Visitors can download a polished PDF version of the portfolio, with the template selectable by the admin.
-   **Fully Responsive Design**: The entire application, from the public portfolio to the admin dashboard, is optimized for all screen sizes.
-   **Performance Optimization**: Implemented lazy loading for all routes to ensure fast initial page loads.
-   **Interactive Feedback**: All forms provide clear, client-side validation and use modals for success and error feedback.

### ⚙️ Architecture & Technical

-   **Full-Stack Platform**: Built on a modern stack featuring Vue 3 (Composition API) for the frontend and Java 21 with Spring Boot 3 for the backend.
-   **Service-as-Store Pattern**: Centralized and reactive state management for authentication and settings without a heavy library.
-   **Dockerized Deployment**: The entire application (frontend, backend, database) is containerized with Docker for easy, reproducible deployment.