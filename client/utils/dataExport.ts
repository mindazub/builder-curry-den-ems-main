import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ChartDataPoint } from '../../shared/types';
import { ExportConfig } from '../components/DataExportDialog';

export interface ExportDataPoint {
  timestamp: number;
  formatted_timestamp: string;
  datetime: string;
  date: string;
  time: string;
  pv_power: number;
  battery_power: number;
  grid_power: number;
  load_power: number;
  battery_soc: number;
  energy_price: number;
  battery_savings: number;
}

/**
 * Convert chart data points to export format
 */
export const prepareExportData = (chartData: ChartDataPoint[]): ExportDataPoint[] => {
  return chartData.map(point => {
    const date = new Date(point.timestamp * 1000);
    
    // Format timestamp as requested: "Tue 2025-07-22 14:31:50:279"
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[date.getDay()];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    
    const formattedTimestamp = `${dayName} ${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}`;
    
    return {
      timestamp: point.timestamp,
      formatted_timestamp: formattedTimestamp,
      datetime: date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      date: date.toLocaleDateString('en-US'),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      pv_power: point.pv_power || point.pv || 0,
      battery_power: point.battery_power || point.battery || 0,
      grid_power: point.grid_power || point.grid || 0,
      load_power: point.load_power || point.load || 0,
      battery_soc: point.battery_soc || 0,
      energy_price: point.energy_price || point.price || 0,
      battery_savings: point.battery_savings || 0
    };
  });
};

/**
 * Generate CSV content from export data
 */
export const generateCSV = (data: ExportDataPoint[]): string => {
  console.log('generateCSV: Creating CSV for', data.length, 'rows');
  
  // Ensure we have valid data
  if (!data || data.length === 0) {
    throw new Error('No data provided for CSV generation');
  }

  // Check if data contains HTML (indicating API error)
  const firstRow = data[0];
  if (typeof firstRow.pv_power === 'string' && (firstRow.pv_power as string).includes('<!DOCTYPE')) {
    throw new Error('CSV generation failed: API returned HTML instead of data. Please check your authentication.');
  }

  const headers = [
    'Timestamp',
    'Formatted Timestamp',
    'Date & Time',
    'Date',
    'Time',
    'PV Power (kW)',
    'Battery Power (kW)',
    'Grid Power (kW)',
    'Load Power (kW)',
    'Battery SOC (%)',
    'Energy Price ($/kWh)',
    'Battery Savings ($)'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      row.timestamp,
      `"${row.formatted_timestamp}"`,
      `"${row.datetime}"`,
      `"${row.date}"`,
      `"${row.time}"`,
      row.pv_power,
      row.battery_power,
      row.grid_power,
      row.load_power,
      row.battery_soc,
      row.energy_price,
      row.battery_savings
    ].join(','))
  ].join('\n');

  console.log('generateCSV: Generated CSV with', csvContent.split('\n').length, 'lines');
  return csvContent;
};

/**
 * Generate and download CSV file
 */
export const downloadCSV = (data: ExportDataPoint[], filename: string): void => {
  console.log('Starting CSV generation for:', filename);
  const csvContent = generateCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  console.log('CSV file generated, starting download...');
  saveAs(blob, `${filename}.csv`);
  console.log('CSV download initiated successfully');
};

/**
 * Generate and download XLSX file
 */
export const downloadXLSX = (data: ExportDataPoint[], filename: string): void => {
  try {
    console.log('Starting XLSX generation for:', filename);
    console.log('XLSX data sample:', data[0]);
    
    // Validate data before processing
    if (!data || data.length === 0) {
      throw new Error('No data provided for XLSX generation');
    }

    // Check if data contains HTML (indicating API error)
    const firstRow = data[0];
    if (typeof firstRow.pv_power === 'string' && (firstRow.pv_power as string).includes('<!DOCTYPE')) {
      throw new Error('XLSX generation failed: API returned HTML instead of data. Please check your authentication.');
    }
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Prepare data with proper headers
    const worksheetData = [
      [
        'Timestamp',
        'Formatted Timestamp',
        'Date & Time',
        'Date',
        'Time',
        'PV Power (kW)',
        'Battery Power (kW)',
        'Grid Power (kW)',
        'Load Power (kW)',
        'Battery SOC (%)',
        'Energy Price ($/kWh)',
        'Battery Savings ($)'
      ],
      ...data.map(row => [
        row.timestamp,
        row.formatted_timestamp,
        row.datetime,
        row.date,
        row.time,
        row.pv_power,
        row.battery_power,
        row.grid_power,
        row.load_power,
        row.battery_soc,
        row.energy_price,
        row.battery_savings
      ])
    ];

    console.log('Worksheet data prepared, rows:', worksheetData.length);

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths for better readability
    const columnWidths = [
      { wch: 12 }, // Timestamp
      { wch: 25 }, // Formatted Timestamp
      { wch: 20 }, // Date & Time
      { wch: 12 }, // Date
      { wch: 12 }, // Time
      { wch: 15 }, // PV Power
      { wch: 18 }, // Battery Power
      { wch: 15 }, // Grid Power
      { wch: 15 }, // Load Power
      { wch: 15 }, // Battery SOC
      { wch: 18 }, // Energy Price
      { wch: 18 }  // Battery Savings
    ];
    worksheet['!cols'] = columnWidths;

    // Style the header row
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "366092" } },
      alignment: { horizontal: "center", vertical: "center" }
    };

    // Apply header styling
    for (let col = 0; col < 12; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle;
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Energy Data');

    // Add metadata sheet
    const metadataSheet = XLSX.utils.aoa_to_sheet([
      ['Export Information'],
      ['Generated Date:', new Date().toLocaleString()],
      ['Total Records:', data.length],
      ['Date Range:', data.length > 0 ? `${data[0].date} to ${data[data.length - 1].date}` : 'No data'],
      [''],
      ['Data Description:'],
      ['PV Power', 'Solar panel power generation in kilowatts'],
      ['Battery Power', 'Battery charge/discharge power in kilowatts (positive = charging, negative = discharging)'],
      ['Grid Power', 'Power imported from/exported to grid in kilowatts'],
      ['Load Power', 'Total electrical load consumption in kilowatts'],
      ['Battery SOC', 'Battery State of Charge as percentage'],
      ['Energy Price', 'Current electricity price in dollars per kilowatt-hour'],
      ['Battery Savings', 'Cost savings from battery usage in dollars']
    ]);

    // Style the metadata sheet
    metadataSheet['!cols'] = [{ wch: 20 }, { wch: 50 }];
    
    XLSX.utils.book_append_sheet(workbook, metadataSheet, 'Export Info');

    // Generate and save the file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    console.log('XLSX file generated, starting download...');
    saveAs(blob, `${filename}.xlsx`);
    console.log('XLSX download initiated successfully');
    
  } catch (error) {
    console.error('Error generating XLSX file:', error);
    throw new Error(`Failed to generate XLSX file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate filename based on date range
 */
export const generateFilename = (config: ExportConfig, plantId: string): string => {
  const fromDateStr = config.fromDate.toISOString().split('T')[0];
  const toDateStr = config.toDate.toISOString().split('T')[0];
  
  if (fromDateStr === toDateStr) {
    return `plant-${plantId}-${fromDateStr}`;
  } else {
    return `plant-${plantId}-${fromDateStr}_to_${toDateStr}`;
  }
};

/**
 * Main export function that handles both CSV and XLSX
 */
export const exportPlantData = async (
  chartData: ChartDataPoint[],
  config: ExportConfig,
  plantId: string
): Promise<void> => {
  console.log('exportPlantData: Starting export with', chartData.length, 'data points');
  console.log('exportPlantData: First few data points:', chartData.slice(0, 2));
  console.log('exportPlantData: Config:', config);

  if (!chartData || chartData.length === 0) {
    throw new Error('No data available for export');
  }

  // Validate that we have actual numeric data, not HTML content
  const firstPoint = chartData[0];
  if (typeof firstPoint.timestamp !== 'number' || typeof firstPoint.pv !== 'number') {
    console.error('Invalid data detected:', firstPoint);
    throw new Error('Export data appears to be corrupted or invalid. Please refresh the page and try again.');
  }

  // Filter data by date range
  const fromTimestamp = Math.floor(config.fromDate.getTime() / 1000);
  const toTimestamp = Math.floor(config.toDate.getTime() / 1000) + 86399; // End of day

  console.log('exportPlantData: Filtering data from', fromTimestamp, 'to', toTimestamp);

  const filteredData = chartData.filter(point => 
    point.timestamp >= fromTimestamp && point.timestamp <= toTimestamp
  );

  console.log('exportPlantData: Filtered to', filteredData.length, 'data points');

  if (filteredData.length === 0) {
    const fromDateStr = config.fromDate.toLocaleDateString();
    const toDateStr = config.toDate.toLocaleDateString();
    throw new Error(`No data found for the selected date range (${fromDateStr} to ${toDateStr}). Please try a different date range or check if data exists for these dates.`);
  }

  // Prepare export data
  const exportData = prepareExportData(filteredData);
  console.log('exportPlantData: Prepared export data, first row:', exportData[0]);
  
  const filename = generateFilename(config, plantId);

  // Generate downloads based on selected formats - both files at once
  const downloadPromises: Promise<void>[] = [];

  if (config.formats.csv) {
    downloadPromises.push(
      new Promise<void>((resolve) => {
        setTimeout(() => {
          downloadCSV(exportData, filename);
          resolve();
        }, 0);
      })
    );
  }

  if (config.formats.xlsx) {
    downloadPromises.push(
      new Promise<void>((resolve) => {
        setTimeout(() => {
          downloadXLSX(exportData, filename);
          resolve();
        }, 100); // Small delay to prevent browser blocking
      })
    );
  }

  // Execute all downloads simultaneously
  await Promise.all(downloadPromises);
  console.log('exportPlantData: Export completed successfully');
};
