// Plant API Types
export interface Plant {
  device_amount: number;
  owner: string;
  status: "Working" | "Error" | "Maintenance";
  uid: string;
  updated_at: number;
}

export interface PlantListResponse {
  plants: Plant[];
}

export interface PlantDataSnapshot {
  battery_p: number;
  battery_savings: number;
  battery_soc: number;
  dt: number;
  grid_p: number;
  load_p: number;
  price: number;
  pv_p: number;
  uid: string;
  wind_p: number;
}

export interface Device {
  assigned_devices: Device[];
  device_manufacturer: string;
  device_model: string;
  device_status: "Working" | "Error" | "Maintenance";
  device_type: string;
  parameters: {
    communication?: {
      ip: string;
      port: number;
      unit_id: number;
    };
    communication_type?: string;
    role?: string | null;
    slave_id?: number;
  };
  uid: string;
  updated_at: number;
}

export interface MainFeed {
  export_power: number;
  import_power: number;
  main_feed_devices: Device[];
  uid: string;
  updated_at: number;
}

export interface Controller {
  controller_main_feeds: MainFeed[];
  serial_number: string;
  uid: string;
  updated_at: number;
}

export interface PlantMetadata {
  capacity: number;
  latitude: number;
  longitude: number;
  owner: string;
  status: "Working" | "Error" | "Maintenance";
  uid: string;
  updated_at: number;
}

export interface PlantViewResponse {
  aggregated_data_snapshots: PlantDataSnapshot[];
  controllers: Controller[];
  plant_metadata: PlantMetadata;
}

// Chart data types
export interface ChartDataPoint {
  time: string;
  timestamp: number;
  pv: number;
  battery: number;
  grid: number;
  load: number;
  battery_soc: number;
  price: number;
  battery_savings: number;
  // Additional properties for export
  pv_power?: number;
  battery_power?: number;
  grid_power?: number;
  load_power?: number;
  energy_price?: number;
}

// Authentication types
export interface User {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
