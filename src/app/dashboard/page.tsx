// src/app/dashboard/page.tsx - Fancy Dashboard
'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Lightbulb, 
  Thermometer, 
  Shield, 
  Zap,
  TrendingUp,
  Activity,
  Clock,
  Settings,
  ChevronRight,
  Power,
  Wifi,
  Maximize2,
  MoreHorizontal,
  Flame,
  Droplets,
  Wind,
  Sun,
  Moon,
  Eye,
  Lock,
  Play,
  Pause
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Mock API functions
const fetchDashboardData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  return {
    stats: {
      lighting: { active: 12, total: 18, efficiency: 87 },
      temperature: 22.5,
      security: 'Сигурно',
      energy: { current: 2.4, today: 18.7, solar: 12.3, saved: 340 }
    },
    quickDevices: [
      { id: 1, name: 'Хол - Главно осветление', status: true, type: 'light', room: 'Хол', brightness: 85, color: '#FFE4B5' },
      { id: 2, name: 'Климатик - Спалня', status: true, type: 'climate', value: '21°C', room: 'Спалня', target: 22 },
      { id: 3, name: 'Входна врата', status: true, type: 'security', room: 'Вход', lastActivity: '14:30' },
      { id: 4, name: 'Кухня - LED лента', status: false, type: 'light', room: 'Кухня', brightness: 0 },
      { id: 5, name: 'Баня - Вентилатор', status: true, type: 'fan', room: 'Баня', speed: 2 },
      { id: 6, name: 'Камера - Двор', status: true, type: 'camera', room: 'Двор', recording: true }
    ],
    scenes: [
      { id: 1, name: 'Добро утро', active: false, devices: 8, color: '#FFF3CD' },
      { id: 2, name: 'Работен ден', active: true, devices: 12, color: '#D4EDDA' },
      { id: 3, name: 'Филмова вечер', active: false, devices: 6, color: '#E2E3F3' },
      { id: 4, name: 'Лека нощ', active: false, devices: 4, color: '#F8D7DA' }
    ],
    recentActivity: [
      { id: 1, action: 'Включено осветление в кухнята', time: '14:30', type: 'lighting', severity: 'info' },
      { id: 2, action: 'Климатик настроен на 21°C', time: '13:45', type: 'climate', severity: 'success' },
      { id: 3, action: 'Детектиран е движение в двора', time: '12:20', type: 'security', severity: 'warning' },
      { id: 4, action: 'Енергийно потребление: пик', time: '11:15', type: 'energy', severity: 'error' }
    ],
    weather: {
      temperature: 24,
      condition: 'sunny',
      humidity: 65,
      windSpeed: 12
    }
  };
};

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeScene, setActiveScene] = useState(2);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    refetchInterval: 30000,
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-600 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <p className="text-xl text-gray-600 animate-pulse">Инициализиране на системата...</p>
            <p className="text-sm text-gray-400 mt-2">Зареждане на устройства</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorMessage 
          title="Грешка при зареждане"
          message="Не можем да заредим данните за dashboard-а."
          onRetry={() => refetch()}
        />
      </DashboardLayout>
    );
  }

  const { stats, quickDevices, scenes, recentActivity, weather } = data!;

  const toggleDevice = async (deviceId: number) => {
    // Simulate API call with optimistic update
    const device = quickDevices.find(d => d.id === deviceId);
    if (device) {
      device.status = !device.status;
      // Add haptic feedback simulation
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const activateScene = (sceneId: number) => {
    setActiveScene(sceneId);
    // Simulate scene activation
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-8xl mx-auto space-y-8">
        {/* Hero Section with Time & Weather */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-36 -translate-x-36"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {currentTime.getHours() < 12 ? 'Добро утро' : 
                 currentTime.getHours() < 17 ? 'Добър ден' : 'Добра вечер'}
              </h1>
              <p className="text-purple-100 text-lg">
                Вашият умен дом ви очаква
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="text-2xl font-mono">
                  {currentTime.toLocaleTimeString('bg-BG', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
                <div className="h-6 w-px bg-white/30"></div>
                <div className="text-sm">
                  {currentTime.toLocaleDateString('bg-BG', { 
                    weekday: 'long',
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </div>
              </div>
            </div>
            
            {/* Weather Widget */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 min-w-64">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Време навън</h3>
                <Sun className="w-6 h-6 text-yellow-300" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{weather.temperature}°C</span>
                  <span className="text-purple-200">Слънчево</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    {weather.humidity}%
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4" />
                    {weather.windSpeed} km/h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group">
            <StatsCard
              title="Осветление"
              value={`${stats.lighting.active}`}
              subtitle={`от ${stats.lighting.total} устройства`}
              icon={<Lightbulb className="w-5 h-5" />}
              trend={{ value: 12, isPositive: true }}
              color="yellow"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <div className="mt-2 bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-yellow-700">Ефективност</span>
                <span className="font-medium text-yellow-800">{stats.lighting.efficiency}%</span>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${stats.lighting.efficiency}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="group">
            <StatsCard
              title="Температура"
              value={`${stats.temperature}°`}
              subtitle="средна в дома"
              icon={<Thermometer className="w-5 h-5" />}
              color="blue"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <div className="mt-2 bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-center">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full bg-blue-200"></div>
                  <div 
                    className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-1000"
                    style={{ 
                      clipPath: `circle(${(stats.temperature / 35) * 100}% at center)` 
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-800">
                    {stats.temperature}°
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <StatsCard
              title="Сигурност"
              value="100%"
              subtitle="системи активни"
              icon={<Shield className="w-5 h-5" />}
              color="green"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <div className="mt-2 bg-green-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700">Всички сензори активни</span>
              </div>
            </div>
          </div>

          <div className="group">
            <StatsCard
              title="Енергия"
              value={`${stats.energy.current}kW`}
              subtitle={`${stats.energy.today}kWh днес`}
              icon={<Zap className="w-5 h-5" />}
              trend={{ value: 8, isPositive: false }}
              color="orange"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <div className="mt-2 bg-orange-50 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-orange-700">Спестени</span>
                <span className="font-medium text-orange-800">{stats.energy.saved} лв</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scene Control */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Сценарии
              </h2>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Управление
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {scenes.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => activateScene(scene.id)}
                  className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    scene.id === activeScene
                      ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: scene.color }}
                    ></div>
                    {scene.id === activeScene && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{scene.name}</h3>
                  <p className="text-sm text-gray-500">{scene.devices} устройства</p>
                  
                  {scene.id === activeScene && (
                    <div className="absolute inset-0 bg-purple-500/10 rounded-xl animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Device Control */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Устройства</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {quickDevices.filter(d => d.status).length} активни
                    </span>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Виж всички
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickDevices.map((device) => {
                    const getDeviceIcon = (type: string, status: boolean) => {
                      const iconClass = `w-5 h-5 ${status ? 'text-blue-600' : 'text-gray-400'}`;
                      switch (type) {
                        case 'light': return <Lightbulb className={iconClass} />;
                        case 'climate': return <Thermometer className={iconClass} />;
                        case 'security': return <Shield className={iconClass} />;
                        case 'fan': return <Wind className={iconClass} />;
                        case 'camera': return <Eye className={iconClass} />;
                        default: return <Power className={iconClass} />;
                      }
                    };

                    const getStatusColor = (type: string, status: boolean) => {
                      if (!status) return 'bg-gray-100 border-gray-200';
                      switch (type) {
                        case 'light': return 'bg-yellow-50 border-yellow-200';
                        case 'climate': return 'bg-blue-50 border-blue-200';
                        case 'security': return 'bg-green-50 border-green-200';
                        case 'fan': return 'bg-cyan-50 border-cyan-200';
                        case 'camera': return 'bg-purple-50 border-purple-200';
                        default: return 'bg-gray-50 border-gray-200';
                      }
                    };

                    return (
                      <div 
                        key={device.id} 
                        className={`group relative border-2 rounded-xl p-4 transition-all duration-300 cursor-pointer hover:shadow-md ${getStatusColor(device.type, device.status)}`}
                        onClick={() => toggleDevice(device.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg transition-all duration-300 ${
                              device.status 
                                ? 'bg-white shadow-sm' 
                                : 'bg-gray-200'
                            }`}>
                              {getDeviceIcon(device.type, device.status)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{device.name}</p>
                              <p className="text-xs text-gray-500">{device.room}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {/* Special indicators */}
                            {device.type === 'light' && device.status && (
                              <div className="text-xs text-gray-600">
                                {device.brightness}%
                              </div>
                            )}
                            {device.type === 'climate' && device.value && (
                              <div className="text-xs font-medium text-blue-700">
                                {device.value}
                              </div>
                            )}
                            {device.type === 'camera' && device.recording && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-red-600">REC</span>
                              </div>
                            )}
                            
                            {/* Power toggle */}
                            <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
                              device.status ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                                device.status ? 'translate-x-6' : 'translate-x-0.5'
                              } translate-y-0.5`}></div>
                            </div>
                          </div>
                        </div>

                        {/* Progress bars for certain devices */}
                        {device.type === 'light' && device.status && (
                          <div className="mt-3 pt-3 border-t border-gray-200/50">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Яркост</span>
                              <span>{device.brightness}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-yellow-500 h-1 rounded-full transition-all duration-1000"
                                style={{ width: `${device.brightness}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Right Sidebar */}
          <div className="space-y-6">
            {/* Live Activity Feed */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Активност на живо
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const getSeverityColor = (severity: string) => {
                      switch (severity) {
                        case 'info': return 'bg-blue-100 text-blue-600 border-blue-200';
                        case 'success': return 'bg-green-100 text-green-600 border-green-200';
                        case 'warning': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
                        case 'error': return 'bg-red-100 text-red-600 border-red-200';
                        default: return 'bg-gray-100 text-gray-600 border-gray-200';
                      }
                    };

                    return (
                      <div key={activity.id} className="flex gap-3 group">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          activity.severity === 'info' ? 'bg-blue-500' :
                          activity.severity === 'success' ? 'bg-green-500' :
                          activity.severity === 'warning' ? 'bg-yellow-500' :
                          activity.severity === 'error' ? 'bg-red-500' : 'bg-gray-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border mb-1 ${getSeverityColor(activity.severity)}`}>
                            {activity.type}
                          </div>
                          <p className="text-sm text-gray-900 group-hover:text-gray-700">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Energy Insights */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-yellow-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  Енергиен анализ
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Текущо потребление</span>
                    <span className="font-bold text-orange-600">{stats.energy.current}kW</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Слънчево производство</span>
                    <span className="font-bold text-green-600">+{stats.energy.solar}kW</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {stats.energy.saved} лв
                      </div>
                      <div className="text-sm text-gray-600">спестени този месец</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
                <h3 className="text-lg font-semibold text-gray-900">Състояние</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Системни процеси</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">Активни</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Мрежова връзка</span>
                  <span className="text-sm font-medium text-gray-900">1 Gbps</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Използвана памет</span>
                  <span className="text-sm font-medium text-gray-900">4.2 / 16 GB</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Последна резервна копия</span>
                  <span className="text-sm text-gray-500">преди 2ч</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}