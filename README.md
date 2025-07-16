# EDIS LAB EMS - Energy Management System

A modern React-based energy management system for monitoring solar PV plants with real-time data visualization and analytics.

## Features

### 🔋 Plant Management

- Complete CRUD operations for PV plants
- Real-time plant status monitoring
- Device and controller management
- Multi-plant dashboard view

### 📊 Advanced Charts & Analytics

- **Interactive Zoom**: X-axis zoom functionality with mouse wheel, drag selection, and pan
- **Dynamic Time Resolution**: Automatic tick adjustment based on zoom level
  - 15-minute intervals when zoomed in (< 2 hours)
  - 30-minute intervals for moderate zoom (< 6 hours)
  - Hourly intervals for normal view (< 12 hours)
  - 2-hour intervals when zoomed out
- **Multiple Chart Types**:
  - Energy Live: PV, Battery, Grid, Load Power + Battery SOC
  - Battery Power: Battery Power + Energy Price
  - Battery Savings: Battery Savings + Energy Price
- **Time Offset Control**: Adjustable time offset (-6 to +8 hours) for API data lag compensation

### 🛠️ Settings & Configuration

- **Time Offset Settings**: Control data time alignment through settings page
- **Persistent Configuration**: Settings saved in localStorage
- **Admin Dashboard**: Dropdown menu with settings access

## Installation

\`\`\`bash

# Clone the repository

git clone <repository-url>

# Install dependencies

npm install

# Start development server

npm run dev
\`\`\`

## Usage

### Chart Interaction

- **Zoom In/Out**: Use mouse wheel or zoom buttons
- **Pan**: Click and drag to move around the chart
- **Drag Zoom**: Click and drag to select an area to zoom into
- **Reset Zoom**: Click the reset button to return to full view

### Settings

1. Click the "Admin" dropdown in the header
2. Select "Settings"
3. Adjust time offset to compensate for API data lag
4. Changes apply immediately to all charts

## API Integration

The system connects to external energy management APIs:

- **Plant List**: `/api/plants/plant_list/{owner_id}`
- **Plant View**: `/api/plants/plant_view/{plant_id}?start={timestamp}&end={timestamp}`
- **Authentication**: Bearer token authentication
- **CORS**: Handled via Vite proxy configuration

## Technology Stack

- **Frontend**: React 18.3.1 with TypeScript
- **Charts**: Chart.js 4.x with react-chartjs-2
- **Zoom**: chartjs-plugin-zoom for interactive chart navigation
- **UI**: Tailwind CSS with custom components
- **Build**: Vite with hot module replacement
- **State**: React Context API for settings management

## Development

\`\`\`bash

# Start development server

npm run dev

# Build for production

npm run build

# Preview production build

npm run preview
\`\`\`

## Chart Configuration

The charts support:

- **Time Scale**: 24-hour timeline (00:00-24:00)
- **Dual Y-Axis**: Power (kW) and percentage/price scales
- **Real-time Updates**: Data refreshes based on selected date
- **Responsive Design**: Adapts to different screen sizes
