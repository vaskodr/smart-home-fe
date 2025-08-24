// src/app/dashboard/lighting/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Lightbulb, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset,
  Power,
  Settings,
  Timer,
  Palette,
  Zap,
  Home,
  Plus,
  MoreHorizontal,
  Sliders
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LightCard } from '@/components/lighting/LightCard';
import { RoomSelector } from '@/components/lighting/RoomSelector';
import { SceneSelector } from '@/components/lighting/SceneSelector';
import { ColorPicker } from '@/components/lighting/ColorPicker';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Mock data
const fetchLightingData = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    rooms: [
      { id: 'all', name: 'Всички стаи', deviceCount: 18 },
      { id: 'living', name: 'Хол', deviceCount: 4 },
      { id: 'bedroom', name: 'Спалня', deviceCount: 3 },
      { id: 'kitchen', name: 'Кухня', deviceCount: 5 },
      { id: 'bathroom', name: 'Баня', deviceCount: 2 },
      { id: 'office', name: 'Офис', deviceCount: 3 },
      { id: 'hallway', name: 'Коридор', deviceCount: 1 }
    ],
    lights: [
      {
        id: 1,
        name: 'Главно осветление',
        room: 'living',
        roomName: 'Хол',
        status: true,
        brightness: 85,
        colorTemperature: 3000,
        color: '#FFE4B5',
        type: 'dimmable' as const,
        powerUsage: 12,
        schedule: { enabled: true, onTime: '07:00', offTime: '23:00' }
      },
      {
        id: 2,
        name: 'Ambient светлина',
        room: 'living',
        roomName: 'Хол',
        status: true,
        brightness: 45,
        colorTemperature: 2700,
        color: '#FFA07A',
        type: 'rgb' as const,
        powerUsage: 8,
        schedule: { enabled: false, onTime: '', offTime: '' }
      },
      {
        id: 3,
        name: 'Таванска лампа',
        room: 'living',
        roomName: 'Хол',
        status: false,
        brightness: 0,
        colorTemperature: 4000,
        color: '#FFFFFF',
        type: 'basic' as const,
        powerUsage: 0,
        schedule: { enabled: false, onTime: '', offTime: '' }
      },
      {
        id: 4,
        name: 'Reading лампа',
        room: 'living',
        roomName: 'Хол',
        status: true,
        brightness: 95,
        colorTemperature: 5000,
        color: '#F0F8FF',
        type: 'dimmable' as const,
        powerUsage: 15,
        schedule: { enabled: true, onTime: '19:00', offTime: '22:30' }
      },
      {
        id: 5,
        name: 'Нощна лампа',
        room: 'bedroom',
        roomName: 'Спалня',
        status: false,
        brightness: 20,
        colorTemperature: 2200,
        color: '#FFB6C1',
        type: 'rgb' as const,
        powerUsage: 0,
        schedule: { enabled: true, onTime: '21:00', offTime: '07:00' }
      },
      {
        id: 6,
        name: 'Главно - Спалня',
        room: 'bedroom',
        roomName: 'Спалня',
        status: true,
        brightness: 70,
        colorTemperature: 3500,
        color: '#F5F5DC',
        type: 'dimmable' as const,
        powerUsage: 18,
        schedule: { enabled: false, onTime: '', offTime: '' }
      },
      {
        id: 7,
        name: 'LED лента',
        room: 'kitchen',
        roomName: 'Кухня',
        status: true,
        brightness: 90,
        colorTemperature: 4000,
        color: '#E6E6FA',
        type: 'rgb' as const,
        powerUsage: 24,
        schedule: { enabled: true, onTime: '06:30', offTime: '22:00' }
      },
      {
        id: 8,
        name: 'Pendant лампи',
        room: 'kitchen',
        roomName: 'Кухня',
        status: true,
        brightness: 75,
        colorTemperature: 3800,
        color: '#FFFAF0',
        type: 'dimmable' as const,
        powerUsage: 36,
        schedule: { enabled: false, onTime: '', offTime: '' }
      }
    ],
    scenes: [
      { id: 'morning', name: 'Сутрешно събуждане', icon: Sunrise, active: false, lightsCount: 8 },
      { id: 'work', name: 'Работен ден', icon: Sun, active: true, lightsCount: 12 },
      { id: 'evening', name: 'Вечерна почивка', icon: Sunset, active: false, lightsCount: 6 },
      { id: 'night', name: 'Лека нощ', icon: Moon, active: false, lightsCount: 2 }
    ],
    stats: {
      totalLights: 18,
      activeLights: 6,
      totalPowerUsage: 113,
      averageBrightness: 68,
      scheduledLights: 4
    }
  };
};

export default function LightingPage() {
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedLight, setSelectedLight] = useState<number | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['lighting'],
    queryFn: fetchLightingData,
    refetchInterval: 10000,
  });

  // Mutation for light control
  const lightMutation = useMutation({
    mutationFn: async ({ lightId, updates }: { lightId: number; updates: any }) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { lightId, updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lighting'] });
    },
  });

  // Scene activation mutation
  const sceneMutation = useMutation({
    mutationFn: async (sceneId: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return sceneId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lighting'] });
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
          message="Не можем да заредим данните за осветлението."
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  const { rooms, lights, scenes, stats } = data!;
  
  const filteredLights = selectedRoom === 'all' 
    ? lights 
    : lights.filter(light => light.room === selectedRoom);

  const toggleLight = (lightId: number, status: boolean) => {
    lightMutation.mutate({
      lightId,
      updates: { status: !status, brightness: !status ? 75 : 0 }
    });
  };

  const updateLightBrightness = (lightId: number, brightness: number) => {
    lightMutation.mutate({
      lightId,
      updates: { brightness, status: brightness > 0 }
    });
  };

  const updateLightColor = (lightId: number, color: string, temperature: number) => {
    lightMutation.mutate({
      lightId,
      updates: { color, colorTemperature: temperature }
    });
  };

  const activateScene = (sceneId: string) => {
    sceneMutation.mutate(sceneId);
  };

  const toggleAllLights = (roomId: string) => {
    const roomLights = roomId === 'all' ? lights : lights.filter(l => l.room === roomId);
    const anyOn = roomLights.some(light => light.status);
    
    roomLights.forEach(light => {
      lightMutation.mutate({
        lightId: light.id,
        updates: { status: !anyOn, brightness: !anyOn ? 75 : 0 }
      });
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-xl">
                <Lightbulb className="w-8 h-8 text-yellow-600" />
              </div>
              Управление на осветлението
            </h1>
            <p className="mt-2 text-gray-600">
              Контролирайте всички лампи и създавайте перфектната атмосфера
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toggleAllLights(selectedRoom)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Power className="w-4 h-4" />
              {filteredLights.some(l => l.status) ? 'Изключи всички' : 'Включи всички'}
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-200 rounded-lg">
                <Lightbulb className="w-5 h-5 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm text-yellow-700">Активни лампи</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.activeLights}/{stats.totalLights}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-200 rounded-lg">
                <Zap className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-green-700">Потребление</p>
                <p className="text-2xl font-bold text-green-900">{stats.totalPowerUsage}W</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <Sliders className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-blue-700">Средна яркост</p>
                <p className="text-2xl font-bold text-blue-900">{stats.averageBrightness}%</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-200 rounded-lg">
                <Timer className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="text-sm text-purple-700">По график</p>
                <p className="text-2xl font-bold text-purple-900">{stats.scheduledLights}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scene Selector */}
        <SceneSelector 
          scenes={scenes} 
          onSceneSelect={activateScene}
          isLoading={sceneMutation.isPending}
        />

        {/* Room Selector */}
        <RoomSelector 
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomSelect={setSelectedRoom}
          lights={lights}
        />

        {/* Lights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLights.map((light) => (
            <LightCard
              key={light.id}
              light={light}
              onToggle={() => toggleLight(light.id, light.status)}
              onBrightnessChange={(brightness) => updateLightBrightness(light.id, brightness)}
              onColorChange={(color, temperature) => updateLightColor(light.id, color, temperature)}
              onSettingsClick={() => setSelectedLight(light.id)}
              isLoading={lightMutation.isPending}
            />
          ))}
          
          {/* Add new light card */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-gray-400 hover:bg-gray-100 transition-colors cursor-pointer min-h-64">
            <div className="p-3 bg-gray-200 rounded-full mb-3">
              <Plus className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Добави лампа</h3>
            <p className="text-sm text-gray-500">Свържи ново осветително устройство</p>
          </div>
        </div>

        {/* Color Picker Modal */}
        {showColorPicker && selectedLight && (
          <ColorPicker
            light={lights.find(l => l.id === selectedLight)!}
            onClose={() => setShowColorPicker(false)}
            onColorChange={(color, temperature) => updateLightColor(selectedLight, color, temperature)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}