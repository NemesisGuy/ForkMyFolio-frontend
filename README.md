# ForkMyFolio - Vue.js Frontend 🎨

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue.js](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/vite-%3E4.x-purple.svg)](https://vitejs.dev/)
[![Docker Hub](https://img.shields.io/docker/pulls/nemesisguy/forkmyfolio-frontend?style=flat-square)](https://hub.docker.com/r/nemesisguy/forkmyfolio-frontend)

This is the sleek and responsive frontend for **ForkMyFolio**. Built with Vue 3, it provides both a beautiful public-facing portfolio and a powerful, secure administrative dashboard for content management.

**Backend Repository**: [NemesisGuy/ForkMyFolio-backend](https://github.com/NemesisGuy/ForkMyFolio-backend)

---

## ✨ Key Features

*   **🖼️ Dynamic Public Portfolio**: A fully responsive and customizable portfolio page where all content is dynamically loaded from the backend API.
*   **👑 Full-Featured Admin Dashboard**: A secure, behind-login area to manage every aspect of the portfolio content, view contact messages, and see site statistics.
*   **📄 On-the-Fly PDF Generation**: Visitors can download a PDF version of the portfolio, generated instantly from the current live data.
*   **🚀 Modern & Fast**: Built as a Single-Page Application (SPA) using Vue 3 and Vite for a lightning-fast user experience.
*   **🐳 Dockerized**: Ready for production with a multi-stage Dockerfile and a one-command `docker-compose` setup for easy deployment of the entire stack.

---

## 🛠️ Tech Stack

| Area              | Technology                                       |
| Category          | Technology                                                       |
| :---------------- | :--------------------------------------------------------------- |
| **Framework**     | Vue.js 3 (Composition API)                                       |
| **Build Tool**    | Vite                                                             |
| **Routing**       | Vue Router                                                       |
| **Styling**       | Bootstrap 5 & Bootswatch                                         |
| **API Client**    | Fetch API with a robust interceptor for JWT token refresh        |
| **Deployment**    | Docker & Nginx                                                   |

---

## 🚀 Getting Started

The fastest way to get the entire ForkMyFolio application running is with Docker Compose.

1.  **Clone this repository** (which contains the `docker-compose.yaml`):
    ```bash
    git clone https://github.com/NemesisGuy/ForkMyFolio-frontend.git
    cd ForkMyFolio-frontend
    ```
2.  **Follow the Full Stack Deployment Guide** to create your `.env` file and launch the application.

The frontend will be available at `http://localhost:8089`.

---

## 📚 Documentation

For more detailed information, please refer to the documentation in the `/docs` directory:

*   **[Local Development Guide](./docs/DEVELOPMENT.md)**: For setting up and running the frontend locally without Docker.
*   **[Standalone Docker Guide](./docs/DOCKER.md)**: For building and running the frontend as a standalone Docker container.
*   **[Features & Architecture](./docs/FEATURES_AND_ARCHITECTURE.md)**: A deep dive into the technical implementation and features.
*   **[Full Stack Deployment Guide](./docs/DEPLOYMENT_DOCKER_COMPOSE.md)**: The complete guide for running the full application stack with Docker Compose.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

---

## 📄 License

Distributed under the MIT License. See the `LICENSE` file for more information.