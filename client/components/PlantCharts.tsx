import React, { useState, useMemo } from 'react';
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

interface PlantChartsProps {
  chartData: ChartDataPoint[];
  selectedDate: Date;
  onDownloadPNG: (type: string) => void;
  onDownloadCSV: (type: string) => void;
  onDownloadPDF: (type: string) => void;
}

const PlantCharts: React.FC<PlantChartsProps> = React.memo(({ 
  chartData, 
  selectedDate, 
  onDownloadPNG, 
  onDownloadCSV, 
  onDownloadPDF 
}) => {
  const [energyLiveTab, setEnergyLiveTab] = useState<"graph" | "data">("graph");
  const [batteryPowerTab, setBatteryPowerTab] = useState<"graph" | "data">("graph");
  const [batterySavingsTab, setBatterySavingsTab] = useState<"graph" | "data">("graph");

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                    {energyTableData.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2">{row.time}</td>
                        <td className="px-3 py-2">{row.pv}</td>
                        <td className="px-3 py-2">{row.battery}</td>
                        <td className="px-3 py-2">{row.grid}</td>
                        <td className="px-3 py-2">{row.load}</td>
                      </tr>
                    ))}
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
                    {batteryTableData.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2">{row.time}</td>
                        <td className="px-3 py-2">{row.power}</td>
                        <td className="px-3 py-2">{row.soc}</td>
                      </tr>
                    ))}
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
                    {savingsTableData.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2">{row.time}</td>
                        <td className="px-3 py-2">{row.savings}</td>
                        <td className="px-3 py-2">{row.price}</td>
                      </tr>
                    ))}
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
