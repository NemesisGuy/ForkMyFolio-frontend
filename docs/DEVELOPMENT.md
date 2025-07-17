# Local Development Guide

Follow these instructions to set up the project for local development. This setup is ideal for working on Vue components and other frontend-specific features.

## Prerequisites

- **Node.js**: version 18+
- **A running instance of the [ForkMyFolio Backend](https://github.com/NemesisGuy/ForkMyFolio-backend)**. The frontend needs the backend API to function.

---

## Setup

1.  **Clone this repository:**
    ```bash
    git clone https://github.com/NemesisGuy/ForkMyFolio-frontend.git
    cd ForkMyFolio-frontend
    ```

2.  **Install NPM dependencies:**
    This command will download all the required libraries for the project.
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    The frontend needs to know where to find the backend API.
    - Create a new file named `.env.local` in the root of the project.
    - Add the URL of your running backend API instance to this file:
      ```
      VITE_API_BASE_URL=http://localhost:8080/api/v1
      ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will now be accessible at `http://localhost:5173` (or another port if 5173 is in use). The terminal will display the correct address.