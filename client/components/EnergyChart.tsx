import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
  TimeScale
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line, Chart } from 'react-chartjs-2';
import { ChartDataPoint } from '../../shared/types';
import { useSettings } from '../context/SettingsContext';
import { Button } from './ui/button';
import { RotateCcw, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { ChartZoomHelp } from './ChartZoomHelp';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import jsPDF from 'jspdf';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  zoomPlugin
);

interface EnergyChartProps {
  data: ChartDataPoint[];
  type: 'energy' | 'battery' | 'savings';
  height?: number;
  selectedDate?: Date;
}

export const EnergyChart: React.FC<EnergyChartProps> = ({ data, type, height = 400, selectedDate = new Date() }) => {
  const { timeOffset } = useSettings();
  const chartRef = useRef<ChartJS<'line'>>(null);
  
  // Apply time offset to data points
  const offsetData = data.map(d => ({
    ...d,
    timestamp: d.timestamp + (timeOffset * 3600) // Convert hours to seconds
  }));

  // Download functions
  const downloadPNG = () => {
    const chart = chartRef.current;
    if (chart) {
      const url = chart.toBase64Image();
      const link = document.createElement('a');
      link.download = `${type}-chart-${selectedDate.toISOString().split('T')[0]}.png`;
      link.href = url;
      link.click();
    }
  };

  const downloadJPEG = () => {
    const chart = chartRef.current;
    if (chart) {
      const url = chart.toBase64Image('image/jpeg', 0.8);
      const link = document.createElement('a');
      link.download = `${type}-chart-${selectedDate.toISOString().split('T')[0]}.jpg`;
      link.href = url;
      link.click();
    }
  };

  const downloadPDF = () => {
    const chart = chartRef.current;
    if (chart) {
      const canvas = chart.canvas;
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      pdf.setFontSize(16);
      pdf.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Chart - ${selectedDate.toLocaleDateString()}`, 20, 20);
      
      // Add chart image
      const imgWidth = 250;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 20, 30, imgWidth, imgHeight);
      
      pdf.save(`${type}-chart-${selectedDate.toISOString().split('T')[0]}.pdf`);
    }
  };

  const downloadCSV = () => {
    const csvContent = [
      ['Timestamp', 'Value', 'Type'],
      ...offsetData.flatMap(d => [
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
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const handleZoomIn = () => {
    if (chartRef.current) {
      chartRef.current.zoom(1.2);
    }
  };

  const handleZoomOut = () => {
    if (chartRef.current) {
      chartRef.current.zoom(0.8);
    }
  };

  const getChartConfig = () => {
    switch (type) {
      case 'energy':
        return {
          datasets: [
            {
              label: 'PV Power (kW)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.pv })),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: false,
              tension: 0.1,
            },
            {
              label: 'Battery Power (kW)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.battery })),
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: false,
              tension: 0.1,
            },
            {
              label: 'Grid Power (kW)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.grid })),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: false,
              tension: 0.1,
            },
            {
              label: 'Load Power (kW)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.load })),
              borderColor: 'rgb(234, 179, 8)',
              backgroundColor: 'rgba(234, 179, 8, 0.1)',
              fill: false,
              tension: 0.1,
            },
            {
              label: 'Battery SOC (%)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.battery_soc })),
              borderColor: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              fill: false,
              tension: 0.1,
              yAxisID: 'y1',
            }
          ]
        };
      case 'battery':
        return {
          datasets: [
            {
              label: 'Battery Power (kW)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.battery })),
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: false,
              tension: 0.1,
            },
            {
              label: 'Energy Price (€/MWh)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.price })),
              borderColor: 'rgb(249, 115, 22)',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              fill: false,
              tension: 0.1,
              yAxisID: 'y1',
            }
          ]
        };
      case 'savings':
        // Filter out zero savings values
        const nonZeroSavingsData = offsetData.filter(d => d.battery_savings !== 0);
        
        return {
          datasets: [
            {
              label: 'Battery Savings (€)',
              type: 'bar' as const,
              data: nonZeroSavingsData.map(d => ({ x: d.timestamp * 1000, y: d.battery_savings })),
              borderColor: (context: any) => {
                const value = context.parsed.y;
                return value < 0 ? 'rgb(239, 68, 68)' : 'rgb(34, 197, 94)';
              },
              backgroundColor: (context: any) => {
                const value = context.parsed.y;
                return value < 0 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(34, 197, 94, 0.6)';
              },
              maxBarThickness: 10,
            },
            {
              label: 'Energy Price (€/MWh)',
              type: 'line' as const,
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.price })),
              borderColor: 'rgb(245, 158, 11)',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              fill: false,
              tension: 0.1,
              yAxisID: 'y1',
            }
          ]
        };
      default:
        return { datasets: [] };
    }
  };

  const getFullDayTimeRange = () => {
    // Use the selected date instead of data points
    const date = selectedDate || new Date();
    
    // Set to start of day (00:00)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    // Set to end of day (23:59)
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return {
      min: startOfDay.getTime(),
      max: endOfDay.getTime(),
    };
  };

  const timeRange = getFullDayTimeRange();

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 16
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 14
        },
        callbacks: {
          title: (context) => {
            const timestamp = context[0].parsed.x;
            return new Date(timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            });
          },
        },
      },
      zoom: {
        limits: {
          x: {
            min: timeRange.min,
            max: timeRange.max,
            minRange: 15 * 60 * 1000, // Minimum 15 minutes
          },
        },
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.1,
          },
          pinch: {
            enabled: true,
          },
          drag: {
            enabled: false,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          },
          mode: 'x',
          onZoomComplete: function(context) {
            // Trigger a redraw to update dynamic ticks
            context.chart.update('none');
          },
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            millisecond: 'HH:mm:ss.SSS',
            second: 'HH:mm:ss',
            minute: 'HH:mm',
            hour: 'HH:mm',
            day: 'MMM dd',
            week: 'MMM dd',
            month: 'MMM yyyy',
            quarter: 'MMM yyyy',
            year: 'yyyy',
          },
          tooltipFormat: 'HH:mm:ss',
        },
        adapters: {
          date: {},
        },
        display: true,
        title: {
          display: true,
          text: 'Time',
          font: {
            size: 16
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        min: timeRange.min,
        max: timeRange.max,
        ticks: {
          font: {
            size: 14
          },
          source: 'auto',
          autoSkip: true,
          maxTicksLimit: 25,
          callback: function(value, index, values) {
            const date = new Date(value as number);
            const chart = this.chart;
            const scale = chart.scales.x;
            const range = scale.max - scale.min;
            const hourInMs = 60 * 60 * 1000;
            const minuteInMs = 60 * 1000;
            
            // Very dynamic tick formatting based on current zoom level
            if (range <= hourInMs) {
              // Very zoomed in - show 5-minute intervals
              return date.getMinutes() % 5 === 0 && date.getSeconds() === 0 ? 
                date.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : '';
            } else if (range <= hourInMs * 2) {
              // Zoomed in - show 10-minute intervals
              return date.getMinutes() % 10 === 0 && date.getSeconds() === 0 ? 
                date.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : '';
            } else if (range <= hourInMs * 4) {
              // Moderately zoomed in - show 15-minute intervals
              return date.getMinutes() % 15 === 0 && date.getSeconds() === 0 ? 
                date.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : '';
            } else if (range <= hourInMs * 8) {
              // Normal zoom - show 30-minute intervals
              return date.getMinutes() % 30 === 0 && date.getSeconds() === 0 ? 
                date.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : '';
            } else if (range <= hourInMs * 16) {
              // Medium zoom out - show hourly
              return date.getMinutes() === 0 && date.getSeconds() === 0 ? 
                date.getHours().toString().padStart(2, '0') + ':00' : '';
            } else {
              // Zoomed out - show every 2 hours
              return date.getMinutes() === 0 && date.getSeconds() === 0 && date.getHours() % 2 === 0 ? 
                date.getHours().toString().padStart(2, '0') + ':00' : '';
            }
          },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: type === 'energy' ? 'Power (kW)' : type === 'battery' ? 'Power (kW)' : 'Savings (€)',
          font: {
            size: 16
          }
        },
        ticks: {
          font: {
            size: 14
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: type === 'energy' ? 'SOC (%)' : 'Price (€/MWh)',
          font: {
            size: 16
          }
        },
        ticks: {
          font: {
            size: 14
          }
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div style={{ height }} className="relative">
      {/* Top-right controls - Zoom only */}
      <div className="absolute top-2 right-2 z-20 flex gap-1">
        {/* Zoom controls */}
        <ChartZoomHelp />
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="p-1 h-8 w-8"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="p-1 h-8 w-8"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetZoom}
          className="p-1 h-8 w-8"
          title="Reset Zoom"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
      <Chart ref={chartRef} type={type === 'savings' ? 'line' : 'line'} data={getChartConfig()} options={options} />
    </div>
  );
};
