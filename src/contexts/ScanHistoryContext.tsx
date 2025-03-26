
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  addScanResult: (result: Omit<ScanResult, 'id' | 'scanDate'>) => Promise<void>;
  clearHistory: () => Promise<void>;
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
      
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .order('scanned_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Map Supabase data to ScanResult format
      const formattedHistory: ScanResult[] = data.map(item => ({
        id: item.id,
        fileName: item.file_name,
        fileSize: item.result?.fileSize || 'Unknown',
        scanDate: new Date(item.scanned_at),
        threatLevel: getThreatLevel(item.threat_percentage),
        mlPrediction: item.threat_percentage,
        filePath: item.result?.filePath
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

  const getThreatLevel = (percentage?: number): 'Safe' | 'Suspicious' | 'Critical' => {
    if (percentage === undefined) return 'Safe';
    if (percentage < 30) return 'Safe';
    if (percentage < 70) return 'Suspicious';
    return 'Critical';
  };

  const addScanResult = async (result: Omit<ScanResult, 'id' | 'scanDate'>) => {
    if (!user) return;
    
    try {
      // Prepare data for Supabase
      const { data, error } = await supabase
        .from('scan_history')
        .insert({
          user_id: user.id,
          file_name: result.fileName,
          threat_percentage: result.mlPrediction,
          result: {
            fileSize: result.fileSize,
            filePath: result.filePath,
            threatLevel: result.threatLevel
          }
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Add to local state
      const newScan: ScanResult = {
        id: data.id,
        fileName: data.file_name,
        fileSize: result.fileSize,
        scanDate: new Date(data.scanned_at),
        threatLevel: result.threatLevel,
        filePath: result.filePath,
        mlPrediction: result.mlPrediction
      };
      
      setScanHistory(prev => [newScan, ...prev]);
    } catch (error) {
      console.error('Failed to add scan result:', error);
      toast({
        title: "Failed to save scan result",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };

  const clearHistory = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setScanHistory([]);
      toast({
        title: "History cleared",
        description: "Your scan history has been cleared",
      });
    } catch (error) {
      console.error('Failed to clear history:', error);
      toast({
        title: "Failed to clear history",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
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
