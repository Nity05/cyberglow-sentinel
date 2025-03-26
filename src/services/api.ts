
import { toast } from '@/hooks/use-toast';
import { ScanResult } from '@/contexts/ScanHistoryContext';
import { supabase } from '@/integrations/supabase/client';

// Update with your FastAPI backend URL
const API_URL = 'http://localhost:8000';

// Type for scan request
export interface ScanRequest {
  file?: File;
  fileName?: string;
  isSystemScan?: boolean;
}

// Type for authentication
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
}

// Helper for handling response errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || `Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

// Authentication API calls (these now use Supabase)
export const apiAuth = {
  login: async (credentials: AuthCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name
          }
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
};

// Scanner API calls (still use FastAPI for scanning)
export const apiScanner = {
  scanFile: async (scanRequest: ScanRequest): Promise<ScanResult> => {
    try {
      const formData = new FormData();
      
      if (scanRequest.file) {
        formData.append('file', scanRequest.file);
      }
      
      if (scanRequest.isSystemScan) {
        formData.append('system_scan', 'true');
      }
      
      // Get the session token for authentication with FastAPI
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${API_URL}/scan`, {
        method: 'POST',
        body: formData,
        headers: {
          // Pass the auth token to FastAPI
          'Authorization': `Bearer ${session?.access_token || ''}`
        }
      });
      
      const scanData = await handleResponse(response);
      
      // Also save to supabase
      if (session?.user) {
        await supabase.from('scan_history').insert({
          user_id: session.user.id,
          file_name: scanData.fileName,
          scan_type: scanRequest.isSystemScan ? 'system' : 'file',
          threat_percentage: scanData.mlPrediction,
          result: {
            fileSize: scanData.fileSize,
            filePath: scanData.filePath
          }
        });
      }
      
      return scanData;
    } catch (error) {
      console.error('File scan error:', error);
      throw error;
    }
  },
  
  getScanHistory: async (): Promise<ScanResult[]> => {
    try {
      const { data, error } = await supabase
        .from('scan_history')
        .select('*')
        .order('scanned_at', { ascending: false });
      
      if (error) throw error;
      
      // Map data to ScanResult format
      return data.map(item => ({
        id: item.id,
        fileName: item.file_name,
        fileSize: item.result?.fileSize || 'Unknown',
        scanDate: new Date(item.scanned_at),
        threatLevel: getThreatLevel(item.threat_percentage),
        mlPrediction: item.threat_percentage,
        filePath: item.result?.filePath
      }));
    } catch (error) {
      console.error('Get scan history error:', error);
      throw error;
    }
  },
};

// Helper function to determine threat level
function getThreatLevel(percentage?: number): 'Safe' | 'Suspicious' | 'Critical' {
  if (percentage === undefined) return 'Safe';
  if (percentage < 30) return 'Safe';
  if (percentage < 70) return 'Suspicious';
  return 'Critical';
}
