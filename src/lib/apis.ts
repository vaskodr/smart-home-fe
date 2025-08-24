// lib/api.ts

import axios from 'axios';
import { DeviceData, HomeStats, ApiResponse, DeviceUpdatePayload, SystemSettings } from './types';
import { mockDeviceData, mockHomeStats, updateMockDevice, mockSystemSettings, updateMockSettings } from './mockData';

// Axios instance configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Service class
export class ApiService {
  private static useMockData = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_USE_REAL_API;

  // Device management
  static async getDevices(): Promise<DeviceData> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockDeviceData;
    }

    try {
      const response = await apiClient.get<ApiResponse<DeviceData>>('/devices');
      return response.data.data;
    } catch (error) {
      console.warn('API unavailable, using mock data');
      return mockDeviceData;
    }
  }

  static async updateDevice(deviceType: keyof DeviceData, deviceId: number, updates: any): Promise<void> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      updateMockDevice(deviceId, deviceType, updates);
      return;
    }

    try {
      await apiClient.patch(`/devices/${deviceType}/${deviceId}`, updates);
    } catch (error) {
      // Fallback to mock data update
      updateMockDevice(deviceId, deviceType, updates);
      throw error;
    }
  }

  static async toggleDevice(deviceType: keyof DeviceData, deviceId: number): Promise<void> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 150));
      const device = mockDeviceData[deviceType].find((d: any) => d.id === deviceId);
      if (device && 'status' in device) {
        updateMockDevice(deviceId, deviceType, { status: !device.status });
      }
      return;
    }

    try {
      await apiClient.post(`/devices/${deviceType}/${deviceId}/toggle`);
    } catch (error) {
      // Fallback to mock data
      const device = mockDeviceData[deviceType].find((d: any) => d.id === deviceId);
      if (device && 'status' in device) {
        updateMockDevice(deviceId, deviceType, { status: !device.status });
      }
      throw error;
    }
  }

  // Home statistics
  static async getHomeStats(): Promise<HomeStats> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        ...mockHomeStats,
        lastUpdate: new Date()
      };
    }

    try {
      const response = await apiClient.get<ApiResponse<HomeStats>>('/stats');
      return response.data.data;
    } catch (error) {
      console.warn('Stats API unavailable, using mock data');
      return mockHomeStats;
    }
  }

  // Room-based queries
  static async getDevicesByRoom(roomId: string): Promise<DeviceData | null> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 250));
      // This would be implemented based on room filtering
      return mockDeviceData;
    }

    try {
      const response = await apiClient.get<ApiResponse<DeviceData>>(`/devices/room/${roomId}`);
      return response.data.data;
    } catch (error) {
      console.warn('Room devices API unavailable');
      return null;
    }
  }

  // Bulk operations
  static async bulkUpdateDevices(updates: DeviceUpdatePayload[]): Promise<void> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      updates.forEach(update => {
        // Determine device type by checking which array contains the device
        let deviceType: keyof DeviceData | null = null;
        for (const [type, devices] of Object.entries(mockDeviceData)) {
          if (devices.some((d: any) => d.id === update.deviceId)) {
            deviceType = type as keyof DeviceData;
            break;
          }
        }
        if (deviceType) {
          updateMockDevice(update.deviceId, deviceType, update.updates);
        }
      });
      return;
    }

    try {
      await apiClient.patch('/devices/bulk', { updates });
    } catch (error) {
      // Fallback to individual mock updates
      updates.forEach(update => {
        let deviceType: keyof DeviceData | null = null;
        for (const [type, devices] of Object.entries(mockDeviceData)) {
          if (devices.some((d: any) => d.id === update.deviceId)) {
            deviceType = type as keyof DeviceData;
            break;
          }
        }
        if (deviceType) {
          updateMockDevice(update.deviceId, deviceType, update.updates);
        }
      });
      throw error;
    }
  }

  // Scene/automation management
  static async activateScene(sceneId: string): Promise<void> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`Mock: Activated scene ${sceneId}`);
      return;
    }

    try {
      await apiClient.post(`/scenes/${sceneId}/activate`);
    } catch (error) {
      console.warn(`Scene activation failed: ${sceneId}`);
      throw error;
    }
  }

  // System health check
  static async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'down'; message?: string }> {
    if (this.useMockData) {
      return { status: 'healthy', message: 'Mock mode active' };
    }

    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      return { status: 'down', message: 'API unreachable' };
    }
  }

  // Settings management
  static async getSettings(): Promise<SystemSettings> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockSystemSettings;
    }

    try {
      const response = await apiClient.get<ApiResponse<SystemSettings>>('/settings');
      return response.data.data;
    } catch (error) {
      console.warn('Settings API unavailable, using mock data');
      return mockSystemSettings;
    }
  }

  static async updateSettings(category: keyof SystemSettings, updates: any): Promise<void> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      updateMockSettings(category, updates);
      return;
    }

    try {
      await apiClient.patch(`/settings/${category}`, updates);
    } catch (error) {
      // Fallback to mock data update
      updateMockSettings(category, updates);
      throw error;
    }
  }

  static async resetSettings(category?: keyof SystemSettings): Promise<void> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 250));
      if (category) {
        // Reset specific category to defaults (would need default values)
        console.log(`Mock: Reset ${category} settings to defaults`);
      } else {
        // Reset all settings
        console.log('Mock: Reset all settings to defaults');
      }
      return;
    }

    try {
      const endpoint = category ? `/settings/${category}/reset` : '/settings/reset';
      await apiClient.post(endpoint);
    } catch (error) {
      console.warn(`Settings reset failed: ${category || 'all'}`);
      throw error;
    }
  }

  static async exportSettings(): Promise<Blob> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const data = JSON.stringify(mockSystemSettings, null, 2);
      return new Blob([data], { type: 'application/json' });
    }

    try {
      const response = await apiClient.get('/settings/export', { responseType: 'blob' });
      return response.data;
    } catch (error) {
      // Fallback to mock export
      const data = JSON.stringify(mockSystemSettings, null, 2);
      return new Blob([data], { type: 'application/json' });
    }
  }

  static async importSettings(file: File): Promise<void> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Mock: Settings imported from file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('settings', file);
      await apiClient.post('/settings/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (error) {
      console.warn('Settings import failed');
      throw error;
    }
  }
}

// Export individual methods for easier importing
export const {
  getDevices,
  updateDevice,
  toggleDevice,
  getHomeStats,
  getDevicesByRoom,
  bulkUpdateDevices,
  activateScene,
  healthCheck,
  getSettings,
  updateSettings,
  resetSettings,
  exportSettings,
  importSettings
} = ApiService;