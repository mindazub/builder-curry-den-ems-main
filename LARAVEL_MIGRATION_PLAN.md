# Laravel 12 + React Migration Plan 🚀

## Energy Management System - Migration Guide

**Current Stack:** React + TypeScript + Vite + Node.js + Prisma  
**Target Stack:** Laravel 12 + React + TypeScript + Vite + MySQL/PostgreSQL

---

## 📋 **Table of Contents**

1. [Project Analysis](#project-analysis)
2. [Files to Copy & Keep](#files-to-copy--keep)
3. [Laravel Project Setup](#laravel-project-setup)
4. [File Structure Mapping](#file-structure-mapping)
5. [Code Modifications Required](#code-modifications-required)
6. [Step-by-Step Migration Process](#step-by-step-migration-process)
7. [Database Migration](#database-migration)
8. [API Endpoints Mapping](#api-endpoints-mapping)
9. [Testing & Deployment](#testing--deployment)
10. [Migration Checklist](#migration-checklist)

---

## 🎯 **Project Analysis**

### Current Project Structure

```
📁 Current Project/
├── client/ (React Frontend - KEEP 95%)
├── server/ (Node.js API - REPLACE with Laravel)
├── shared/ (Types & API - MODIFY)
├── public/ (Static Assets - KEEP)
├── prisma/ (Database - REPLACE with Laravel Eloquent)
└── Config files (Modify for Laravel)
```

### Migration Complexity: **MEDIUM** ⚖️

- **Frontend Components**: ✅ 95% Direct Copy
- **API Integration**: 🔄 Major Changes Required
- **Database Layer**: 🔄 Complete Rewrite
- **Authentication**: 🔄 Laravel Sanctum Implementation
- **Deployment**: 🔄 New Laravel Deployment Process

---

## ✅ **Files to Copy & Keep**

### 1. **Frontend Components (Direct Copy - 95%)**

```
📁 client/components/ → resources/js/components/
├── ui/ (All shadcn/ui components)
├── EnergyChart.tsx (Chart.js integration)
├── PlantCharts.tsx (Chart displays)
├── DateNavigation.tsx (Date picker & refresh)
├── Header.tsx
├── PlantStaticInfo.tsx
├── PlantDevices.tsx
├── DataExportDialog.tsx
└── ChartSkeleton.tsx
```

### 2. **Pages (Direct Copy)**

```
📁 client/pages/ → resources/js/pages/
├── Index.tsx
├── Landing.tsx
├── PlantDetails.tsx
├── Plants.tsx
└── NotFound.tsx
```

### 3. **React Utilities (Direct Copy)**

```
📁 client/hooks/ → resources/js/hooks/
├── use-mobile.tsx
└── use-toast.ts

📁 client/lib/ → resources/js/lib/
├── utils.ts
└── utils.spec.ts

📁 client/context/ → resources/js/context/
└── SettingsContext.tsx (if exists)
```

### 4. **Static Assets (Direct Copy)**

```
📁 public/ → public/
├── favicon.ico
├── placeholder.svg
└── robots.txt
```

### 5. **Configuration Files (Modify)**

```
✅ Keep & Adapt:
├── components.json (shadcn/ui config)
├── tailwind.config.ts
├── postcss.config.js
└── tsconfig.json

🔄 Replace:
├── package.json (new Laravel dependencies)
├── vite.config.ts (Laravel Vite plugin)
└── .env (Laravel environment)
```

---

## 🚀 **Laravel Project Setup**

### Step 1: Create Laravel Project

```bash
# Create Laravel 12 project
composer create-project laravel/laravel energy-management-system
cd energy-management-system

# Install React + TypeScript
npm install react react-dom @types/react @types/react-dom
npm install -D @vitejs/plugin-react typescript

# Install UI Dependencies (from your current package.json)
npm install @hookform/resolvers @radix-ui/react-accordion @radix-ui/react-alert-dialog
npm install @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-calendar
npm install @radix-ui/react-card @radix-ui/react-checkbox @radix-ui/react-collapsible
npm install @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar
npm install @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress
npm install @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select
npm install @radix-ui/react-separator @radix-ui/react-sheet @radix-ui/react-slider
npm install @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs
npm install @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group
npm install @radix-ui/react-tooltip

# Chart & Data Libraries
npm install chart.js react-chartjs-2 chartjs-adapter-date-fns
npm install date-fns framer-motion jspdf html2canvas

# UI & Icons
npm install lucide-react clsx tailwind-merge
npm install class-variance-authority tailwindcss-animate

# Form & Router
npm install react-hook-form react-router-dom

# Install Laravel Sanctum for API authentication
php artisan install:api
```

### Step 2: Laravel File Structure

```
📁 Laravel Project/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── PlantController.php
│   │   ├── AuthController.php
│   │   └── DataExportController.php
│   ├── Models/
│   │   ├── Plant.php
│   │   ├── PlantData.php
│   │   └── User.php
│   ├── Services/
│   │   ├── PlantDataService.php
│   │   └── ExportService.php
│   └── Policies/
│       └── PlantPolicy.php
├── resources/
│   ├── js/ (Your React app)
│   │   ├── components/ (copied from client/)
│   │   ├── pages/ (copied from client/)
│   │   ├── hooks/ (copied from client/)
│   │   ├── lib/ (copied from client/)
│   │   ├── services/
│   │   │   └── api.ts (modified from shared/api.ts)
│   │   ├── types/ (modified from shared/types.ts)
│   │   └── app.tsx (new entry point)
│   ├── css/
│   │   └── app.css (copied from client/global.css)
│   └── views/
│       └── app.blade.php (SPA entry point)
├── routes/
│   ├── api.php (API routes)
│   └── web.php (SPA route)
├── database/
│   ├── migrations/
│   │   ├── create_plants_table.php
│   │   └── create_plant_data_table.php
│   └── seeders/
└── config/ (Laravel configurations)
```

---

## 🔄 **Code Modifications Required**

### 1. **API Service Layer (Major Changes)**

**Current:** `shared/api.ts`

```typescript
const API_BASE_URL = "/api/plants";
```

**New:** `resources/js/services/api.ts`

```typescript
import axios from "axios";

// Laravel API configuration
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// CSRF token support
api.interceptors.request.use((config) => {
  const token = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
  if (token) {
    config.headers["X-CSRF-TOKEN"] = token;
  }

  // Laravel Sanctum auth token
  const authToken = localStorage.getItem("auth_token");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

export const plantApi = {
  getPlants: async (): Promise<PlantListResponse> => {
    const response = await api.get("/plants");
    return response.data;
  },

  getPlantView: async (
    id: string,
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<PlantViewResponse> => {
    const response = await api.get(`/plants/${id}`, {
      params: { start: startTimestamp, end: endTimestamp },
    });
    return response.data;
  },

  exportPlantData: async (id: string, config: any): Promise<Blob> => {
    const response = await api.post(`/plants/${id}/export`, config, {
      responseType: "blob",
    });
    return response.data;
  },
};
```

### 2. **Import Path Updates**

**In ALL React Components, change:**

```typescript
// Old imports
import { plantApi } from "../../shared/api";
import { ChartDataPoint } from "../../shared/types";

// New imports
import { plantApi } from "../services/api";
import { ChartDataPoint } from "../types";
```

### 3. **Laravel Vite Configuration**

**Create:** `vite.config.js`

```javascript
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.tsx"],
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./resources/js"),
      "@/components": path.resolve(__dirname, "./resources/js/components"),
      "@/pages": path.resolve(__dirname, "./resources/js/pages"),
      "@/hooks": path.resolve(__dirname, "./resources/js/hooks"),
      "@/lib": path.resolve(__dirname, "./resources/js/lib"),
    },
  },
  define: {
    global: "globalThis",
  },
});
```

### 4. **React App Entry Point**

**Create:** `resources/js/app.tsx`

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import "./bootstrap";
import "../css/app.css";

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
}
```

---

## 📊 **Database Migration**

### Current Prisma → Laravel Eloquent

**Create Migrations:**

```bash
php artisan make:migration create_plants_table
php artisan make:migration create_plant_data_table
```

**Plants Table Migration:**

```php
Schema::create('plants', function (Blueprint $table) {
    $table->id();
    $table->string('uid')->unique();
    $table->string('name');
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->enum('status', ['Working', 'Error', 'Maintenance'])->default('Working');
    $table->decimal('capacity', 8, 2);
    $table->decimal('latitude', 10, 8);
    $table->decimal('longitude', 11, 8);
    $table->timestamps();
});
```

**Plant Data Migration:**

```php
Schema::create('plant_data', function (Blueprint $table) {
    $table->id();
    $table->foreignId('plant_id')->constrained()->onDelete('cascade');
    $table->integer('dt'); // timestamp
    $table->decimal('pv_p', 10, 2); // PV power
    $table->decimal('battery_p', 10, 2); // Battery power
    $table->decimal('grid_p', 10, 2); // Grid power
    $table->decimal('load_p', 10, 2); // Load power
    $table->decimal('battery_soc', 5, 2); // Battery SOC %
    $table->decimal('price', 8, 4); // Energy price
    $table->decimal('battery_savings', 8, 2); // Battery savings
    $table->timestamps();

    $table->index(['plant_id', 'dt']);
});
```

---

## 🌐 **API Endpoints Mapping**

### Current → Laravel Routes

| Current Endpoint                 | Laravel Route                     | Controller Method             |
| -------------------------------- | --------------------------------- | ----------------------------- |
| `GET /api/plants`                | `GET /api/plants`                 | `PlantController@index`       |
| `GET /api/plants/{id}?start&end` | `GET /api/plants/{plant}`         | `PlantController@show`        |
| `POST /api/export`               | `POST /api/plants/{plant}/export` | `DataExportController@export` |
| `POST /api/auth/login`           | `POST /api/auth/login`            | `AuthController@login`        |
| `POST /api/auth/register`        | `POST /api/auth/register`         | `AuthController@register`     |
| `POST /api/auth/logout`          | `POST /api/auth/logout`           | `AuthController@logout`       |

### Laravel API Routes (`routes/api.php`):

```php
<?php
use App\Http\Controllers\Api\{PlantController, AuthController, DataExportController};
use Illuminate\Support\Facades\Route;

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });
});

// Protected plant routes
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('plants')->group(function () {
        Route::get('/', [PlantController::class, 'index']);
        Route::get('/{plant}', [PlantController::class, 'show']);
        Route::post('/{plant}/export', [DataExportController::class, 'export']);
    });
});
```

---

## 📝 **Step-by-Step Migration Process**

### Phase 1: Laravel Project Setup ⚙️

1. **Create Laravel Project**

   ```bash
   composer create-project laravel/laravel energy-management-system
   cd energy-management-system
   ```

2. **Install Dependencies**

   ```bash
   # Install React & TypeScript
   npm install react react-dom @types/react @types/react-dom
   npm install -D @vitejs/plugin-react typescript

   # Install all UI dependencies (copy from current package.json)
   # [Copy your current dependencies list here]

   # Install Laravel Sanctum
   php artisan install:api
   ```

3. **Environment Setup**

   ```bash
   # Configure .env file
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=energy_management
   DB_USERNAME=root
   DB_PASSWORD=

   # Your API configurations
   PLANT_API_URL=your_external_api_url
   PLANT_API_KEY=your_api_key
   ```

### Phase 2: File Migration 📁

1. **Copy Frontend Files**

   ```bash
   # Copy component directories
   cp -r client/components resources/js/components
   cp -r client/pages resources/js/pages
   cp -r client/hooks resources/js/hooks
   cp -r client/lib resources/js/lib

   # Copy styles
   cp client/global.css resources/css/app.css

   # Copy static assets
   cp -r public/* public/

   # Copy config files
   cp components.json .
   cp tailwind.config.ts .
   cp postcss.config.js .
   ```

2. **Create Laravel-Specific Files**

   ```bash
   # Create API service
   mkdir -p resources/js/services
   # [Copy modified api.ts content]

   # Create types
   mkdir -p resources/js/types
   # [Copy and modify shared/types.ts]

   # Create React entry point
   # [Create resources/js/app.tsx]
   ```

### Phase 3: Backend Development 🔧

1. **Database Setup**

   ```bash
   php artisan make:migration create_plants_table
   php artisan make:migration create_plant_data_table
   php artisan migrate
   ```

2. **Create Models**

   ```bash
   php artisan make:model Plant
   php artisan make:model PlantData
   ```

3. **Create Controllers**

   ```bash
   php artisan make:controller Api/PlantController
   php artisan make:controller Api/AuthController
   php artisan make:controller Api/DataExportController
   ```

4. **Create Services**
   ```bash
   php artisan make:service PlantDataService
   php artisan make:service ExportService
   ```

### Phase 4: Code Updates 🔄

1. **Update All React Component Imports**

   - Replace `../../shared/api` → `../services/api`
   - Replace `../../shared/types` → `../types`

2. **Update API Calls**

   - Add CSRF token handling
   - Add Laravel Sanctum auth headers
   - Update endpoint URLs

3. **Configure Laravel Blade Template**
   ```php
   <!-- resources/views/app.blade.php -->
   <!DOCTYPE html>
   <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
   <head>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <meta name="csrf-token" content="{{ csrf_token() }}">
       <title>Energy Management System</title>
       @vite(['resources/css/app.css', 'resources/js/app.tsx'])
   </head>
   <body>
       <div id="app"></div>
   </body>
   </html>
   ```

### Phase 5: Testing & Debugging 🧪

1. **Development Testing**

   ```bash
   # Run Laravel development server
   php artisan serve

   # In another terminal, compile React
   npm run dev

   # Check for errors in browser console
   # Test API endpoints with Postman/Insomnia
   ```

2. **Database Seeding**
   ```bash
   php artisan make:seeder PlantSeeder
   php artisan db:seed
   ```

---

## ✅ **Migration Checklist**

### Pre-Migration

- [ ] Backup current project
- [ ] Document current API endpoints
- [ ] List all dependencies
- [ ] Identify custom configurations

### Laravel Setup

- [ ] Create Laravel 12 project
- [ ] Install React + TypeScript
- [ ] Install all UI dependencies
- [ ] Configure Laravel Sanctum
- [ ] Setup database connection

### File Migration

- [ ] Copy all React components
- [ ] Copy pages and hooks
- [ ] Copy utility functions
- [ ] Copy static assets
- [ ] Copy and adapt config files

### Code Updates

- [ ] Update all import paths
- [ ] Modify API service for Laravel
- [ ] Update authentication flow
- [ ] Configure CSRF protection
- [ ] Setup Laravel routes

### Backend Development

- [ ] Create database migrations
- [ ] Create Eloquent models
- [ ] Create API controllers
- [ ] Implement business services
- [ ] Setup route policies

### Testing

- [ ] Test API endpoints
- [ ] Test React components
- [ ] Test authentication flow
- [ ] Test data export functionality
- [ ] Test chart functionality

### Deployment

- [ ] Configure production environment
- [ ] Setup database production
- [ ] Configure web server
- [ ] Setup SSL certificates
- [ ] Configure CDN (if needed)

---

## 🚨 **Files NOT to Copy**

### Backend (Replace with Laravel)

- `server/` directory → Replace with Laravel controllers
- `netlify/` directory → Not needed for Laravel
- `prisma/` directory → Replace with Laravel Eloquent
- `vite.config.server.ts` → Use Laravel Vite plugin

### Configuration (Modify)

- `package.json` → Create new with Laravel dependencies
- `.env` → Create new Laravel environment file
- Current API routes → Replace with Laravel routes

---

## 🔧 **Laravel Controller Examples**

### PlantController.php

```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plant;
use App\Services\PlantDataService;
use Illuminate\Http\Request;

class PlantController extends Controller
{
    public function __construct(
        private PlantDataService $plantDataService
    ) {}

    public function index()
    {
        $plants = Plant::where('user_id', auth()->id())->get();
        return response()->json(['plants' => $plants]);
    }

    public function show(Plant $plant, Request $request)
    {
        $this->authorize('view', $plant);

        $request->validate([
            'start' => 'required|integer',
            'end' => 'required|integer',
        ]);

        $data = $this->plantDataService->getPlantData(
            $plant,
            $request->integer('start'),
            $request->integer('end')
        );

        return response()->json($data);
    }
}
```

---

## 📈 **Expected Timeline**

| Phase                   | Duration | Tasks                                      |
| ----------------------- | -------- | ------------------------------------------ |
| **Setup**               | 1-2 days | Laravel project, dependencies, environment |
| **File Migration**      | 1 day    | Copy React components, update imports      |
| **Backend Development** | 3-4 days | Controllers, models, services, routes      |
| **Integration**         | 2-3 days | Connect React to Laravel APIs              |
| **Testing**             | 2-3 days | Debug, test all functionality              |
| **Deployment**          | 1-2 days | Production setup, server configuration     |

**Total Estimated Time: 10-15 days**

---

## 💡 **Benefits After Migration**

### Laravel Advantages

- **Robust Authentication** (Laravel Sanctum)
- **Powerful ORM** (Eloquent)
- **Built-in Security** (CSRF, XSS protection)
- **Artisan Commands** (Easy database management)
- **Queue System** (Background jobs)
- **Caching** (Redis, Memcached support)

### Maintained Features

- **All Chart Functionality** (Chart.js integration)
- **Responsive UI** (Tailwind CSS + shadcn/ui)
- **Data Export** (PDF, CSV, PNG)
- **Date Navigation** (Calendar picker)
- **Real-time Updates** (5-minute auto-refresh)
- **Smart Caching** (Enhanced with Laravel cache)

---

## 🎯 **Success Metrics**

- [ ] All React components work without modification
- [ ] Charts display correctly with same functionality
- [ ] Authentication flow works with Laravel Sanctum
- [ ] Data export maintains all current formats
- [ ] Performance equals or exceeds current implementation
- [ ] Auto-refresh timer functions correctly
- [ ] All UI interactions preserved

---

**Migration Complexity Assessment: MEDIUM**

- Frontend: 85% direct copy ✅
- API Integration: Major rewrite required 🔄
- Database: Moderate changes needed 🔄
- Authentication: Complete Laravel Sanctum implementation 🔄
- Overall: Well-structured migration with clear steps 📋

---

_This migration plan preserves your excellent React frontend while leveraging Laravel's robust backend capabilities. Your Chart.js implementation, UI components, and user experience will remain identical while gaining Laravel's enterprise-level features._
