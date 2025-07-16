import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlantViewResponse } from "../../shared/types";
import PlantMap from "@/components/PlantMap";
import PlantMapSimple from "@/components/PlantMapSimple";
import StaticMap from "@/components/StaticMapEmbed";
import MapErrorBoundary from "@/components/MapErrorBoundary";

interface PlantStaticInfoProps {
  plantData: PlantViewResponse;
  mapType: 'static' | 'simple' | 'leaflet';
  onMapTypeChange: (value: 'static' | 'simple' | 'leaflet') => void;
}

const PlantStaticInfo: React.FC<PlantStaticInfoProps> = React.memo(({ 
  plantData, 
  mapType, 
  onMapTypeChange 
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 lg:h-96">
      {/* General Information */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">General Information</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Plant ID</span>
              <div className="font-medium text-gray-900">
                {plantData.plant_metadata.uid.substring(0, 8)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Owner</span>
              <div className="font-medium text-gray-900">
                {plantData.plant_metadata.owner.substring(0, 8)}...
              </div>
            </div>
            <div>
              <span className="text-gray-600">Capacity</span>
              <div className="font-medium text-gray-900">
                {(plantData.plant_metadata.capacity / 1000).toFixed(1)} kW
              </div>
            </div>
            <div>
              <span className="text-gray-600">Latitude</span>
              <div className="font-medium text-gray-900">
                {plantData.plant_metadata.latitude.toFixed(5)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Longitude</span>
              <div className="font-medium text-gray-900">
                {plantData.plant_metadata.longitude.toFixed(5)}
              </div>
            </div>
            <div>
              <span className="text-gray-600">Status</span>
              <Badge className={getStatusColor(plantData.plant_metadata.status)}>
                {plantData.plant_metadata.status}
              </Badge>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Updated at</span>
              <div className="font-medium text-gray-900">
                {formatDate(plantData.plant_metadata.updated_at)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Location */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Map Location</CardTitle>
            <Select value={mapType} onValueChange={onMapTypeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static Map</SelectItem>
                <SelectItem value="simple">Simple View</SelectItem>
                <SelectItem value="leaflet">Interactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="h-full">
          <MapErrorBoundary fallback={<StaticMap
            latitude={plantData.plant_metadata.latitude}
            longitude={plantData.plant_metadata.longitude}
            plantId={plantData.plant_metadata.uid}
            capacity={plantData.plant_metadata.capacity}
            status={plantData.plant_metadata.status}
          />}>
            {mapType === 'static' && (
              <StaticMap
                latitude={plantData.plant_metadata.latitude}
                longitude={plantData.plant_metadata.longitude}
                plantId={plantData.plant_metadata.uid}
                capacity={plantData.plant_metadata.capacity}
                status={plantData.plant_metadata.status}
              />
            )}
            {mapType === 'simple' && (
              <PlantMapSimple
                latitude={plantData.plant_metadata.latitude}
                longitude={plantData.plant_metadata.longitude}
                plantId={plantData.plant_metadata.uid}
                capacity={plantData.plant_metadata.capacity}
                status={plantData.plant_metadata.status}
              />
            )}
            {mapType === 'leaflet' && (
              <PlantMap
                latitude={plantData.plant_metadata.latitude}
                longitude={plantData.plant_metadata.longitude}
                plantId={plantData.plant_metadata.uid}
                capacity={plantData.plant_metadata.capacity}
                status={plantData.plant_metadata.status}
              />
            )}
          </MapErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
});

PlantStaticInfo.displayName = 'PlantStaticInfo';

export default PlantStaticInfo;
