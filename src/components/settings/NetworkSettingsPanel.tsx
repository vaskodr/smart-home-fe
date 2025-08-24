// src/components/settings/NetworkSettingsPanel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, Router, Globe, Shield, Server, CheckCircle, AlertTriangle, X, Users } from 'lucide-react';
import { NetworkSettings } from '@/lib/types';

interface NetworkSettingsPanelProps {
  settings: NetworkSettings;
  onUpdate: (updates: Partial<NetworkSettings>) => void;
}

export const NetworkSettingsPanel: React.FC<NetworkSettingsPanelProps> = ({
  settings,
  onUpdate
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleChange = (field: keyof NetworkSettings, value: any) => {
    const updated = { ...localSettings, [field]: value };
    setLocalSettings(updated);
    setHasChanges(true);
    
    const timeoutId = setTimeout(() => {
      onUpdate({ [field]: value });
      setHasChanges(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleNestedChange = (parent: keyof NetworkSettings, field: string, value: any) => {
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

  const getConnectionStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'disconnected':
        return <X className="w-5 h-5 text-red-600" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <X className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'error':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* WiFi Settings */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wifi className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">WiFi настройки</h3>
            <p className="text-sm text-gray-600">Управление на безжичната мрежа</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Име на мрежата (SSID)
              </label>
              <input
                type="text"
                value={localSettings.wifi.ssid}
                onChange={(e) => handleNestedChange('wifi', 'ssid', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Парола
              </label>
              <input
                type="password"
                value={localSettings.wifi.password}
                onChange={(e) => handleNestedChange('wifi', 'password', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Скрита мрежа</h4>
                  <p className="text-sm text-gray-600">Не показвай името на мрежата публично</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={localSettings.wifi.hidden}
                  onChange={(e) => handleNestedChange('wifi', 'hidden', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Гост мрежа</h4>
                  <p className="text-sm text-gray-600">Отделна мрежа за посетители</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={localSettings.wifi.guestNetwork}
                  onChange={(e) => handleNestedChange('wifi', 'guestNetwork', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Hub Connection */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Server className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Свързаност с хъба</h3>
            <p className="text-sm text-gray-600">Статус и настройки на основното устройство</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className={`p-4 rounded-lg border ${getStatusColor(localSettings.hubConnection.status)}`}>
            <div className="flex items-center gap-3 mb-3">
              {getConnectionStatusIcon(localSettings.hubConnection.status)}
              <div>
                <h4 className="font-medium">
                  {localSettings.hubConnection.status === 'connected' ? 'Свързан' :
                   localSettings.hubConnection.status === 'disconnected' ? 'Прекъснат' : 'Грешка'}
                </h4>
                <p className="text-sm">
                  IP адрес: {localSettings.hubConnection.ipAddress}
                </p>
              </div>
            </div>
            <p className="text-sm">
              Последна синхронизация: {new Date(localSettings.hubConnection.lastSync).toLocaleString('bg-BG')}
            </p>
          </div>
        </div>
      </div>

      {/* Remote Access */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Globe className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Отдалечен достъп</h3>
            <p className="text-sm text-gray-600">Управление извън локалната мрежа</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Достъп от интернет</h4>
                <p className="text-sm text-gray-600">Позволи управление от всяко място</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localSettings.remoteAccess}
                onChange={(e) => handleChange('remoteAccess', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">VPN връзка</h4>
                <p className="text-sm text-gray-600">Криптирана връзка за по-добра сигурност</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localSettings.vpnEnabled}
                onChange={(e) => handleChange('vpnEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Port Forwarding */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 rounded-lg">
            <Router className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Пренасочване на портове</h3>
            <p className="text-sm text-gray-600">Конфигурирани услуги за външен достъп</p>
          </div>
        </div>

        <div className="space-y-4">
          {localSettings.portForwarding.map((rule, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Server className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{rule.service}</h4>
                  <p className="text-sm text-gray-600">Порт: {rule.port}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  rule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {rule.enabled ? 'Активен' : 'Неактивен'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={rule.enabled}
                    onChange={(e) => {
                      const updatedRules = [...localSettings.portForwarding];
                      updatedRules[index] = { ...rule, enabled: e.target.checked };
                      handleChange('portForwarding', updatedRules);
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
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
