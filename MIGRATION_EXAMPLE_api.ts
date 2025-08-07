// NEW Laravel API service (resources/js/services/api.ts)
import axios from 'axios';
import { 
  PlantListResponse, 
  PlantViewResponse, 
  AuthResponse, 
  User,
  LoginRequest,
  RegisterRequest 
} from '../types';

// Laravel API configuration
const api = axios.create({
  baseURL: '/api', // Laravel API routes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Add CSRF token support
api.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token;
  }
  
  // Add auth token if exists
  const authToken = localStorage.getItem('auth_token');
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  
  return config;
});

// Plant API (adapted for Laravel routes)
export const plantApi = {
  // GET /api/plants
  getPlants: async (): Promise<PlantListResponse> => {
    const response = await api.get('/plants');
    return response.data;
  },

  // GET /api/plants/{id}?start={timestamp}&end={timestamp}
  getPlantView: async (id: string, startTimestamp: number, endTimestamp: number): Promise<PlantViewResponse> => {
    const response = await api.get(`/plants/${id}`, {
      params: {
        start: startTimestamp,
        end: endTimestamp
      }
    });
    return response.data;
  },

  // POST /api/plants/{id}/export
  exportPlantData: async (id: string, config: any): Promise<Blob> => {
    const response = await api.post(`/plants/${id}/export`, config, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Auth API (Laravel Sanctum/Passport)
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
  },

  getUser: async (): Promise<User> => {
    const response = await api.get('/auth/user');
    return response.data;
  }
};

export default api;
