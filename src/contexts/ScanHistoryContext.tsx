
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiScanner } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export interface ScanResult {
  id: string;
  fileName: string;
  fileSize: string;
  scanDate: Date;
  threatLevel: 'Safe' | 'Suspicious' | 'Critical';
  detailsPath?: string;
  filePath?: string;
  mlPrediction?: number; // Percentage from ML model
}

interface ScanHistoryContextType {
  scanHistory: ScanResult[];
  addScanResult: (result: Omit<ScanResult, 'id' | 'scanDate'>) => void;
  clearHistory: () => void;
  refreshHistory: () => Promise<void>;
  isLoading: boolean;
}

const ScanHistoryContext = createContext<ScanHistoryContextType | undefined>(undefined);

export const ScanHistoryProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user } = useAuth();
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load scan history when user changes
  useEffect(() => {
    if (user) {
      refreshHistory();
    } else {
      setScanHistory([]);
    }
  }, [user]);

  const refreshHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const history = await apiScanner.getScanHistory();
      
      // Parse dates correctly
      const formattedHistory = history.map(item => ({
        ...item,
        scanDate: new Date(item.scanDate)
      }));
      
      setScanHistory(formattedHistory);
    } catch (error) {
      console.error('Failed to load scan history:', error);
      toast({
        title: "Failed to load scan history",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addScanResult = (result: Omit<ScanResult, 'id' | 'scanDate'>) => {
    const newScan: ScanResult = {
      ...result,
      id: `scan_${Math.random().toString(36).substring(2, 9)}`,
      scanDate: new Date(),
    };
    
    setScanHistory(prev => [newScan, ...prev]);
  };

  const clearHistory = async () => {
    // In a real app, you would call an API endpoint to clear the history
    // For now, we'll just clear the local state
    setScanHistory([]);
    toast({
      title: "History cleared",
      description: "Your scan history has been cleared",
    });
  };

  return (
    <ScanHistoryContext.Provider value={{ 
      scanHistory, 
      addScanResult, 
      clearHistory, 
      refreshHistory,
      isLoading 
    }}>
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
