# ForkMyFolio v2.0.0-BETA: Backend Release Notes

This document details the key backend enhancements, new features, and architectural refinements that power the v2.0.0-BETA release. These changes focus on expanding data portability, improving analytics, and solidifying our API architecture.

---

## 1. New Feature: Multi-Format Portfolio Downloads

To support the new "Download Center" on the frontend, a suite of new public-facing endpoints has been added to the `PortfolioController`. These endpoints allow any visitor to download a user's portfolio in various formats.

### New API Endpoints

| Method | Path                 | Controller Method                 | Description                                       |
| :----- | :------------------- | :-------------------------------- | :------------------------------------------------ |
| `GET`  | `/{slug}/pdf`        | `downloadPortfolioAsPdf`          | Generates and serves a PDF version of the portfolio. |
| `GET`  | `/{slug}/markdown`   | `downloadPortfolioAsMarkdown`     | Generates and serves a Markdown version of the portfolio. |
| `GET`  | `/{slug}/vcard`      | `downloadVCard`                   | Generates and serves a vCard (.vcf) contact file. |

### Implementation Details

-   **File Streams**: These endpoints return a raw `byte[]` stream, not JSON.
-   **`@SkipApiResponseWrapper`**: A custom annotation is used to bypass our standard JSON response wrapper, ensuring the file is delivered correctly to the browser.
-   **Content-Disposition**: The `Content-Disposition` header is set to `attachment`, which prompts the user's browser to download the file with a clean, dynamically generated filename (e.g., `PeterBuckinghan-Portfolio.pdf`).

---

## 2. New Feature: Visitor Analytics Tracking

We've introduced a non-invasive, AOP-based system to track key visitor interactions for analytics.

-   **`@TrackVisitor` Annotation**: This new annotation can be placed on any controller method to automatically record a specific event.
-   **`VisitorStatType` Enum**: Defines the types of events we can track, such as `PDF_DOWNLOAD`, `MARKDOWN_DOWNLOAD`, and `VCARD_DOWNLOAD`.
-   **Aspect-Oriented Programming (AOP)**: The tracking logic is completely decoupled from the business logic of the controller, making it easy to add or remove tracking from any endpoint without modifying its code.

**Example from `PortfolioController.java`:**
