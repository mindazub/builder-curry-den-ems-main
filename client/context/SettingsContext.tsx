import React, { createContext, useContext, useState, useEffect } from 'react';

export type TimeFormat = '12' | '24';

interface SettingsContextType {
  timeOffset: number;
  timeFormat: TimeFormat;
  setTimeOffset: (offset: number) => void;
  setTimeFormat: (format: TimeFormat) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeOffset, setTimeOffset] = useState<number>(6); // Default +6 hours
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('24'); // Default 24-hour format

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedOffset = localStorage.getItem('timeOffset');
    const savedTimeFormat = localStorage.getItem('timeFormat') as TimeFormat;
    
    if (savedOffset) {
      setTimeOffset(parseInt(savedOffset, 10));
    }
    if (savedTimeFormat && (savedTimeFormat === '12' || savedTimeFormat === '24')) {
      setTimeFormat(savedTimeFormat);
    }
  }, []);

  // Save to localStorage when offset changes
  const updateTimeOffset = (offset: number) => {
    setTimeOffset(offset);
    localStorage.setItem('timeOffset', offset.toString());
  };

  // Save to localStorage when time format changes
  const updateTimeFormat = (format: TimeFormat) => {
    setTimeFormat(format);
    localStorage.setItem('timeFormat', format);
  };

  return (
    <SettingsContext.Provider value={{ 
      timeOffset, 
      timeFormat,
      setTimeOffset: updateTimeOffset,
      setTimeFormat: updateTimeFormat
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
