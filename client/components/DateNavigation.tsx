import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Download, Edit, Plus, RefreshCw } from "lucide-react";

interface DateNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  plantStatus: string;
  getStatusColor: (status: string) => string;
  chartData?: any[];
  onExport?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const DateNavigation: React.FC<DateNavigationProps> = React.memo(({
  selectedDate,
  onDateChange,
  onPreviousDay,
  onNextDay,
  plantStatus,
  getStatusColor,
  chartData = [],
  onExport,
  onRefresh,
  isRefreshing = false
}) => {
  const [countdown, setCountdown] = React.useState(0);
  const [lastRefreshTime, setLastRefreshTime] = React.useState<Date | null>(null);
  
  // Calculate next refresh time (sync to 5-minute intervals)
  const getNextRefreshTime = React.useCallback(() => {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    
    // Calculate how many minutes to add to get to next 5-minute mark
    const minutesToAdd = 5 - (minutes % 5);
    const nextRefresh = new Date(now);
    nextRefresh.setMinutes(minutes + minutesToAdd, 0, 0); // Set seconds and milliseconds to 0
    
    return nextRefresh;
  }, []);

  // Update countdown every second
  React.useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextRefresh = getNextRefreshTime();
      const timeDiff = nextRefresh.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        setCountdown(0);
        // Trigger refresh when countdown reaches 0
        if (onRefresh) {
          onRefresh();
          setLastRefreshTime(new Date());
        }
      } else {
        setCountdown(Math.ceil(timeDiff / 1000)); // Convert to seconds
      }
    };
    
    // Update immediately
    updateCountdown();
    
    // Then update every second
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [getNextRefreshTime, onRefresh]);

  // Format countdown as MM:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date);
    }
  };

  return (
    <div className="p-4 mb-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center flex-1">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousDay}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-64 justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onNextDay}
              disabled={isToday}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExport}
            disabled={!chartData || chartData.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>

          <Link to="/plants">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link to="/plants">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Plant
            </Button>
          </Link>

          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="relative"
            title={`Auto-refresh in ${formatCountdown(countdown)}`}
          >
            <RefreshCw 
              className={`w-4 h-4 mr-2 transition-all duration-500 ${
                isRefreshing 
                  ? 'animate-spin text-green-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`} 
            />
            {formatCountdown(countdown)}
          </Button>
        </div>
      </div>
    </div>
  );
});

DateNavigation.displayName = 'DateNavigation';

export default DateNavigation;
