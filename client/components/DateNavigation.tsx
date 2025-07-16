import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Edit, Plus } from "lucide-react";

interface DateNavigationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  plantStatus: string;
  getStatusColor: (status: string) => string;
}

const DateNavigation: React.FC<DateNavigationProps> = React.memo(({
  selectedDate,
  onDateChange,
  onPreviousDay,
  onNextDay,
  plantStatus,
  getStatusColor
}) => {
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
          <Badge className={getStatusColor(plantStatus)}>
            {plantStatus}
          </Badge>
        </div>
      </div>
    </div>
  );
});

DateNavigation.displayName = 'DateNavigation';

export default DateNavigation;
