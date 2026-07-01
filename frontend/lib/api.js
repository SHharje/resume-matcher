/**
 * lib/api.js
 * ----------
 * Centralised API helper. Every component that needs backend data
 * imports from this file — nothing else talks to the backend directly.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Fetch the full list of job descriptions from the backend.
 * @returns {Promise<Array>} Array of job objects.
 */
export async function fetchJobs() {
  const response = await fetch(`${API_URL}/jobs`);
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return response.json();
}

/**
 * Upload a resume PDF and get back matching results.
 * @param {File} file - The PDF file object from an <input> or drag-and-drop.
 * @returns {Promise<Object>} The match results from the backend.
 */
export async function matchResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/match`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to match resume");
  }
  return response.json();
}
