// src/components/lighting/LightCard.tsx
'use client';

import React, { useState } from 'react';
import { 
  Lightbulb, 
  Power, 
  Settings, 
  Timer, 
  Palette,
  Zap,
  MoreHorizontal
} from 'lucide-react';

interface Light {
  id: number;
  name: string;
  room: string;
  roomName: string;
  status: boolean;
  brightness: number;
  colorTemperature: number;
  color: string;
  type: 'basic' | 'dimmable' | 'rgb';
  powerUsage: number;
  schedule: {
    enabled: boolean;
    onTime: string;
    offTime: string;
  };
}

interface LightCardProps {
  light: Light;
  onToggle: () => void;
  onBrightnessChange: (brightness: number) => void;
  onColorChange: (color: string, temperature: number) => void;
  onSettingsClick: () => void;
  isLoading?: boolean;
}

export const LightCard: React.FC<LightCardProps> = ({
  light,
  onToggle,
  onBrightnessChange,
  onColorChange,
  onSettingsClick,
  isLoading = false
}) => {
  const [showControls, setShowControls] = useState(false);

  const getBrightnessColor = (brightness: number) => {
    if (brightness === 0) return 'text-gray-400';
    if (brightness < 30) return 'text-yellow-400';
    if (brightness < 70) return 'text-yellow-500';
    return 'text-yellow-600';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rgb': return <Palette className="w-4 h-4" />;
      case 'dimmable': return <Settings className="w-4 h-4" />;
      default: return <Power className="w-4 h-4" />;
    }
  };

  const getCardShadow = (status: boolean, brightness: number) => {
    if (!status) return '';
    const intensity = Math.floor(brightness / 25);
    const shadowClasses = [
      '',
      'shadow-yellow-200/30',
      'shadow-yellow-300/40', 
      'shadow-yellow-400/50',
      'shadow-yellow-500/60'
    ];
    return `shadow-lg ${shadowClasses[intensity]}`;
  };

  return (
    <div 
      className={`bg-white rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
        light.status 
          ? `border-yellow-200 ${getCardShadow(light.status, light.brightness)}` 
          : 'border-gray-200 hover:border-gray-300'
      } ${isLoading ? 'opacity-70' : ''}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg transition-all duration-300 ${
              light.status 
                ? 'bg-yellow-100 shadow-sm' 
                : 'bg-gray-100'
            }`}>
              <Lightbulb className={`w-5 h-5 ${getBrightnessColor(light.brightness)}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{light.name}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                {light.roomName}
                {getTypeIcon(light.type)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {light.schedule.enabled && (
              <div className="p-1 bg-blue-100 rounded-md">
                <Timer className="w-3 h-3 text-blue-600" />
              </div>
            )}
            <button
              onClick={onToggle}
              disabled={isLoading}
              className={`w-12 h-6 rounded-full transition-all duration-300 ${
                light.status ? 'bg-yellow-500' : 'bg-gray-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                light.status ? 'translate-x-6' : 'translate-x-0.5'
              } translate-y-0.5`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Light Preview */}
      <div className="p-4">
        <div className="relative mb-4">
          <div 
            className={`w-full h-24 rounded-lg transition-all duration-500 ${
              light.status 
                ? 'shadow-inner' 
                : 'bg-gray-100'
            }`}
            style={{
              backgroundColor: light.status ? light.color : '#f3f4f6',
              opacity: light.status ? (light.brightness / 100) * 0.8 + 0.2 : 1
            }}
          >
            {light.status && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg"></div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-center ${light.status ? 'text-gray-700' : 'text-gray-400'}`}>
                <div className="text-2xl font-bold">
                  {light.brightness}%
                </div>
                <div className="text-xs">
                  {light.status ? `${light.colorTemperature}K` : 'Изключена'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        {light.status && (
          <div className="space-y-3">
            {/* Brightness Control */}
            <div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Яркост</span>
                <span>{light.brightness}%</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={light.brightness}
                  onChange={(e) => onBrightnessChange(parseInt(e.target.value))}
                  disabled={isLoading}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${light.brightness}%, #e5e7eb ${light.brightness}%, #e5e7eb 100%)`
                  }}
                />
                <div 
                  className="absolute top-1/2 w-4 h-4 bg-yellow-500 rounded-full shadow-md transform -translate-y-1/2 pointer-events-none transition-all duration-200"
                  style={{ 
                    left: `calc(${light.brightness}% - 8px)`,
                    boxShadow: light.brightness > 50 ? '0 0 10px rgba(251, 191, 36, 0.5)' : '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                ></div>
              </div>
            </div>

            {/* Color Temperature (for dimmable and rgb lights) */}
            {(light.type === 'dimmable' || light.type === 'rgb') && (
              <div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Топлина</span>
                  <span>{light.colorTemperature}K</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="2200"
                    max="6500"
                    value={light.colorTemperature}
                    onChange={(e) => {
                      const temp = parseInt(e.target.value);
                      const color = temp < 3000 ? '#FFE4B5' : 
                                   temp < 4000 ? '#FFFFFF' : '#E6E6FA';
                      onColorChange(color, temp);
                    }}
                    disabled={isLoading}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: 'linear-gradient(to right, #FFA07A 0%, #FFFFFF 50%, #E6E6FA 100%)'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {light.powerUsage}W
            </div>
            {light.schedule.enabled && (
              <div className="flex items-center gap-1">
                <Timer className="w-3 h-3" />
                {light.schedule.onTime}-{light.schedule.offTime}
              </div>
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

// CSS for custom slider styling
const sliderStyles = `
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #fbbf24;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #fbbf24;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.6);
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = sliderStyles;
  document.head.appendChild(styleSheet);
}