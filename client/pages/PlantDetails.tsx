import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
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
  Edit,
  Plus,
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
import PlantMap from "@/components/PlantMap";
import PlantMapSimple from "@/components/PlantMapSimple";
import StaticMap from "@/components/StaticMapEmbed";
import MapErrorBoundary from "@/components/MapErrorBoundary";
import jsPDF from 'jspdf';
import PlantStaticInfo from "@/components/PlantStaticInfo";
import PlantCharts from "@/components/PlantCharts";
import DateNavigation from "@/components/DateNavigation";
import PlantDevices from "@/components/PlantDevices";

export default function PlantDetails() {
  const { id } = useParams<{ id: string }>();
  const [plantData, setPlantData] = useState<PlantViewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mapType, setMapType] = useState<'static' | 'simple' | 'leaflet'>('static');
  const [energyLiveTab, setEnergyLiveTab] = useState<'graph' | 'data'>('graph');

  const fetchPlantData = useCallback(async (date: Date = new Date()) => {
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
  }, [id]);

  useEffect(() => {
    fetchPlantData(selectedDate);
  }, [fetchPlantData, selectedDate]);

  const goToPreviousDay = useCallback(() => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    setSelectedDate(previousDay);
  }, [selectedDate]);

  const goToNextDay = useCallback(() => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  }, [selectedDate]);

  const handleMapTypeChange = useCallback((value: 'static' | 'simple' | 'leaflet') => {
    setMapType(value);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString();
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case "working":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }, []);

  const formatTimestamp = useCallback((timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const processChartData = useCallback((snapshots: PlantDataSnapshot[]): ChartDataPoint[] => {
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
  }, [formatTimestamp]);

  const chartData = useMemo(() => {
    if (!plantData) return [];
    return processChartData(plantData.aggregated_data_snapshots);
  }, [plantData, processChartData]);

  const tableData = useMemo(() => {
    return chartData.map((row, index) => ({
      index,
      time: row.time,
      pv: row.pv.toFixed(2),
      battery: row.battery.toFixed(2),
      grid: row.grid.toFixed(2),
      load: row.load.toFixed(2),
      battery_soc: row.battery_soc.toFixed(1)
    }));
  }, [chartData]);

  // Download functions with useCallback for performance
  const downloadChartPNG = useCallback((type: 'energy' | 'battery' | 'savings') => {
    const chartElement = document.querySelector(`[data-chart-type="${type}"] canvas`) as HTMLCanvasElement;
    if (chartElement) {
      // Create a new canvas with white background
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = chartElement.width;
      canvas.height = chartElement.height;
      
      // Fill with white background
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the chart on top
        ctx.drawImage(chartElement, 0, 0);
      }
      
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${type}-chart-${selectedDate.toISOString().split('T')[0]}.png`;
      link.href = url;
      link.click();
    }
  }, [selectedDate]);

  const downloadChartCSV = useCallback((type: 'energy' | 'battery' | 'savings') => {
    const csvContent = [
      ['Timestamp', 'Value', 'Type'],
      ...chartData.flatMap(d => [
        [new Date(d.timestamp * 1000).toISOString(), d.pv.toString(), 'Solar (PV)'],
        [new Date(d.timestamp * 1000).toISOString(), d.grid.toString(), 'Grid'],
        [new Date(d.timestamp * 1000).toISOString(), d.load.toString(), 'Load'],
        [new Date(d.timestamp * 1000).toISOString(), d.battery.toString(), 'Battery'],
        [new Date(d.timestamp * 1000).toISOString(), d.battery_soc.toString(), 'Battery SOC'],
        [new Date(d.timestamp * 1000).toISOString(), d.price.toString(), 'Price'],
        [new Date(d.timestamp * 1000).toISOString(), d.battery_savings.toString(), 'Battery Savings'],
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${type}-chart-data-${selectedDate.toISOString().split('T')[0]}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, [chartData, selectedDate]);

  const downloadChartPDF = useCallback((type: 'energy' | 'battery' | 'savings') => {
    const chartElement = document.querySelector(`[data-chart-type="${type}"] canvas`) as HTMLCanvasElement;
    if (chartElement && plantData) {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      let yPosition = 20;
      
      // Add title
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Chart Report`, 20, yPosition);
      yPosition += 10;
      
      // Add date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date: ${selectedDate.toLocaleDateString()}`, 20, yPosition);
      yPosition += 15;
      
      // Add plant information
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Plant Information', 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Plant ID: ${plantData.plant_metadata.uid}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Owner: ${plantData.plant_metadata.owner}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Status: ${plantData.plant_metadata.status}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Capacity: ${plantData.plant_metadata.capacity} kW`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Location: ${plantData.plant_metadata.latitude.toFixed(4)}, ${plantData.plant_metadata.longitude.toFixed(4)}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Last Updated: ${new Date(plantData.plant_metadata.updated_at * 1000).toLocaleDateString()}`, 20, yPosition);
      yPosition += 15;
      
      // Add chart with white background
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = chartElement.width;
      canvas.height = chartElement.height;
      
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(chartElement, 0, 0);
      }
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Check if we need a new page
      if (yPosition + imgHeight > 280) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 15;
      
      // Add data table
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Data Table', 20, yPosition);
      yPosition += 10;
      
      // Table headers
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      const headers = ['Time', 'PV (kW)', 'Battery (kW)', 'Grid (kW)', 'Load (kW)', 'SOC (%)', 'Price (€/MWh)', 'Savings (€)'];
      const colWidths = [20, 20, 20, 20, 20, 20, 25, 20];
      let xPosition = 20;
      
      headers.forEach((header, index) => {
        pdf.text(header, xPosition, yPosition);
        xPosition += colWidths[index];
      });
      yPosition += 5;
      
      // Add a line under headers
      pdf.line(20, yPosition, 185, yPosition);
      yPosition += 5;
      
      // Table data
      pdf.setFont('helvetica', 'normal');
      const maxRows = Math.min(chartData.length, 25); // Limit rows to fit on page
      
      for (let i = 0; i < maxRows; i++) {
        const row = chartData[i];
        xPosition = 20;
        
        const rowData = [
          formatTimestamp(row.timestamp),
          row.pv.toFixed(2),
          row.battery.toFixed(2),
          row.grid.toFixed(2),
          row.load.toFixed(2),
          row.battery_soc.toFixed(1),
          row.price.toFixed(2),
          row.battery_savings.toFixed(3)
        ];
        
        rowData.forEach((data, index) => {
          pdf.text(data, xPosition, yPosition);
          xPosition += colWidths[index];
        });
        yPosition += 4;
        
        // Check if we need a new page
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
      }
      
      // Add footer with additional info
      if (chartData.length > 25) {
        yPosition += 10;
        pdf.setFontSize(8);
        pdf.text(`Note: Showing first 25 rows of ${chartData.length} total data points`, 20, yPosition);
      }
      
      pdf.save(`${type}-chart-report-${selectedDate.toISOString().split('T')[0]}.pdf`);
    }
  }, [selectedDate, plantData, chartData, formatTimestamp]);

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

        {/* Date Navigation Component */}
        <DateNavigation 
          selectedDate={selectedDate}
          onDateChange={(date) => setSelectedDate(date)}
          onPreviousDay={goToPreviousDay}
          onNextDay={goToNextDay}
          plantStatus={plantData.plant_metadata.status}
          getStatusColor={getStatusColor}
        />

        {/* Plant Static Information Component */}
        <PlantStaticInfo 
          plantData={plantData}
          mapType={mapType}
          onMapTypeChange={setMapType}
        />

        {/* Plant Charts Component */}
        <PlantCharts 
          chartData={chartData}
          selectedDate={selectedDate}
          onDownloadPNG={downloadChartPNG}
          onDownloadCSV={downloadChartCSV}
          onDownloadPDF={downloadChartPDF}
        />

        {/* Plant Devices Component */}
        <PlantDevices 
          plantData={plantData}
          getStatusColor={getStatusColor}
        />
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
