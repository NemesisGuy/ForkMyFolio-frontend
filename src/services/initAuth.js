// src/services/initAuth.js
import { authService } from './authService';
import { setAuthService } from './api/apiClient';

setAuthService(authService);
await authService.initAuth();
