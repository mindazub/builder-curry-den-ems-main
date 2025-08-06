# 📊 **Plant Data Flow & Chart Rendering Tutorial**

This comprehensive guide explains how the plant monitoring application fetches data from the API, processes it, and displays beautiful interactive charts.

---

## 🔄 **Step 1: Data Fetching Architecture**

### **API Call Initialization**

The application uses React hooks to manage data fetching lifecycle:

```tsx
// 1. Component mounts and triggers data fetch
useEffect(() => {
  fetchPlantData(selectedDate, "initial");
}, [fetchPlantData]);

// 2. Date changes trigger new data fetch
useEffect(() => {
  if (plantData) {
    // Only if we already have data (not initial load)
    fetchPlantData(selectedDate, "dateChange");
  }
}, [selectedDate]);
```

### **API Request Construction**

The `fetchPlantData` function handles all data fetching scenarios:

```tsx
const fetchPlantData = useCallback(
  async (
    date: Date = new Date(),
    source: "initial" | "dateChange" | "refresh" = "initial",
  ) => {
    if (!id) return;

    try {
      // 🎭 Smart loading state management
      if (source === "dateChange" || source === "refresh") {
        setChartLoading(true); // Show skeleton charts only
      } else {
        setLoading(true); // Show full page loader
      }
      setError(null);

      // 🕐 Step 1: Create time boundaries (full day: 00:00 to 23:59:59)
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // 📡 Step 2: Convert to Unix timestamps for API
      const start = Math.floor(startOfDay.getTime() / 1000);
      const end = Math.floor(endOfDay.getTime() / 1000);

      // 🌐 Step 3: Make API call with plant ID and time range
      const response = await plantApi.getPlantView(id, start, end);
      console.log("fetchPlantData: API response:", response);
      console.log(
        "fetchPlantData: aggregated_data_snapshots length:",
        response?.aggregated_data_snapshots?.length,
      );
      setPlantData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch plant data",
      );
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  },
  [id],
);
```

**Key Features:**

- ⏰ **Time Range Management**: Automatically creates full-day boundaries
- 🎭 **Smart Loading States**: Different loading indicators for different actions
- 🛡️ **Error Handling**: Comprehensive error catching and user feedback
- 🔄 **Source Tracking**: Tracks whether data fetch is initial load, date change, or manual refresh

---

## 🏗️ **Step 2: Raw API Response Structure**

The API returns a structured `PlantViewResponse` object containing all necessary data:

```typescript
interface PlantViewResponse {
  plant_metadata: {
    uid: string; // Unique plant identifier
    owner: string; // Plant owner information
    status: string; // Current operational status
    capacity: number; // Plant capacity in watts
    latitude: number; // Geographic coordinates
    longitude: number;
    updated_at: number; // Last update timestamp
  };

  // 📊 Raw time-series data points (main data source for charts)
  aggregated_data_snapshots: PlantDataSnapshot[];

  // 🔌 Device hierarchy (controllers, feeds, devices)
  controllers: Controller[];
}

interface PlantDataSnapshot {
  dt: number; // Unix timestamp (seconds)
  pv_p: number; // Solar power in watts
  battery_p: number; // Battery power in watts (+ = charging, - = discharging)
  grid_p: number; // Grid power in watts (+ = importing, - = exporting)
  load_p: number; // Load power in watts
  battery_soc: number; // Battery state of charge percentage (0-100)
  price: number; // Energy price in €/MWh
  battery_savings: number; // Battery savings in euros
}
```

**Data Structure Explanation:**

- 🏭 **Plant Metadata**: Static information about the solar installation
- 📈 **Time-Series Data**: Regular snapshots of energy flow measurements
- 🔌 **Device Hierarchy**: Physical hardware structure and status

---

## ⚡ **Step 3: Data Processing Pipeline**

### **Raw Data Validation & Transformation**

The `processChartData` function transforms raw API data into chart-ready format:

```tsx
const processChartData = useCallback(
  (snapshots: PlantDataSnapshot[]): ChartDataPoint[] => {
    // 🔍 Step 1: Validate input data
    if (!Array.isArray(snapshots)) {
      console.warn("processChartData: snapshots is not an array:", snapshots);
      return [];
    }

    console.log("processChartData: Processing", snapshots.length, "snapshots");
    console.log("First snapshot sample:", snapshots[0]);

    // ⏰ Step 2: Sort by timestamp for correct chronological order
    const sortedSnapshots = [...snapshots].sort((a, b) => a.dt - b.dt);

    // 🧹 Step 3: Filter out invalid/corrupted data points
    const processedData = sortedSnapshots
      .filter((snapshot) => {
        const isValid =
          snapshot &&
          typeof snapshot.dt === "number" &&
          snapshot.dt > 0 &&
          typeof snapshot.pv_p === "number";

        if (!isValid) {
          console.warn("Invalid snapshot filtered out:", snapshot);
        }
        return isValid;
      })

      // 🔄 Step 4: Transform raw data into chart-ready format
      .map((snapshot) => ({
        // ⌚ Time formatting for display
        time: formatTimestamp(snapshot.dt),
        timestamp: snapshot.dt,

        // 📊 Power conversion: Watts → Kilowatts for readability
        pv: snapshot.pv_p / 1000, // Solar power
        battery: snapshot.battery_p / 1000, // Battery power
        grid: snapshot.grid_p / 1000, // Grid power
        load: snapshot.load_p / 1000, // Load power

        // 🔋 Battery metrics (already in correct units)
        battery_soc: snapshot.battery_soc, // State of charge %
        price: snapshot.price, // Energy price €/MWh
        battery_savings: snapshot.battery_savings, // Savings €

        // 📤 Additional properties for data export functionality
        pv_power: snapshot.pv_p / 1000,
        battery_power: snapshot.battery_p / 1000,
        grid_power: snapshot.grid_p / 1000,
        load_power: snapshot.load_p / 1000,
        energy_price: snapshot.price,
      }));

    console.log(
      "processChartData: Processed",
      processedData.length,
      "valid data points",
    );
    return processedData;
  },
  [formatTimestamp],
);
```

**Processing Steps Explained:**

1. **🔍 Data Validation**: Ensures input is valid array with proper structure
2. **⏰ Temporal Ordering**: Sorts data points by timestamp for correct chart progression
3. **🧹 Quality Control**: Filters out corrupted or invalid data points
4. **🔄 Unit Conversion**: Converts watts to kilowatts for better chart readability
5. **📝 Format Enhancement**: Adds formatted time strings and export-friendly properties

### **Memoized Chart Data**

```tsx
// 🧠 Step 5: Memoize processed data to prevent unnecessary recalculations
const chartData = useMemo(() => {
  if (!plantData) return [];
  return processChartData(plantData.aggregated_data_snapshots);
}, [plantData, processChartData]);
```

**Memoization Benefits:**

- ⚡ **Performance**: Prevents expensive recalculations on every render
- 🎯 **Efficiency**: Only recalculates when input data actually changes
- 🧠 **Memory**: Optimizes React rendering performance

---

## 📈 **Step 4: Chart Component Architecture**

### **Data Distribution to Charts**

The processed data flows to the main charts component:

```tsx
<PlantCharts
  chartData={chartData} // 📊 Processed time-series data
  selectedDate={selectedDate} // 📅 Current date context
  onDownloadPNG={downloadChartPNG} // 🖼️ PNG export handler
  onDownloadCSV={downloadChartCSV} // 📄 CSV export handler
  onDownloadPDF={downloadChartPDF} // 📑 PDF export handler
/>
```

### **PlantCharts Component Structure**

The `PlantCharts` component creates three different chart visualizations from the same data:

```tsx
// PlantCharts receives processed data and creates 3 specialized chart types:

// 1. 🌟 Energy Live Chart - Shows comprehensive power flow
<Card>
  <CardHeader>
    <CardTitle>Energy Live Chart</CardTitle>
    <DownloadDropdown onDownloadPNG={() => onDownloadPNG('energy')} />
  </CardHeader>
  <CardContent>
    {energyLiveTab === "graph" ? (
      <EnergyChart
        data={chartData}
        type="energy"
        selectedDate={selectedDate}
      />
    ) : (
      <DataTable data={energyTableData} type="energy" />
    )}
  </CardContent>
</Card>

// 2. 🔋 Battery Power Chart - Focuses on battery metrics
<Card>
  <CardHeader>
    <CardTitle>Battery Power Chart</CardTitle>
    <DownloadDropdown onDownloadPNG={() => onDownloadPNG('battery')} />
  </CardHeader>
  <CardContent>
    {batteryPowerTab === "graph" ? (
      <EnergyChart
        data={chartData}
        type="battery"
        selectedDate={selectedDate}
      />
    ) : (
      <DataTable data={batteryTableData} type="battery" />
    )}
  </CardContent>
</Card>

// 3. 💰 Battery Savings Chart - Shows financial benefits
<Card>
  <CardHeader>
    <CardTitle>Battery Savings Chart</CardTitle>
    <Badge>Total savings: {dailyBatterySavingsTotal.toFixed(2)}€</Badge>
    <DownloadDropdown onDownloadPNG={() => onDownloadPNG('savings')} />
  </CardHeader>
  <CardContent>
    {batterySavingsTab === "graph" ? (
      <EnergyChart
        data={chartData}
        type="savings"
        selectedDate={selectedDate}
      />
    ) : (
      <DataTable data={savingsTableData} type="savings" />
    )}
  </CardContent>
</Card>
```

**Component Features:**

- 📊 **Multi-View Support**: Each chart has Graph and Data table views
- 📥 **Export Integration**: Download options for PNG, CSV, and PDF
- 🎨 **Consistent Styling**: Unified card-based layout with proper spacing
- 📱 **Responsive Design**: Adapts to different screen sizes

---

## 🎨 **Step 5: Chart.js Data Preparation**

### **Chart Data Transformation (inside EnergyChart component)**

The `EnergyChart` component transforms the processed data into Chart.js-compatible format:

```tsx
// Different chart types process the same data with different focus areas:

const chartData = {
  labels: data.map((d) => d.time), // X-axis labels: ["09:00", "09:15", "09:30", ...]

  datasets:
    type === "energy"
      ? [
          // 🌟 Energy Chart Dataset Configuration
          {
            label: "Solar (PV)",
            data: data.map((d) => d.pv),
            borderColor: "#f59e0b", // Amber for solar
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            fill: true,
            tension: 0.4, // Smooth curves
            pointRadius: 0, // Hide individual points
            pointHoverRadius: 6, // Show points on hover
          },
          {
            label: "Battery",
            data: data.map((d) => d.battery),
            borderColor: "#10b981", // Green for battery
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Grid",
            data: data.map((d) => d.grid),
            borderColor: "#3b82f6", // Blue for grid
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Load",
            data: data.map((d) => d.load),
            borderColor: "#ef4444", // Red for load
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            fill: true,
            tension: 0.4,
          },
        ]
      : type === "battery"
        ? [
            // 🔋 Battery Chart Dataset Configuration (Dual Y-axis)
            {
              label: "Battery Power (kW)",
              data: data.map((d) => d.battery),
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              yAxisID: "y", // Left Y-axis for power
              type: "line",
              fill: true,
            },
            {
              label: "Battery SOC (%)",
              data: data.map((d) => d.battery_soc),
              borderColor: "#8b5cf6", // Purple for SOC
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              yAxisID: "y1", // Right Y-axis for percentage
              type: "line",
              fill: false,
            },
          ]
        : [
            // 💰 Savings Chart Dataset Configuration
            {
              label: "Battery Savings (€)",
              data: data.map((d) => d.battery_savings),
              borderColor: "#10b981", // Green for savings
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              fill: true,
              yAxisID: "y",
            },
            {
              label: "Energy Price (€/MWh)",
              data: data.map((d) => d.price),
              borderColor: "#f59e0b", // Amber for price
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              fill: false,
              yAxisID: "y1", // Separate axis for price
            },
          ],
};

// Chart.js Configuration Options
const options: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      position: "top",
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "white",
      bodyColor: "white",
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
    },
    zoom: {
      // Interactive zoom/pan functionality
      pan: {
        enabled: true,
        mode: "x",
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: "x",
      },
    },
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Time",
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    y: {
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text:
          type === "energy"
            ? "Power (kW)"
            : type === "battery"
              ? "Power (kW)"
              : "Savings (€)",
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    // Dual Y-axis for battery and savings charts
    ...(type === "battery" || type === "savings"
      ? {
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: type === "battery" ? "SOC (%)" : "Price (€/MWh)",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        }
      : {}),
  },
};
```

**Chart Configuration Features:**

- 🎨 **Consistent Color Scheme**: Meaningful colors for different data types
- 📊 **Dual Y-Axis Support**: For charts with different measurement units
- 🔍 **Interactive Zoom/Pan**: Users can explore data in detail
- 💡 **Smart Tooltips**: Contextual information on hover
- 📱 **Responsive Design**: Adapts to container size

---

## 🔄 **Step 6: Real-time Data Updates**

### **Loading States Management**

The application uses sophisticated loading state management for optimal user experience:

```tsx
// 🎭 Different loading states for different scenarios
const [loading, setLoading] = useState(true); // Initial page load
const [chartLoading, setChartLoading] = useState(false); // Chart updates only
const [error, setError] = useState<string | null>(null); // Error states

// 🔄 Smart loading based on user action
const fetchPlantData = useCallback(
  async (date: Date, source: string) => {
    if (source === "dateChange" || source === "refresh") {
      setChartLoading(true); // Show skeleton charts, keep UI interactive
    } else {
      setLoading(true); // Show full page loader for initial load
    }

    try {
      const response = await plantApi.getPlantView(id, start, end);
      setPlantData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  },
  [id],
);
```

### **Smooth Chart Transitions**

Using Framer Motion for elegant loading transitions:

```tsx
<AnimatePresence mode="wait">
  {chartLoading ? (
    <motion.div
      key="chart-skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="space-y-6"
    >
      <ChartSkeleton
        title="Energy Live Chart"
        showTabs={true}
        showDownload={true}
      />
      <ChartSkeleton
        title="Battery Power & State of Charge"
        showTabs={true}
        showDownload={true}
      />
      <ChartSkeleton
        title="Battery Savings & Energy Pricing"
        showTabs={true}
        showDownload={true}
      />
    </motion.div>
  ) : (
    <motion.div
      key="chart-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <PlantCharts
        chartData={chartData}
        selectedDate={selectedDate}
        onDownloadPNG={downloadChartPNG}
        onDownloadCSV={downloadChartCSV}
        onDownloadPDF={downloadChartPDF}
      />
    </motion.div>
  )}
</AnimatePresence>
```

**Loading State Benefits:**

- 🎭 **Visual Continuity**: Smooth transitions between loading and content states
- ⚡ **Perceived Performance**: Users see immediate feedback for their actions
- 🎯 **Context Preservation**: Different loading indicators for different actions
- 💫 **Professional UX**: Polished animations enhance user experience

---

## 📊 **Step 7: Interactive Chart Features**

### **Tab Switching (Graph vs Data Table)**

Each chart provides dual viewing modes:

```tsx
// Chart Header with Tab Navigation
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

// Conditional Content Rendering
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
```

### **Download Options**

Comprehensive export functionality for different use cases:

```tsx
// Download Dropdown Menu
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm" className="p-1 h-8 w-8">
      <Download className="w-4 h-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => onDownloadPNG("energy")}>
      Download as PNG
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => onDownloadCSV("energy")}>
      Download as CSV
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => onDownloadPDF("energy")}>
      Download as PDF
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Interactive Features:**

- 📊 **Dual View Modes**: Visual charts and detailed data tables
- 📥 **Multiple Export Formats**: PNG for presentations, CSV for analysis, PDF for reports
- 🎨 **Consistent UI**: Unified design language across all interactions
- ⌨️ **Keyboard Accessible**: Proper focus management and ARIA labels

---

## 💾 **Step 8: Data Export Pipeline**

### **Export Data Preparation**

The export system handles multiple formats with comprehensive validation:

```tsx
const handleExport = useCallback(
  async (config: ExportConfig) => {
    // 🔍 Step 1: Validate export data availability
    if (!chartData || chartData.length === 0 || !id) {
      toast({
        title: "Export Error",
        description:
          "No data available for export. Please ensure plant data is loaded.",
        variant: "destructive",
      });
      return;
    }

    // 🧪 Step 2: Debug logging for troubleshooting
    console.log("chartData for export:", chartData.slice(0, 3)); // Show first 3 items
    console.log(
      "plantData:",
      plantData?.aggregated_data_snapshots?.slice(0, 2),
    ); // Show raw data

    // ✅ Step 3: Additional validation for data quality
    const hasValidData = chartData.some(
      (point) =>
        typeof point.timestamp === "number" &&
        point.timestamp > 0 &&
        typeof point.pv === "number",
    );

    if (!hasValidData) {
      toast({
        title: "Export Error",
        description:
          "The current data appears to be invalid. Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    // 🛡️ Step 4: Check for actual data snapshots
    if (
      !plantData ||
      !plantData.aggregated_data_snapshots ||
      plantData.aggregated_data_snapshots.length === 0
    ) {
      toast({
        title: "Export Error",
        description:
          "No plant data snapshots available. The API may have returned invalid data.",
        variant: "destructive",
      });
      return;
    }

    try {
      setExportLoading(true);

      // 📤 Step 5: Execute export with processed chart data
      await exportPlantData(chartData, config, id);

      // ✅ Step 6: Success feedback
      toast({
        title: "Export Successful",
        description: `Data exported for ${config.formats.csv && config.formats.xlsx ? "CSV and XLSX" : config.formats.csv ? "CSV" : "XLSX"} format`,
      });

      setShowExportDialog(false);
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description:
          error instanceof Error ? error.message : "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  },
  [chartData, id, toast, plantData],
);
```

### **Individual Chart Downloads**

#### **PNG Chart Export**

```tsx
const downloadChartPNG = useCallback(
  (type: "energy" | "battery" | "savings") => {
    // 🎯 Step 1: Find the specific chart canvas element
    const chartElement = document.querySelector(
      `[data-chart-type="${type}"] canvas`,
    ) as HTMLCanvasElement;

    if (chartElement) {
      // 🖼️ Step 2: Create a new canvas with white background
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = chartElement.width;
      canvas.height = chartElement.height;

      // 🎨 Step 3: Fill with white background for clean export
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 📊 Step 4: Draw the chart on top of white background
        ctx.drawImage(chartElement, 0, 0);
      }

      // 💾 Step 5: Trigger download
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${type}-chart-${selectedDate.toISOString().split("T")[0]}.png`;
      link.href = url;
      link.click();
    }
  },
  [selectedDate],
);
```

#### **CSV Data Export**

```tsx
const downloadChartCSV = useCallback(
  (type: "energy" | "battery" | "savings") => {
    // 📋 Step 1: Create CSV structure with headers
    const csvContent = [
      ["Timestamp", "Value", "Type"],

      // 📊 Step 2: Transform chart data into CSV rows
      ...chartData.flatMap((d) => [
        [
          new Date(d.timestamp * 1000).toISOString(),
          d.pv.toString(),
          "Solar (PV)",
        ],
        [new Date(d.timestamp * 1000).toISOString(), d.grid.toString(), "Grid"],
        [new Date(d.timestamp * 1000).toISOString(), d.load.toString(), "Load"],
        [
          new Date(d.timestamp * 1000).toISOString(),
          d.battery.toString(),
          "Battery",
        ],
        [
          new Date(d.timestamp * 1000).toISOString(),
          d.battery_soc.toString(),
          "Battery SOC",
        ],
        [
          new Date(d.timestamp * 1000).toISOString(),
          d.price.toString(),
          "Price",
        ],
        [
          new Date(d.timestamp * 1000).toISOString(),
          d.battery_savings.toString(),
          "Battery Savings",
        ],
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // 💾 Step 3: Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${type}-chart-data-${selectedDate.toISOString().split("T")[0]}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  },
  [chartData, selectedDate],
);
```

#### **PDF Report Export**

```tsx
const downloadChartPDF = useCallback(
  (type: "energy" | "battery" | "savings") => {
    const chartElement = document.querySelector(
      `[data-chart-type="${type}"] canvas`,
    ) as HTMLCanvasElement;

    if (chartElement && plantData) {
      // 📄 Step 1: Initialize PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      let yPosition = 20;

      // 📋 Step 2: Add report title and metadata
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `${type.charAt(0).toUpperCase() + type.slice(1)} Chart Report`,
        20,
        yPosition,
      );
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Date: ${selectedDate.toLocaleDateString()}`, 20, yPosition);
      yPosition += 15;

      // 🏭 Step 3: Add plant information section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Plant Information", 20, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Plant ID: ${plantData.plant_metadata.uid}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Owner: ${plantData.plant_metadata.owner}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Status: ${plantData.plant_metadata.status}`, 20, yPosition);
      yPosition += 5;
      pdf.text(
        `Capacity: ${plantData.plant_metadata.capacity} kW`,
        20,
        yPosition,
      );
      yPosition += 5;
      pdf.text(
        `Location: ${plantData.plant_metadata.latitude.toFixed(4)}, ${plantData.plant_metadata.longitude.toFixed(4)}`,
        20,
        yPosition,
      );
      yPosition += 15;

      // 📊 Step 4: Add chart image with white background
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = chartElement.width;
      canvas.height = chartElement.height;

      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(chartElement, 0, 0);
      }

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // 📄 Step 5: Handle page breaks for large content
      if (yPosition + imgHeight > 280) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 15;

      // 📊 Step 6: Add data table
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 20;
      }

      // [Table generation code continues...]

      // 💾 Step 7: Save PDF
      pdf.save(
        `${type}-chart-report-${selectedDate.toISOString().split("T")[0]}.pdf`,
      );
    }
  },
  [selectedDate, plantData, chartData, formatTimestamp],
);
```

**Export Features:**

- 🖼️ **PNG Charts**: High-quality image exports with white backgrounds
- 📊 **CSV Data**: Structured data for spreadsheet analysis
- 📑 **PDF Reports**: Professional reports with charts and metadata
- 🛡️ **Validation**: Comprehensive checks before export
- 📅 **Date Context**: Filenames include selected date for organization

---

## 🎯 **Step 9: Performance Optimizations**

### **Memoization Strategy**

Strategic use of React hooks for optimal performance:

```tsx
// 🧠 Prevent unnecessary re-renders and recalculations
const chartData = useMemo(() => {
  if (!plantData) return [];
  return processChartData(plantData.aggregated_data_snapshots);
}, [plantData, processChartData]);

// 🔄 Memoize callback functions to prevent child component re-renders
const handleRefresh = useCallback(() => {
  fetchPlantData(selectedDate, "refresh");
}, [fetchPlantData, selectedDate]);

const downloadChartPNG = useCallback(
  (type: "energy" | "battery" | "savings") => {
    // Download logic here
  },
  [selectedDate],
);

const processChartData = useCallback(
  (snapshots: PlantDataSnapshot[]): ChartDataPoint[] => {
    // Processing logic here
  },
  [formatTimestamp],
);

const getStatusColor = useCallback((status: string) => {
  // Status color logic here
}, []); // No dependencies - pure function
```

### **Smart Re-fetching Logic**

```tsx
// 🎯 Only fetch when necessary - avoid redundant API calls
useEffect(() => {
  fetchPlantData(selectedDate, "initial");
}, [fetchPlantData]); // Only runs on mount

useEffect(() => {
  if (plantData) {
    // Only if we already have data (not initial load)
    fetchPlantData(selectedDate, "dateChange");
  }
}, [selectedDate]); // Only re-fetch when date actually changes
```

### **Component Optimization**

```tsx
// 🚀 Use React.memo for expensive child components
const PlantCharts = React.memo(
  ({
    chartData,
    selectedDate,
    onDownloadPNG,
    onDownloadCSV,
    onDownloadPDF,
    isLoading = false,
  }) => {
    // Component logic here
  },
);

const PlantDevices = React.memo(({ plantData, getStatusColor }) => {
  // Component logic here
});
```

**Performance Benefits:**

- ⚡ **Reduced Calculations**: Memoization prevents expensive recomputations
- 🎯 **Selective Updates**: Components only re-render when their data changes
- 🔄 **Efficient API Usage**: Smart fetching reduces unnecessary network requests
- 📱 **Better UX**: Faster rendering and smoother interactions

---

## 📋 **Complete Data Flow Summary**

### **🚀 End-to-End Process Flow**

1. **🎬 Initialization**:

   - Component mounts → triggers `fetchPlantData` with current date
   - Loading state activated → full page spinner shown

2. **🌐 API Communication**:

   - Create time boundaries (00:00 to 23:59:59 for selected date)
   - Convert to Unix timestamps → call `plantApi.getPlantView(id, start, end)`
   - Receive `PlantViewResponse` with metadata + time-series data

3. **🔍 Data Validation & Processing**:

   - Check data integrity → filter invalid snapshots
   - Sort chronologically → ensure correct time sequence
   - Convert units (watts → kilowatts) → improve readability

4. **⚡ Transformation & Caching**:

   - Transform raw snapshots → chart-ready `ChartDataPoint[]`
   - Memoize processed data → prevent unnecessary recalculations
   - Add export-friendly properties → prepare for data downloads

5. **📊 Chart Rendering**:

   - Distribute data to `PlantCharts` component
   - Create 3 specialized charts → Energy, Battery, Savings
   - Configure Chart.js → colors, scales, interactions, zoom

6. **🎭 UI State Management**:

   - Handle loading transitions → skeleton charts during updates
   - Manage tab switching → graph vs data table views
   - Error handling → user-friendly error messages

7. **📥 Export Functionality**:

   - PNG exports → high-quality chart images
   - CSV exports → structured data for analysis
   - PDF reports → professional documents with metadata

8. **🔄 Real-time Updates**:
   - Date changes → smart re-fetching with chart loading
   - Manual refresh → full data reload with user feedback
   - Error recovery → retry mechanisms and fallbacks

### **🎯 Key Architecture Principles**

- **📊 Single Source of Truth**: All charts derive from the same processed dataset
- **⚡ Performance First**: Strategic memoization and smart re-rendering
- **🛡️ Robust Error Handling**: Comprehensive validation at every step
- **🎨 Consistent UX**: Unified loading states and smooth transitions
- **📱 Responsive Design**: Adapts seamlessly to different screen sizes
- **♿ Accessibility**: Keyboard navigation and screen reader support
- **🔧 Developer Experience**: Clear separation of concerns and debugging tools

This architecture ensures **fast**, **reliable**, and **user-friendly** data visualization with proper error handling, loading states, and performance optimizations for a production-ready solar plant monitoring application! 🌟

---

## 🔧 **Technical Implementation Notes**

### **Dependencies Used**

```json
{
  "chart.js": "^4.x.x", // Core charting library
  "react-chartjs-2": "^5.x.x", // React wrapper for Chart.js
  "chartjs-plugin-zoom": "^2.x.x", // Interactive zoom/pan functionality
  "framer-motion": "^10.x.x", // Smooth animations and transitions
  "jspdf": "^2.x.x", // PDF generation for reports
  "lucide-react": "^0.x.x", // Icon library for UI elements
  "@radix-ui/react-*": "^1.x.x" // Accessible UI components
}
```

### **File Structure**

```
client/
├── pages/
│   └── PlantDetails.tsx          # Main page component
├── components/
│   ├── PlantCharts.tsx           # Charts container component
│   ├── EnergyChart.tsx           # Individual chart component
│   ├── PlantStaticInfo.tsx       # Plant metadata display
│   ├── PlantDevices.tsx          # Device hierarchy display
│   ├── DateNavigation.tsx        # Date picker component
│   ├── ChartSkeleton.tsx         # Loading skeleton
│   └── DataExportDialog.tsx      # Export modal
├── utils/
│   └── dataExport.ts             # Export utility functions
└── shared/
    ├── api.ts                    # API communication layer
    └── types.ts                  # TypeScript type definitions
```

### **API Endpoints**

```typescript
// Plant data endpoint
GET /api/plants/{id}/view?start={timestamp}&end={timestamp}

// Response structure
interface PlantViewResponse {
  plant_metadata: PlantMetadata;
  aggregated_data_snapshots: PlantDataSnapshot[];
  controllers: Controller[];
}
```

This comprehensive tutorial provides everything needed to understand and replicate the plant monitoring application's data flow and chart rendering system! 🚀
