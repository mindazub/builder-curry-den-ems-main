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
}

export const EnergyChart: React.FC<EnergyChartProps> = ({ data, type, height = 400 }) => {
  const getChartConfig = () => {
    switch (type) {
      case 'energy':
        return {
          datasets: [
            {
              label: 'PV Power (kW)',
              data: data.map(d => ({ x: d.time, y: d.pv })),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: false,
              tension: 0.1,
            },
            {
              label: 'Battery Power (kW)',
              data: data.map(d => ({ x: d.time, y: d.battery })),
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: false,
              tension: 0.1,
            },
            {
              label: 'Grid Power (kW)',
              data: data.map(d => ({ x: d.time, y: d.grid })),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: false,
              tension: 0.1,
            },
            {
              label: 'Load Power (kW)',
              data: data.map(d => ({ x: d.time, y: d.load })),
              borderColor: 'rgb(234, 179, 8)',
              backgroundColor: 'rgba(234, 179, 8, 0.1)',
              fill: false,
              tension: 0.1,
            },
            {
              label: 'Battery SOC (%)',
              data: data.map(d => ({ x: d.time, y: d.battery_soc })),
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
              data: data.map(d => ({ x: d.time, y: d.battery })),
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: false,
              tension: 0.1,
            },
            {
              label: 'Energy Price (€/MWh)',
              data: data.map(d => ({ x: d.time, y: d.price })),
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
              data: data.map(d => ({ x: d.time, y: d.battery_savings })),
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.6)',
              fill: 'origin',
              tension: 0.1,
            },
            {
              label: 'Energy Price (€/MWh)',
              data: data.map(d => ({ x: d.time, y: d.price })),
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
      },
    },
    scales: {
      x: {
        type: 'category',
        display: true,
        title: {
          display: true,
          text: 'Time',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
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
