import {fetchWithAuth} from './apiClient';

// --- Profile ---
export const updateProfile = (profileData) => fetchWithAuth('/admin/profile', {
  method: 'PUT',
  body: profileData
}, true);

// --- Projects ---
export const createProject = (projectData) => fetchWithAuth('/admin/projects', {
  method: 'POST',
  body: projectData
}, true);
export const updateProject = (id, projectData) => fetchWithAuth(`/admin/projects/${id}`, {
  method: 'PUT',
  body: projectData
}, true);
export const deleteProject = (id) => fetchWithAuth(`/admin/projects/${id}`, {method: 'DELETE'}, true);

// --- Skills ---
export const createSkill = (skillData) => fetchWithAuth('/admin/skills', {
  method: 'POST',
  body: skillData
}, true);
export const deleteSkill = (id) => fetchWithAuth(`/admin/skills/${id}`, {method: 'DELETE'}, true);

// --- Experience ---
export const createExperience = (expData) => fetchWithAuth('/admin/experience', {
  method: 'POST',
  body: expData
}, true);
export const updateExperience = (id, expData) => fetchWithAuth(`/admin/experience/${id}`, {
  method: 'PUT',
  body: expData
}, true);
export const deleteExperience = (id) => fetchWithAuth(`/admin/experience/${id}`, {method: 'DELETE'}, true);

// --- Testimonials ---
export const createTestimonial = (testData) => fetchWithAuth('/admin/testimonials', {
  method: 'POST',
  body: testData
}, true);
export const updateTestimonial = (id, testData) => fetchWithAuth(`/admin/testimonials/${id}`, {
  method: 'PUT',
  body: testData
}, true);
export const deleteTestimonial = (id) => fetchWithAuth(`/admin/testimonials/${id}`, {method: 'DELETE'}, true);
