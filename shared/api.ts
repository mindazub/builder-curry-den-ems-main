/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

import { PlantListResponse, PlantViewResponse } from "./types";

// Use Vite proxy for API calls
const API_BASE_URL = "/api/plants";

const AUTH_TOKEN = "f9c2f80e1c0e5b6a3f7f40e6f2e9c9d0af7eaabc6b37a4d9728e26452b81fc13";
const OWNER_ID = "6a36660d-daae-48dd-a4fe-000b191b13d8";

const headers = {
  "Authorization": `Bearer ${AUTH_TOKEN}`,
  "Content-Type": "application/json",
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

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}
