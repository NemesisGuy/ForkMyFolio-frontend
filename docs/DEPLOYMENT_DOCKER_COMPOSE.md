# ForkMyFolio - Docker Compose Deployment Guide

This guide provides step-by-step instructions for deploying the entire ForkMyFolio application stack (Frontend, Backend, and Database) using Docker Compose.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Step 1: Create the Environment File (`.env`)](#step-1-create-the-environment-file-env)
- [Step 2: Understanding Environment Variables](#step-2-understanding-environment-variables)
- [Step 3: Running the Application](#step-3-running-the-application)
- [Step 4: Accessing the Application](#step-4-accessing-the-application)
- [Managing the Stack](#managing-the-stack)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Docker**: Get Docker
- **Docker Compose**: Included with Docker Desktop. For Linux servers, you may need to install it separately.

---

## Step 1: Create the Environment File (`.env`)

Docker Compose uses an `.env` file in the same directory as the `docker-compose.yaml` file to manage secrets and configuration.

Create a file named `.env` and paste the following content into it. You **must** fill in the placeholder values.

```env
# --- Database Configuration ---
# Choose a strong, secure password for the MySQL root user.
# This is used by both the 'db' and 'app' services.
DB_PASSWORD=your_strong_database_password

# --- Backend API Configuration ---
# A secret key for signing JWT tokens. Use a long, random string.
JWT_SECRET_KEY=your_super_secret_jwt_key_that_is_long_and_random

# The initial password for the default 'admin' user.
# You should change this immediately after your first login.
DEFAULT_ADMIN_PASSWORD=your_secure_admin_password

# The public URL of your frontend. This is crucial for CORS.
# Example: http://localhost:8089 or https://your-domain.com
APP_CORS_ALLOWED_ORIGINS=http://localhost:8089

# --- Frontend Configuration ---
# The full public URL where the backend API will be accessible.
# This value is passed to the frontend container.
# Example: http://localhost:8080/api/v1 or https://your-domain.com/api/v1
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

---

## Step 2: Understanding Environment Variables

- `DB_PASSWORD`: Sets the root password for the MySQL database. The backend service also uses this to connect to the database.
- `JWT_SECRET_KEY`: A secret phrase used by the backend to create and verify JSON Web Tokens for authentication.
- `DEFAULT_ADMIN_PASSWORD`: The password for the `admin` user that gets created on the first run.
- `APP_CORS_ALLOWED_ORIGINS`: Tells the backend API which frontend URL is allowed to make requests. **This must match the URL where your frontend is running.**
- `VITE_API_BASE_URL`: Tells the frontend where to find the backend API. This is injected at runtime.

---

## Step 3: Running the Application

With the `docker-compose.yaml` and your configured `.env` file in the same directory, run the following command:

```bash
docker-compose up -d
```

This command will:
1.  Download the latest `nemesisguy/forkmyfolio-backend` and `nemesisguy/forkmyfolio-frontend` images from Docker Hub.
2.  Create and start the three containers (`app`, `frontend`, `db`) in the background (`-d`).
3.  Create the `forkmyfolio-net` network and the `mysql_data` volume.

---

## Step 4: Accessing the Application

-   **Frontend**: The portfolio and admin dashboard will be available at `http://localhost:8089`.
-   **Backend API**: The API will be accessible at `http://localhost:8080`.

---

## Managing the Stack

-   **To stop the application:**
    ```bash
    docker-compose down
    ```
-   **To view logs for all services:**
    ```bash
    docker-compose logs -f
    ```
-   **To view logs for a specific service (e.g., the backend):**
    ```bash
    docker-compose logs -f app
    ```
