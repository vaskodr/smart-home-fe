// src/app/dashboard/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Settings, 
  User,
  Shield,
  Bell,
  Wifi,
  Zap,
  Calendar,
  Database,
  Download,
  Upload,
  RotateCcw,
  Save,
  AlertTriangle,
  CheckCircle,
  Globe
} from 'lucide-react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { 
  GeneralSettingsPanel,
  SecuritySettingsPanel,
  NotificationSettingsPanel,
  NetworkSettingsPanel,
  AutomationSettingsPanel,
  EnergySettingsPanel,
  BackupSettingsPanel
} from '@/components/settings';
import { getSettings, updateSettings, resetSettings, exportSettings, importSettings } from '@/lib/apis';
import { SystemSettings } from '@/lib/types';

type SettingsTab = 
  | 'general' 
  | 'security' 
  | 'notifications' 
  | 'network' 
  | 'automation' 
  | 'energy' 
  | 'backup';

interface TabConfig {
  id: SettingsTab;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

const settingsTabs: TabConfig[] = [
  { 
    id: 'general', 
    name: 'Основни', 
    icon: User, 
    description: 'Общи настройки и персонализация',
    color: 'blue'
  },
  { 
    id: 'security', 
    name: 'Сигурност', 
    icon: Shield, 
    description: 'Защита и контрол на достъпа',
    color: 'green'
  },
  { 
    id: 'notifications', 
    name: 'Известия', 
    icon: Bell, 
    description: 'Алерти и уведомления',
    color: 'yellow'
  },
  { 
    id: 'network', 
    name: 'Мрежа', 
    icon: Wifi, 
    description: 'Интернет и свързаност',
    color: 'purple'
  },
  { 
    id: 'automation', 
    name: 'Автоматизация', 
    icon: Calendar, 
    description: 'Сценарии и планиране',
    color: 'indigo'
  },
  { 
    id: 'energy', 
    name: 'Енергия', 
    icon: Zap, 
    description: 'Производство и потребление',
    color: 'orange'
  },
  { 
    id: 'backup', 
    name: 'Резервни копия', 
    icon: Database, 
    description: 'Архивиране и възстановяване',
    color: 'gray'
  }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: ({ category, updates }: { category: keyof SystemSettings; updates: any }) =>
      updateSettings(category, updates),
    onMutate: () => setSaveStatus('saving'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
    onError: () => setSaveStatus('error'),
  });

  const resetSettingsMutation = useMutation({
    mutationFn: () => resetSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const exportSettingsMutation = useMutation({
    mutationFn: exportSettings,
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-home-settings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });

  const importSettingsMutation = useMutation({
    mutationFn: importSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const handleSettingsUpdate = (category: keyof SystemSettings, updates: Partial<SystemSettings[keyof SystemSettings]>) => {
    updateSettingsMutation.mutate({ category, updates });
  };

  const handleExport = () => {
    exportSettingsMutation.mutate();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importSettingsMutation.mutate(file);
    }
  };

  const handleReset = () => {
    if (confirm('Сигурни ли сте, че искате да нулирате всички настройки? Това действие не може да бъде отменено.')) {
      resetSettingsMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-xl text-gray-600 mt-4">Зареждане на настройки...</p>
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
          message="Не можем да заредим настройките."
          onRetry={() => refetch()}
        />
      </DashboardLayout>
    );
  }

  const activeTabConfig = settingsTabs.find(tab => tab.id === activeTab);
  
  return (
    <DashboardLayout>
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-xl">
                <Settings className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
                <p className="text-gray-600">Управление на системните конфигурации</p>
              </div>
            </div>

            {/* Save Status Indicator */}
            <div className="flex items-center gap-4">
              {saveStatus === 'saving' && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Записване...</span>
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Записано</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Грешка при записване</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleExport}
              disabled={exportSettingsMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Експорт
            </button>
            
            <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
              <Upload className="w-4 h-4" />
              Импорт
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                disabled={importSettingsMutation.isPending}
              />
            </label>

            <button
              onClick={handleReset}
              disabled={resetSettingsMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Нулиране
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Settings Navigation */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h3 className="text-lg font-semibold text-gray-900">Категории</h3>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-2">
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`flex-shrink-0 p-2 rounded-lg ${
                            isActive ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-4 h-4 ${
                              isActive ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium">{tab.name}</h4>
                            <p className="text-sm text-gray-500 truncate">{tab.description}</p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>

          {/* Settings Panel */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  {activeTabConfig && (
                    <>
                      <div className={`p-2 rounded-lg bg-${activeTabConfig.color}-100`}>
                        <activeTabConfig.icon className={`w-5 h-5 text-${activeTabConfig.color}-600`} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{activeTabConfig.name}</h2>
                        <p className="text-gray-600">{activeTabConfig.description}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="p-8">
                {settings && (
                  <>
                    {activeTab === 'general' && (
                      <GeneralSettingsPanel
                        settings={settings.general}
                        onUpdate={(updates: Partial<SystemSettings['general']>) => handleSettingsUpdate('general', updates)}
                      />
                    )}
                    {activeTab === 'security' && (
                      <SecuritySettingsPanel
                        settings={settings.security}
                        onUpdate={(updates: Partial<SystemSettings['security']>) => handleSettingsUpdate('security', updates)}
                      />
                    )}
                    {activeTab === 'notifications' && (
                      <NotificationSettingsPanel
                        settings={settings.notifications}
                        onUpdate={(updates: Partial<SystemSettings['notifications']>) => handleSettingsUpdate('notifications', updates)}
                      />
                    )}
                    {activeTab === 'network' && (
                      <NetworkSettingsPanel
                        settings={settings.network}
                        onUpdate={(updates: Partial<SystemSettings['network']>) => handleSettingsUpdate('network', updates)}
                      />
                    )}
                    {activeTab === 'automation' && (
                      <AutomationSettingsPanel
                        settings={settings.automation}
                        onUpdate={(updates: Partial<SystemSettings['automation']>) => handleSettingsUpdate('automation', updates)}
                      />
                    )}
                    {activeTab === 'energy' && (
                      <EnergySettingsPanel
                        settings={settings.energy}
                        onUpdate={(updates: Partial<SystemSettings['energy']>) => handleSettingsUpdate('energy', updates)}
                      />
                    )}
                    {activeTab === 'backup' && (
                      <BackupSettingsPanel
                        settings={settings.backup}
                        onUpdate={(updates: Partial<SystemSettings['backup']>) => handleSettingsUpdate('backup', updates)}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
