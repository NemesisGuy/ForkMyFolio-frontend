DEPLOYMENT_DOCKER_COMPOSE.md
# ForkMyFolio - Docker Compose Deployment Guide

This guide provides step-by-step instructions for deploying the entire ForkMyFolio application stack (Frontend, Backend, and Database) using Docker Compose.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Step 1: Create the Environment File (`.env`)](#step-1-create-the-environment-file-env)
- Step 2: Understanding Environment Variables
- Step 3: Running the Application
- Step 4: Accessing the Application
- Managing the Stack

 ---

## Prerequisites

Before you begin, ensure you have the following installed on your system:
- **Docker**: Get Docker
- **Docker Compose**: Included with Docker Desktop. For Linux servers, you may need to install it separately.

 ---

## Step 1: Create the Environment File (`.env`)

Docker Compose uses an `.env` file in the same directory as the `docker-compose.yaml` file to manage secrets and configuration.

Create a file named `.env` and paste the following content into it. You **must** fill in the placeholder values.
