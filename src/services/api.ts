
import { toast } from '@/hooks/use-toast';
import { ScanResult } from '@/contexts/ScanHistoryContext';

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

// Authentication API calls
export const apiAuth = {
  login: async (credentials: AuthCredentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
};

// Scanner API calls
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
      
      const response = await fetch(`${API_URL}/scan`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('File scan error:', error);
      throw error;
    }
  },
  
  getScanHistory: async (): Promise<ScanResult[]> => {
    try {
      const response = await fetch(`${API_URL}/scan/history`, {
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get scan history error:', error);
      throw error;
    }
  },
};
