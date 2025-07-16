# Map Configuration Guide

## Setting up Static Maps

The application supports three types of maps for plant location visualization:

### 1. Static Map (Recommended)

Uses Google Maps Static API or Mapbox Static API to display real satellite/street maps.

**Setup:**

1. Copy `.env.example` to `.env`
2. Add your API key:

#### Google Maps API:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**How to get Google Maps API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/overview)
2. Create a new project or select existing
3. Enable "Maps Static API"
4. Create credentials (API Key)
5. Restrict the API key to your domain

#### Mapbox (Alternative):

```env
REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
```

**How to get Mapbox Access Token:**

1. Go to [Mapbox Account](https://account.mapbox.com/access-tokens/)
2. Create a new token
3. Copy the token to your .env file

### 2. Simple View

Custom-built plant location viewer with basic map representation.

### 3. Interactive Map

React Leaflet implementation with full pan/zoom functionality.

## Map Features

- **Plant Status Indicator**: Color-coded status (green=working, red=error, yellow=maintenance)
- **Plant Information Panel**: Shows plant ID, capacity, status, and coordinates
- **External Links**: Direct links to OpenStreetMap and Google Maps
- **Fallback Options**: Graceful degradation if API keys are missing

## Usage

Users can switch between map types using the dropdown in the map header:

- **Static Map**: Real satellite/street view (requires API key)
- **Simple View**: Custom visualization (no API key needed)
- **Interactive**: Full pan/zoom functionality

## Error Handling

The application includes comprehensive error handling:

- Missing API keys: Falls back to OpenStreetMap embed
- Network errors: Shows error message with coordinates
- Component errors: Error boundary catches and displays fallback

## Performance

- Static maps load instantly (cached by map provider)
- Simple view has no external dependencies
- Interactive maps load on-demand
