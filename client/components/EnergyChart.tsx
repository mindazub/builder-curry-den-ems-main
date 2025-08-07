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
import { Line, Chart } from 'react-chartjs-2';
import { ChartDataPoint } from '../../shared/types';
import { useSettings } from '../context/SettingsContext';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import jsPDF from 'jspdf';
import 'chartjs-adapter-date-fns';

// 🚫 ZOOM PLUGIN COMPLETELY DISABLED - No import, no registration
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
  TimeScale
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
  
  // 🎯 Handle empty data gracefully
  if (!data || data.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-500 mb-1">NO DATA</h3>
          <p className="text-sm text-gray-400">
            No {type} data available for this date
          </p>
        </div>
      </div>
    );
  }
  
  // Apply time offset to data points
  const offsetData = data.map(d => ({
    ...d,
    timestamp: d.timestamp + (timeOffset * 3600) // Convert hours to seconds
  }));

  // Console log debug information
  React.useEffect(() => {
    console.log('📊 EnergyChart Debug - Chart Type:', type);
    console.log('📊 EnergyChart Debug - Time Offset (hours):', timeOffset);
    console.log('📊 EnergyChart Debug - Raw data length:', data.length);
    console.log('📊 EnergyChart Debug - Offset data length:', offsetData.length);
    console.log('📊 EnergyChart Debug - First raw data point:', data[0]);
    console.log('📊 EnergyChart Debug - First offset data point:', offsetData[0]);
    if (data.length > 0 && offsetData.length > 0) {
      console.log('📊 EnergyChart Debug - Time comparison:', {
        raw_timestamp: data[0].timestamp,
        raw_time: new Date(data[0].timestamp * 1000).toISOString(),
        offset_timestamp: offsetData[0].timestamp,
        offset_time: new Date(offsetData[0].timestamp * 1000).toISOString()
      });
    }
    console.log('📊 EnergyChart Debug - All offset data for chart:', offsetData);
  }, [data, offsetData, type, timeOffset]);

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
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Battery Power (kW)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.battery })),
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: false,
              tension: 0.1,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Grid Power (kW)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.grid })),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: false,
              tension: 0.1,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Load Power (kW)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.load })),
              borderColor: 'rgb(234, 179, 8)',
              backgroundColor: 'rgba(234, 179, 8, 0.1)',
              fill: false,
              tension: 0.1,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Battery SOC (%)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.battery_soc })),
              borderColor: 'rgb(168, 85, 247)',
              backgroundColor: 'rgba(168, 85, 247, 0.1)',
              fill: false,
              tension: 0.1,
              yAxisID: 'y1',
              pointRadius: 4,
              pointHoverRadius: 6,
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
              pointRadius: 4,
              pointHoverRadius: 6,
            },
            {
              label: 'Energy Price (€/MWh)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.price })),
              borderColor: 'rgb(249, 115, 22)',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              fill: false,
              tension: 0.1,
              yAxisID: 'y1',
              pointRadius: 4,
              pointHoverRadius: 6,
            }
          ]
        };
      case 'savings':
        // Filter out zero savings values for bars only - keep all data for energy price line
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
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.price })), // Use ALL data points for price line
              borderColor: 'rgb(249, 115, 22)',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              fill: false,
              tension: 0.1,
              yAxisID: 'y1',
              pointRadius: 4,
              pointHoverRadius: 6,
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

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    
    // 🎯 SMOOTH CHART TRANSITIONS - This is what you want!
    animation: {
      duration: 750,                    // Animation duration in ms
      easing: 'easeInOutQuart',        // Smooth easing function
    },
    transitions: {
      active: {
        animation: {
          duration: 400,                // Hover animations
        }
      }
    },
    
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
      <Chart ref={chartRef} type={type === 'savings' ? 'bar' : 'line'} data={getChartConfig()} options={options as any} />
    </div>
  );
};
