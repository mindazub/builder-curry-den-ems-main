# GitHub Copilot Instructions: Plant Monitoring System

## Laravel 11 + React Implementation Guide

### 🎯 **Project Overview**

Create a comprehensive plant monitoring system with real-time data visualization, interactive charts, and data export capabilities. The system should handle energy data for solar plants including PV power, battery management, grid interaction, and cost savings analytics.

---

## 📋 **System Architecture Requirements**

### **Backend: Laravel 11**

```bash
# Initial Setup Commands
composer create-project laravel/laravel plant-monitoring-system
cd plant-monitoring-system
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### **Frontend: React + TypeScript**

```bash
# Frontend Setup
npm install react@18 react-dom@18 typescript @types/react @types/react-dom
npm install @vitejs/plugin-react vite
npm install tailwindcss postcss autoprefixer
npm install framer-motion lucide-react
npm install recharts chart.js react-chartjs-2
npm install date-fns react-day-picker
npm install xlsx file-saver
npm install @types/file-saver
```

---

## 🗄️ **Database Schema**

### **1. Migration Files**

**Create Plants Migration:**

```php
// database/migrations/create_plants_table.php
Schema::create('plants', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('owner_id');
    $table->string('status')->default('Working'); // Working, Error, Maintenance
    $table->integer('device_amount')->default(0);
    $table->decimal('capacity', 8, 2); // kW capacity
    $table->decimal('latitude', 10, 7);
    $table->decimal('longitude', 10, 7);
    $table->string('location_address')->nullable();
    $table->timestamps();
    $table->timestamp('updated_at_unix')->useCurrent();
});
```

**Create Plant Data Snapshots Migration:**

```php
// database/migrations/create_plant_data_snapshots_table.php
Schema::create('plant_data_snapshots', function (Blueprint $table) {
    $table->id();
    $table->uuid('plant_id');
    $table->integer('dt'); // Unix timestamp
    $table->decimal('pv_p', 10, 3); // PV power in watts
    $table->decimal('battery_p', 10, 3); // Battery power in watts (+ charging, - discharging)
    $table->decimal('grid_p', 10, 3); // Grid power in watts
    $table->decimal('load_p', 10, 3); // Load power in watts
    $table->decimal('wind_p', 10, 3)->default(0); // Wind power in watts
    $table->decimal('battery_soc', 5, 2); // Battery State of Charge percentage
    $table->decimal('price', 8, 4); // Energy price per kWh
    $table->decimal('battery_savings', 8, 3); // Savings in currency
    $table->timestamps();

    $table->foreign('plant_id')->references('id')->on('plants')->onDelete('cascade');
    $table->index(['plant_id', 'dt']);
});
```

**Create Devices Migration:**

```php
// database/migrations/create_devices_table.php
Schema::create('devices', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->uuid('plant_id');
    $table->string('device_type'); // inverter, battery, meter, etc.
    $table->string('device_manufacturer');
    $table->string('device_model');
    $table->string('device_status')->default('Working');
    $table->json('parameters'); // Communication settings, roles, etc.
    $table->timestamps();
    $table->timestamp('updated_at_unix')->useCurrent();

    $table->foreign('plant_id')->references('id')->on('plants')->onDelete('cascade');
});
```

---

## 🏗️ **Laravel Backend Implementation**

### **1. Models**

**Plant Model:**

```php
// app/Models/Plant.php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plant extends Model
{
    use HasUuids;

    protected $fillable = [
        'owner_id', 'status', 'device_amount', 'capacity',
        'latitude', 'longitude', 'location_address'
    ];

    protected $casts = [
        'capacity' => 'decimal:2',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'updated_at_unix' => 'timestamp'
    ];

    public function dataSnapshots(): HasMany
    {
        return $this->hasMany(PlantDataSnapshot::class)->orderBy('dt');
    }

    public function devices(): HasMany
    {
        return $this->hasMany(Device::class);
    }

    public function getUpdatedAtUnixAttribute()
    {
        return $this->updated_at->unix();
    }
}
```

**PlantDataSnapshot Model:**

```php
// app/Models/PlantDataSnapshot.php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlantDataSnapshot extends Model
{
    protected $fillable = [
        'plant_id', 'dt', 'pv_p', 'battery_p', 'grid_p', 'load_p',
        'wind_p', 'battery_soc', 'price', 'battery_savings'
    ];

    protected $casts = [
        'pv_p' => 'decimal:3',
        'battery_p' => 'decimal:3',
        'grid_p' => 'decimal:3',
        'load_p' => 'decimal:3',
        'wind_p' => 'decimal:3',
        'battery_soc' => 'decimal:2',
        'price' => 'decimal:4',
        'battery_savings' => 'decimal:3'
    ];

    public function plant(): BelongsTo
    {
        return $this->belongsTo(Plant::class);
    }
}
```

### **2. API Controllers**

**PlantController:**

```php
// app/Http/Controllers/Api/PlantController.php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PlantController extends Controller
{
    public function index(string $ownerId): JsonResponse
    {
        $plants = Plant::where('owner_id', $ownerId)
            ->withCount('devices')
            ->get()
            ->map(function ($plant) {
                return [
                    'device_amount' => $plant->devices_count,
                    'owner' => $plant->owner_id,
                    'status' => $plant->status,
                    'uid' => $plant->id,
                    'updated_at' => $plant->updated_at_unix,
                ];
            });

        return response()->json(['plants' => $plants]);
    }

    public function show(string $plantId, Request $request): JsonResponse
    {
        $start = $request->get('start');
        $end = $request->get('end');

        $plant = Plant::with(['devices', 'dataSnapshots' => function ($query) use ($start, $end) {
            if ($start && $end) {
                $query->whereBetween('dt', [$start, $end]);
            }
        }])->findOrFail($plantId);

        // Transform data to match frontend expectations
        $response = [
            'plant_metadata' => [
                'uid' => $plant->id,
                'owner' => $plant->owner_id,
                'status' => $plant->status,
                'capacity' => $plant->capacity,
                'latitude' => $plant->latitude,
                'longitude' => $plant->longitude,
                'updated_at' => $plant->updated_at_unix,
            ],
            'aggregated_data_snapshots' => $plant->dataSnapshots->map(function ($snapshot) {
                return [
                    'dt' => $snapshot->dt,
                    'pv_p' => $snapshot->pv_p,
                    'battery_p' => $snapshot->battery_p,
                    'grid_p' => $snapshot->grid_p,
                    'load_p' => $snapshot->load_p,
                    'wind_p' => $snapshot->wind_p,
                    'battery_soc' => $snapshot->battery_soc,
                    'price' => $snapshot->price,
                    'battery_savings' => $snapshot->battery_savings,
                    'uid' => $plant->id,
                ];
            }),
            'devices' => $plant->devices->map(function ($device) {
                return [
                    'uid' => $device->id,
                    'device_type' => $device->device_type,
                    'device_manufacturer' => $device->device_manufacturer,
                    'device_model' => $device->device_model,
                    'device_status' => $device->device_status,
                    'parameters' => $device->parameters,
                    'updated_at' => $device->updated_at_unix,
                ];
            }),
        ];

        return response()->json($response);
    }
}
```

### **3. API Routes**

```php
// routes/api.php
use App\Http\Controllers\Api\PlantController;

Route::prefix('plants')->group(function () {
    Route::get('plant_list/{ownerId}', [PlantController::class, 'index']);
    Route::get('plant_view/{plantId}', [PlantController::class, 'show']);
});
```

---

## ⚛️ **React Frontend Implementation**

### **1. TypeScript Interfaces**

```typescript
// src/types/Plant.ts
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

export interface PlantMetadata {
  uid: string;
  owner: string;
  status: "Working" | "Error" | "Maintenance";
  capacity: number;
  latitude: number;
  longitude: number;
  updated_at: number;
}

export interface Device {
  uid: string;
  device_type: string;
  device_manufacturer: string;
  device_model: string;
  device_status: "Working" | "Error" | "Maintenance";
  parameters: Record<string, any>;
  updated_at: number;
}

export interface PlantViewResponse {
  plant_metadata: PlantMetadata;
  aggregated_data_snapshots: PlantDataSnapshot[];
  devices: Device[];
}

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
```

### **2. API Service**

```typescript
// src/services/api.ts
import { PlantListResponse, PlantViewResponse } from "../types/Plant";

const API_BASE_URL = "/api/plants";
const OWNER_ID = "your-owner-id-here"; // Replace with actual owner ID

export const plantApi = {
  async getPlantList(): Promise<PlantListResponse> {
    const response = await fetch(`${API_BASE_URL}/plant_list/${OWNER_ID}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch plants: ${response.statusText}`);
    }

    // Validate JSON response
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      if (text.includes("<!DOCTYPE html>") || text.includes("<html")) {
        throw new Error(
          "API returned HTML instead of JSON data. Check authentication.",
        );
      }
      throw new Error("API returned non-JSON response");
    }

    return response.json();
  },

  async getPlantView(
    plantId: string,
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<PlantViewResponse> {
    const response = await fetch(
      `${API_BASE_URL}/plant_view/${plantId}?start=${startTimestamp}&end=${endTimestamp}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch plant view: ${response.statusText}`);
    }

    // Validate JSON response
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      if (text.includes("<!DOCTYPE html>") || text.includes("<html")) {
        throw new Error(
          "API returned HTML instead of JSON data. Check authentication.",
        );
      }
      throw new Error("API returned non-JSON response");
    }

    const data = await response.json();

    if (!data || typeof data !== "object") {
      throw new Error("Invalid data format received from API");
    }

    return data;
  },

  getDateTimestamps(date: Date): { start: number; end: number } {
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
    );

    return {
      start: Math.floor(startOfDay.getTime() / 1000),
      end: Math.floor(endOfDay.getTime() / 1000),
    };
  },
};
```

### **3. Plants List Component**

```typescript
// src/components/PlantsList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plant } from '../types/Plant';
import { plantApi } from '../services/api';

export const PlantsList: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const response = await plantApi.getPlantList();
        setPlants(response.plants);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch plants');
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "working":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading plants</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Plant Monitoring</h1>
          <p className="text-gray-600">Monitor your solar plants in real-time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <Link
              key={plant.uid}
              to={`/plant/${plant.uid}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Plant #{plant.uid.substring(0, 8)}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(plant.status)}`}>
                  {plant.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div>Owner: {plant.owner}</div>
                <div>Devices: {plant.device_amount}</div>
                <div>Updated: {new Date(plant.updated_at * 1000).toLocaleString()}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### **4. Plant Details Component**

```typescript
// src/components/PlantDetails.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlantViewResponse, PlantDataSnapshot, ChartDataPoint } from '../types/Plant';
import { plantApi } from '../services/api';
import { PlantCharts } from './PlantCharts';
import { DataExportDialog } from './DataExportDialog';
import { exportPlantData } from '../utils/dataExport';

export const PlantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [plantData, setPlantData] = useState<PlantViewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchPlantData = useCallback(async (date: Date = new Date(), source: 'initial' | 'dateChange' | 'refresh' = 'initial') => {
    if (!id) return;

    try {
      if (source === 'dateChange' || source === 'refresh') {
        setChartLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const { start, end } = plantApi.getDateTimestamps(date);
      const response = await plantApi.getPlantView(id, start, end);
      setPlantData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch plant data");
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlantData(selectedDate, 'initial');
  }, [fetchPlantData]);

  useEffect(() => {
    if (plantData) {
      fetchPlantData(selectedDate, 'dateChange');
    }
  }, [selectedDate]);

  const processChartData = useCallback((snapshots: PlantDataSnapshot[]): ChartDataPoint[] => {
    if (!Array.isArray(snapshots)) {
      console.warn('processChartData: snapshots is not an array:', snapshots);
      return [];
    }

    const sortedSnapshots = [...snapshots].sort((a, b) => a.dt - b.dt);

    return sortedSnapshots
      .filter((snapshot) => {
        return snapshot &&
               typeof snapshot.dt === 'number' &&
               snapshot.dt > 0 &&
               typeof snapshot.pv_p === 'number';
      })
      .map((snapshot) => ({
        time: new Date(snapshot.dt * 1000).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: snapshot.dt,
        pv: snapshot.pv_p / 1000, // Convert to kW
        battery: snapshot.battery_p / 1000,
        grid: snapshot.grid_p / 1000,
        load: snapshot.load_p / 1000,
        battery_soc: snapshot.battery_soc,
        price: snapshot.price,
        battery_savings: snapshot.battery_savings,
        // Additional properties for export
        pv_power: snapshot.pv_p / 1000,
        battery_power: snapshot.battery_p / 1000,
        grid_power: snapshot.grid_p / 1000,
        load_power: snapshot.load_p / 1000,
        energy_price: snapshot.price,
      }));
  }, []);

  const chartData = useMemo(() => {
    if (!plantData) return [];
    return processChartData(plantData.aggregated_data_snapshots);
  }, [plantData, processChartData]);

  const handleExport = useCallback(async (config: any) => {
    if (!chartData || chartData.length === 0 || !id) {
      alert("No data available for export");
      return;
    }

    try {
      setExportLoading(true);
      await exportPlantData(chartData, config, id);
      alert("Export successful!");
      setShowExportDialog(false);
    } catch (error) {
      console.error('Export error:', error);
      alert("Export failed: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setExportLoading(false);
    }
  }, [chartData, id]);

  const handleRefresh = useCallback(() => {
    fetchPlantData(selectedDate, 'refresh');
  }, [fetchPlantData, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading plant data</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!plantData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">No plant data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Plant Details - #{id?.substring(0, 8)}
              </h1>
              <p className="text-gray-600">Real-time monitoring and analytics</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading || chartLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {(loading || chartLoading) ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => setShowExportDialog(true)}
                disabled={!chartData || chartData.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Plant Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Plant Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-600">Status:</span>
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                plantData.plant_metadata.status === 'Working'
                  ? 'bg-green-100 text-green-800'
                  : plantData.plant_metadata.status === 'Error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {plantData.plant_metadata.status}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Capacity:</span>
              <span className="ml-2 font-medium">{plantData.plant_metadata.capacity} kW</span>
            </div>
            <div>
              <span className="text-gray-600">Location:</span>
              <span className="ml-2 font-medium">
                {plantData.plant_metadata.latitude.toFixed(4)}, {plantData.plant_metadata.longitude.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Charts with Loading Animation */}
        <AnimatePresence mode="wait">
          {chartLoading ? (
            <motion.div
              key="chart-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg shadow-md p-6 h-96 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
                <div className="h-80 bg-gray-200 rounded"></div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chart-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PlantCharts
                chartData={chartData}
                selectedDate={selectedDate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Export Dialog */}
      <DataExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExport}
        loading={exportLoading}
      />
    </div>
  );
};
```

### **5. Chart Component**

```typescript
// src/components/PlantCharts.tsx
import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartDataPoint } from '../types/Plant';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PlantChartsProps {
  chartData: ChartDataPoint[];
  selectedDate: Date;
}

export const PlantCharts: React.FC<PlantChartsProps> = ({ chartData, selectedDate }) => {
  const [energyTab, setEnergyTab] = useState<"graph" | "data">("graph");
  const [batteryTab, setBatteryTab] = useState<"graph" | "data">("graph");
  const [savingsTab, setSavingsTab] = useState<"graph" | "data">("graph");

  // Energy Chart Data
  const energyChartData = {
    labels: chartData.map(point => point.time),
    datasets: [
      {
        label: 'PV Power (kW)',
        data: chartData.map(point => point.pv),
        borderColor: 'rgb(255, 206, 84)',
        backgroundColor: 'rgba(255, 206, 84, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Battery Power (kW)',
        data: chartData.map(point => point.battery),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Grid Power (kW)',
        data: chartData.map(point => point.grid),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Load Power (kW)',
        data: chartData.map(point => point.load),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
    ],
  };

  // Battery Chart Data
  const batteryChartData = {
    labels: chartData.map(point => point.time),
    datasets: [
      {
        label: 'Battery Power (kW)',
        data: chartData.map(point => point.battery),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y',
      },
      {
        label: 'Battery SOC (%)',
        data: chartData.map(point => point.battery_soc),
        borderColor: 'rgb(255, 206, 84)',
        backgroundColor: 'rgba(255, 206, 84, 0.2)',
        yAxisID: 'y1',
      },
    ],
  };

  // Savings Chart Data
  const savingsChartData = {
    labels: chartData.map(point => point.time),
    datasets: [
      {
        label: 'Battery Savings (€)',
        data: chartData.map(point => point.battery_savings),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        yAxisID: 'y',
      },
      {
        label: 'Energy Price (€/kWh)',
        data: chartData.map(point => point.price),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const totalSavings = useMemo(() => {
    return chartData.reduce((sum, point) => sum + point.battery_savings, 0);
  }, [chartData]);

  return (
    <div className="space-y-6">
      {/* Energy Chart */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Energy Live Chart</h3>
          <div className="flex mt-4">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                energyTab === "graph"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
              onClick={() => setEnergyTab("graph")}
            >
              Graph
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                energyTab === "data"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
              onClick={() => setEnergyTab("data")}
            >
              Data
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="h-96">
            {energyTab === "graph" ? (
              <Line data={energyChartData} options={chartOptions} />
            ) : (
              <div className="h-full overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">PV (kW)</th>
                      <th className="px-3 py-2 text-left">Battery (kW)</th>
                      <th className="px-3 py-2 text-left">Grid (kW)</th>
                      <th className="px-3 py-2 text-left">Load (kW)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((point, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2">{point.time}</td>
                        <td className="px-3 py-2">{point.pv.toFixed(2)}</td>
                        <td className="px-3 py-2">{point.battery.toFixed(2)}</td>
                        <td className="px-3 py-2">{point.grid.toFixed(2)}</td>
                        <td className="px-3 py-2">{point.load.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Battery Chart */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Battery Power & SOC</h3>
          <div className="flex mt-4">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                batteryTab === "graph"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
              onClick={() => setBatteryTab("graph")}
            >
              Graph
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                batteryTab === "data"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
              onClick={() => setBatteryTab("data")}
            >
              Data
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="h-96">
            {batteryTab === "graph" ? (
              <Line data={batteryChartData} options={chartOptions} />
            ) : (
              <div className="h-full overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">Power (kW)</th>
                      <th className="px-3 py-2 text-left">SOC (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((point, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2">{point.time}</td>
                        <td className="px-3 py-2">{point.battery.toFixed(2)}</td>
                        <td className="px-3 py-2">{point.battery_soc.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Savings Chart */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Battery Savings & Pricing</h3>
            <span className="text-sm text-green-600 font-medium">
              Total savings: {totalSavings.toFixed(2)}€
            </span>
          </div>
          <div className="flex mt-4">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                savingsTab === "graph"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
              onClick={() => setSavingsTab("graph")}
            >
              Graph
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                savingsTab === "data"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
              onClick={() => setSavingsTab("data")}
            >
              Data
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="h-96">
            {savingsTab === "graph" ? (
              <Line data={savingsChartData} options={chartOptions} />
            ) : (
              <div className="h-full overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">Savings (€)</th>
                      <th className="px-3 py-2 text-left">Price (€/kWh)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((point, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2">{point.time}</td>
                        <td className="px-3 py-2">{point.battery_savings.toFixed(2)}</td>
                        <td className="px-3 py-2">{point.price.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### **6. Data Export Components**

```typescript
// src/components/DataExportDialog.tsx
import React, { useState, useCallback } from 'react';
import { format } from 'date-fns';

export interface ExportConfig {
  fromDate: Date;
  toDate: Date;
  formats: {
    csv: boolean;
    xlsx: boolean;
  };
  dataTypes: string[];
}

interface DataExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (config: ExportConfig) => Promise<void>;
  loading?: boolean;
}

export const DataExportDialog: React.FC<DataExportDialogProps> = ({
  open,
  onOpenChange,
  onExport,
  loading = false,
}) => {
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [csvEnabled, setCsvEnabled] = useState(true);
  const [xlsxEnabled, setXlsxEnabled] = useState(true);

  const handleExport = useCallback(async () => {
    if (!csvEnabled && !xlsxEnabled) {
      alert('Please select at least one export format');
      return;
    }

    if (fromDate > toDate) {
      alert('From date cannot be after To date');
      return;
    }

    const config: ExportConfig = {
      fromDate,
      toDate,
      formats: {
        csv: csvEnabled,
        xlsx: xlsxEnabled,
      },
      dataTypes: [
        'PV Power',
        'Battery Power',
        'Grid Power',
        'Load Power',
        'Battery SOC',
        'Energy Price',
        'Battery Savings'
      ],
    };

    try {
      await onExport(config);
      onOpenChange(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  }, [fromDate, toDate, csvEnabled, xlsxEnabled, onExport, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Data Export</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Date Range */}
        <div className="mb-6">
          <h3 className="font-medium text-sm text-gray-700 mb-3">Select Date Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <input
                type="date"
                value={fromDate.toISOString().split('T')[0]}
                onChange={(e) => setFromDate(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <input
                type="date"
                value={toDate.toISOString().split('T')[0]}
                onChange={(e) => setToDate(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Export Formats */}
        <div className="mb-6">
          <h3 className="font-medium text-sm text-gray-700 mb-3">Export Format</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={csvEnabled}
                onChange={(e) => setCsvEnabled(e.target.checked)}
                className="mr-2"
              />
              CSV (Comma Separated Values)
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={xlsxEnabled}
                onChange={(e) => setXlsxEnabled(e.target.checked)}
                className="mr-2"
              />
              XLSX (Excel Spreadsheet)
            </label>
          </div>
        </div>

        {/* Data Types */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Data Included in Export</h4>
          <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
            <div>• PV Power (kW)</div>
            <div>• Battery Power (kW)</div>
            <div>• Grid Power (kW)</div>
            <div>• Load Power (kW)</div>
            <div>• Battery SOC (%)</div>
            <div>• Energy Price (€/kWh)</div>
            <div>• Battery Savings (€)</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            All chart data will be included in the selected file format(s)
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={loading || (!csvEnabled && !xlsxEnabled)}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating Export...' : 'Download Data'}
        </button>
      </div>
    </div>
  );
};
```

### **7. Export Utility**

```typescript
// src/utils/dataExport.ts
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ChartDataPoint } from "../types/Plant";
import { ExportConfig } from "../components/DataExportDialog";

export interface ExportDataPoint {
  timestamp: number;
  formatted_timestamp: string;
  datetime: string;
  date: string;
  time: string;
  pv_power: number;
  battery_power: number;
  grid_power: number;
  load_power: number;
  battery_soc: number;
  energy_price: number;
  battery_savings: number;
}

export const prepareExportData = (
  chartData: ChartDataPoint[],
): ExportDataPoint[] => {
  return chartData.map((point) => {
    const date = new Date(point.timestamp * 1000);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = dayNames[date.getDay()];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

    const formattedTimestamp = `${dayName} ${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}`;

    return {
      timestamp: point.timestamp,
      formatted_timestamp: formattedTimestamp,
      datetime: date.toLocaleString("en-US"),
      date: date.toLocaleDateString("en-US"),
      time: date.toLocaleTimeString("en-US"),
      pv_power: point.pv_power || point.pv || 0,
      battery_power: point.battery_power || point.battery || 0,
      grid_power: point.grid_power || point.grid || 0,
      load_power: point.load_power || point.load || 0,
      battery_soc: point.battery_soc || 0,
      energy_price: point.energy_price || point.price || 0,
      battery_savings: point.battery_savings || 0,
    };
  });
};

export const generateCSV = (data: ExportDataPoint[]): string => {
  const headers = [
    "Timestamp",
    "Formatted Timestamp",
    "Date & Time",
    "Date",
    "Time",
    "PV Power (kW)",
    "Battery Power (kW)",
    "Grid Power (kW)",
    "Load Power (kW)",
    "Battery SOC (%)",
    "Energy Price (€/kWh)",
    "Battery Savings (€)",
  ];

  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        row.timestamp,
        `"${row.formatted_timestamp}"`,
        `"${row.datetime}"`,
        `"${row.date}"`,
        `"${row.time}"`,
        row.pv_power,
        row.battery_power,
        row.grid_power,
        row.load_power,
        row.battery_soc,
        row.energy_price,
        row.battery_savings,
      ].join(","),
    ),
  ].join("\n");

  return csvContent;
};

export const downloadCSV = (
  data: ExportDataPoint[],
  filename: string,
): void => {
  const csvContent = generateCSV(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${filename}.csv`);
};

export const downloadXLSX = (
  data: ExportDataPoint[],
  filename: string,
): void => {
  const workbook = XLSX.utils.book_new();

  const worksheetData = [
    [
      "Timestamp",
      "Formatted Timestamp",
      "Date & Time",
      "Date",
      "Time",
      "PV Power (kW)",
      "Battery Power (kW)",
      "Grid Power (kW)",
      "Load Power (kW)",
      "Battery SOC (%)",
      "Energy Price (€/kWh)",
      "Battery Savings (€)",
    ],
    ...data.map((row) => [
      row.timestamp,
      row.formatted_timestamp,
      row.datetime,
      row.date,
      row.time,
      row.pv_power,
      row.battery_power,
      row.grid_power,
      row.load_power,
      row.battery_soc,
      row.energy_price,
      row.battery_savings,
    ]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Energy Data");

  // Add metadata sheet
  const metadataSheet = XLSX.utils.aoa_to_sheet([
    ["Export Information"],
    ["Generated Date:", new Date().toLocaleString()],
    ["Total Records:", data.length],
    [
      "Date Range:",
      data.length > 0
        ? `${data[0].date} to ${data[data.length - 1].date}`
        : "No data",
    ],
  ]);
  XLSX.utils.book_append_sheet(workbook, metadataSheet, "Export Info");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${filename}.xlsx`);
};

export const generateFilename = (
  config: ExportConfig,
  plantId: string,
): string => {
  const fromDateStr = config.fromDate.toISOString().split("T")[0];
  const toDateStr = config.toDate.toISOString().split("T")[0];

  if (fromDateStr === toDateStr) {
    return `plant-${plantId}-${fromDateStr}`;
  } else {
    return `plant-${plantId}-${fromDateStr}_to_${toDateStr}`;
  }
};

export const exportPlantData = async (
  chartData: ChartDataPoint[],
  config: ExportConfig,
  plantId: string,
): Promise<void> => {
  if (!chartData || chartData.length === 0) {
    throw new Error("No data available for export");
  }

  // Filter data by date range
  const fromTimestamp = Math.floor(config.fromDate.getTime() / 1000);
  const toTimestamp = Math.floor(config.toDate.getTime() / 1000) + 86399;

  const filteredData = chartData.filter(
    (point) =>
      point.timestamp >= fromTimestamp && point.timestamp <= toTimestamp,
  );

  if (filteredData.length === 0) {
    throw new Error(`No data found for the selected date range.`);
  }

  const exportData = prepareExportData(filteredData);
  const filename = generateFilename(config, plantId);

  const downloadPromises: Promise<void>[] = [];

  if (config.formats.csv) {
    downloadPromises.push(
      new Promise<void>((resolve) => {
        setTimeout(() => {
          downloadCSV(exportData, filename);
          resolve();
        }, 0);
      }),
    );
  }

  if (config.formats.xlsx) {
    downloadPromises.push(
      new Promise<void>((resolve) => {
        setTimeout(() => {
          downloadXLSX(exportData, filename);
          resolve();
        }, 100);
      }),
    );
  }

  await Promise.all(downloadPromises);
};
```

---

## 🔧 **Additional Configuration**

### **Laravel Configuration**

**1. CORS Configuration (config/cors.php):**

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000', 'http://localhost:5173'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

**2. API Routes Prefix (bootstrap/app.php for Laravel 11):**

```php
->withRouting(
    api: __DIR__.'/../routes/api.php',
    apiPrefix: 'api',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```

### **Vite Configuration**

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

### **TailwindCSS Configuration**

```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-teal": {
          500: "#14b8a6",
          600: "#0d9488",
        },
        "brand-blue": {
          500: "#3b82f6",
        },
      },
    },
  },
  plugins: [],
};
```

---

## 🚀 **Deployment Instructions**

### **Laravel Backend**

```bash
# Environment setup
php artisan key:generate
php artisan migrate
php artisan db:seed

# Production optimizations
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### **React Frontend**

```bash
# Production build
npm run build

# Preview build
npm run preview
```

---

## 📊 **Key Features Implemented**

### **✅ Real-time Data Visualization**

- Interactive charts with Chart.js
- Multiple chart types (Energy, Battery, Savings)
- Tab-based navigation between graph and data views
- Responsive design with loading animations

### **✅ Data Management**

- Date-based data filtering
- Real-time data refresh
- Comprehensive error handling
- Data validation at API and frontend levels

### **✅ Export Functionality**

- CSV and XLSX export formats
- Date range selection
- Comprehensive data inclusion
- Parallel file downloads
- Professional file naming conventions

### **✅ User Experience**

- Smooth loading animations with Framer Motion
- Interactive calendar navigation
- Status indicators and badges
- Responsive design for all screen sizes
- Toast notifications for user feedback

### **✅ Performance Optimizations**

- Memoized data processing
- Lazy loading components
- Efficient re-rendering with React.memo
- Optimized database queries with proper indexing

This comprehensive guide provides everything needed to recreate the plant monitoring system in Laravel 11 + React with all the features, reactivity, and user experience elements from the original application.
