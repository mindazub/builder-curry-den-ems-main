# Design Templates & Frontend Style Guide

## Plant Monitoring System UI/UX Implementation

### 🎨 **Visual Design Overview**

This guide provides comprehensive design templates, styling patterns, and UI/UX guidelines to recreate the exact visual appearance and user experience of the plant monitoring system.

---

## 🎯 **Color Palette & Brand Identity**

### **Primary Colors**

```css
/* Brand Teal - Primary Action Colors */
--brand-teal-50: #f0fdfa;
--brand-teal-100: #ccfbf1;
--brand-teal-200: #99f6e4;
--brand-teal-300: #5eead4;
--brand-teal-400: #2dd4bf;
--brand-teal-500: #14b8a6; /* Primary brand color */
--brand-teal-600: #0d9488; /* Active states */
--brand-teal-700: #0f766e;
--brand-teal-800: #115e59;
--brand-teal-900: #134e4a;

/* Secondary Blues */
--brand-blue-50: #eff6ff;
--brand-blue-100: #dbeafe;
--brand-blue-200: #bfdbfe;
--brand-blue-300: #93c5fd;
--brand-blue-400: #60a5fa;
--brand-blue-500: #3b82f6; /* Secondary actions */
--brand-blue-600: #2563eb;
--brand-blue-700: #1d4ed8;
--brand-blue-800: #1e40af;
--brand-blue-900: #1e3a8a;
```

### **Status Indicator Colors**

```css
/* Status Colors */
--status-working: #10b981; /* Green - Working status */
--status-working-bg: #d1fae5; /* Light green background */
--status-error: #ef4444; /* Red - Error status */
--status-error-bg: #fee2e2; /* Light red background */
--status-maintenance: #f59e0b; /* Amber - Maintenance */
--status-maintenance-bg: #fef3c7; /* Light amber background */

/* Chart Colors */
--chart-pv: #fbbf24; /* PV Power - Golden Yellow */
--chart-battery: #10b981; /* Battery - Green */
--chart-grid: #8b5cf6; /* Grid - Purple */
--chart-load: #ef4444; /* Load - Red */
--chart-savings: #22c55e; /* Savings - Bright Green */
--chart-price: #ef4444; /* Price - Red */
```

### **Neutral Grays**

```css
/* Gray Scale */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

---

## 🏗️ **Layout & Spacing System**

### **Container Layouts**

```css
/* Main Container */
.main-container {
  max-width: 1280px; /* max-w-7xl */
  margin: 0 auto;
  padding: 0 1rem; /* px-4 */
}

@media (min-width: 640px) {
  .main-container {
    padding: 0 1.5rem; /* sm:px-6 */
  }
}

@media (min-width: 1024px) {
  .main-container {
    padding: 0 2rem; /* lg:px-8 */
  }
}

/* Page Sections */
.page-section {
  padding: 2rem 0; /* py-8 */
  min-height: 100vh;
  background-color: #f9fafb; /* bg-gray-50 */
}
```

### **Spacing Scale**

```css
/* Spacing Variables */
--spacing-xs: 0.25rem; /* 1 */
--spacing-sm: 0.5rem; /* 2 */
--spacing-md: 1rem; /* 4 */
--spacing-lg: 1.5rem; /* 6 */
--spacing-xl: 2rem; /* 8 */
--spacing-2xl: 3rem; /* 12 */
--spacing-3xl: 4rem; /* 16 */

/* Component Spacing */
.component-spacing {
  gap: var(--spacing-lg); /* space-y-6 for vertical stacking */
}
```

---

## 🃏 **Card Components Design**

### **Base Card Structure**

```css
.card-base {
  background: white;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow-md */
  overflow: hidden;
  transition: box-shadow 0.2s ease-in-out;
}

.card-base:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); /* hover:shadow-lg */
}

.card-header {
  padding: 1.5rem; /* p-6 */
  border-bottom: 1px solid #e5e7eb; /* border-gray-200 */
  background: white;
}

.card-content {
  padding: 1.5rem; /* p-6 */
}

.card-title {
  font-size: 1.125rem; /* text-lg */
  font-weight: 600; /* font-semibold */
  color: #111827; /* text-gray-900 */
  margin: 0;
}
```

### **Plant List Cards**

```css
.plant-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  text-decoration: none;
  display: block;
}

.plant-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.plant-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.plant-card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.plant-card-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}
```

### **Chart Cards**

```css
.chart-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.chart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-content {
  padding: 1.5rem;
}

.chart-container {
  height: 29.25rem; /* h-[29.25rem] - approximately 468px */
  position: relative;
}
```

---

## 🎛️ **Interactive Elements**

### **Tab Navigation**

```css
.tab-navigation {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 1.5rem;
}

.tab-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
}

.tab-button:hover {
  color: #374151;
}

.tab-button.active {
  color: #0d9488; /* brand-teal-600 */
  border-bottom-color: #0d9488;
}

.tab-button:focus {
  outline: none;
  ring: 2px solid #14b8a6;
  ring-opacity: 0.5;
}
```

### **Buttons**

```css
/* Primary Button */
.btn-primary {
  background-color: #0d9488; /* brand-teal-600 */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  background-color: #0f766e; /* brand-teal-700 */
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Secondary Button */
.btn-secondary {
  background-color: #3b82f6; /* brand-blue-500 */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: #2563eb; /* brand-blue-600 */
}

/* Outline Button */
.btn-outline {
  background-color: transparent;
  color: #6b7280;
  padding: 0.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-outline:hover {
  background-color: #f3f4f6;
  color: #374151;
}
```

### **Status Badges**

```css
.status-badge {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  text-transform: capitalize;
}

.status-working {
  background-color: #d1fae5; /* green-100 */
  color: #065f46; /* green-800 */
}

.status-error {
  background-color: #fee2e2; /* red-100 */
  color: #991b1b; /* red-800 */
}

.status-maintenance {
  background-color: #fef3c7; /* yellow-100 */
  color: #92400e; /* yellow-800 */
}

.status-unknown {
  background-color: #f3f4f6; /* gray-100 */
  color: #1f2937; /* gray-800 */
}
```

---

## 📊 **Chart Styling**

### **Chart Container Styling**

```css
.chart-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.chart-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.chart-skeleton {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

### **Chart Color Configuration**

```javascript
// Chart.js Color Palette
const chartColors = {
  pv: {
    border: "rgb(255, 206, 84)", // Golden Yellow
    background: "rgba(255, 206, 84, 0.2)",
  },
  battery: {
    border: "rgb(75, 192, 192)", // Teal
    background: "rgba(75, 192, 192, 0.2)",
  },
  grid: {
    border: "rgb(153, 102, 255)", // Purple
    background: "rgba(153, 102, 255, 0.2)",
  },
  load: {
    border: "rgb(255, 99, 132)", // Red
    background: "rgba(255, 99, 132, 0.2)",
  },
  savings: {
    border: "rgb(34, 197, 94)", // Green
    background: "rgba(34, 197, 94, 0.2)",
  },
  price: {
    border: "rgb(239, 68, 68)", // Red
    background: "rgba(239, 68, 68, 0.2)",
  },
  soc: {
    border: "rgb(255, 206, 84)", // Golden Yellow
    background: "rgba(255, 206, 84, 0.2)",
  },
};
```

### **Data Table Styling**

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem; /* text-sm */
}

.data-table thead {
  background-color: #f9fafb; /* bg-gray-50 */
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th {
  padding: 0.75rem; /* px-3 py-2 */
  text-align: left;
  font-weight: 500;
  color: #374151; /* text-gray-700 */
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 0.75rem; /* px-3 py-2 */
  color: #111827; /* text-gray-900 */
  border-bottom: 1px solid #f3f4f6; /* border-gray-100 */
}

.data-table tbody tr:hover {
  background-color: #f9fafb; /* hover:bg-gray-50 */
}

.data-table-container {
  height: 100%;
  overflow: auto;
  border-radius: 0.375rem;
}
```

---

## 🎭 **Animation & Transitions**

### **Loading Animations**

```css
/* Spinner Animation */
.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #0d9488;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner-large {
  width: 8rem;
  height: 8rem;
  border-width: 2px;
}

/* Skeleton Loading */
.skeleton {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-text {
  height: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.skeleton-chart {
  height: 20rem;
  border-radius: 0.5rem;
}
```

### **Page Transitions (Framer Motion)**

```javascript
// Animation Variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const chartVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};
```

---

## 📱 **Responsive Design**

### **Breakpoints**

```css
/* Mobile First Approach */
/* Base styles for mobile (0px and up) */

/* Small tablets and large phones (640px and up) */
@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem;
  }
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablets (768px and up) */
@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
  .plant-info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktops (1024px and up) */
@media (min-width: 1024px) {
  .container {
    padding: 0 2rem;
  }
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large desktops (1280px and up) */
@media (min-width: 1280px) {
  .grid-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### **Grid Layouts**

```css
.plant-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .plant-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .plant-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.info-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 🎪 **Modal & Dialog Design**

### **Export Dialog**

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 24rem; /* w-96 */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #6b7280;
}
```

### **Form Elements in Dialogs**

```css
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.75rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #14b8a6;
  ring: 2px solid rgba(20, 184, 166, 0.2);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-input {
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  accent-color: #14b8a6;
}

.info-panel {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.info-panel-title {
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.info-grid-small {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.info-note {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
}
```

---

## 🖼️ **Icon Usage Guidelines**

### **Icon Library (Lucide React)**

```javascript
// Common icons used in the system
import {
  Download, // Export/download actions
  FileImage, // PNG export
  FileText, // CSV export
  FileSpreadsheet, // XLSX export
  Refresh, // Refresh data
  Calendar, // Date selection
  TrendingUp, // Performance indicators
  Battery, // Battery status
  Sun, // Solar/PV power
  Zap, // Energy/power
  DollarSign, // Cost/savings
  AlertTriangle, // Warning/error states
  CheckCircle, // Success states
  Clock, // Time-related
  MapPin, // Location
  Settings, // Configuration
} from "lucide-react";
```

### **Icon Sizing**

```css
.icon-xs {
  width: 0.75rem;
  height: 0.75rem;
} /* 12px */
.icon-sm {
  width: 1rem;
  height: 1rem;
} /* 16px */
.icon-md {
  width: 1.25rem;
  height: 1.25rem;
} /* 20px */
.icon-lg {
  width: 1.5rem;
  height: 1.5rem;
} /* 24px */
.icon-xl {
  width: 2rem;
  height: 2rem;
} /* 32px */

/* Icon in buttons */
.btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon svg {
  width: 1rem;
  height: 1rem;
}

/* Icon-only buttons */
.btn-icon-only {
  padding: 0.25rem;
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

---

## 🎨 **Typography System**

### **Font Hierarchy**

```css
/* Headings */
.heading-1 {
  font-size: 2.25rem; /* text-4xl */
  font-weight: 800; /* font-extrabold */
  line-height: 1.1;
  color: #111827; /* text-gray-900 */
}

.heading-2 {
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700; /* font-bold */
  line-height: 1.2;
  color: #111827;
}

.heading-3 {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700; /* font-bold */
  line-height: 1.3;
  color: #111827;
}

.heading-4 {
  font-size: 1.25rem; /* text-xl */
  font-weight: 600; /* font-semibold */
  line-height: 1.4;
  color: #111827;
}

.heading-5 {
  font-size: 1.125rem; /* text-lg */
  font-weight: 600; /* font-semibold */
  line-height: 1.5;
  color: #111827;
}

/* Body Text */
.body-large {
  font-size: 1.125rem; /* text-lg */
  font-weight: 400; /* font-normal */
  line-height: 1.6;
  color: #374151; /* text-gray-700 */
}

.body-normal {
  font-size: 1rem; /* text-base */
  font-weight: 400;
  line-height: 1.6;
  color: #374151;
}

.body-small {
  font-size: 0.875rem; /* text-sm */
  font-weight: 400;
  line-height: 1.5;
  color: #6b7280; /* text-gray-500 */
}

.body-xs {
  font-size: 0.75rem; /* text-xs */
  font-weight: 400;
  line-height: 1.4;
  color: #6b7280;
}

/* Special Text */
.text-muted {
  color: #6b7280; /* text-gray-500 */
}

.text-accent {
  color: #0d9488; /* text-brand-teal-600 */
}

.text-success {
  color: #059669; /* text-green-600 */
}

.text-error {
  color: #dc2626; /* text-red-600 */
}

.text-warning {
  color: #d97706; /* text-amber-600 */
}
```

---

## 🎪 **Layout Components**

### **Page Header Template**

```html
<div class="page-header">
  <div class="main-container">
    <div class="header-content">
      <div class="header-text">
        <h1 class="heading-2">Page Title</h1>
        <p class="body-normal text-muted">Page description or subtitle</p>
      </div>
      <div class="header-actions">
        <button class="btn-secondary">
          <RefreshIcon class="icon-sm" />
          Refresh
        </button>
        <button class="btn-primary">
          <DownloadIcon class="icon-sm" />
          Export Data
        </button>
      </div>
    </div>
  </div>
</div>
```

### **Info Panel Template**

```html
<div class="card-base">
  <div class="card-header">
    <h2 class="heading-5">Information Panel</h2>
  </div>
  <div class="card-content">
    <div class="info-grid">
      <div class="info-item">
        <span class="body-small text-muted">Label:</span>
        <span class="body-normal">Value</span>
      </div>
      <!-- Repeat for more items -->
    </div>
  </div>
</div>
```

### **Chart Card Template**

```html
<div class="chart-card">
  <div class="chart-header">
    <div class="chart-header-content">
      <h3 class="heading-5">Chart Title</h3>
      <span class="body-small text-accent">Additional Info</span>
    </div>
    <div class="chart-actions">
      <button class="btn-outline">
        <DownloadIcon class="icon-sm" />
      </button>
    </div>
  </div>

  <div class="tab-navigation">
    <button class="tab-button active">Graph</button>
    <button class="tab-button">Data</button>
  </div>

  <div class="chart-content">
    <div class="chart-container">
      <!-- Chart or table content -->
    </div>
  </div>
</div>
```

---

## 🎯 **State Management Patterns**

### **Loading States**

```css
.loading-state {
  opacity: 0.6;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.loading-overlay {
  position: relative;
}

.loading-overlay::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}
```

### **Error States**

```css
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 20rem;
  text-align: center;
  color: #6b7280;
}

.error-icon {
  width: 3rem;
  height: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.error-message {
  font-size: 0.875rem;
  color: #6b7280;
  max-width: 28rem;
}
```

### **Empty States**

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 20rem;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-message {
  font-size: 0.875rem;
  color: #6b7280;
  max-width: 28rem;
}
```

---

## 📐 **Measurement Guidelines**

### **Component Dimensions**

```css
/* Standard Heights */
--height-input: 2.5rem; /* 40px */
--height-button: 2.5rem; /* 40px */
--height-button-sm: 2rem; /* 32px */
--height-button-lg: 3rem; /* 48px */
--height-card-header: 4rem; /* 64px */
--height-chart: 29.25rem; /* 468px */

/* Standard Widths */
--width-sidebar: 16rem; /* 256px */
--width-modal: 24rem; /* 384px */
--width-modal-lg: 32rem; /* 512px */
--max-width-container: 80rem; /* 1280px */

/* Border Radius */
--radius-sm: 0.25rem; /* 4px */
--radius-md: 0.375rem; /* 6px */
--radius-lg: 0.5rem; /* 8px */
--radius-full: 9999px; /* Full rounded */
```

### **Z-Index Scale**

```css
--z-dropdown: 10;
--z-sticky: 20;
--z-fixed: 30;
--z-modal-backdrop: 40;
--z-modal: 50;
--z-popover: 60;
--z-tooltip: 70;
```

---

## 🎨 **CSS Custom Properties Implementation**

```css
:root {
  /* Colors */
  --color-primary: #0d9488;
  --color-primary-hover: #0f766e;
  --color-secondary: #3b82f6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* Background Colors */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-muted: #f3f4f6;

  /* Text Colors */
  --text-primary: #111827;
  --text-secondary: #374151;
  --text-muted: #6b7280;

  /* Spacing */
  --spacing-unit: 0.25rem;
  --spacing-xs: calc(var(--spacing-unit) * 1);
  --spacing-sm: calc(var(--spacing-unit) * 2);
  --spacing-md: calc(var(--spacing-unit) * 4);
  --spacing-lg: calc(var(--spacing-unit) * 6);
  --spacing-xl: calc(var(--spacing-unit) * 8);

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-lg:
    0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-xl:
    0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
  --transition-slow: 0.3s ease;

  /* Typography */
  --font-family:
    "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1f2937;
    --bg-secondary: #111827;
    --bg-muted: #374151;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --text-muted: #9ca3af;
  }
}
```

This comprehensive design guide provides all the visual specifications, styling patterns, and implementation details needed to recreate the exact appearance and user experience of your plant monitoring system. The templates are designed to be responsive, accessible, and maintainable while preserving the professional look and smooth interactions of the original application.
