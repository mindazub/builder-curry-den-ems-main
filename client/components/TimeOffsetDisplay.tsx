import React from 'react';
import { useSettings } from '../context/SettingsContext';

export function TimeOffsetDisplay() {
  const { timeOffset } = useSettings();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2 text-sm text-blue-800">
        <span className="font-medium">Time Offset:</span>
        <span>
          {timeOffset > 0 ? `+${timeOffset}` : timeOffset} hour{Math.abs(timeOffset) !== 1 ? 's' : ''}
        </span>
        <span className="text-blue-600">
          (Charts are shifted by this amount)
        </span>
      </div>
    </div>
  );
}
