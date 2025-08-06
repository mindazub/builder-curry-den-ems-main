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
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [fromCalendarOpen, setFromCalendarOpen] = useState(false);
  const [toCalendarOpen, setToCalendarOpen] = useState(false);
  
  // Format checkboxes
  const [csvEnabled, setCsvEnabled] = useState(true);
  const [xlsxEnabled, setXlsxEnabled] = useState(true);

  // Quick date preset handlers
  const setToday = useCallback(() => {
    const today = new Date();
    setFromDate(today);
    setToDate(today);
  }, []);

  const setYesterday = useCallback(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setFromDate(yesterday);
    setToDate(yesterday);
  }, []);

  const setThisMonth = useCallback(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setFromDate(firstDay);
    setToDate(lastDay);
  }, []);

  const setLast30Days = useCallback(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    setFromDate(thirtyDaysAgo);
    setToDate(today);
  }, []);

  const handleExport = useCallback(async () => {
    if (!csvEnabled && !xlsxEnabled) {
      alert('Please select at least one export format (CSV or XLSX)');
      return;
    }

    if (fromDate > toDate) {
      alert('From date cannot be after To date');
      return;
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
  }, [fromDate, toDate, csvEnabled, xlsxEnabled, onExport]);

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
            <h3 className="font-medium text-sm text-gray-700">Select Date Range</h3>
            
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
                        if (date) setFromDate(date);
                        setFromCalendarOpen(false);
                      }}
                      showOutsideDays={true}
                      fixedWeeks={true}
                      captionLayout="dropdown-buttons"
                      fromMonth={new Date(2020, 0)}
                      toMonth={new Date(2030, 11)}
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
                        if (date) setToDate(date);
                        setToCalendarOpen(false);
                      }}
                      showOutsideDays={true}
                      fixedWeeks={true}
                      captionLayout="dropdown-buttons"
                      fromMonth={new Date(2020, 0)}
                      toMonth={new Date(2030, 11)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
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
                onClick={setThisMonth}
                className="h-9"
              >
                This Month
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={setLast30Days}
                className="h-9"
              >
                Last 30 Days
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
          <Button 
            onClick={handleExport}
            disabled={(isLoading || loading) || (!csvEnabled && !xlsxEnabled)}
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
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default DataExportDialog;
