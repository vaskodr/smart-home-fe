// src/components/climate/ClimateCard.tsx
'use client';

import React, { useState } from 'react';
import { 
  Thermometer, 
  Wind,
  Droplets,
  Snowflake,
  Flame,
  Power,
  Settings,
  Timer,
  ChevronUp,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';

interface ClimateDevice {
  id: number;
  name: string;
  room: string;
  roomName: string;
  type: 'thermostat' | 'ac' | 'humidifier' | 'fan';
  currentTemp: number;
  targetTemp: number;
  humidity: number;
  status: 'heating' | 'cooling' | 'idle';
  mode: 'auto' | 'heat' | 'cool' | 'fan' | 'humidity';
  fanSpeed: number;
  powerUsage: number;
  schedule: {
    enabled: boolean;
    schedules: string[];
  };
}

interface ClimateCardProps {
  device: ClimateDevice;
  onToggle: () => void;
  onTempChange: (temp: number) => void;
  onModeChange: (mode: string) => void;
  onFanSpeedChange: (speed: number) => void;
  onSettingsClick: () => void;
  isLoading?: boolean;
}

export const ClimateCard: React.FC<ClimateCardProps> = ({
  device,
  onToggle,
  onTempChange,
  onModeChange,
  onFanSpeedChange,
  onSettingsClick,
  isLoading = false
}) => {
  const [showControls, setShowControls] = useState(false);

  const getDeviceIcon = (type: string, status: string) => {
    switch (type) {
      case 'thermostat':
        return status === 'heating' ? 
          <Flame className="w-6 h-6 text-orange-500" /> : 
          status === 'cooling' ?
            <Snowflake className="w-6 h-6 text-blue-500" /> :
            <Thermometer className="w-6 h-6 text-gray-500" />;
      case 'ac':
        return status === 'cooling' ?
          <Snowflake className="w-6 h-6 text-blue-500" /> :
          status === 'heating' ?
            <Flame className="w-6 h-6 text-orange-500" /> :
            <Wind className="w-6 h-6 text-gray-500" />;
      case 'humidifier':
        return <Droplets className="w-6 h-6 text-blue-400" />;
      case 'fan':
        return <Wind className="w-6 h-6 text-gray-600" />;
      default:
        return <Thermometer className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'heating': return 'bg-orange-50 border-orange-200';
      case 'cooling': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'heating': return 'Отопление';
      case 'cooling': return 'Охлаждане';
      default: return 'Неактивен';
    }
  };

  const modes = [
    { value: 'auto', label: 'Автоматично' },
    { value: 'heat', label: 'Отопление' },
    { value: 'cool', label: 'Охлаждане' },
    { value: 'fan', label: 'Вентилация' },
    { value: 'humidity', label: 'Влажност' }
  ];

  const adjustTemp = (increment: boolean) => {
    const newTemp = increment ? device.targetTemp + 0.5 : device.targetTemp - 0.5;
    if (newTemp >= 15 && newTemp <= 30) {
      onTempChange(newTemp);
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
        device.status !== 'idle' 
          ? `${getStatusColor(device.status)} shadow-lg` 
          : 'border-gray-200 hover:border-gray-300'
      } ${isLoading ? 'opacity-70' : ''}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg transition-all duration-300 ${
              device.status !== 'idle' 
                ? 'bg-white shadow-sm' 
                : 'bg-gray-100'
            }`}>
              {getDeviceIcon(device.type, device.status)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{device.name}</h3>
              <p className="text-xs text-gray-500">{device.roomName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {device.schedule.enabled && (
              <div className="p-1 bg-blue-100 rounded-md">
                <Timer className="w-3 h-3 text-blue-600" />
              </div>
            )}
            <button
              onClick={onToggle}
              disabled={isLoading}
              className={`w-12 h-6 rounded-full transition-all duration-300 ${
                device.status !== 'idle' ? 'bg-blue-500' : 'bg-gray-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                device.status !== 'idle' ? 'translate-x-6' : 'translate-x-0.5'
              } translate-y-0.5`}></div>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            device.status === 'heating' ? 'bg-orange-100 text-orange-700' :
            device.status === 'cooling' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {getStatusText(device.status)}
          </span>
          <span className="text-sm text-gray-500">{device.powerUsage}W</span>
        </div>
      </div>

      {/* Temperature Display */}
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {device.currentTemp.toFixed(1)}°
            </div>
            <div className="absolute -top-1 -right-8 text-sm text-gray-500">
              C
            </div>
          </div>
          
          {/* Target Temperature */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <button 
              onClick={() => adjustTemp(false)}
              disabled={isLoading || device.targetTemp <= 15}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {device.targetTemp.toFixed(1)}°C
              </div>
              <div className="text-xs text-gray-500">Целева</div>
            </div>
            
            <button 
              onClick={() => adjustTemp(true)}
              disabled={isLoading || device.targetTemp >= 30}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {/* Temperature difference indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {device.currentTemp < device.targetTemp ? (
              <div className="flex items-center gap-1 text-orange-600">
                <ChevronUp className="w-3 h-3" />
                <span className="text-sm">+{(device.targetTemp - device.currentTemp).toFixed(1)}°</span>
              </div>
            ) : device.currentTemp > device.targetTemp ? (
              <div className="flex items-center gap-1 text-blue-600">
                <ChevronDown className="w-3 h-3" />
                <span className="text-sm">-{(device.currentTemp - device.targetTemp).toFixed(1)}°</span>
              </div>
            ) : (
              <span className="text-sm text-green-600">Постигната</span>
            )}
          </div>
        </div>

        {/* Humidity Display */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-900">Влажност</span>
            </div>
            <span className="font-semibold text-blue-900">{device.humidity}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${device.humidity}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        {device.status !== 'idle' && (
          <div className="space-y-4">
            {/* Mode Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Режим</label>
              <select
                value={device.mode}
                onChange={(e) => onModeChange(e.target.value)}
                disabled={isLoading}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {modes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fan Speed */}
            {(device.type === 'ac' || device.type === 'fan') && (
              <div>
                <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                  <span>Скорост на вентилатора</span>
                  <span>{device.fanSpeed}/3</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => onFanSpeedChange(speed)}
                      disabled={isLoading}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        device.fanSpeed >= speed
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {device.schedule.enabled && device.schedule.schedules.length > 0 && (
              <span>График: {device.schedule.schedules.join(', ')}</span>
            )}
          </div>

          <div className={`transition-opacity duration-200 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={onSettingsClick}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};