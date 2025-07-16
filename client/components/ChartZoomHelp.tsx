import React from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { HelpCircle } from 'lucide-react';

export function ChartZoomHelp() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="p-1 h-8 w-8" title="Zoom Help">
          <HelpCircle className="w-4 h-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">Chart Zoom Controls</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li>• <strong>Mouse Wheel:</strong> Zoom in/out on x-axis</li>
            <li>• <strong>Click & Drag:</strong> Select area to zoom</li>
            <li>• <strong>Pan:</strong> Click and drag to move around</li>
            <li>• <strong>Buttons:</strong> Use zoom controls in top-right</li>
            <li>• <strong>Dynamic Ticks:</strong> Time resolution adapts to zoom level</li>
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
