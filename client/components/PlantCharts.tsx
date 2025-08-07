import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileImage, FileText } from "lucide-react";
import { EnergyChart } from "@/components/EnergyChart";
import { ChartDataPoint } from "../../shared/types";
import { useSettings } from "@/context/SettingsContext";
import { formatTime } from "@/lib/utils";

interface PlantChartsProps {
  chartData: ChartDataPoint[];
  selectedDate: Date;
  onDownloadPNG: (type: string) => void;
  onDownloadCSV: (type: string) => void;
  onDownloadPDF: (type: string) => void;
  isLoading?: boolean;
}

const PlantCharts: React.FC<PlantChartsProps> = React.memo(({ 
  chartData, 
  selectedDate, 
  onDownloadPNG, 
  onDownloadCSV, 
  onDownloadPDF,
  isLoading = false
}) => {
  const { timeFormat } = useSettings();
  const [energyLiveTab, setEnergyLiveTab] = useState<"graph" | "data">("graph");
  const [batteryPowerTab, setBatteryPowerTab] = useState<"graph" | "data">("graph");
  const [batterySavingsTab, setBatterySavingsTab] = useState<"graph" | "data">("graph");

  // Apply 6-hour offset to match chart data (offset is 6 hours = 21600 seconds)
  const TIME_OFFSET_HOURS = 6;
  const TIME_OFFSET_SECONDS = TIME_OFFSET_HOURS * 3600;

  const formatTimestamp = (timestamp: number) => {
    return formatTime(timestamp, timeFormat, TIME_OFFSET_SECONDS);
  };

  // Console log all chart data for debugging
  React.useEffect(() => {
    console.log('🔍 PlantCharts Debug - Raw chartData:', chartData);
    console.log('🔍 PlantCharts Debug - Applied offset (hours):', TIME_OFFSET_HOURS);
    console.log('🔍 PlantCharts Debug - Time format:', timeFormat);
    console.log('🔍 PlantCharts Debug - Sample original timestamp:', chartData[0]?.timestamp);
    console.log('🔍 PlantCharts Debug - Sample offset timestamp:', chartData[0]?.timestamp + TIME_OFFSET_SECONDS);
    console.log('🔍 PlantCharts Debug - Sample original time:', chartData[0] ? new Date(chartData[0].timestamp * 1000).toISOString() : 'No data');
    console.log('🔍 PlantCharts Debug - Sample offset time:', chartData[0] ? new Date((chartData[0].timestamp + TIME_OFFSET_SECONDS) * 1000).toISOString() : 'No data');
    console.log('🔍 PlantCharts Debug - Sample formatted time:', chartData[0] ? formatTime(chartData[0].timestamp, timeFormat, TIME_OFFSET_SECONDS) : 'No data');
  }, [chartData, timeFormat]);

  const energyTableData = useMemo(() => {
    return chartData.map((point) => ({
      time: formatTimestamp(point.timestamp),
      pv: point.pv.toFixed(2),
      battery: point.battery.toFixed(2),
      grid: point.grid.toFixed(2),
      load: point.load.toFixed(2),
    }));
  }, [chartData]);

  const batteryTableData = useMemo(() => {
    return chartData.map((point) => ({
      time: formatTimestamp(point.timestamp),
      power: point.battery.toFixed(2),
      soc: point.battery_soc.toFixed(1),
    }));
  }, [chartData]);

  const savingsTableData = useMemo(() => {
    return chartData.map((point) => ({
      time: formatTimestamp(point.timestamp),
      savings: point.battery_savings.toFixed(2),
      price: point.price.toFixed(4),
    }));
  }, [chartData]);

  const dailyBatterySavingsTotal = useMemo(() => {
    return chartData.reduce((total, point) => total + point.battery_savings, 0);
  }, [chartData]);

  return (
    <div className="space-y-6">
      {/* Energy Live Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Energy Live Chart</CardTitle>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="p-1 h-8 w-8">
                  <Download className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDownloadPNG('energy')}>
                  Download as PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownloadCSV('energy')}>
                  Download as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownloadPDF('energy')}>
                  Download as PDF
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
          <div className="h-[29.25rem]">
            {energyLiveTab === "graph" ? (
              <div data-chart-type="energy">
                {(() => {
                  console.log('🔍 Energy Chart Data:', chartData);
                  console.log('🔍 Energy Chart - First 3 data points with offset applied:');
                  chartData.slice(0, 3).forEach((point, index) => {
                    console.log(`  Point ${index}:`, {
                      original_timestamp: point.timestamp,
                      original_time: new Date(point.timestamp * 1000).toISOString(),
                      offset_timestamp: point.timestamp + TIME_OFFSET_SECONDS,
                      offset_time: new Date((point.timestamp + TIME_OFFSET_SECONDS) * 1000).toISOString(),
                      pv: point.pv,
                      battery: point.battery,
                      grid: point.grid,
                      load: point.load
                    });
                  });
                  return null;
                })()}
                <EnergyChart
                  data={chartData}
                  type="energy"
                  selectedDate={selectedDate}
                />
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">PV (kW)</th>
                      <th className="px-3 py-2 text-left">Battery (kW)</th>
                      <th className="px-3 py-2 text-left">Grid (kW)</th>
                      <th className="px-3 py-2 text-left">Load (kW)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {energyTableData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-8 text-center text-gray-400">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                            </div>
                            <span>NO DATA</span>
                            <span className="text-xs">No energy data available for this date</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      energyTableData.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-3 py-2">{row.time}</td>
                          <td className="px-3 py-2">{row.pv}</td>
                          <td className="px-3 py-2">{row.battery}</td>
                          <td className="px-3 py-2">{row.grid}</td>
                          <td className="px-3 py-2">{row.load}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Battery Power Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Battery Power Chart</CardTitle>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="p-1 h-8 w-8">
                  <Download className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDownloadPNG('battery')}>
                  Download as PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownloadCSV('battery')}>
                  Download as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownloadPDF('battery')}>
                  Download as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <div className="flex border-b border-gray-200 px-6">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              batteryPowerTab === "graph"
                ? "text-brand-teal-600 border-brand-teal-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
            onClick={() => setBatteryPowerTab("graph")}
          >
            Graph
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              batteryPowerTab === "data"
                ? "text-brand-teal-600 border-brand-teal-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
            onClick={() => setBatteryPowerTab("data")}
          >
            Data
          </button>
        </div>

        <CardContent>
          <div className="h-[29.25rem]">
            {batteryPowerTab === "graph" ? (
              <div data-chart-type="battery">
                {(() => {
                  console.log('🔍 Battery Chart Data:', chartData);
                  console.log('🔍 Battery Chart - First 3 data points with offset applied:');
                  chartData.slice(0, 3).forEach((point, index) => {
                    console.log(`  Point ${index}:`, {
                      original_timestamp: point.timestamp,
                      original_time: new Date(point.timestamp * 1000).toISOString(),
                      offset_timestamp: point.timestamp + TIME_OFFSET_SECONDS,
                      offset_time: new Date((point.timestamp + TIME_OFFSET_SECONDS) * 1000).toISOString(),
                      battery: point.battery,
                      battery_soc: point.battery_soc
                    });
                  });
                  return null;
                })()}
                <EnergyChart
                  data={chartData}
                  type="battery"
                  selectedDate={selectedDate}
                />
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">Power (kW)</th>
                      <th className="px-3 py-2 text-left">SOC (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batteryTableData.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-3 py-8 text-center text-gray-400">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            </div>
                            <span>NO DATA</span>
                            <span className="text-xs">No battery data available for this date</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      batteryTableData.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-3 py-2">{row.time}</td>
                          <td className="px-3 py-2">{row.power}</td>
                          <td className="px-3 py-2">{row.soc}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Battery Savings Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">Battery Savings Chart</CardTitle>
            <span className="text-sm text-green-600 font-medium">
              Total savings: {dailyBatterySavingsTotal.toFixed(2)}€
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="p-1 h-8 w-8">
                  <Download className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDownloadPNG('savings')}>
                  Download as PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownloadCSV('savings')}>
                  Download as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownloadPDF('savings')}>
                  Download as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <div className="flex border-b border-gray-200 px-6">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              batterySavingsTab === "graph"
                ? "text-brand-teal-600 border-brand-teal-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
            onClick={() => setBatterySavingsTab("graph")}
          >
            Graph
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              batterySavingsTab === "data"
                ? "text-brand-teal-600 border-brand-teal-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
            onClick={() => setBatterySavingsTab("data")}
          >
            Data
          </button>
        </div>

        <CardContent>
          <div className="h-[29.25rem]">
            {batterySavingsTab === "graph" ? (
              <div data-chart-type="savings">
                {(() => {
                  console.log('🔍 Savings Chart Data:', chartData);
                  console.log('🔍 Savings Chart - First 3 data points with offset applied:');
                  chartData.slice(0, 3).forEach((point, index) => {
                    console.log(`  Point ${index}:`, {
                      original_timestamp: point.timestamp,
                      original_time: new Date(point.timestamp * 1000).toISOString(),
                      offset_timestamp: point.timestamp + TIME_OFFSET_SECONDS,
                      offset_time: new Date((point.timestamp + TIME_OFFSET_SECONDS) * 1000).toISOString(),
                      battery_savings: point.battery_savings,
                      price: point.price
                    });
                  });
                  return null;
                })()}
                <EnergyChart
                  data={chartData}
                  type="savings"
                  selectedDate={selectedDate}
                />
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">Savings (€)</th>
                      <th className="px-3 py-2 text-left">Price (€/kWh)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savingsTableData.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-3 py-8 text-center text-gray-400">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            </div>
                            <span>NO DATA</span>
                            <span className="text-xs">No savings data available for this date</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      savingsTableData.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-3 py-2">{row.time}</td>
                          <td className="px-3 py-2">{row.savings}</td>
                          <td className="px-3 py-2">{row.price}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

PlantCharts.displayName = 'PlantCharts';

export default PlantCharts;
