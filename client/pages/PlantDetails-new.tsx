import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  Share,
  MapPin,
  User,
  Mail,
  Building,
  Globe,
  Activity,
  Battery,
  DollarSign,
  Calendar,
  LineChart,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  FileImage,
  FileText,
  ArrowLeft,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { PlantViewResponse, PlantDataSnapshot, ChartDataPoint } from "../../shared/types";
import { plantApi } from "../../shared/api";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { EnergyChart } from "@/components/EnergyChart";

export default function PlantDetails() {
  const { id } = useParams<{ id: string }>();
  const [energyLiveTab, setEnergyLiveTab] = useState<"graph" | "data">("graph");
  const [batteryPowerTab, setBatteryPowerTab] = useState<"graph" | "data">("graph");
  const [batterySavingsTab, setBatterySavingsTab] = useState<"graph" | "data">("graph");
  
  const [plantData, setPlantData] = useState<PlantViewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchPlantData = async (date: Date = new Date()) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get full day timestamps (00:00 to 23:59:59)
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const start = Math.floor(startOfDay.getTime() / 1000);
      const end = Math.floor(endOfDay.getTime() / 1000);
      
      const response = await plantApi.getPlantView(id, start, end);
      setPlantData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch plant data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantData(selectedDate);
  }, [id, selectedDate]);

  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatDisplayDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const processChartData = (snapshots: PlantDataSnapshot[]): ChartDataPoint[] => {
    // Sort snapshots by timestamp to ensure correct order
    const sortedSnapshots = [...snapshots].sort((a, b) => a.dt - b.dt);
    
    return sortedSnapshots.map((snapshot) => ({
      time: formatTimestamp(snapshot.dt),
      timestamp: snapshot.dt,
      pv: snapshot.pv_p / 1000, // Convert to kW
      battery: snapshot.battery_p / 1000, // Convert to kW
      grid: snapshot.grid_p / 1000, // Convert to kW
      load: snapshot.load_p / 1000, // Convert to kW
      battery_soc: snapshot.battery_soc,
      price: snapshot.price,
      battery_savings: snapshot.battery_savings,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Working":
        return "bg-green-100 text-green-800";
      case "Error":
        return "bg-red-100 text-red-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header variant="app" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading plant data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header variant="app" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="text-red-700">
                <p className="font-medium">Error loading plant data</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plantData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header variant="app" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <p className="text-gray-600">No plant data available</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = processChartData(plantData.aggregated_data_snapshots);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header variant="app" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/plants">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Plants
                </a>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Plant Details - #{id?.substring(0, 8)}
                </h1>
                <p className="text-gray-600">
                  Real-time monitoring and analytics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => fetchPlantData(selectedDate)}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Date Navigation Section */}
        <div className="p-4 mb-6 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousDay}
                  className="p-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-64 justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDisplayDate(selectedDate)}
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedDate(date);
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={goToToday}
                      >
                        Today
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextDay}
                  disabled={selectedDate.toDateString() === new Date().toDateString()}
                  className="p-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>•</span>
                <span>
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>Full Day (00:00 - 24:00)</span>
              </div>
              
              <Badge className={getStatusColor(plantData.plant_metadata.status)}>
                {plantData.plant_metadata.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Top Section - General Info and Map Side by Side */}
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
              <CardTitle className="text-lg">Map Location</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm">
                    {plantData.plant_metadata.latitude.toFixed(5)}, {plantData.plant_metadata.longitude.toFixed(5)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Interactive map would be displayed here
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section - Full Width */}
        <div className="space-y-6">
          {/* Energy Live Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Energy Live Chart</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {chartData.length} data points
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <FileImage className="w-4 h-4 mr-2" />
                      Download PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="w-4 h-4 mr-2" />
                      Download CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="w-4 h-4 mr-2" />
                      Download PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 px-6">
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  energyLiveTab === "graph"
                    ? "text-brand-teal-600 border-brand-teal-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
                onClick={() => setEnergyLiveTab("graph")}
              >
                Graph
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  energyLiveTab === "data"
                    ? "text-brand-teal-600 border-brand-teal-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
                onClick={() => setEnergyLiveTab("data")}
              >
                Data
              </button>
            </div>

            <CardContent>
              <div className="h-[23rem]">
                {energyLiveTab === "graph" ? (
                  <EnergyChart
                    data={chartData}
                    type="energy"
                    height={368}
                  />
                ) : (
                  <div className="h-full overflow-auto bg-white border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Time</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">PV (kW)</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Battery (kW)</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Grid (kW)</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Load (kW)</th>
                          <th className="px-4 py-2 text-left font-medium text-gray-600">Battery SOC (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chartData.map((row, index) => (
                          <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="px-4 py-2">{row.time}</td>
                            <td className="px-4 py-2">{row.pv.toFixed(2)}</td>
                            <td className="px-4 py-2">{row.battery.toFixed(2)}</td>
                            <td className="px-4 py-2">{row.grid.toFixed(2)}</td>
                            <td className="px-4 py-2">{row.load.toFixed(2)}</td>
                            <td className="px-4 py-2">{row.battery_soc.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {energyLiveTab === "graph" && (
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span>PV (kW)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded"></div>
                    <span>Battery (kW)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span>Grid (kW)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                    <span>Load (kW)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded"></div>
                    <span>Battery SOC (%)</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controllers and Devices Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Controllers & Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {plantData.controllers.map((controller, index) => (
                  <div key={controller.uid} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">
                        Controller #{controller.serial_number}
                      </h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        {controller.controller_main_feeds.length} Main Feeds
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {controller.controller_main_feeds.map((mainFeed, feedIndex) => (
                        <div key={mainFeed.uid} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Main Feed {feedIndex + 1}
                            </span>
                            <div className="flex gap-2 text-xs">
                              <span className="text-green-600">Export: {mainFeed.export_power/1000}kW</span>
                              <span className="text-red-600">Import: {mainFeed.import_power/1000}kW</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {mainFeed.main_feed_devices.map((device) => (
                              <div key={device.uid} className="bg-white rounded border p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-800">
                                    {device.device_type}
                                  </span>
                                  <Badge className={`text-xs ${getStatusColor(device.device_status)}`}>
                                    {device.device_status}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-600">
                                  <div>{device.device_manufacturer} {device.device_model}</div>
                                  {device.parameters.communication && (
                                    <div className="mt-1">
                                      {device.parameters.communication.ip}:{device.parameters.communication.port}
                                    </div>
                                  )}
                                  {device.assigned_devices.length > 0 && (
                                    <div className="mt-1 text-blue-600">
                                      +{device.assigned_devices.length} sub-devices
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="flex flex-col">
                  <span className="font-bold text-brand-teal-500 text-xl leading-none tracking-wide">
                    EDIS LAB
                  </span>
                  <span className="text-brand-blue-500 text-sm leading-none tracking-wide mt-1">
                    Monitoring
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Smart PV for solar, battery, and grid energy management.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Live Monitoring</li>
                <li>Reports</li>
                <li>Battery Insights</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About</li>
                <li>Contact</li>
                <li>Support</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Documentation</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 EDIS LAB APP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
