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

For a full list of features, see [FEATURES.md](./FEATURES.md).
For a full list of API endpoints, see [API_ENDPOINTS.md](./API_ENDPOINTS.md).

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
