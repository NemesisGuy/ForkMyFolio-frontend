# ForkMyFolio Application Features

This document outlines the key features of the ForkMyFolio application, separated into the public-facing portfolio and the administrative backend.

---

## 1. Public-Facing Portfolio Features

These are the features available to any visitor of the website.

-   **Dynamic Home Page**:
    -   Displays the owner's profile picture, full name, professional headline, and a detailed summary/bio.
    -   Provides quick access to social and professional links (LinkedIn, GitHub, Website, Email).
    -   Direct links to view or download a resume and a pre-formatted cover letter.

-   **Dedicated Content Pages**: The portfolio is organized into clear, separate sections, each with its own page:
    -   **Projects**: A gallery of professional projects.
    -   **Skills**: A categorized list of technical skills and their proficiency levels.
    -   **Experience**: A timeline of professional work history.
    -   **Testimonials**: A collection of quotes and endorsements.
    -   **Qualifications**: A list of degrees, certifications, and other qualifications.

-   **Interactive Contact Form**: Allows visitors to send messages directly to the portfolio owner.

-   **Responsive Design**: The entire public site is built with Bootstrap 5, ensuring it is fully functional and looks great on desktops, tablets, and mobile devices.

-   **User-Selectable Theme**: A persistent Light/Dark mode toggle allows visitors to choose their preferred viewing experience.

## 2. Admin Management Features

These features are available to the authenticated site owner through a secure admin dashboard.

-   **Secure Authentication**:
    -   User registration and login system protected by JWT (JSON Web Tokens).
    -   Uses `HttpOnly` cookies for refresh tokens to enhance security against XSS attacks.
    -   Session management includes login, secure logout, and automatic token refresh.

-   **Central Admin Dashboard**: A single-page hub providing quick access to all management sections of the portfolio.

-   **Comprehensive Content Management (Full CRUD)**:
    -   **Account Management**: Update private user details like first name, last name, login email, and the public-facing profile image URL.
    -   **Portfolio Profile**: Manage all content on the public home page, including the headline, summary, location, and all social/contact links.
    -   **Projects**: Add, edit, and delete projects. Each project can have a title, description, image, repository link, live demo link, and a "Published/Draft" status toggle.
    -   **Skills**: Add new skills and assign a proficiency level (`Beginner`, `Intermediate`, `Expert`). Existing skills can be deleted.
    -   **Experience**: Full control over work history entries, including job title, company, dates, and description.
    -   **Testimonials**: Add, edit, and delete quotes, including the author's name and title.
    -   **Qualifications**: Manage educational degrees and professional certifications.

-   **Intuitive User Experience**:
    -   All management pages feature a consistent two-column layout with a sticky form for easy editing and a live list of existing items.
    -   Interactive modals are used for critical actions:
        -   `ConfirmModal` for safe deletion.
        -   `SuccessModal` to provide positive feedback after creating or updating content.
        -   `ErrorModal` to clearly display any issues from the server.
        -   `LoadingModal` to prevent interaction during API calls, improving perceived performance.