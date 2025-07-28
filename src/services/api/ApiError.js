/**
 * @file src/services/api/ApiError.js
 * @description Custom error class for handling API-specific errors.
 */

export class ApiError extends Error {
  constructor(message, httpStatus, errors = []) {
    super(message);
    this.name = 'ApiError';
    this.httpStatus = httpStatus;
    this.errors = errors; // Array of { field, message } from the backend
  }
}
