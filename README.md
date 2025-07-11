# Vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).
# ForkMyFolio - Frontend

This is the complete frontend for the **ForkMyFolio** project, a dynamic and data-driven portfolio application built with Vue 3, Vite, and Bootstrap 5. It provides a beautiful public-facing portfolio and a secure, comprehensive admin dashboard for content management.

---

## Key Features

-   **Dynamic Public Portfolio**: Displays projects, skills, work experience, qualifications, and testimonials fetched from a backend API.
-   **Secure Admin Dashboard**: A central hub for the site owner to manage all portfolio content via a clean user interface.
-   **JWT Authentication**: Robust authentication flow using access and refresh tokens, designed to work with HttpOnly cookies for enhanced security.
-   **Full CRUD Functionality**: Create, Read, Update, and Delete operations for all major portfolio sections:
    -   Public Profile (Headline, Bio, Social Links)
    -   Projects Showcase
    -   Skills & Proficiencies
    -   Work Experience History
    -   Client & Colleague Testimonials
    -   Degrees & Certifications
-   **Responsive Design**: Built with Bootstrap 5 to ensure a seamless experience on desktops, tablets, and mobile devices.
-   **Light & Dark Mode**: Includes a theme toggler for user preference.
-   **Client-Side Aggregation**: The public homepage intelligently fetches data from multiple API sources and composes the view on the client, keeping backend endpoints decoupled and focused.

## Tech Stack

-   **Framework**: [Vue 3](https://vuejs.org/) (using Composition API with `<script setup>`)
-   **Build Tool**: Vite
-   **Routing**: Vue Router
-   **Styling**: Bootstrap 5 & Bootstrap Icons
-   **Linting**: ESLint
-   **Unit Testing**: Vitest
-   **E2E Testing**: Playwright

## Project Structure

A brief overview of the key directories in the project:

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
