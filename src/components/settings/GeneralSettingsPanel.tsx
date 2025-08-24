// src/components/settings/GeneralSettingsPanel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Clock, DollarSign, Palette, Calendar } from 'lucide-react';
import { GeneralSettings } from '@/lib/types';

interface GeneralSettingsPanelProps {
  settings: GeneralSettings;
  onUpdate: (updates: Partial<GeneralSettings>) => void;
}

export const GeneralSettingsPanel: React.FC<GeneralSettingsPanelProps> = ({
  settings,
  onUpdate
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleChange = (field: keyof GeneralSettings, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    setHasChanges(true);
    
    // Auto-save after short delay
    const timeoutId = setTimeout(() => {
      onUpdate({ [field]: value });
      setHasChanges(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleNestedChange = (parent: keyof GeneralSettings, field: string, value: any) => {
    const updated = {
      ...localSettings,
      [parent]: {
        ...localSettings[parent],
        [field]: value
      }
    };
    setLocalSettings(updated);
    setHasChanges(true);

    // Auto-save after short delay
    const timeoutId = setTimeout(() => {
      onUpdate({ [parent]: updated[parent] });
      setHasChanges(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="space-y-8">
      {/* Home Identity */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Идентичност на дома</h3>
            <p className="text-sm text-gray-600">Основна информация за вашия умен дом</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Име на дома
            </label>
            <input
              type="text"
              value={localSettings.homeTitle}
              onChange={(e) => handleChange('homeTitle', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Например: Умният дом на семейство Петкови"
            />
          </div>
        </div>
      </div>

      {/* Location Settings */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Местоположение</h3>
            <p className="text-sm text-gray-600">Настройки за местоположение и времева зона</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Град
            </label>
            <input
              type="text"
              value={localSettings.location.city}
              onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Времева зона
            </label>
            <select
              value={localSettings.location.timezone}
              onChange={(e) => handleNestedChange('location', 'timezone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Europe/Sofia">София (UTC+2)</option>
              <option value="Europe/London">Лондон (UTC+0)</option>
              <option value="Europe/Paris">Париж (UTC+1)</option>
              <option value="America/New_York">Ню Йорк (UTC-5)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Units & Formats */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Единици и формати</h3>
            <p className="text-sm text-gray-600">Настройки за измерване и показване</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Температура
            </label>
            <select
              value={localSettings.units.temperature}
              onChange={(e) => handleNestedChange('units', 'temperature', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="celsius">Целзий (°C)</option>
              <option value="fahrenheit">Фаренхайт (°F)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Енергия
            </label>
            <select
              value={localSettings.units.energy}
              onChange={(e) => handleNestedChange('units', 'energy', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="kWh">Киловат-час (kWh)</option>
              <option value="Wh">Ват-час (Wh)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Валута
            </label>
            <select
              value={localSettings.units.currency}
              onChange={(e) => handleNestedChange('units', 'currency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="BGN">Български лев (лв)</option>
              <option value="EUR">Евро (€)</option>
              <option value="USD">Долар ($)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Формат на датата
            </label>
            <select
              value={localSettings.dateFormat}
              onChange={(e) => handleChange('dateFormat', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dd/mm/yyyy">дд/мм/гггг</option>
              <option value="mm/dd/yyyy">мм/дд/гггг</option>
              <option value="yyyy-mm-dd">гггг-мм-дд</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Формат на часа
            </label>
            <select
              value={localSettings.timeFormat}
              onChange={(e) => handleChange('timeFormat', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24h">24-часов</option>
              <option value="12h">12-часов</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interface Settings */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Palette className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Интерфейс</h3>
            <p className="text-sm text-gray-600">Персонализиране на потребителския интерфейс</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Език
            </label>
            <select
              value={localSettings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bg">Български</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тема
            </label>
            <select
              value={localSettings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="light">Светла</option>
              <option value="dark">Тъмна</option>
              <option value="auto">Автоматична</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Автоматичната тема следва системните настройки
            </p>
          </div>
        </div>
      </div>

      {/* Change Indicator */}
      {hasChanges && (
        <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-700">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Записване на промените...</span>
          </div>
        </div>
      )}
    </div>
  );
};
