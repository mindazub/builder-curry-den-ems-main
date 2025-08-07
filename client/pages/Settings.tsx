import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSettings, type TimeFormat } from "@/context/SettingsContext";
import { Header } from "@/components/Header";

export default function Settings() {
  const { timeOffset, timeFormat, setTimeOffset, setTimeFormat } = useSettings();

  const offsetOptions = [
    { value: -6, label: "-6 hours" },
    { value: -5, label: "-5 hours" },
    { value: -4, label: "-4 hours" },
    { value: -3, label: "-3 hours" },
    { value: -2, label: "-2 hours" },
    { value: -1, label: "-1 hour" },
    { value: 0, label: "No offset" },
    { value: 1, label: "+1 hour" },
    { value: 2, label: "+2 hours" },
    { value: 3, label: "+3 hours" },
    { value: 4, label: "+4 hours" },
    { value: 5, label: "+5 hours" },
    { value: 6, label: "+6 hours" },
    { value: 7, label: "+7 hours" },
    { value: 8, label: "+8 hours" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="app" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure your application preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Time Offset Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time Offset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeOffset">Data Time Offset</Label>
                <Select 
                  value={timeOffset.toString()} 
                  onValueChange={(value) => setTimeOffset(parseInt(value, 10))}
                >
                  <SelectTrigger id="timeOffset">
                    <SelectValue placeholder="Select time offset" />
                  </SelectTrigger>
                  <SelectContent>
                    {offsetOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Adjust the time offset to compensate for API data lag. 
                  Default is +6 hours.
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Current Setting:</p>
                  <p>
                    {timeOffset > 0 ? `+${timeOffset}` : timeOffset} hour{Math.abs(timeOffset) !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Example: If API shows 12:00, charts will display{' '}
                    {(() => {
                      const newTime = 12 + timeOffset;
                      return newTime < 0 ? `${24 + newTime}:00` : `${newTime}:00`;
                    })()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Display Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Time Format (Timeline/Charts)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeFormat">Time Format</Label>
                <Select 
                  value={timeFormat} 
                  onValueChange={(value: TimeFormat) => setTimeFormat(value)}
                >
                  <SelectTrigger id="timeFormat">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24-hour (e.g., 14:30)</SelectItem>
                    <SelectItem value="12">12-hour (e.g., 2:30 PM)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Choose how time is displayed in data tables and charts.
                  Default is 24-hour format.
                </p>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Preview:</p>
                  <p className="font-mono">
                    {timeFormat === '24' ? '00:00, 06:30, 12:00, 18:45' : '12:00 AM, 6:30 AM, 12:00 PM, 6:45 PM'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Settings Card - Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Additional display settings will be available here.
              </p>
            </CardContent>
          </Card>

          {/* API Settings Card - Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">API Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                API configuration settings will be available here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
