/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

import { 
  PlantListResponse, 
  PlantViewResponse, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User,
  ProfileUpdateRequest,
  ChangePasswordRequest 
} from "./types";

// Use Vite proxy for API calls
const API_BASE_URL = "/api/plants";
const AUTH_API_BASE_URL = "/api/auth";

const AUTH_TOKEN = "f9c2f80e1c0e5b6a3f7f40e6f2e9c9d0af7eaabc6b37a4d9728e26452b81fc13";
const OWNER_ID = "6a36660d-daae-48dd-a4fe-000b191b13d8";

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Create authenticated headers
const createAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};

export const plantApi = {
  // Get list of plants
  async getPlantList(): Promise<PlantListResponse> {
    const response = await fetch(`${API_BASE_URL}/plant_list/${OWNER_ID}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch plants: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get plant view data
  async getPlantView(plantId: string, startTimestamp: number, endTimestamp: number): Promise<PlantViewResponse> {
    const response = await fetch(
      `${API_BASE_URL}/plant_view/${plantId}?start=${startTimestamp}&end=${endTimestamp}`,
      { 
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch plant view: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get today's timestamps (start of day at 00:00 and end at 23:59)
  getTodayTimestamps(): { start: number; end: number } {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    return {
      start: Math.floor(startOfDay.getTime() / 1000),
      end: Math.floor(endOfDay.getTime() / 1000),
    };
  },

  // Get timestamps for a specific date
  getDateTimestamps(date: Date): { start: number; end: number } {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    
    return {
      start: Math.floor(startOfDay.getTime() / 1000),
      end: Math.floor(endOfDay.getTime() / 1000),
    };
  },
};

export const authApi = {
  // Register new user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return response.json();
  },

  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  // Get current user profile
  async getProfile(): Promise<{ user: User }> {
    const response = await fetch(`${AUTH_API_BASE_URL}/me`, {
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch profile');
    }

    return response.json();
  },

  // Update user profile
  async updateProfile(profileData: ProfileUpdateRequest): Promise<{ message: string; user: User }> {
    const response = await fetch(`${AUTH_API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: createAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update profile');
    }

    return response.json();
  },

  // Change password
  async changePassword(passwordData: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await fetch(`${AUTH_API_BASE_URL}/change-password`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to change password');
    }

    return response.json();
  },

  // Logout user
  async logout(): Promise<{ message: string }> {
    const response = await fetch(`${AUTH_API_BASE_URL}/logout`, {
      method: 'POST',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Logout failed');
    }

    // Clear token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }

    return response.json();
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return getAuthToken() !== null;
  },

  // Save token to localStorage
  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },

  // Remove token from localStorage
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }
};

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}
