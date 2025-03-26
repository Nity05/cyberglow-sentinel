
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface ScanResult {
  id: string;
  fileName: string;
  fileSize: string;
  scanDate: Date;
  threatLevel: 'Safe' | 'Suspicious' | 'Critical';
  detailsPath?: string;
  filePath?: string;
}

interface ScanHistoryContextType {
  scanHistory: ScanResult[];
  addScanResult: (result: Omit<ScanResult, 'id' | 'scanDate'>) => void;
  clearHistory: () => void;
}

const ScanHistoryContext = createContext<ScanHistoryContextType | undefined>(undefined);

export const ScanHistoryProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  // Load scan history from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`scanHistory_${user.id}`);
      if (savedHistory) {
        // Parse dates correctly
        const parsedHistory = JSON.parse(savedHistory, (key, value) => {
          if (key === 'scanDate') return new Date(value);
          return value;
        });
        setScanHistory(parsedHistory);
      } else {
        setScanHistory([]);
      }
    } else {
      setScanHistory([]);
    }
  }, [user]);

  // Save to localStorage whenever scan history changes
  useEffect(() => {
    if (user && scanHistory.length > 0) {
      localStorage.setItem(`scanHistory_${user.id}`, JSON.stringify(scanHistory));
    }
  }, [scanHistory, user]);

  const addScanResult = (result: Omit<ScanResult, 'id' | 'scanDate'>) => {
    const newScan: ScanResult = {
      ...result,
      id: `scan_${Math.random().toString(36).substring(2, 9)}`,
      scanDate: new Date(),
    };
    
    setScanHistory(prev => [newScan, ...prev]);
  };

  const clearHistory = () => {
    if (user) {
      localStorage.removeItem(`scanHistory_${user.id}`);
      setScanHistory([]);
    }
  };

  return (
    <ScanHistoryContext.Provider value={{ scanHistory, addScanResult, clearHistory }}>
      {children}
    </ScanHistoryContext.Provider>
  );
};

export const useScanHistory = () => {
  const context = useContext(ScanHistoryContext);
  if (context === undefined) {
    throw new Error('useScanHistory must be used within a ScanHistoryProvider');
  }
  return context;
};
