// src/components/settings/SecuritySettingsPanel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Key, Eye, Lock, Users, Camera, AlertTriangle, Smartphone, Bell } from 'lucide-react';
import { SecuritySettings } from '@/lib/types';

interface SecuritySettingsPanelProps {
  settings: SecuritySettings;
  onUpdate: (updates: Partial<SecuritySettings>) => void;
}

export const SecuritySettingsPanel: React.FC<SecuritySettingsPanelProps> = ({
  settings,
  onUpdate
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleChange = (field: keyof SecuritySettings, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    setHasChanges(true);
    
    const timeoutId = setTimeout(() => {
      onUpdate({ [field]: value });
      setHasChanges(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleNestedChange = (parent: keyof SecuritySettings, field: string, value: any) => {
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

  return (
    <div className="space-y-8">
      {/* Authentication */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Key className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Удостоверяване</h3>
            <p className="text-sm text-gray-600">Настройки за сигурност на акаунта</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Двуфакторна автентикация</h4>
                <p className="text-sm text-gray-600">Допълнителна защита с SMS или приложение</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localSettings.twoFactorAuth}
                onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Известия при влизане</h4>
                <p className="text-sm text-gray-600">Уведомявай при нов достъп до системата</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localSettings.loginNotifications}
                onChange={(e) => handleChange('loginNotifications', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Автоматично излизане (минути)
              </label>
              <input
                type="number"
                min="5"
                max="480"
                step="5"
                value={localSettings.sessionTimeout}
                onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Между 5 и 480 минути</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Cameras */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Camera className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Камери за сигурност</h3>
            <p className="text-sm text-gray-600">Настройки за видеонаблюдение</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Качество на записа
              </label>
              <select
                value={localSettings.securityCameras.recordingQuality}
                onChange={(e) => handleNestedChange('securityCameras', 'recordingQuality', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Ниско (720p)</option>
                <option value="medium">Средно (1080p)</option>
                <option value="high">Високо (1440p)</option>
                <option value="4k">Ultra (4K)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Съхранение (дни)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={localSettings.securityCameras.storageRetention}
                onChange={(e) => handleNestedChange('securityCameras', 'storageRetention', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Колко дни да се съхраняват записите</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Детекция на движение</h4>
                  <p className="text-sm text-gray-600">Автоматично записване при детектирано движение</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={localSettings.securityCameras.motionDetection}
                  onChange={(e) => handleNestedChange('securityCameras', 'motionDetection', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Eye className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Нощно виждане</h4>
                  <p className="text-sm text-gray-600">Включи инфрачервено осветление при слаба светлина</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={localSettings.securityCameras.nightVision}
                  onChange={(e) => handleNestedChange('securityCameras', 'nightVision', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Access Control */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Контрол на достъпа</h3>
            <p className="text-sm text-gray-600">Управление на потребителски права</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Гостов достъп</h4>
                <p className="text-sm text-gray-600">Позволи на гости да контролират основни устройства</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localSettings.accessControl.guestAccess}
                onChange={(e) => handleNestedChange('accessControl', 'guestAccess', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Одобрение на администратор</h4>
                <p className="text-sm text-gray-600">Изисквай одобрение за нови устройства</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localSettings.accessControl.adminApproval}
                onChange={(e) => handleNestedChange('accessControl', 'adminApproval', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ниво на контрол на устройства за гости
            </label>
            <select
              value={localSettings.accessControl.deviceControl}
              onChange={(e) => handleNestedChange('accessControl', 'deviceControl', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="none">Без контрол</option>
              <option value="basic">Основен (осветление, климат)</option>
              <option value="full">Пълен контрол</option>
            </select>
          </div>
        </div>
      </div>

      {/* Allowed Devices */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Smartphone className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Разрешени устройства</h3>
            <p className="text-sm text-gray-600">Устройства с достъп до системата</p>
          </div>
        </div>

        <div className="space-y-4">
          {localSettings.allowedDevices.map((device, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">{device}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Активно
                </span>
              </div>
            </div>
          ))}
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
