// src/app/dashboard/energy/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Zap, 
  Sun,
  Battery,
  TrendingUp,
  TrendingDown,
  Settings,
  Calendar,
  Download,
  Target,
  Leaf,
  DollarSign
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EnergyCard } from '@/components/energy/EnergyCard';
import { EnergyChart } from '@/components/energy/EnergyChart';
import { EnergyStats } from '@/components/energy/EnergyStats';
import { CostAnalysis } from '@/components/energy/CostAnalysis';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Mock data
const fetchEnergyData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    realTimeData: {
      currentConsumption: 3.2,
      solarGeneration: 4.1,
      batteryLevel: 78,
      batteryStatus: 'charging' as const,
      gridExport: 0.9,
      netConsumption: -0.9, // negative means exporting
      carbonOffset: 2.3
    },
    devices: [
      {
        id: 1,
        name: 'Слънчеви панели',
        type: 'solar' as const,
        currentPower: 4.1,
        todayEnergy: 28.4,
        monthEnergy: 847,
        efficiency: 87,
        status: 'generating' as const,
        location: 'Покрив'
      },
      {
        id: 2,
        name: 'Батерийна система',
        type: 'battery' as const,
        currentPower: -1.2, // negative means charging
        todayEnergy: 15.6,
        monthEnergy: 468,
        efficiency: 94,
        status: 'charging' as const,
        capacity: 13.5,
        level: 78
      },
      {
        id: 3,
        name: 'Основно потребление',
        type: 'consumption' as const,
        currentPower: 3.2,
        todayEnergy: 24.8,
        monthEnergy: 744,
        efficiency: 0,
        status: 'active' as const
      },
      {
        id: 4,
        name: 'Климатизация',
        type: 'consumption' as const,
        currentPower: 1.8,
        todayEnergy: 14.2,
        monthEnergy: 426,
        efficiency: 0,
        status: 'active' as const
      },
      {
        id: 5,
        name: 'Водонагревател',
        type: 'consumption' as const,
        currentPower: 0.0,
        todayEnergy: 3.1,
        monthEnergy: 93,
        efficiency: 0,
        status: 'idle' as const
      }
    ],
    dailyChart: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      consumption: 2 + Math.sin((i - 6) / 24 * 2 * Math.PI) * 1.5 + Math.random() * 0.5,
      generation: i > 6 && i < 19 ? Math.sin((i - 6) / 12 * Math.PI) * 4 + Math.random() * 0.3 : 0,
      battery: 2 + Math.sin((i - 12) / 24 * 2 * Math.PI) * 1 + Math.random() * 0.3,
    })),
    monthlyStats: {
      consumption: 744,
      generation: 892,
      exported: 148,
      savings: 284,
      carbonReduced: 312
    },
    tariffs: {
      current: 'time_of_use' as const,
      currentRate: 0.18,
      peakRate: 0.26,
      offPeakRate: 0.12,
      exportRate: 0.08
    },
    goals: {
      monthlyTarget: 800,
      currentProgress: 744,
      carbonTarget: 400,
      carbonProgress: 312,
      savingsTarget: 300,
      savingsProgress: 284
    }
  };
};

export default function EnergyPage() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['energy', timeRange],
    queryFn: fetchEnergyData,
    refetchInterval: 10000, // Real-time updates every 10 seconds
  });

  // Device control mutation
  const deviceMutation = useMutation({
    mutationFn: async ({ deviceId, action }: { deviceId: number; action: string }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { deviceId, action };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energy'] });
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
          message="Не можем да заредим енергийните данни."
          onRetry={() => window.location.reload()}
        />
      </DashboardLayout>
    );
  }

  const { realTimeData, devices, dailyChart, monthlyStats, tariffs, goals } = data!;

  const controlDevice = (deviceId: number, action: string) => {
    deviceMutation.mutate({ deviceId, action });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className={`p-2 rounded-xl ${
                realTimeData.netConsumption < 0 ? 'bg-green-100' : 'bg-orange-100'
              }`}>
                <Zap className={`w-8 h-8 ${
                  realTimeData.netConsumption < 0 ? 'text-green-600' : 'text-orange-600'
                }`} />
              </div>
              Енергийно управление
            </h1>
            <p className="mt-2 text-gray-600">
              Мониторинг и оптимизация на енергийното потребление
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-lg font-medium ${
              realTimeData.netConsumption < 0 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-orange-100 text-orange-700 border border-orange-200'
            }`}>
              {realTimeData.netConsumption < 0 
                ? `+${Math.abs(realTimeData.netConsumption).toFixed(1)} kW експорт`
                : `${realTimeData.netConsumption.toFixed(1)} kW потребление`
              }
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{realTimeData.currentConsumption} kW</div>
              <div className="text-sm text-gray-600">Потребление</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sun className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{realTimeData.solarGeneration} kW</div>
              <div className="text-sm text-gray-600">Слънчева енергия</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Battery className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{realTimeData.batteryLevel}%</div>
              <div className="text-sm text-gray-600">Батерия</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{realTimeData.carbonOffset} kg</div>
              <div className="text-sm text-gray-600">CO₂ спестен днес</div>
            </div>
          </div>
        </div>

        {/* Energy Stats */}
        <EnergyStats stats={monthlyStats} goals={goals} />

        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['day', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range === 'day' ? 'Ден' : range === 'week' ? 'Седмица' : 'Месец'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Calendar className="w-4 h-4" />
              Период
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Експорт
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Energy Chart */}
          <div className="lg:col-span-2">
            <EnergyChart 
              data={dailyChart}
              timeRange={timeRange}
              title="Енергиен поток"
            />
          </div>

          {/* Cost Analysis */}
          <div>
            <CostAnalysis 
              monthlyStats={monthlyStats}
              tariffs={tariffs}
            />
          </div>
        </div>

        {/* Device Grid */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Енергийни устройства</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <EnergyCard
                  key={device.id}
                  device={device}
                  onControl={(action) => controlDevice(device.id, action)}
                  isLoading={deviceMutation.isPending}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}