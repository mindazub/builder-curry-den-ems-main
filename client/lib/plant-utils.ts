import { ChartDataPoint, PlantDataSnapshot } from "../../shared/types";

export const convertToChartData = (snapshots: PlantDataSnapshot[]): ChartDataPoint[] => {
  return snapshots.map((snapshot) => ({
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

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatFullDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getStatusColor = (status: string): string => {
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

export const calculatePowerStats = (data: ChartDataPoint[]) => {
  if (data.length === 0) return {};
  
  const pvValues = data.map(d => d.pv);
  const batteryValues = data.map(d => d.battery);
  const gridValues = data.map(d => d.grid);
  const loadValues = data.map(d => d.load);
  
  return {
    pv: {
      max: Math.max(...pvValues),
      min: Math.min(...pvValues),
      avg: pvValues.reduce((a, b) => a + b, 0) / pvValues.length,
    },
    battery: {
      max: Math.max(...batteryValues),
      min: Math.min(...batteryValues),
      avg: batteryValues.reduce((a, b) => a + b, 0) / batteryValues.length,
    },
    grid: {
      max: Math.max(...gridValues),
      min: Math.min(...gridValues),
      avg: gridValues.reduce((a, b) => a + b, 0) / gridValues.length,
    },
    load: {
      max: Math.max(...loadValues),
      min: Math.min(...loadValues),
      avg: loadValues.reduce((a, b) => a + b, 0) / loadValues.length,
    },
  };
};

export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPower = (value: number): string => {
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)} MW`;
  }
  return `${value.toFixed(1)} kW`;
};

export const formatEnergy = (value: number): string => {
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)} MWh`;
  }
  return `${value.toFixed(1)} kWh`;
};
