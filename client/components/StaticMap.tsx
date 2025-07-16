import React, { useEffect, useState } from 'react';
import { MapPin, ExternalLink, AlertTriangle } from 'lucide-react';

interface StaticMapProps {
  latitude: number;
  longitude: number;
  plantId: string;
  plantName?: string;
  capacity?: number;
  status?: string;
  width?: number;
  height?: number;
  zoom?: number;
}

export default function StaticMap({ 
  latitude, 
  longitude, 
  plantId, 
  plantName, 
  capacity, 
  status,
  width = 400,
  height = 300,
  zoom = 14
}: StaticMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-sm">Loading map...</div>
        </div>
      </div>
    );
  }

  // Google Maps API key - replace with your actual API key
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";
  
  // OpenStreetMap static map alternatives
  const osmStaticUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
  
  // Google Maps Static API URL
  const googleStaticUrl = apiKey 
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&markers=color:green|label:S|${latitude},${longitude}&key=${apiKey}`
    : null;

  // MapBox static map (free tier available)
  const mapboxToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || "";
  const mapboxStaticUrl = mapboxToken 
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-solar+green(${longitude},${latitude})/${longitude},${latitude},${zoom}/${width}x${height}?access_token=${mapboxToken}`
    : null;

  // External map URLs
  const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=${zoom}`;
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="h-full rounded-lg overflow-hidden bg-white">
      <div className="h-full flex flex-col">
        {/* Map Image */}
        <div className="flex-1 relative">
          {!imageError && (googleStaticUrl || mapboxStaticUrl) ? (
            <img
              src={googleStaticUrl || mapboxStaticUrl || ''}
              width={width}
              height={height}
              alt="Plant Location Map"
              className="w-full h-full object-cover rounded-lg"
              onError={handleImageError}
            />
          ) : (
            // Fallback to embedded OSM map
            <iframe
              src={osmStaticUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Plant Location Map"
              className="rounded-lg"
              onError={handleImageError}
            />
          )}
          
          {/* Plant info overlay */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg shadow-lg p-3 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${
                status === 'Working' ? 'bg-green-500' : 
                status === 'Error' ? 'bg-red-500' : 
                'bg-yellow-500'
              }`}></div>
              <h3 className="font-semibold text-sm">
                {plantName || `Plant ${plantId.substring(0, 8)}`}
              </h3>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Plant ID:</span>
                <span className="font-medium">{plantId.substring(0, 8)}</span>
              </div>
              {capacity && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{(capacity / 1000).toFixed(1)} kW</span>
                </div>
              )}
              {status && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    status === 'Working' ? 'text-green-600' : 
                    status === 'Error' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {status}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Coordinates:</span>
                <span className="font-medium">{latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
              </div>
            </div>
          </div>
          
          {/* API Key warning */}
          {!apiKey && !mapboxToken && (
            <div className="absolute top-4 right-4 bg-yellow-100 border border-yellow-400 rounded-lg p-2 max-w-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <div className="text-xs text-yellow-800">
                  Add API key for better maps
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom control bar */}
        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-600 flex items-center justify-between border-t">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>
              {googleStaticUrl ? 'Google Maps' : mapboxStaticUrl ? 'Mapbox' : 'OpenStreetMap'}
            </span>
          </div>
          <div className="flex gap-2">
            <a 
              href={osmUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-3 h-3" />
              OpenStreetMap
            </a>
            <span className="text-gray-400">|</span>
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-3 h-3" />
              Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
