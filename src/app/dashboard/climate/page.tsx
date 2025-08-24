// src/app/dashboard/climate/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Thermometer, 
  Wind,
  Droplets,
  Snowflake,
  Flame,
  Settings,
  Power,
  Timer,
  TrendingUp,
  Plus,
  Activity
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClimateCard } from '@/components/climate/ClimateCard';
import { TemperatureChart } from '@/components/climate/TemperatureChart';
import { ClimateStats } from '@/components/climate/ClimateStats';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Mock data
const fetchClimateData = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    devices: [
      {
        id: 1,
        name: 'Термостат - Хол',
        room: 'living',
        roomName: 'Хол',
        type: 'thermostat' as const,
        currentTemp: 22.5,
        targetTemp: 23,
        humidity: 45,
        status: 'heating' as const,
        mode: 'auto' as const,
        fanSpeed: 2,
        powerUsage: 850,
        schedule: { enabled: true, schedules: ['7:00-22:00'] }
      },
      {
        id: 2,
        name: 'Климатик - Спалня',
        room: 'bedroom',
        roomName: 'Спалня', 
        type: 'ac' as const,
        currentTemp: 20.2,
        targetTemp: 21,
        humidity: 42,
        status: 'heating' as const,
        mode: 'heat' as const,
        fanSpeed: 1,
        powerUsage: 1200,
        schedule: { enabled: true, schedules: ['21:00-8:00'] }
      },
      {
        id: 3,
        name: 'Климатик - Офис',
        room: 'office',
        roomName: 'Офис',
        type: 'ac' as const,
        currentTemp: 24.1,
        targetTemp: 22,
        humidity: 38,
        status: 'cooling' as const,
        mode: 'cool' as const,
        fanSpeed: 3,
        powerUsage: 1450,
        schedule: { enabled: false, schedules: [] }
      },
      {
        id: 4,
        name: 'Овлажнител - Детска',
        room: 'kids',
        roomName: 'Детска стая',
        type: 'humidifier' as const,
        currentTemp: 21.8,
        targetTemp: 22,
        humidity: 65,
        status: 'idle' as const,
        mode: 'humidity' as const,
        fanSpeed: 1,
        powerUsage: 45,
        schedule: { enabled: true, schedules: ['20:00-7:00'] }
      },
      {
        id: 5,
        name: 'Вентилатор - Кухня',
        room: 'kitchen',
        roomName: 'Кухня',
        type: 'fan' as const,
        currentTemp: 23.5,
        targetTemp: 23,
        humidity: 40,
        status: 'idle' as const,
        mode: 'fan' as const,
        fanSpeed: 0,
        powerUsage: 0,
        schedule: { enabled: false, schedules: [] }
      }
    ],
    temperatureHistory: Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, '0')}:00`,
      living: 21 + Math.sin((i - 6) / 24 * 2 * Math.PI) * 2 + Math.random() * 0.5,
      bedroom: 20 + Math.sin((i - 6) / 24 * 2 * Math.PI) * 1.5 + Math.random() * 0.3,
      office: 22 + Math.sin((i - 8) / 24 * 2 * Math.PI) * 3 + Math.random() * 0.4,
      outdoor: 15 + Math.sin((i - 14) / 24 * 2 * Math.PI) * 8 + Math.random() * 1,
    })),
    stats: {
      averageTemp: 22.2,
      totalPowerUsage: 3545,
      activeDevices: 3,
      totalDevices: 5,
      energyEfficiency: 87,
      averageHumidity: 46,
      optimalRooms: 3
    },
    presets: [
      { id: 'comfort', name: 'Комфорт', temp: 22, humidity: 45, active: true },
      { id: 'eco', name: 'Икономичен', temp: 20, humidity: 40, active: false },
      { id: 'sleep', name: 'За сън', temp: 19, humidity: 50, active: false },
      { id: 'away', name: 'Отсъствие', temp: 16, humidity: 35, active: false }
    ]
  };
};

export default function ClimatePage() {
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  const [selectedPreset, setSelectedPreset] = useState('comfort');
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['climate'],
    queryFn: fetchClimateData,
    refetchInterval: 15000,
  });

  // Mutation for device control
  const deviceMutation = useMutation({
    mutationFn: async ({ deviceId, updates }: { deviceId: number; updates: any }) => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { deviceId, updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['climate'] });
    },
  });

  // Preset activation mutation
  const presetMutation = useMutation({
    mutationFn: async (presetId: string) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return presetId;
    },
    onSuccess: (presetId) => {
      setSelectedPreset(presetId);
      queryClient.invalidateQueries({ queryKey: ['climate'] });
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
          message="Не можем да заредим данните за климатичната система."
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  const { devices, temperatureHistory, stats, presets } = data!;

  const updateDeviceTemp = (deviceId: number, targetTemp: number) => {
    deviceMutation.mutate({
      deviceId,
      updates: { targetTemp }
    });
  };

  const updateDeviceMode = (deviceId: number, mode: string) => {
    deviceMutation.mutate({
      deviceId,
      updates: { mode }
    });
  };

  const updateFanSpeed = (deviceId: number, fanSpeed: number) => {
    deviceMutation.mutate({
      deviceId,
      updates: { fanSpeed }
    });
  };

  const toggleDevice = (deviceId: number) => {
    const device = devices.find(d => d.id === deviceId);
    const newStatus = device?.status === 'idle' ? 'heating' : 'idle';
    deviceMutation.mutate({
      deviceId,
      updates: { status: newStatus }
    });
  };

  const activatePreset = (presetId: string) => {
    presetMutation.mutate(presetId);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Thermometer className="w-8 h-8 text-blue-600" />
              </div>
              Климатично управление
            </h1>
            <p className="mt-2 text-gray-600">
              Контролирайте температурата и влажността в целия дом
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Activity className="w-4 h-4" />
              Автоматично
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Climate Stats */}
        <ClimateStats stats={stats} />

        {/* Preset Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <h2 className="text-xl font-semibold text-gray-900">Готови настройки</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => activatePreset(preset.id)}
                  disabled={presetMutation.isPending}
                  className={`p-4 rounded-xl transition-all duration-300 ${
                    preset.id === selectedPreset
                      ? 'bg-blue-50 border-2 border-blue-500 shadow-lg scale-105'
                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-300 hover:shadow-md'
                  } ${presetMutation.isPending ? 'opacity-70' : ''}`}
                >
                  <div className="text-center">
                    <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                      preset.id === selectedPreset ? 'bg-blue-100' : 'bg-gray-200'
                    }`}>
                      <Thermometer className={`w-6 h-6 ${
                        preset.id === selectedPreset ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{preset.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{preset.temp}°C</div>
                      <div>{preset.humidity}% влажност</div>
                    </div>
                    {preset.id === selectedPreset && (
                      <div className="mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Активен
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Device Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {devices.map((device) => (
                <ClimateCard
                  key={device.id}
                  device={device}
                  onToggle={() => toggleDevice(device.id)}
                  onTempChange={(temp) => updateDeviceTemp(device.id, temp)}
                  onModeChange={(mode) => updateDeviceMode(device.id, mode)}
                  onFanSpeedChange={(speed) => updateFanSpeed(device.id, speed)}
                  onSettingsClick={() => setSelectedDevice(device.id)}
                  isLoading={deviceMutation.isPending}
                />
              ))}
              
              {/* Add new device card */}
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 hover:bg-gray-100 transition-colors cursor-pointer min-h-80">
                <div className="p-3 bg-gray-200 rounded-full mb-3">
                  <Plus className="w-6 h-6 text-gray-500" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Добави устройство</h3>
                <p className="text-sm text-gray-500">Свържи нов климатичен контролер</p>
              </div>
            </div>
          </div>

          {/* Temperature Chart */}
          <div>
            <TemperatureChart 
              data={temperatureHistory}
              title="Температура за 24 часа"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}