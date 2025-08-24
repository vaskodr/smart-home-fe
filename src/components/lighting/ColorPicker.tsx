// src/components/lighting/ColorPicker.tsx
'use client';

import React, { useState } from 'react';
import { X, Palette, Thermometer, Lightbulb } from 'lucide-react';

interface Light {
  id: number;
  name: string;
  color: string;
  colorTemperature: number;
  type: 'basic' | 'dimmable' | 'rgb';
}

interface ColorPickerProps {
  light: Light;
  onClose: () => void;
  onColorChange: (color: string, temperature: number) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  light,
  onClose,
  onColorChange
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'wheel' | 'temperature'>('presets');
  const [selectedColor, setSelectedColor] = useState(light.color);
  const [selectedTemperature, setSelectedTemperature] = useState(light.colorTemperature);

  const colorPresets = [
    { name: 'Топло бяло', color: '#FFE4B5', temp: 2700 },
    { name: 'Неутрално бяло', color: '#FFFFFF', temp: 4000 },
    { name: 'Студено бяло', color: '#E6E6FA', temp: 6500 },
    { name: 'Червено', color: '#FF6B6B', temp: 3000 },
    { name: 'Оранжево', color: '#FFA07A', temp: 2800 },
    { name: 'Жълто', color: '#FFD93D', temp: 3200 },
    { name: 'Зелено', color: '#6BCF7F', temp: 4000 },
    { name: 'Синьо', color: '#4ECDC4', temp: 5000 },
    { name: 'Лилаво', color: '#A8E6CF', temp: 4500 },
    { name: 'Розово', color: '#FFB6C1', temp: 3500 }
  ];

  const temperaturePresets = [
    { name: 'Свещ', temp: 1900, color: '#FF8C00' },
    { name: 'Изгрев', temp: 2200, color: '#FFA500' },
    { name: 'Халоген', temp: 2700, color: '#FFE4B5' },
    { name: 'Флуоресцентна', temp: 4000, color: '#FFFFFF' },
    { name: 'Дневна светлина', temp: 5600, color: '#E6E6FA' },
    { name: 'Облачно небе', temp: 6500, color: '#B0C4DE' }
  ];

  const handlePresetClick = (color: string, temp: number) => {
    setSelectedColor(color);
    setSelectedTemperature(temp);
    onColorChange(color, temp);
  };

  const handleTemperatureChange = (temp: number) => {
    setSelectedTemperature(temp);
    // Convert temperature to color approximation
    let color;
    if (temp < 2500) color = '#FF8C00';
    else if (temp < 3000) color = '#FFA500';
    else if (temp < 3500) color = '#FFE4B5';
    else if (temp < 4500) color = '#FFFFFF';
    else if (temp < 5500) color = '#E6E6FA';
    else color = '#B0C4DE';
    
    setSelectedColor(color);
    onColorChange(color, temp);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Цвят и топлина</h2>
              <p className="text-sm text-gray-600">{light.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'presets'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Palette className="w-4 h-4 inline mr-2" />
            Готови цветове
          </button>
          
          <button
            onClick={() => setActiveTab('temperature')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'temperature'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Thermometer className="w-4 h-4 inline mr-2" />
            Топлина
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Preview */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-3">Преглед:</div>
            <div 
              className="w-full h-20 rounded-xl border-2 border-gray-200 shadow-inner flex items-center justify-center"
              style={{ backgroundColor: selectedColor }}
            >
              <Lightbulb className="w-8 h-8 text-gray-600 opacity-80" />
            </div>
            <div className="mt-2 text-center text-sm text-gray-600">
              {selectedTemperature}K
            </div>
          </div>

          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handlePresetClick(preset.color, preset.temp)}
                    className={`group relative p-3 rounded-xl transition-all duration-200 ${
                      selectedColor === preset.color
                        ? 'ring-2 ring-purple-500 ring-offset-2 scale-105'
                        : 'hover:scale-105 hover:shadow-md'
                    }`}
                    style={{ backgroundColor: preset.color }}
                  >
                    <div className="aspect-square rounded-lg bg-white/20 flex items-center justify-center mb-2">
                      <Lightbulb className="w-5 h-5 text-gray-700 opacity-80" />
                    </div>
                    <div className="text-xs font-medium text-gray-700 text-center">
                      {preset.name}
                    </div>
                    <div className="text-xs text-gray-600 text-center">
                      {preset.temp}K
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'temperature' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Цветна температура
                  </label>
                  <span className="text-sm text-gray-600">{selectedTemperature}K</span>
                </div>
                
                <div className="relative mb-6">
                  <input
                    type="range"
                    min="1900"
                    max="6500"
                    step="100"
                    value={selectedTemperature}
                    onChange={(e) => handleTemperatureChange(parseInt(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: 'linear-gradient(to right, #FF8C00 0%, #FFA500 25%, #FFE4B5 50%, #FFFFFF 75%, #B0C4DE 100%)'
                    }}
                  />
                  <div 
                    className="absolute top-0 w-6 h-3 bg-white border-2 border-gray-400 rounded-lg shadow-md pointer-events-none"
                    style={{ 
                      left: `calc(${((selectedTemperature - 1900) / (6500 - 1900)) * 100}% - 12px)`,
                    }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {temperaturePresets.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handleTemperatureChange(preset.temp)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        Math.abs(selectedTemperature - preset.temp) < 100
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div 
                        className="w-full h-8 rounded mb-2"
                        style={{ backgroundColor: preset.color }}
                      ></div>
                      <div className="text-sm font-medium text-gray-900">{preset.name}</div>
                      <div className="text-xs text-gray-600">{preset.temp}K</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Отказ
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};