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
  // Initialize controllers and main feeds as expanded by default
  const [expandedControllers, setExpandedControllers] = useState<Set<string>>(() => 
    new Set((plantData?.controllers || []).map(controller => controller.uid))
  );
  const [expandedMainFeeds, setExpandedMainFeeds] = useState<Set<string>>(() => 
    new Set((plantData?.controllers || []).flatMap(controller => 
      controller.controller_main_feeds.map(feed => feed.uid)
    ))
  );
  // Only slave devices are closed by default
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
      <React.Fragment key={device.uid}>
        <tr className={`${isSubDevice ? 'bg-gray-50' : ''} hover:bg-gray-100`}>
          <td className="px-4 py-2 w-12">
            <div className="flex items-center justify-center">
              {hasSubDevices ? (
                <button
                  onClick={() => toggleDevice(device.uid)}
                  className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center bg-white hover:bg-gray-50"
                >
                  {isExpanded ? (
                    <span className="text-gray-600 text-xs font-bold">−</span>
                  ) : (
                    <span className="text-gray-600 text-xs font-bold">+</span>
                  )}
                </button>
              ) : isSubDevice ? (
                <div className="w-4 h-4 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">→</span>
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-gray-100"></div>
              )}
            </div>
          </td>
          <td className="px-4 py-2 text-sm">
            <span className="text-blue-600 font-medium">{device.uid.substring(0, 8)}</span>
          </td>
          <td className="px-4 py-2 text-sm">{device.device_type}</td>
          <td className="px-4 py-2 text-sm">{device.device_manufacturer}</td>
          <td className="px-4 py-2 text-sm">{device.device_model}</td>
          <td className="px-4 py-2">
            <Badge className={`text-xs ${getStatusColor(device.device_status)}`}>
              {device.device_status}
            </Badge>
          </td>
        </tr>
        
        {/* Render sub-devices if expanded */}
        {hasSubDevices && isExpanded && device.assigned_devices.map((subDevice) => 
          renderDevice(subDevice, true)
        )}
      </React.Fragment>
    );
  }, [expandedDevices, toggleDevice, getStatusColor]);

  const renderMainFeed = useCallback((mainFeed: MainFeed, feedIndex: number) => {
    const isExpanded = expandedMainFeeds.has(mainFeed.uid);
    
    return (
      <div key={mainFeed.uid} className="bg-blue-50 rounded-lg border border-blue-200 mb-4">
        <div className="p-3 bg-blue-100 rounded-t-lg">
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
          <div className="bg-white rounded-b-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {mainFeed.main_feed_devices.map((device) => 
                  renderDevice(device)
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }, [expandedMainFeeds, toggleMainFeed, renderDevice]);

  const renderController = useCallback((controller: Controller, controllerIndex: number) => {
    const isExpanded = expandedControllers.has(controller.uid);
    
    return (
      <div key={controller.uid} className="border rounded-lg bg-white shadow-sm">
        <div className="p-4 bg-blue-50 rounded-t-lg">
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
                  Serial: {controller.serial_number}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Serial No: {controller.serial_number}</span>
              <Badge className="bg-blue-100 text-blue-800">
                {controller.controller_main_feeds.length} Main Feeds
              </Badge>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4 bg-white rounded-b-lg">
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
          {(plantData?.controllers || []).map((controller, index) => 
            renderController(controller, index)
          )}
        </div>
      </CardContent>
    </Card>
  );
});

PlantDevices.displayName = 'PlantDevices';

export default PlantDevices;
