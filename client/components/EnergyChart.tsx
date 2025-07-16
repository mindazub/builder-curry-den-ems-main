import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler,
  TimeScale
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartDataPoint } from '../../shared/types';
import { useSettings } from '../context/SettingsContext';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  
  // Apply time offset to data points
  const offsetData = data.map(d => ({
    ...d,
    timestamp: d.timestamp + (timeOffset * 3600) // Convert hours to seconds
  }));

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
        return {
          datasets: [
            {
              label: 'Battery Savings (€)',
              data: offsetData.map(d => ({ x: d.timestamp * 1000, y: d.battery_savings })),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.6)',
              fill: 'origin',
              tension: 0.1,
            },
            {
              label: 'Energy Price (€/MWh)',
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
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
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
            hour: 'HH:mm',
          },
          tooltipFormat: 'HH:mm',
        },
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        min: timeRange.min,
        max: timeRange.max,
        ticks: {
          source: 'auto',
          stepSize: 1000 * 60 * 60, // 1 hour in milliseconds
          callback: function(value, index, values) {
            const date = new Date(value as number);
            return date.getHours().toString().padStart(2, '0') + ':00';
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
    <div style={{ height }}>
      <Line data={getChartConfig()} options={options} />
    </div>
  );
};
