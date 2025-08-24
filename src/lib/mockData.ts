// lib/mockData.ts

import { DeviceData, HomeStats, Room, SystemSettings } from './types';

export const mockDeviceData: DeviceData = {
  lighting: [
    {
      id: 1,
      name: 'Хол - Главно осветление',
      status: true,
      brightness: 75,
      room: 'Хол',
      type: 'chandelier',
      color: { temperature: 3000 }
    },
    {
      id: 2,
      name: 'Спалня - Нощна лампа',
      status: false,
      brightness: 30,
      room: 'Спалня',
      type: 'bulb',
      color: { temperature: 2700 }
    },
    {
      id: 3,
      name: 'Кухня - LED лента',
      status: true,
      brightness: 90,
      room: 'Кухня',
      type: 'strip',
      color: { temperature: 4000 }
    },
    {
      id: 4,
      name: 'Баня - Огледало',
      status: true,
      brightness: 60,
      room: 'Баня',
      type: 'spot',
      color: { temperature: 5000 }
    },
    {
      id: 5,
      name: 'Коридор - Автоматично',
      status: false,
      brightness: 40,
      room: 'Коридор',
      type: 'bulb',
      color: { temperature: 3500 }
    }
  ],

  climate: [
    {
      id: 6,
      name: 'Термостат - Хол',
      temperature: 22.5,
      targetTemp: 23,
      humidity: 45,
      room: 'Хол',
      type: 'thermostat',
      mode: 'heat',
      fanSpeed: 2
    },
    {
      id: 7,
      name: 'Климатик - Спалня',
      temperature: 20.2,
      targetTemp: 21,
      humidity: 42,
      room: 'Спалня',
      type: 'ac',
      mode: 'heat',
      fanSpeed: 1
    },
    {
      id: 8,
      name: 'Климатик - Офис',
      temperature: 24.1,
      targetTemp: 22,
      humidity: 38,
      room: 'Офис',
      type: 'ac',
      mode: 'cool',
      fanSpeed: 3
    }
  ],

  security: [
    {
      id: 9,
      name: 'Входна врата',
      status: 'заключена',
      lastActivity: '14:30',
      room: 'Вход',
      type: 'door_sensor',
      batteryLevel: 85
    },
    {
      id: 10,
      name: 'Камера - Хол',
      status: 'активна',
      recording: true,
      room: 'Хол',
      type: 'camera'
    },
    {
      id: 11,
      name: 'Датчик движение - Коридор',
      status: 'нормално',
      lastTrigger: '08:15',
      room: 'Коридор',
      type: 'motion_sensor',
      batteryLevel: 92
    },
    {
      id: 12,
      name: 'Датчик дим - Кухня',
      status: 'нормално',
      room: 'Кухня',
      type: 'smoke_detector',
      batteryLevel: 78
    },
    {
      id: 13,
      name: 'Прозорец - Спалня',
      status: 'заключена',
      lastActivity: '22:45',
      room: 'Спалня',
      type: 'window_sensor',
      batteryLevel: 88
    }
  ],

  energy: [
    {
      id: 14,
      name: 'Общо потребление',
      current: 2.4,
      today: 18.7,
      unit: 'kWh',
      type: 'consumption'
    },
    {
      id: 15,
      name: 'Соларни панели',
      current: 1.2,
      today: 12.3,
      unit: 'kWh',
      type: 'solar',
      efficiency: 87
    },
    {
      id: 16,
      name: 'Батерия',
      current: 0.8,
      today: 6.2,
      unit: 'kWh',
      type: 'battery',
      efficiency: 94
    },
    {
      id: 17,
      name: 'Климатизация',
      current: 1.1,
      today: 8.4,
      unit: 'kWh',
      type: 'consumption'
    }
  ]
};

export const mockRooms: Room[] = [
  {
    id: 'living-room',
    name: 'Хол',
    type: 'living_room',
    devices: {
      lighting: [1],
      climate: [6],
      security: [10]
    }
  },
  {
    id: 'bedroom',
    name: 'Спалня',
    type: 'bedroom',
    devices: {
      lighting: [2],
      climate: [7],
      security: [13]
    }
  },
  {
    id: 'kitchen',
    name: 'Кухня',
    type: 'kitchen',
    devices: {
      lighting: [3],
      climate: [],
      security: [12]
    }
  },
  {
    id: 'bathroom',
    name: 'Баня',
    type: 'bathroom',
    devices: {
      lighting: [4],
      climate: [],
      security: []
    }
  },
  {
    id: 'hallway',
    name: 'Коридор',
    type: 'hallway',
    devices: {
      lighting: [5],
      climate: [],
      security: [11]
    }
  },
  {
    id: 'office',
    name: 'Офис',
    type: 'office',
    devices: {
      lighting: [],
      climate: [8],
      security: []
    }
  }
];

export const mockHomeStats: HomeStats = {
  totalDevices: 17,
  activeDevices: 12,
  averageTemperature: 22.3,
  totalEnergyToday: 18.7,
  securityStatus: 'secure',
  lastUpdate: new Date()
};

// Utility functions for working with mock data
export const getMockDevicesByRoom = (roomId: string) => {
  const room = mockRooms.find(r => r.id === roomId);
  if (!room) return null;

  return {
    lighting: mockDeviceData.lighting.filter(d => room.devices.lighting.includes(d.id)),
    climate: mockDeviceData.climate.filter(d => room.devices.climate.includes(d.id)),
    security: mockDeviceData.security.filter(d => room.devices.security.includes(d.id)),
    energy: mockDeviceData.energy // Energy devices are usually global
  };
};

export const getMockDeviceById = (deviceId: number, type: keyof DeviceData) => {
  return mockDeviceData[type].find(device => device.id === deviceId);
};

export const updateMockDevice = (deviceId: number, type: keyof DeviceData, updates: any) => {
  const deviceIndex = mockDeviceData[type].findIndex((device: any) => device.id === deviceId);
  if (deviceIndex !== -1) {
    (mockDeviceData[type] as any[])[deviceIndex] = {
      ...(mockDeviceData[type] as any[])[deviceIndex],
      ...updates
    };
  }
};

// Mock settings data
export const mockSystemSettings: SystemSettings = {
  general: {
    homeTitle: "Умният дом на семейство Василеви",
    location: {
      city: "София",
      timezone: "Europe/Sofia",
      coordinates: { lat: 42.6977, lng: 23.3219 }
    },
    units: {
      temperature: "celsius",
      energy: "kWh",
      currency: "BGN"
    },
    language: "bg",
    theme: "auto",
    dateFormat: "dd/mm/yyyy",
    timeFormat: "24h"
  },
  security: {
    twoFactorAuth: true,
    sessionTimeout: 30,
    allowedDevices: ["iPhone", "MacBook Pro", "iPad"],
    loginNotifications: true,
    securityCameras: {
      recordingQuality: "high",
      storageRetention: 30,
      motionDetection: true,
      nightVision: true
    },
    accessControl: {
      guestAccess: false,
      adminApproval: true,
      deviceControl: "basic"
    }
  },
  notifications: {
    push: true,
    email: true,
    sms: false,
    categories: {
      security: true,
      energy: true,
      maintenance: true,
      weather: false,
      automation: true
    },
    schedule: {
      enabled: true,
      startTime: "08:00",
      endTime: "22:00",
      weekends: false
    },
    emergencyOverride: true
  },
  network: {
    wifi: {
      ssid: "SmartHome_5G",
      password: "********",
      hidden: false,
      guestNetwork: true
    },
    hubConnection: {
      status: "connected",
      ipAddress: "192.168.1.100",
      lastSync: "2024-01-20T10:30:00Z"
    },
    remoteAccess: true,
    vpnEnabled: false,
    portForwarding: [
      { service: "Home Assistant", port: 8123, enabled: true },
      { service: "Node-RED", port: 1880, enabled: false }
    ]
  },
  automation: {
    enabled: true,
    learningMode: false,
    schedules: [
      {
        id: "morning-routine",
        name: "Сутрешна рутина",
        enabled: true,
        triggers: ["time:07:00", "presence:home"],
        actions: ["lights:on:living", "climate:22", "coffee:brew"]
      },
      {
        id: "evening-routine",
        name: "Вечерна рутина",
        enabled: true,
        triggers: ["time:21:00"],
        actions: ["lights:dim:50", "climate:20", "security:arm"]
      }
    ],
    scenes: [
      {
        id: "movie-night",
        name: "Филмова вечер",
        devices: [1, 2, 3],
        settings: { lights: { brightness: 20 }, temperature: 21 }
      }
    ],
    sensors: {
      occupancyDetection: true,
      adaptiveLighting: true,
      climateLearning: false
    }
  },
  energy: {
    solar: {
      enabled: true,
      capacity: 5.5,
      batteryStorage: 13.5,
      gridTieIn: true
    },
    monitoring: {
      realTime: true,
      historicalData: true,
      costTracking: true
    },
    optimization: {
      peakShaving: true,
      loadShifting: false,
      demandResponse: false
    },
    billing: {
      provider: "ЧЕЗ България",
      tariff: "time-of-use",
      rates: {
        peak: 0.25,
        offPeak: 0.15,
        weekendRate: 0.18
      }
    }
  },
  backup: {
    autoBackup: true,
    frequency: "daily",
    location: "cloud",
    retention: 30,
    encryption: true,
    lastBackup: "2024-01-20T02:00:00Z",
    nextBackup: "2024-01-21T02:00:00Z"
  }
};

// Settings update function
export const updateMockSettings = (category: keyof SystemSettings, updates: any): void => {
  (mockSystemSettings[category] as any) = {
    ...mockSystemSettings[category],
    ...updates
  };
};