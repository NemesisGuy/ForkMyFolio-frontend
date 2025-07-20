/**
 * @file src/services/api/backup.api.js
 * @description API functions for data backup and restore operations.
 * Adheres to the Nemesis Architecture Style Guide.
 */
import { fetchWithAuth } from './apiClient';

/**
 * Initiates a download of the full portfolio backup.
 * @returns {Promise<void>}
 */
export const downloadBackup = async () => {
  // 1. Fetch the backup data. The fetchWithAuth wrapper unwraps the main
  //    response and provides the inner `data` object.
  const backupData = await fetchWithAuth('/admin/backup', {
    method: 'GET',
  });

  // 2. Stringify the received data object into a readable format.
  const jsonString = JSON.stringify(backupData, null, 2);

  // 3. Create a Blob from the JSON string, which is required for file creation.
  const blob = new Blob([jsonString], { type: 'application/json' });

  // 4. Create a temporary URL to trigger the browser's download functionality.
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const filename = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.setAttribute('download', filename);

  // 5. Trigger the download and clean up the temporary elements.
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Uploads a backup file to restore the portfolio.
 * @param {File} file The JSON backup file to upload.
 * @returns {Promise<any>} A promise that resolves with the server's response.
 */
export const ingestBackup = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return fetchWithAuth('/admin/ingest', {
    method: 'POST',
    body: formData,
    // Note: 'Content-Type' for multipart/form-data is set automatically by the browser
    // when using FormData and should not be specified manually.
  });
};
