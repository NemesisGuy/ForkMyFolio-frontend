import {fetchWithAuth} from './apiClient';

export const register = (userData) => fetchWithAuth('/auth/register', {
  method: 'POST',
  body: userData
}, false);
export const login = (credentials) => fetchWithAuth('/auth/login', {
  method: 'POST',
  body: credentials
}, false);
export const refreshToken = () => fetchWithAuth('/auth/refresh-token', {method: 'POST'}, false);
export const logout = () => fetchWithAuth('/auth/logout', {method: 'POST'}, true);
