import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  timeOffset: number;
  setTimeOffset: (offset: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeOffset, setTimeOffset] = useState<number>(6); // Default +6 hours

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedOffset = localStorage.getItem('timeOffset');
    if (savedOffset) {
      setTimeOffset(parseInt(savedOffset, 10));
    }
  }, []);

  // Save to localStorage when offset changes
  const updateTimeOffset = (offset: number) => {
    setTimeOffset(offset);
    localStorage.setItem('timeOffset', offset.toString());
  };

  return (
    <SettingsContext.Provider value={{ timeOffset, setTimeOffset: updateTimeOffset }}>
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
