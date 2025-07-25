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

For a deeper dive into the technical architecture and a complete feature list, please see [FEATURES.md](./FEATURES.md).