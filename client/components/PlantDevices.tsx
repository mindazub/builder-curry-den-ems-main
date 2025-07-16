import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { PlantViewResponse, Controller, MainFeed, Device } from "../../shared/types";

interface PlantDevicesProps {
  plantData: PlantViewResponse;
  getStatusColor: (status: string) => string;
}

const PlantDevices: React.FC<PlantDevicesProps> = React.memo(({ 
  plantData, 
  getStatusColor 
}) => {
  const [expandedControllers, setExpandedControllers] = useState<Set<string>>(new Set());
  const [expandedMainFeeds, setExpandedMainFeeds] = useState<Set<string>>(new Set());
  const [expandedDevices, setExpandedDevices] = useState<Set<string>>(new Set());

  const toggleController = useCallback((controllerUid: string) => {
    setExpandedControllers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(controllerUid)) {
        newSet.delete(controllerUid);
      } else {
        newSet.add(controllerUid);
      }
      return newSet;
    });
  }, []);

  const toggleMainFeed = useCallback((mainFeedUid: string) => {
    setExpandedMainFeeds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mainFeedUid)) {
        newSet.delete(mainFeedUid);
      } else {
        newSet.add(mainFeedUid);
      }
      return newSet;
    });
  }, []);

  const toggleDevice = useCallback((deviceUid: string) => {
    setExpandedDevices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deviceUid)) {
        newSet.delete(deviceUid);
      } else {
        newSet.add(deviceUid);
      }
      return newSet;
    });
  }, []);

  const renderDevice = useCallback((device: Device, isSubDevice: boolean = false) => {
    const hasSubDevices = device.assigned_devices && device.assigned_devices.length > 0;
    const isExpanded = expandedDevices.has(device.uid);

    return (
      <div key={device.uid} className={`border rounded-lg ${isSubDevice ? 'ml-6 bg-gray-50' : 'bg-white'}`}>
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {hasSubDevices && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleDevice(device.uid)}
                  className="p-1 h-6 w-6"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              )}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-sm">{device.uid.substring(0, 8)}</span>
              </div>
            </div>
            <Badge className={`text-xs ${getStatusColor(device.device_status)}`}>
              {device.device_status}
            </Badge>
          </div>
          
          <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-600">Type:</span>
              <div className="font-medium">{device.device_type}</div>
            </div>
            <div>
              <span className="text-gray-600">Manufacturer:</span>
              <div className="font-medium">{device.device_manufacturer}</div>
            </div>
            <div>
              <span className="text-gray-600">Model:</span>
              <div className="font-medium">{device.device_model}</div>
            </div>
            {device.parameters.communication && (
              <div>
                <span className="text-gray-600">Communication:</span>
                <div className="font-medium">
                  {device.parameters.communication.ip}:{device.parameters.communication.port}
                </div>
              </div>
            )}
            {device.parameters.slave_id && (
              <div>
                <span className="text-gray-600">Slave ID:</span>
                <div className="font-medium">{device.parameters.slave_id}</div>
              </div>
            )}
            {device.parameters.role && (
              <div>
                <span className="text-gray-600">Role:</span>
                <div className="font-medium">{device.parameters.role}</div>
              </div>
            )}
          </div>
        </div>
        
        {hasSubDevices && isExpanded && (
          <div className="border-t bg-gray-50 p-3">
            <div className="text-xs font-medium text-gray-600 mb-2">
              Assigned Devices ({device.assigned_devices.length})
            </div>
            <div className="space-y-2">
              {device.assigned_devices.map((subDevice) => 
                renderDevice(subDevice, true)
              )}
            </div>
          </div>
        )}
      </div>
    );
  }, [expandedDevices, toggleDevice, getStatusColor]);

  const renderMainFeed = useCallback((mainFeed: MainFeed, feedIndex: number) => {
    const isExpanded = expandedMainFeeds.has(mainFeed.uid);
    
    return (
      <div key={mainFeed.uid} className="bg-blue-50 rounded-lg">
        <div className="p-3">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleMainFeed(mainFeed.uid)}>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              <span className="font-medium text-sm text-blue-700">
                Main Feed ID: {mainFeed.uid.substring(0, 8)}
              </span>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="text-green-600 font-medium">
                Export: {(mainFeed.export_power / 1000).toFixed(2)}kW
              </span>
              <span className="text-red-600 font-medium">
                Import: {(mainFeed.import_power / 1000).toFixed(2)}kW
              </span>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="border-t border-blue-200 p-3">
            <div className="text-xs font-medium text-gray-600 mb-3">
              Devices ({mainFeed.main_feed_devices.length})
            </div>
            <div className="space-y-2">
              {mainFeed.main_feed_devices.map((device) => 
                renderDevice(device)
              )}
            </div>
          </div>
        )}
      </div>
    );
  }, [expandedMainFeeds, toggleMainFeed, renderDevice]);

  const renderController = useCallback((controller: Controller, controllerIndex: number) => {
    const isExpanded = expandedControllers.has(controller.uid);
    
    return (
      <div key={controller.uid} className="border rounded-lg bg-white">
        <div className="p-4">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleController(controller.uid)}>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
              <div>
                <h4 className="font-medium text-gray-900">
                  Controller #{controller.serial_number}
                </h4>
                <p className="text-sm text-gray-600">
                  Serial: {controller.serial_number} | {controller.uid.substring(0, 8)}
                </p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {controller.controller_main_feeds.length} Main Feeds
            </Badge>
          </div>
        </div>
        
        {isExpanded && (
          <div className="border-t bg-gray-50 p-4">
            <div className="space-y-4">
              {controller.controller_main_feeds.map((mainFeed, feedIndex) => 
                renderMainFeed(mainFeed, feedIndex)
              )}
            </div>
          </div>
        )}
      </div>
    );
  }, [expandedControllers, toggleController, renderMainFeed]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Devices by Controller & Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {plantData.controllers.map((controller, index) => 
            renderController(controller, index)
          )}
        </div>
      </CardContent>
    </Card>
  );
});

PlantDevices.displayName = 'PlantDevices';

export default PlantDevices;
