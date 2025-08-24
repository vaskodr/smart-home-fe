// src/components/energy/EnergyCard.tsx
'use client';

import React from 'react';
import { 
  Zap, 
  Sun,
  Battery,
  TrendingUp,
  TrendingDown,
  Power,
  Settings
} from 'lucide-react';

interface EnergyDevice {
  id: number;
  name: string;
  type: 'solar' | 'battery' | 'consumption';
  currentPower: number;
  todayEnergy: number;
  monthEnergy: number;
  efficiency: number;
  status: 'generating' | 'charging' | 'discharging' | 'active' | 'idle';
  location?: string;
  capacity?: number;
  level?: number;
}

interface EnergyCardProps {
  device: EnergyDevice;
  onControl: (action: string) => void;
  isLoading?: boolean;
}

export const EnergyCard: React.FC<EnergyCardProps> = ({
  device,
  onControl,
  isLoading = false
}) => {
  const getDeviceIcon = (type: string, status: string) => {
    switch (type) {
      case 'solar':
        return <Sun className="w-6 h-6 text-yellow-600" />;
      case 'battery':
        return <Battery className={`w-6 h-6 ${
          status === 'charging' ? 'text-green-600' : 
          status === 'discharging' ? 'text-orange-600' : 'text-blue-600'
        }`} />;
      default:
        return <Zap className="w-6 h-6 text-blue-600" />;
    }
  };

  const getStatusColor = (type: string, status: string) => {
    switch (type) {
      case 'solar':
        return status === 'generating' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200';
      case 'battery':
        return status === 'charging' ? 'bg-green-50 border-green-200' : 
               status === 'discharging' ? 'bg-orange-50 border-orange-200' : 
               'bg-blue-50 border-blue-200';
      default:
        return status === 'active' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (type: string, status: string) => {
    const statusMap: { [key: string]: { [key: string]: string } } = {
      solar: { generating: 'Генерира', idle: 'Неактивни' },
      battery: { charging: 'Зарежда се', discharging: 'Разрежда се', idle: 'В готовност' },
      consumption: { active: 'Активно', idle: 'Неактивно' }
    };
    
    return statusMap[type]?.[status] || status;
  };

  const formatPower = (power: number) => {
    if (Math.abs(power) >= 1000) {
      return `${(power / 1000).toFixed(1)} MW`;
    }
    return `${power.toFixed(1)} kW`;
  };

  const formatEnergy = (energy: number) => {
    if (energy >= 1000) {
      return `${(energy / 1000).toFixed(1)} MWh`;
    }
    return `${energy.toFixed(1)} kWh`;
  };

  return (
    <div className={`rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
      getStatusColor(device.type, device.status)
    } ${isLoading ? 'opacity-70' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            {getDeviceIcon(device.type, device.status)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{device.name}</h3>
            {device.location && (
              <p className="text-xs text-gray-500">{device.location}</p>
            )}
          </div>
        </div>

        <button
          onClick={() => onControl('settings')}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
          device.status === 'generating' || device.status === 'charging' ? 'bg-green-100 text-green-800' :
          device.status === 'discharging' ? 'bg-orange-100 text-orange-800' :
          device.status === 'active' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            device.status === 'generating' || device.status === 'charging' ? 'bg-green-500' :
            device.status === 'discharging' ? 'bg-orange-500' :
            device.status === 'active' ? 'bg-blue-500' :
            'bg-gray-500'
          } ${device.status !== 'idle' ? 'animate-pulse' : ''}`}></div>
          {getStatusText(device.type, device.status)}
        </span>
      </div>

      {/* Current Power */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-3xl font-bold text-gray-900">
            {Math.abs(device.currentPower) < 0.1 ? '0.0' : formatPower(Math.abs(device.currentPower))}
          </div>
          {device.currentPower !== 0 && (
            <div className="flex items-center">
              {device.currentPower > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-blue-500" />
              )}
            </div>
          )}
        </div>
        <div className="text-sm text-gray-600">
          {device.type === 'battery' && device.currentPower < 0 ? 'Зарежда се' :
           device.type === 'solar' ? 'Генериране' : 'Потребление'}
        </div>
      </div>

      {/* Battery Level (for battery devices) */}
      {device.type === 'battery' && device.level !== undefined && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Заряд</span>
            <span>{device.level}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                device.level > 80 ? 'bg-green-500' :
                device.level > 50 ? 'bg-blue-500' :
                device.level > 20 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${device.level}%` }}
            ></div>
          </div>
          {device.capacity && (
            <div className="text-xs text-gray-500 mt-1">
              {((device.level / 100) * device.capacity).toFixed(1)} / {device.capacity} kWh
            </div>
          )}
        </div>
      )}

      {/* Efficiency (for solar and battery) */}
      {device.efficiency > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Ефективност</span>
            <span>{device.efficiency}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                device.efficiency > 90 ? 'bg-green-500' :
                device.efficiency > 75 ? 'bg-blue-500' :
                device.efficiency > 60 ? 'bg-yellow-500' : 'bg-orange-500'
              }`}
              style={{ width: `${device.efficiency}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Energy Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/70 rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-gray-900">
            {formatEnergy(device.todayEnergy)}
          </div>
          <div className="text-xs text-gray-600">Днес</div>
        </div>
        <div className="bg-white/70 rounded-lg p-3 text-center">
          <div className="text-lg font-semibold text-gray-900">
            {formatEnergy(device.monthEnergy)}
          </div>
          <div className="text-xs text-gray-600">Месец</div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="space-y-2">
        {device.type === 'battery' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onControl('charge')}
              disabled={isLoading || device.status === 'charging'}
              className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Зареди
            </button>
            <button
              onClick={() => onControl('discharge')}
              disabled={isLoading || device.status === 'discharging'}
              className="py-2 px-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              Разреди
            </button>
          </div>
        )}
        
        {device.type === 'consumption' && (
          <button
            onClick={() => onControl(device.status === 'active' ? 'stop' : 'start')}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg transition-colors text-sm font-medium ${
              device.status === 'active'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {device.status === 'active' ? 'Спри' : 'Старт'}
          </button>
        )}
      </div>
    </div>
  );
};