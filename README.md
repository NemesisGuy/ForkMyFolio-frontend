# ForkMyFolio 🚀

**Your Professional Portfolio, Reimagined. A full-stack, open-source portfolio platform you can deploy and own.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://forkmyfolio.nemesisnet.co.za)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-blue?style=for-the-badge&logo=github)](https://github.com/NemesisGuy/ForkMyFolio-frontend)
[![License](https://img.shields.io/github/license/NemesisGuy/ForkMyFolio-frontend?style=for-the-badge)](LICENSE)

---

![ForkMyFolio Screenshot](https://github.com/NemesisGuy/ForkMyFolio-frontend/blob/master/Snapshotforkmyfolio.nemesisnet.co.za.png?raw=true)

## 📌 Introduction

ForkMyFolio is a complete, self-hostable portfolio solution for developers, designers, and professionals. It provides a beautiful, responsive public-facing website and a secure, feature-rich administrative dashboard to manage all your content dynamically.

This project was built to give professionals full control over their online presence, without being locked into a proprietary platform. You own your data, you control the look and feel, and you can extend it however you see fit.

## ✨ Key Features

-   **🎨 Dynamic Public Portfolio**: All content, from your bio to your projects and skills, is fetched from the API. What you see is what you manage.
-   **⚙️ Powerful Admin Dashboard**: A secure, behind-a-login area to manage every aspect of your portfolio:
    -   **CRUD Interfaces**: Easily Create, Read, Update, and Delete Projects, Skills, Work Experience, Testimonials, and Qualifications.
    -   **Profile Editor**: Update your headline, summary, and social links in real-time.
    -   **Site Analytics**: A statistics dashboard visualizes site traffic and engagement.
    -   **Feature Toggles**: Enable or disable entire sections of your public portfolio (e.g., hide "Testimonials") with a single click.
-   **🔐 Secure Authentication**: Robust JWT-based authentication with automated token refresh ensures your admin panel is secure.
-   **🌓 Light & Dark Modes**: A sleek, themeable interface that respects user preferences.
-   **📦 Backup & Restore**: Download a full JSON backup of your entire portfolio and restore from it anytime.

## 💻 Tech Stack & Architecture

This project is a modern, full-stack application built with a focus on clean architecture and best practices.

| Area      | Technology                                       |
|-----------|--------------------------------------------------|
| **Frontend**  | Vue 3 (Composition API), Vite, Bootstrap 5, Axios |
| **Backend**   | Java 21, Spring Boot 3, Spring Security          |
| **Database**  | MySQL                                            |
| **Deployment**| Docker, Docker Compose, Nginx                    |

### Architectural Highlights

-   **Service-as-Store Pattern**: Utilizes reactive services for global state management (e.g., `authService.js`), providing the benefits of a store like Pinia/Vuex without the boilerplate.
-   **Centralized API Client**: A smart `axios` instance handles all API communication, including automatic JWT attachment and seamless token refreshing to prevent session interruption.
-   **Domain-Driven Design (Backend)**: A strict separation of concerns between controllers, services, and repositories ensures the backend is maintainable and scalable.
-   **Fully Containerized**: The entire stack (frontend, backend, database) is designed to run in Docker containers, making deployment consistent and simple.

