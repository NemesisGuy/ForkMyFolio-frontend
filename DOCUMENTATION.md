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

-   **🎨 Dynamic Public Portfolio**: A stunning, theme-aware (light/dark) portfolio that showcases your profile, projects, skills, experience, and more.
-   **⚙️ Powerful Admin Dashboard**: A secure, behind-a-login area to manage every aspect of your portfolio without touching any code:
    -   **Full Content Management**: Easily Create, Read, Update, and Delete Projects, Skills, Work Experience, Testimonials, and Qualifications.
    -   **Live Site Configuration**: Instantly toggle the visibility of entire sections of your public portfolio (e.g., hide "Testimonials") or change the PDF resume template with a single click.
    -   **Visitor Analytics**: A dashboard to visualize site traffic and engagement.
    -   **Contact Message Inbox**: View and manage messages sent through your contact form.
-   **🔐 Secure Authentication**: Robust JWT-based authentication with automated token refresh ensures your admin panel is secure.
-   **📄 Dynamic PDF Generation**: Visitors can download a PDF of your portfolio, and you can choose from multiple templates (e.g., a full resume or a compact one-pager).
-   **📦 Backup & Restore**: Download a full JSON backup of your entire portfolio and restore from it anytime, ensuring your data is always safe and portable.

## 💻 Tech Stack

This project is a modern, full-stack application built with a focus on clean architecture and best practices.

| Area       | Technology                                          |
| :--------- | :-------------------------------------------------- |
| **Frontend**   | Vue 3 (Composition API), Vite, Bootstrap 5, Axios |
| **Backend**    | Java 21, Spring Boot 3, Spring Security           |
| **Database**   | MySQL                                             |
| **Deployment** | Docker, Docker Compose, Nginx                     |

## 🏛️ Architecture

### Frontend Architecture

The frontend is a modern Vue.js single-page application (SPA) designed for scalability, maintainability, and performance.

-   **Core Technologies**: Vue 3 (Composition API), Pinia for state management, Vue Router for navigation, and Bootstrap 5 for UI components.
-   **Directory Structure**: A well-organized `src` directory separates concerns into `assets`, `components`, `composables`, `router`, `services`, `stores`, and `views`.
-   **State Management**: A centralized Pinia store (`publicPortfolioStore.js`) acts as the single source of truth for all public portfolio data, preventing redundant API calls.
-   **Service Layer**: Business logic, API communication, and browser storage interactions are encapsulated in services, decoupling the UI from external interactions.
-   **Dynamic Routing**: The application uses dynamic routes (`/:slug`) and navigation guards to handle data fetching, enforce authentication, and perform ownership checks.
-   **Theming**: A robust light/dark mode theming engine is built on CSS Custom Properties, ensuring a consistent look and feel.

### Backend Architecture

The backend follows Domain-Driven Design (DDD) principles to ensure a clean separation of concerns and a scalable architecture.

-   **Core Principles**:
    -   **Entities**: Contain domain state and behavior.
    -   **Repositories**: Abstract persistence.
    -   **Services**: Operate purely on Entities, never DTOs.
    -   **DTOs**: Strictly for Controller layer input/output.
-   **Entity Identification**: Every entity has an internal primary key and an external UUID for public identification.
-   **API Structure**: A RESTful API with resource-oriented URLs, using plural nouns and standard HTTP verbs. All responses are wrapped in a consistent `ApiResponse<T>` structure.
-   **Error Handling**: A global exception handler provides consistent and well-formatted error responses.
-   **Security**: The application uses JWT-based authentication with a secure refresh token strategy and role-based access control (RBAC).

## 📡 API Endpoints

This section provides a high-level overview of the API endpoints available in the ForkMyFolio application.

### Public Endpoints

Accessible to anyone without authentication.

| Method | Endpoint                     | Description                                |
| :----- | :--------------------------- | :----------------------------------------- |
| `POST` | `/api/v1/auth/register`      | Creates a new user account.                |
| `POST` | `/api/v1/auth/login`         | Authenticates a user and returns a token.  |
| `POST` | `/api/v1/auth/refresh-token` | Issues a new access token.                 |
| `POST` | `/api/v1/auth/logout`        | Logs the current user out.                 |
| `GET`    | `/api/v1/portfolios/{slug}`                | Retrieves a user's full public portfolio by slug.  |
| `GET`    | `/api/v1/portfolios/{slug}/settings`       | Retrieves the public display settings for a portfolio. |
| `POST`   | `/api/v1/portfolios/{slug}/contact-messages` | Submits a contact message to a specific user.      |
| `GET`    | `/api/v1/portfolios/{slug}/pdf`            | Downloads a PDF version of a user's portfolio.     |
| `GET`    | `/api/v1/portfolios/{slug}/vcard`          | Downloads a vCard of a user's contact info.        |
| `GET`    | `/api/v1/settings`                         | Retrieves public, system-wide application settings. |

### Authenticated User Endpoints

Requires a valid user token. All endpoints are prefixed with `/api/v1/me`.

| Method | Endpoint      | Description                               |
| :----- | :------------ | :---------------------------------------- |
| `GET`    | `/`           | Gets the authenticated user's account details. |
| `PUT`    | `/`           | Updates the authenticated user's account details. |
| `GET`    | `/profile`    | Gets the user's detailed portfolio profile. |
| `PUT`    | `/profile`    | Updates the user's detailed portfolio profile. |
| `GET` / `POST`   | `/projects`         | List all or create a new project.         |
| `GET`/`PUT`/`DELETE` | `/projects/{uuid}`  | Manage a specific project.                |
| `GET` / `POST`   | `/skills`           | List all or create a new skill.           |
| `GET`/`PUT`/`DELETE` | `/skills/{uuid}`    | Manage a specific skill.                  |
| `GET` / `POST`   | `/experiences`      | List all or create a new experience.      |
| `GET`/`PUT`/`DELETE` | `/experiences/{uuid}` | Manage a specific experience.             |
| `GET` / `POST`   | `/qualifications`   | List all or create a new qualification.   |
| `GET`/`PUT`/`DELETE` | `/qualifications/{uuid}` | Manage a specific qualification.          |
| `GET` / `POST`   | `/testimonials`     | List all or create a new testimonial.     |
| `GET`/`PUT`/`DELETE` | `/testimonials/{uuid}` | Manage a specific testimonial.            |
| `GET` / `PUT`  | `/settings`              | Retrieve or update personal portfolio display settings. |
| `GET`      | `/contact-messages`      | Lists all contact messages received by the user.   |
| `DELETE`   | `/contact-messages/{uuid}` | Deletes a specific contact message.                |
| `GET`      | `/backup`                | Downloads a JSON backup of the user's portfolio.   |
| `POST`     | `/backup/restore`        | Restores portfolio data from a JSON backup.        |

### Admin Endpoints

Requires a valid admin token. All endpoints are prefixed with `/api/v1/admin`.

| Method   | Endpoint           | Description                                          |
| :------- | :----------------- | :--------------------------------------------------- |
| `GET`      | `/users`           | Lists all users in the system (paginated).           |
| `GET`      | `/users/{userId}`  | Gets details for a single user by their ID.          |
| `PUT`      | `/users/{userId}`  | Updates a user's details, roles, and active status.  |
| `DELETE`   | `/users/{userId}`  | Deactivates (soft deletes) a user account.           |
| `GET` / `PUT`  | `/settings`              | Retrieve or bulk-update global application settings. |
| `GET`      | `/contact-messages`      | Lists all contact messages from all users.         |
| `DELETE`   | `/contact-messages/{uuid}` | Deletes any contact message from the system.       |
| `GET`      | `/stats`                 | Retrieves site-wide visitor statistics.            |

## 🚀 Deployment

This project is fully containerized and can be deployed using Docker Compose or as a standalone Docker container.

### Docker Compose

1.  **Create an environment file (`.env`)**: Create a `.env` file in the root of the project and add the necessary environment variables.
2.  **Run Docker Compose**:
    ```bash
    docker-compose up -d
    ```

### Standalone Docker Container

```bash
docker run -d -p 8080:80 \
  -e API_BASE_URL=http://your-backend-api-url.com/api/v1 \
  --name forkmyfolio-frontend-container \
  nemesisguy/forkmyfolio-frontend:latest
```

## 💻 Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/NemesisGuy/ForkMyFolio-frontend.git
    cd ForkMyFolio-frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure environment variables**: Create a `.env.local` file and add the following:
    ```
    VITE_API_BASE_URL=http://localhost:8080/api/v1
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 🎨 Style Guide

This project follows the Nemesis Architecture & Code Style Guide, which emphasizes clarity, stability, and control.

### Core Principles

-   **Domain-Driven Design (DDD)**: The backend follows DDD principles, with a clear separation of entities, repositories, and services.
-   **RESTful APIs**: The API is designed to be RESTful, with resource-oriented URLs and standard HTTP verbs.
-   **Security**: The application is secured by default, with JWT-based authentication and role-based access control.
-   **Dockerized**: The entire application is containerized for easy deployment and scaling.

### Naming Conventions

| Type      | Convention       | Example          |
| :-------- | :--------------- | :--------------- |
| Classes   | PascalCase       | `UserService`    |
| Variables | camelCase        | `userRepository` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_TIMEOUT`|
| Packages  | lowercase.dots   | `com.nemesisnet` |
