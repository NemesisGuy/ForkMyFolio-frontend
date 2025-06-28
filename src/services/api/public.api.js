import { fetchWithAuth } from './apiClient';

export const getPublicProfile = () => fetchWithAuth('/profile', { method: 'GET' }, false);
export const getPublicProjects = () => fetchWithAuth('/projects', { method: 'GET' }, false);
export const getPublicProjectById = (id) => fetchWithAuth(`/projects/${id}`, { method: 'GET' }, false);
export const getPublicSkills = () => fetchWithAuth('/skills', { method: 'GET' }, false);
export const submitContactMessage = (messageData) => fetchWithAuth('/contact', { method: 'POST', body: messageData }, false);
