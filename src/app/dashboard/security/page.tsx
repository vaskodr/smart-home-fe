// src/app/dashboard/security/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Shield, 
  Camera,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Bell,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  Home,
  MapPin
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SecurityCard } from '@/components/security/SecurityCard';
import { CameraFeed } from '@/components/security/CameraFeed';
import { SecurityStats } from '@/components/security/SecurityStats';
import { ActivityLog } from '@/components/security/ActivityLog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Mock data
const fetchSecurityData = async () => {
  await new Promise(resolve => setTimeout(resolve, 900));
  return {
    devices: [
      {
        id: 1,
        name: 'Главна входна врата',
        type: 'door_lock' as const,
        room: 'entrance',
        roomName: 'Вход',
        status: 'locked' as const,
        batteryLevel: 85,
        lastActivity: '2024-08-24 14:30',
        isOnline: true,
        hasAlert: false
      },
      {
        id: 2,
        name: 'Задна врата',
        type: 'door_lock' as const,
        room: 'backyard',
        roomName: 'Двор',
        status: 'unlocked' as const,
        batteryLevel: 67,
        lastActivity: '2024-08-24 12:15',
        isOnline: true,
        hasAlert: false
      },
      {
        id: 3,
        name: 'Прозорец - Хол',
        type: 'window_sensor' as const,
        room: 'living',
        roomName: 'Хол',
        status: 'closed' as const,
        batteryLevel: 92,
        lastActivity: '2024-08-24 08:20',
        isOnline: true,
        hasAlert: false
      },
      {
        id: 4,
        name: 'Motion сензор - Коридор',
        type: 'motion_sensor' as const,
        room: 'hallway',
        roomName: 'Коридор',
        status: 'active' as const,
        batteryLevel: 78,
        lastActivity: '2024-08-24 15:45',
        isOnline: true,
        hasAlert: true
      },
      {
        id: 5,
        name: 'Датчик дим - Кухня',
        type: 'smoke_detector' as const,
        room: 'kitchen',
        roomName: 'Кухня',
        status: 'normal' as const,
        batteryLevel: 88,
        lastActivity: '2024-08-24 09:10',
        isOnline: true,
        hasAlert: false
      },
      {
        id: 6,
        name: 'Glass break - Спалня',
        type: 'glass_sensor' as const,
        room: 'bedroom',
        roomName: 'Спалня',
        status: 'normal' as const,
        batteryLevel: 71,
        lastActivity: '2024-08-24 07:30',
        isOnline: false,
        hasAlert: true
      }
    ],
    cameras: [
      {
        id: 101,
        name: 'Камера - Главен вход',
        room: 'entrance',
        roomName: 'Главен вход',
        status: 'recording' as const,
        isOnline: true,
        resolution: '4K',
        nightVision: true,
        motionDetection: true,
        hasAlert: false,
        lastMotion: '2024-08-24 14:32'
      },
      {
        id: 102,
        name: 'Камера - Двор',
        room: 'backyard',
        roomName: 'Двор',
        status: 'standby' as const,
        isOnline: true,
        resolution: '1080p',
        nightVision: true,
        motionDetection: true,
        hasAlert: false,
        lastMotion: '2024-08-24 12:20'
      },
      {
        id: 103,
        name: 'Камера - Хол',
        room: 'living',
        roomName: 'Хол',
        status: 'privacy' as const,
        isOnline: true,
        resolution: '1080p',
        nightVision: false,
        motionDetection: false,
        hasAlert: false,
        lastMotion: '2024-08-24 10:15'
      },
      {
        id: 104,
        name: 'Doorbell камера',
        room: 'entrance',
        roomName: 'Входна врата',
        status: 'recording' as const,
        isOnline: true,
        resolution: '2K',
        nightVision: true,
        motionDetection: true,
        hasAlert: true,
        lastMotion: '2024-08-24 15:50'
      }
    ],
    recentActivity: [
      { id: 1, time: '15:50', action: 'Doorbell камера засече движение', type: 'motion', severity: 'warning' },
      { id: 2, time: '15:45', action: 'Motion сензор активиран в коридора', type: 'motion', severity: 'info' },
      { id: 3, time: '14:32', action: 'Камера - Главен вход започна записване', type: 'recording', severity: 'info' },
      { id: 4, time: '14:30', action: 'Главна входна врата заключена', type: 'lock', severity: 'success' },
      { id: 5, time: '12:20', action: 'Движение засечено в двора', type: 'motion', severity: 'info' },
      { id: 6, time: '12:15', action: 'Задна врата отключена', type: 'unlock', severity: 'warning' },
      { id: 7, time: '09:10', action: 'Датчик дим - проверка изпълнена', type: 'test', severity: 'success' }
    ],
    stats: {
      totalDevices: 10,
      onlineDevices: 9,
      activeAlerts: 3,
      recordingCameras: 2,
      averageBattery: 80,
      systemStatus: 'armed' as const
    },
    systemModes: [
      { id: 'disarmed', name: 'Изключен', active: false, description: 'Всички сензори деактивирани' },
      { id: 'home', name: 'В дома', active: false, description: 'Външна защита активна' },
      { id: 'away', name: 'Извън дома', active: false, description: 'Пълна защита активна' },
      { id: 'night', name: 'Нощен режим', active: true, description: 'Вътрешна защита активна' }
    ]
  };
};

export default function SecurityPage() {
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  const [systemMode, setSystemMode] = useState('night');
  const [showCameraFeeds, setShowCameraFeeds] = useState(true);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['security'],
    queryFn: fetchSecurityData,
    refetchInterval: 5000, // More frequent updates for security
  });

  // Device control mutation
  const deviceMutation = useMutation({
    mutationFn: async ({ deviceId, action }: { deviceId: number; action: string }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { deviceId, action };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['security'] });
    },
  });

  // System mode mutation
  const modeMutation = useMutation({
    mutationFn: async (mode: string) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mode;
    },
    onSuccess: (mode) => {
      setSystemMode(mode);
      queryClient.invalidateQueries({ queryKey: ['security'] });
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage 
          title="Грешка при зареждане"
          message="Не можем да заредим данните за сигурността."
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  const { devices, cameras, recentActivity, stats, systemModes } = data!;

  const toggleDevice = (deviceId: number, action: string) => {
    deviceMutation.mutate({ deviceId, action });
  };

  const changeSystemMode = (mode: string) => {
    modeMutation.mutate(mode);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                stats.systemStatus === 'armed' ? 'bg-red-100' : 
                stats.systemStatus === 'partial' ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                <Shield className={`w-8 h-8 ${
                  stats.systemStatus === 'armed' ? 'text-red-600' :
                  stats.systemStatus === 'partial' ? 'text-yellow-600' : 'text-green-600'
                }`} />
              </div>
              Система за сигурност
            </h1>
            <p className="mt-2 text-gray-600">
              Мониторинг и контрол на всички сигурни системи
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-lg font-medium ${
              stats.activeAlerts > 0 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {stats.activeAlerts > 0 ? `${stats.activeAlerts} Алерта` : 'Всичко наред'}
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Stats */}
        <SecurityStats stats={stats} />

        {/* System Mode Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-xl font-semibold text-gray-900">Режим на системата</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {systemModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => changeSystemMode(mode.id)}
                  disabled={modeMutation.isPending}
                  className={`p-4 rounded-xl transition-all duration-300 text-left ${
                    mode.id === systemMode
                      ? 'bg-blue-50 border-2 border-blue-500 shadow-lg'
                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-300 hover:shadow-md'
                  } ${modeMutation.isPending ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${
                      mode.id === systemMode ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                    <h3 className="font-semibold text-gray-900">{mode.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{mode.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Device Controls */}
          <div className="lg:col-span-2 space-y-6">
            {/* Security Devices */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Сигурни устройства</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {devices.map((device) => (
                    <SecurityCard
                      key={device.id}
                      device={device}
                      onAction={(action) => toggleDevice(device.id, action)}
                      isLoading={deviceMutation.isPending}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Camera Feeds */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Камери</h3>
                  <button
                    onClick={() => setShowCameraFeeds(!showCameraFeeds)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {showCameraFeeds ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showCameraFeeds ? 'Скрий' : 'Покажи'}
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cameras.map((camera) => (
                    <CameraFeed
                      key={camera.id}
                      camera={camera}
                      showFeed={showCameraFeeds}
                      onAction={(action) => toggleDevice(camera.id, action)}
                      isLoading={deviceMutation.isPending}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div>
            <ActivityLog activities={recentActivity} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}