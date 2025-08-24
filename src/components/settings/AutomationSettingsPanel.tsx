// src/components/settings/AutomationSettingsPanel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Play, Pause, Settings, Brain, Plus, X, Edit3, Users, Lightbulb, Thermometer } from 'lucide-react';
import { AutomationSettings } from '@/lib/types';

interface AutomationSettingsPanelProps {
  settings: AutomationSettings;
  onUpdate: (updates: Partial<AutomationSettings>) => void;
}

export const AutomationSettingsPanel: React.FC<AutomationSettingsPanelProps> = ({
  settings,
  onUpdate
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleChange = (field: keyof AutomationSettings, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    setHasChanges(true);
    
    const timeoutId = setTimeout(() => {
      onUpdate({ [field]: value });
      setHasChanges(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleNestedChange = (parent: keyof AutomationSettings, field: string, value: any) => {
    const updated = {
      ...localSettings,
      [parent]: {
        ...localSettings[parent],
        [field]: value
      }
    };
    setLocalSettings(updated);
    setHasChanges(true);

    const timeoutId = setTimeout(() => {
      onUpdate({ [parent]: updated[parent] });
      setHasChanges(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const toggleSchedule = (scheduleId: string) => {
    const updatedSchedules = localSettings.schedules.map(schedule =>
      schedule.id === scheduleId ? { ...schedule, enabled: !schedule.enabled } : schedule
    );
    handleChange('schedules', updatedSchedules);
  };

  return (
    <div className="space-y-8">
      {/* General Automation Settings */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Основни настройки</h3>
            <p className="text-sm text-gray-600">Общи настройки за автоматизацията</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Автоматизация активна</h4>
                <p className="text-sm text-gray-600">Разреши изпълнение на автоматични сценарии</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localSettings.enabled}
                onChange={(e) => handleChange('enabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Режим на самообучение</h4>
                <p className="text-sm text-gray-600">Системата учи от вашите навици и предлага автоматизации</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localSettings.learningMode}
                onChange={(e) => handleChange('learningMode', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Schedules */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Планирани рутини</h3>
              <p className="text-sm text-gray-600">Автоматични действия по разписание</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Нова рутина
          </button>
        </div>

        <div className="space-y-4">
          {localSettings.schedules.map((schedule) => (
            <div key={schedule.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${schedule.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                      {schedule.enabled ? 
                        <Play className="w-4 h-4 text-green-600" /> : 
                        <Pause className="w-4 h-4 text-gray-600" />
                      }
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{schedule.name}</h4>
                      <p className="text-sm text-gray-600">
                        {schedule.triggers.length} тригера • {schedule.actions.length} действия
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      schedule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {schedule.enabled ? 'Активна' : 'Неактивна'}
                    </span>
                    <button 
                      onClick={() => toggleSchedule(schedule.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Тригери:</h5>
                    <ul className="space-y-1">
                      {schedule.triggers.map((trigger, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-3 h-3" />
                          {trigger}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Действия:</h5>
                    <ul className="space-y-1">
                      {schedule.actions.map((action, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <Settings className="w-3 h-3" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenes */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Settings className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Сценарии</h3>
              <p className="text-sm text-gray-600">Предварително настроени комбинации от устройства</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            <Plus className="w-4 h-4" />
            Нов сценарий
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localSettings.scenes.map((scene) => (
            <div key={scene.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{scene.name}</h4>
                    <p className="text-sm text-gray-600">{scene.devices.length} устройства</p>
                  </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-sm">
                <p className="text-gray-600 mb-2">Настройки:</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <code className="text-xs text-gray-700">
                    {JSON.stringify(scene.settings, null, 2).slice(0, 100)}...
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Sensors */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Brain className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Интелигентни сензори</h3>
            <p className="text-sm text-gray-600">Автоматично разпознаване и реакция</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Засичане на присъствие</h4>
                <p className="text-sm text-gray-600">Автоматично включване/изключване при влизане/излизане</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localSettings.sensors.occupancyDetection}
                onChange={(e) => handleNestedChange('sensors', 'occupancyDetection', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Адаптивно осветление</h4>
                <p className="text-sm text-gray-600">Автоматично регулиране според времето и активността</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localSettings.sensors.adaptiveLighting}
                onChange={(e) => handleNestedChange('sensors', 'adaptiveLighting', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Thermometer className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Климатично самообучение</h4>
                <p className="text-sm text-gray-600">Учи от предпочитанията и автоматично настройва</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localSettings.sensors.climateLearning}
                onChange={(e) => handleNestedChange('sensors', 'climateLearning', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
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
