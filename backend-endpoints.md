# ForkMyFolio API Endpoint Documentation

**Version: 2.0 (Final)**

This document provides a comprehensive reference for all available API endpoints for the ForkMyFolio application.

**Base URL:** `http://localhost:8080/api/v1`

**Authentication:** Endpoints under the `/admin` path require an `Authorization` header with a Bearer token: `Authorization: Bearer <your_jwt_token>`.

**Public Identifiers:** All resources are identified in API paths (e.g., `/projects/{uuid}`) using a non-sequential `UUID`. The internal numeric database ID is never exposed.

---

## 1. Public Endpoints

These endpoints are for public consumption to display the portfolio content. They do not require authentication.

| Resource         | Method | Endpoint                    | Description                              | Returns                   |
| :--------------- | :----- | :-------------------------- | :--------------------------------------- | :------------------------ |
| **Profile**      | `GET`  | `/portfolio-profile`        | Get the complete public portfolio profile. | `PortfolioProfileDto`     |
| **Projects**     | `GET`  | `/projects`                 | Get all public projects.                 | `List<ProjectDto>`        |
|                  | `GET`  | `/projects/{uuid}`          | Get a single project by its UUID.        | `ProjectDto`              |
| **Skills**       | `GET`  | `/skills`                   | Get all public skills.                   | `List<SkillDto>`          |
| **Experience**   | `GET`  | `/experience`               | Get all public work experiences.         | `List<ExperienceDto>`     |
| **Testimonials** | `GET`  | `/testimonials`             | Get all public testimonials.             | `List<TestimonialDto>`    |
| **Qualifications**| `GET`  | `/qualifications`           | Get all public qualifications.           | `List<QualificationDto>`  |
| **Contact**      | `POST` | `/contact`                  | Submits a contact form message.          | `{"message": "success"}`  |

---

## 2. Authentication Endpoints

These endpoints handle the admin user's session.

| Method | Endpoint             | Description                                  | Auth?    |
| :----- | :------------------- | :------------------------------------------- | :------- |
| `POST` | `/auth/register`     | Creates the initial admin user.              | Public   |
| `POST` | `/auth/login`        | Logs in the user and returns a JWT.          | Public   |
| `POST` | `/auth/refresh-token`| Issues a new JWT using the refresh token cookie.| Public   |
| `POST` | `/auth/logout`       | Invalidates the user's session.              | **Admin**|

---

## 3. Admin Management Endpoints

All endpoints under the `/admin` path are secured and require an authenticated admin session. They are broken down by the resource they manage.

### 3.1. Account & Profile Content Management

*   `/admin/account`: Manages the private **User** account (name, email).
*   `/admin/portfolio-profile`: Manages the public-facing **Portfolio Profile** content (headline, summary, etc.).

| Method | Endpoint                  | Description                               | Request Body                     | Returns         |
| :----- | :------------------------ | :---------------------------------------- | :------------------------------- | :-------------- |
| `GET`  | `/admin/account`          | Get the authenticated admin's user account. | None                             | `UserDto`       |
| `PUT`  | `/admin/account`          | Update the admin's first and last name.   | `UpdateUserAccountRequest`       | `UserDto`       |
| `POST` | `/admin/portfolio-profile`| Create the public portfolio profile content.| `CreatePortfolioProfileRequest`    | `PortfolioProfileDto` |
| `GET`  | `/admin/portfolio-profile`| Get the public profile content.           | None                             | `PortfolioProfileDto` |
| `PUT`  | `/admin/portfolio-profile`| Update the public profile content.        | `UpdatePortfolioProfileRequest`    | `PortfolioProfileDto` |


### 3.2. Project Management (`/admin/projects`)

| Method   | Endpoint          | Description                   | Request Body           | Returns            |
| :------- | :---------------- | :---------------------------- | :--------------------- | :----------------- |
| `GET`    | `/`               | List all projects for managing. | None                   | `List<ProjectDto>` |
| `GET`    | `/{uuid}`         | Get a single project by UUID. | None                   | `ProjectDto`       |
| `POST`   | `/`               | Create a new project.         | `CreateProjectRequest` | `ProjectDto`       |
| `PUT`    | `/{uuid}`         | Update a project by its UUID. | `UpdateProjectRequest` | `ProjectDto`       |
| `DELETE` | `/{uuid}`         | Delete a project by its UUID. | None                   | `void` (204)       |

### 3.3. Skill Management (`/admin/skills`)

| Method   | Endpoint          | Description               | Request Body         | Returns            |
| :------- | :---------------- | :------------------------ | :------------------- | :----------------- |
| `GET`    | `/`               | List all skills for managing. | None                 | `List<SkillDto>` |
| `GET`    | `/{uuid}`         | Get a single skill by UUID. | None                 | `SkillDto`       |
| `POST`   | `/`               | Create a new skill.       | `CreateSkillRequest` | `SkillDto`       |
| `PUT`    | `/{uuid}`         | Update a skill's level.   | `UpdateSkillRequest` | `SkillDto`       |
| `DELETE` | `/{uuid}`         | Delete a skill by its UUID. | None                 | `void` (204)       |

### 3.4. Experience Management (`/admin/experience`)

| Method   | Endpoint          | Description                      | Request Body            | Returns               |
| :------- | :---------------- | :------------------------------- | :---------------------- | :-------------------- |
| `GET`    | `/`               | List all experiences for managing. | None                    | `List<ExperienceDto>` |
| `GET`    | `/{uuid}`         | Get a single experience by UUID. | None                    | `ExperienceDto`       |
| `POST`   | `/`               | Create a new experience entry.   | `CreateExperienceRequest` | `ExperienceDto`       |
| `PUT`    | `/{uuid}`         | Update an experience by its UUID.| `UpdateExperienceRequest` | `ExperienceDto`       |
| `DELETE` | `/{uuid}`         | Delete an experience by its UUID.| None                      | `void` (204)          |

### 3.5. Testimonial Management (`/admin/testimonials`)

| Method   | Endpoint          | Description                      | Request Body             | Returns                  |
| :------- | :---------------- | :------------------------------- | :----------------------- | :----------------------- |
| `GET`    | `/`               | List all testimonials for managing.| None                     | `List<TestimonialDto>`   |
| `GET`    | `/{uuid}`         | Get a single testimonial by UUID.| None                     | `TestimonialDto`         |
| `POST`   | `/`               | Create a new testimonial.        | `CreateTestimonialRequest` | `TestimonialDto`         |
| `PUT`    | `/{uuid}`         | Update a testimonial by its UUID.| `UpdateTestimonialRequest` | `TestimonialDto`         |
| `DELETE` | `/{uuid}`         | Delete a testimonial by its UUID.| None                       | `void` (204)             |

### 3.6. Qualification Management (`/admin/qualifications`)

| Method   | Endpoint          | Description                        | Request Body               | Returns                   |
| :------- | :---------------- | :--------------------------------- | :------------------------- | :------------------------ |
| `GET`    | `/`               | List all qualifications for managing.| None                       | `List<QualificationDto>`  |
| `GET`    | `/{uuid}`         | Get a single qualification by UUID.| None                       | `QualificationDto`        |
| `POST`   | `/`               | Create a new qualification.        | `CreateQualificationRequest` | `QualificationDto`        |
| `PUT`    | `/{uuid}`         | Update a qualification by its UUID.| `UpdateQualificationRequest` | `QualificationDto`        |
| `DELETE` | `/{uuid}`         | Delete a qualification by its UUID.| None                         | `void` (204)              |