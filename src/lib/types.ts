// lib/types.ts

export interface LightingDevice {
    id: number;
    name: string;
    status: boolean;
    brightness: number;
    room: string;
    type?: 'bulb' | 'strip' | 'spot' | 'chandelier';
    color?: {
      temperature: number; // Kelvin
      rgb?: string;
    };
  }
  
  export interface ClimateDevice {
    id: number;
    name: string;
    temperature: number;
    targetTemp: number;
    humidity?: number;
    mode?: 'heat' | 'cool' | 'auto' | 'fan' | 'dry';
    room: string;
    type?: 'thermostat' | 'ac' | 'heater' | 'humidifier';
    fanSpeed?: number;
  }
  
  export interface SecurityDevice {
    id: number;
    name: string;
    status: 'активна' | 'неактивна' | 'заключена' | 'отключена' | 'нормално' | 'тревога';
    lastActivity?: string;
    lastTrigger?: string;
    recording?: boolean;
    room: string;
    type?: 'camera' | 'door_sensor' | 'motion_sensor' | 'window_sensor' | 'smoke_detector';
    batteryLevel?: number;
  }
  
  export interface EnergyDevice {
    id: number;
    name: string;
    current: number; // Current consumption/generation
    today: number;   // Total for today
    unit: 'kWh' | 'W';
    type?: 'consumption' | 'solar' | 'battery';
    efficiency?: number;
  }
  
  export interface DeviceData {
    lighting: LightingDevice[];
    climate: ClimateDevice[];
    security: SecurityDevice[];
    energy: EnergyDevice[];
  }
  
  export interface Room {
    id: string;
    name: string;
    type: 'living_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'hallway' | 'office' | 'other';
    devices: {
      lighting: number[];
      climate: number[];
      security: number[];
    };
  }
  
  export interface HomeStats {
    totalDevices: number;
    activeDevices: number;
    averageTemperature: number;
    totalEnergyToday: number;
    securityStatus: 'secure' | 'warning' | 'alert';
    lastUpdate: Date;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'guest';
    preferences: {
      theme: 'light' | 'dark' | 'auto';
      notifications: boolean;
      language: 'bg' | 'en';
    };
  }

  // Settings-related types
  export interface SystemSettings {
    general: GeneralSettings;
    security: SecuritySettings;
    notifications: NotificationSettings;
    network: NetworkSettings;
    automation: AutomationSettings;
    energy: EnergySettings;
    backup: BackupSettings;
  }

  export interface GeneralSettings {
    homeTitle: string;
    location: {
      city: string;
      timezone: string;
      coordinates?: { lat: number; lng: number };
    };
    units: {
      temperature: 'celsius' | 'fahrenheit';
      energy: 'kWh' | 'Wh';
      currency: 'BGN' | 'EUR' | 'USD';
    };
    language: 'bg' | 'en';
    theme: 'light' | 'dark' | 'auto';
    dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';
    timeFormat: '12h' | '24h';
  }

  export interface SecuritySettings {
    twoFactorAuth: boolean;
    sessionTimeout: number; // minutes
    allowedDevices: string[];
    loginNotifications: boolean;
    securityCameras: {
      recordingQuality: 'low' | 'medium' | 'high' | '4k';
      storageRetention: number; // days
      motionDetection: boolean;
      nightVision: boolean;
    };
    accessControl: {
      guestAccess: boolean;
      adminApproval: boolean;
      deviceControl: 'none' | 'basic' | 'full';
    };
  }

  export interface NotificationSettings {
    push: boolean;
    email: boolean;
    sms: boolean;
    categories: {
      security: boolean;
      energy: boolean;
      maintenance: boolean;
      weather: boolean;
      automation: boolean;
    };
    schedule: {
      enabled: boolean;
      startTime: string;
      endTime: string;
      weekends: boolean;
    };
    emergencyOverride: boolean;
  }

  export interface NetworkSettings {
    wifi: {
      ssid: string;
      password: string;
      hidden: boolean;
      guestNetwork: boolean;
    };
    hubConnection: {
      status: 'connected' | 'disconnected' | 'error';
      ipAddress: string;
      lastSync: string;
    };
    remoteAccess: boolean;
    vpnEnabled: boolean;
    portForwarding: Array<{
      service: string;
      port: number;
      enabled: boolean;
    }>;
  }

  export interface AutomationSettings {
    enabled: boolean;
    learningMode: boolean;
    schedules: Array<{
      id: string;
      name: string;
      enabled: boolean;
      triggers: string[];
      actions: string[];
    }>;
    scenes: Array<{
      id: string;
      name: string;
      devices: number[];
      settings: Record<string, any>;
    }>;
    sensors: {
      occupancyDetection: boolean;
      adaptiveLighting: boolean;
      climateLearning: boolean;
    };
  }

  export interface EnergySettings {
    solar: {
      enabled: boolean;
      capacity: number; // kW
      batteryStorage: number; // kWh
      gridTieIn: boolean;
    };
    monitoring: {
      realTime: boolean;
      historicalData: boolean;
      costTracking: boolean;
    };
    optimization: {
      peakShaving: boolean;
      loadShifting: boolean;
      demandResponse: boolean;
    };
    billing: {
      provider: string;
      tariff: 'fixed' | 'variable' | 'time-of-use';
      rates: {
        peak: number;
        offPeak: number;
        weekendRate?: number;
      };
    };
  }

  export interface BackupSettings {
    autoBackup: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    location: 'local' | 'cloud' | 'both';
    retention: number; // days
    encryption: boolean;
    lastBackup?: string;
    nextBackup?: string;
  }
  
  // API Response types
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    timestamp: string;
  }
  
  export interface DeviceUpdatePayload {
    deviceId: number;
    updates: Partial<LightingDevice | ClimateDevice | SecurityDevice | EnergyDevice>;
  }
  
  // WebSocket event types
  export interface WebSocketEvents {
    deviceUpdate: DeviceUpdatePayload;
    deviceStatusChange: {
      deviceId: number;
      type: 'lighting' | 'climate' | 'security' | 'energy';
      status: string | boolean | number;
    };
    systemAlert: {
      type: 'warning' | 'error' | 'info';
      message: string;
      deviceId?: number;
    };
    connectionStatus: {
      connected: boolean;
      timestamp: string;
    };
  }