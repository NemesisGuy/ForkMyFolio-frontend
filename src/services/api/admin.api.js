import { fetchWithAuth } from './apiClient';

export const updateProfile = (profileData) => fetchWithAuth('/admin/profile', { method: 'PUT', body: profileData }, true);

// Using public endpoint for now, but organized under admin logic
export const getAllProjects = () => fetchWithAuth('/projects', { method: 'GET' }, false);
export const createProject = (projectData) => fetchWithAuth('/admin/projects', { method: 'POST', body: projectData }, true);
export const updateProject = (id, projectData) => fetchWithAuth(`/admin/projects/${id}`, { method: 'PUT', body: projectData }, true);
export const deleteProject = (id) => fetchWithAuth(`/admin/projects/${id}`, { method: 'DELETE' }, true);
//get by id
export const getProjectById = (id) => fetchWithAuth(`/projects/${id}`, { method: 'GET' }, false);

// Using public endpoint for now, but organized under admin logic
export const getAllSkills = () => fetchWithAuth('/skills', { method: 'GET' }, false);
export const createSkill = (skillData) => fetchWithAuth('/admin/skills', { method: 'POST', body: skillData }, true);
export const deleteSkill = (id) => fetchWithAuth(`/admin/skills/${id}`, { method: 'DELETE' }, true);
