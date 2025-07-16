import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom solar plant icon
const createSolarIcon = () => new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#059669" stroke="#065f46" stroke-width="2"/>
      <path d="M8 16 L16 8 L24 16 L16 24 Z" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/>
      <circle cx="16" cy="16" r="3" fill="#f59e0b"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface PlantMapProps {
  latitude: number;
  longitude: number;
  plantId: string;
  plantName?: string;
  capacity?: number;
  status?: string;
}

const PlantMapContent: React.FC<PlantMapProps> = ({ 
  latitude, 
  longitude, 
  plantId, 
  plantName, 
  capacity, 
  status 
}) => {
  const solarIcon = useRef(createSolarIcon());
  
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker 
        position={[latitude, longitude]} 
        icon={solarIcon.current}
      >
        <Popup>
          <div className="p-2 min-w-48">
            <h3 className="font-semibold text-sm mb-2">
              {plantName || `Plant ${plantId.substring(0, 8)}`}
            </h3>
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
        </Popup>
      </Marker>
    </>
  );
};

export default function PlantMap(props: PlantMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapError, setMapError] = useState(false);
  const { latitude, longitude, plantId } = props;

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

  if (mapError) {
    return (
      <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-600">
          <div className="text-sm mb-2">Map unavailable</div>
          <div className="text-xs">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg overflow-hidden">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        key={`map-${plantId}-${latitude}-${longitude}`}
      >
        <PlantMapContent {...props} />
      </MapContainer>
    </div>
  );
}
