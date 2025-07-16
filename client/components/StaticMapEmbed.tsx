import React, { useEffect, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

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
  const [mapError, setMapError] = useState(false);

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

  // Google Maps embed URL (no API key required)
  const googleEmbedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=${zoom}&output=embed`;
  
  // OpenStreetMap embed URL (fallback)
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;

  // External map URLs
  const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=${zoom}`;
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  const handleMapError = () => {
    setMapError(true);
  };

  return (
    <div className="h-full rounded-lg overflow-hidden bg-white">
      <div className="h-full flex flex-col">
        {/* Map Embed */}
        <div className="flex-1 relative">
          {!mapError ? (
            <iframe
              src={googleEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              title="Plant Location Map"
              className="rounded-lg"
              onError={handleMapError}
            />
          ) : (
            // Fallback to OpenStreetMap
            <iframe
              src={osmEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title="Plant Location Map (OpenStreetMap)"
              className="rounded-lg"
            />
          )}
          
          {/* Plant info overlay */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg shadow-lg p-3 max-w-xs z-10">
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
        </div>
        
        {/* Bottom control bar */}
        <div className="bg-gray-50 px-4 py-2 text-xs text-gray-600 flex items-center justify-between border-t">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>
              {!mapError ? 'Google Maps Embed' : 'OpenStreetMap'}
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
