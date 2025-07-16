import React, { useEffect, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface PlantMapProps {
  latitude: number;
  longitude: number;
  plantId: string;
  plantName?: string;
  capacity?: number;
  status?: string;
}

export default function PlantMapSimple({ 
  latitude, 
  longitude, 
  plantId, 
  plantName, 
  capacity, 
  status 
}: PlantMapProps) {
  const [isClient, setIsClient] = useState(false);

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

  // OpenStreetMap URLs
  const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  
  return (
    <div className="h-full rounded-lg overflow-hidden bg-white">
      <div className="h-full flex flex-col">
        {/* Static Map View */}
        <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-green-50">
          
          {/* Center marker */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Marker shadow */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-black bg-opacity-20 rounded-full blur-sm"></div>
              {/* Main marker */}
              <div className="relative z-10">
                <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                </div>
                <div className="w-1 h-8 bg-green-500 mx-auto"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full mx-auto transform rotate-45 -mt-1"></div>
              </div>
            </div>
          </div>
          
          {/* Grid lines for map feel */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Plant info overlay */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
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
          
          {/* Zoom level indicator */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2">
            <div className="text-xs text-gray-600">Zoom: 15</div>
          </div>
        </div>
        
        {/* Bottom control bar */}
        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-600 flex items-center justify-between border-t">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Plant Location Viewer</span>
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
