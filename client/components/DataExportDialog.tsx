import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Download, 
  Calendar as CalendarIcon, 
  FileSpreadsheet, 
  FileText,
  Loader2 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DataExportDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onExport: (config: ExportConfig) => Promise<void>;
  isLoading?: boolean;
  loading?: boolean;
}

export interface ExportConfig {
  fromDate: Date;
  toDate: Date;
  formats: {
    csv: boolean;
    xlsx: boolean;
  };
  dataTypes: string[];
}

const DataExportDialog: React.FC<DataExportDialogProps> = ({
  trigger,
  open: controlledOpen,
  onOpenChange,
  onExport,
  isLoading = false,
  loading = false,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  
  // Initialize with yesterday's date for both from and to
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const [fromDate, setFromDate] = useState<Date>(yesterday);
  const [toDate, setToDate] = useState<Date>(yesterday);
  const [fromCalendarOpen, setFromCalendarOpen] = useState(false);
  const [toCalendarOpen, setToCalendarOpen] = useState(false);
  
  // Format checkboxes
  const [csvEnabled, setCsvEnabled] = useState(true);
  const [xlsxEnabled, setXlsxEnabled] = useState(true);

  // Helper function to get today's date at midnight
  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Helper function to check if a date is in the past
  const isPastDate = (date: Date) => {
    const today = getToday();
    return date < today;
  };

  // Handle from date change with validation
  const handleFromDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    setFromDate(date);
    // If toDate is before the new fromDate, update toDate to match fromDate
    if (toDate < date) {
      setToDate(date);
    }
  };

  // Handle to date change with validation
  const handleToDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    // Ensure toDate is not before fromDate
    if (date >= fromDate) {
      setToDate(date);
    }
  };

  // Quick date preset handlers
  const setToday = useCallback(() => {
    const today = getToday();
    setFromDate(today);
    setToDate(today);
  }, []);

  const setYesterday = useCallback(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    setFromDate(yesterday);
    setToDate(yesterday);
  }, []);

  const setThisMonth = useCallback(() => {
    const today = getToday();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    lastDay.setHours(0, 0, 0, 0);
    setFromDate(firstDay);
    setToDate(lastDay);
  }, []);

  const setLast30Days = useCallback(() => {
    const today = getToday();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    setFromDate(thirtyDaysAgo);
    setToDate(today);
  }, []);

  const handleExport = useCallback(async () => {
    // Validation checks
    if (!csvEnabled && !xlsxEnabled) {
      alert('Please select at least one export format (CSV or XLSX)');
      return;
    }

    if (fromDate > toDate) {
      alert('From date cannot be after To date');
      return;
    }

    // Check if dates are in the future
    const today = getToday();
    if (fromDate > today) {
      alert('From date cannot be in the future');
      return;
    }

    if (toDate > today) {
      alert('To date cannot be in the future');
      return;
    }

    // Check for reasonable date range (optional warning)
    const daysDifference = Math.abs((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDifference > 365) {
      const confirmed = confirm(`You're exporting data for ${Math.ceil(daysDifference)} days. This might result in a large file. Continue?`);
      if (!confirmed) return;
    }

    const config: ExportConfig = {
      fromDate,
      toDate,
      formats: {
        csv: csvEnabled,
        xlsx: xlsxEnabled,
      },
      dataTypes: [
        'PV Power',
        'Battery Power', 
        'Grid Power',
        'Load Power',
        'Battery SOC',
        'Energy Price',
        'Battery Savings'
      ],
    };

    try {
      await onExport(config);
      setOpen(false); // Close dialog on successful export
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  }, [fromDate, toDate, csvEnabled, xlsxEnabled, onExport, setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Export
          </DialogTitle>
        </DialogHeader>

        <motion.div 
          className="space-y-6 py-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Date Range Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-gray-700">Select Date Range</h3>
              <span className="text-xs text-gray-500">
                {fromDate && toDate && fromDate.getTime() === toDate.getTime() 
                  ? "Single day" 
                  : fromDate && toDate 
                    ? `${Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days`
                    : ""
                }
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* From Date */}
              <div className="space-y-2">
                <Label htmlFor="from-date" className="text-sm font-medium">From</Label>
                <Popover open={fromCalendarOpen} onOpenChange={setFromCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={(date) => {
                        if (date) {
                          handleFromDateChange(date);
                          setFromCalendarOpen(false);
                        }
                      }}
                      showOutsideDays={true}
                      fixedWeeks={true}
                      captionLayout="dropdown-buttons"
                      fromYear={2020}
                      toYear={2030}
                      toDate={getToday()} // Can't select future dates
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <Label htmlFor="to-date" className="text-sm font-medium">To</Label>
                <Popover open={toCalendarOpen} onOpenChange={setToCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={(date) => {
                        if (date) {
                          handleToDateChange(date);
                          setToCalendarOpen(false);
                        }
                      }}
                      showOutsideDays={true}
                      fixedWeeks={true}
                      captionLayout="dropdown-buttons"
                      fromYear={2020}
                      toYear={2030}
                      fromDate={fromDate} // Can't select dates before fromDate
                      toDate={getToday()} // Can't select future dates
                      disabled={(date) => date < fromDate || date > getToday()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Date selection help text */}
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
              <strong>Note:</strong> You can only select dates from the past. 
              The "To" date must be the same as or after the "From" date.
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-gray-700">Quick Select</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={setToday}
                className="h-9"
              >
                Today
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={setYesterday}
                className="h-9"
              >
                Yesterday
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={setLast30Days}
                className="h-9"
              >
                Last 30 Days
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={setThisMonth}
                className="h-9"
              >
                This Month
              </Button>
            </div>
          </div>

          {/* Export Format Selection */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-gray-700">Export Format</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="csv-format" 
                  checked={csvEnabled}
                  onCheckedChange={(checked) => setCsvEnabled(checked as boolean)}
                />
                <Label 
                  htmlFor="csv-format" 
                  className="flex items-center gap-2 text-sm font-normal cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  CSV (Comma Separated Values)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="xlsx-format" 
                  checked={xlsxEnabled}
                  onCheckedChange={(checked) => setXlsxEnabled(checked as boolean)}
                />
                <Label 
                  htmlFor="xlsx-format" 
                  className="flex items-center gap-2 text-sm font-normal cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  XLSX (Excel Spreadsheet)
                </Label>
              </div>
            </div>
          </div>

          {/* Data Types Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Data Included in Export</h4>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
              <div>• PV Power (kW)</div>
              <div>• Battery Power (kW)</div>
              <div>• Grid Power (kW)</div>
              <div>• Load Power (kW)</div>
              <div>• Battery SOC (%)</div>
              <div>• Energy Price ($/kWh)</div>
              <div>• Battery Savings ($)</div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              All chart data will be included in the selected file format(s)
            </p>
          </div>

          {/* Export Button */}
          <div className="space-y-2">
            {fromDate > toDate && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                ⚠️ From date cannot be after To date
              </div>
            )}
            {(fromDate > getToday() || toDate > getToday()) && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                ⚠️ Cannot select future dates
              </div>
            )}
            <Button 
              onClick={handleExport}
              disabled={
                (isLoading || loading) || 
                (!csvEnabled && !xlsxEnabled) ||
                fromDate > toDate ||
                fromDate > getToday() ||
                toDate > getToday()
              }
              className="w-full h-10"
            >
              {(isLoading || loading) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Export...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Data
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default DataExportDialog;
