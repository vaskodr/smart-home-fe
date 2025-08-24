// src/components/security/SecurityStats.tsx
import React from 'react';
import { 
  Shield, 
  Eye, 
  Wifi,
  Battery,
  AlertTriangle,
  Activity
} from 'lucide-react';

interface SecurityStatsProps {
  stats: {
    totalDevices: number;
    onlineDevices: number;
    activeAlerts: number;
    recordingCameras: number;
    averageBattery: number;
    systemStatus: 'armed' | 'partial' | 'disarmed';
  };
}

export const SecurityStats: React.FC<SecurityStatsProps> = ({ stats }) => {
  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = 'blue',
    alert = false 
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
    alert?: boolean;
  }) => {
    const colorClasses = {
      blue: alert ? 'from-blue-50 to-red-50 border-red-200' : 'from-blue-50 to-cyan-50 border-blue-200',
      green: 'from-green-50 to-emerald-50 border-green-200',
      red: 'from-red-50 to-pink-50 border-red-200',
      orange: 'from-orange-50 to-yellow-50 border-orange-200',
      purple: 'from-purple-50 to-pink-50 border-purple-200'
    };

    const iconColors = {
      blue: alert ? 'bg-red-200 text-red-700' : 'bg-blue-200 text-blue-700',
      green: 'bg-green-200 text-green-700',
      red: 'bg-red-200 text-red-700',
      orange: 'bg-orange-200 text-orange-700',
      purple: 'bg-purple-200 text-purple-700'
    };

    const textColors = {
      blue: alert ? 'text-red-700' : 'text-blue-700',
      green: 'text-green-700',
      red: 'text-red-700',
      orange: 'text-orange-700',
      purple: 'text-purple-700'
    };

    return (
      <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl p-4 border relative`}>
        {alert && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconColors[color]}`}>
            {icon}
          </div>
          <div>
            <p className={`text-sm font-medium ${textColors[color]}`}>{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        title="Системен статус"
        value={stats.systemStatus === 'armed' ? 'Активен' : 
               stats.systemStatus === 'partial' ? 'Частичен' : 'Изключен'}
        subtitle="режим на охрана"
        icon={<Shield className="w-5 h-5" />}
        color={stats.systemStatus === 'armed' ? 'red' : 
               stats.systemStatus === 'partial' ? 'orange' : 'green'}
      />
      
      <StatCard
        title="Онлайн устройства"
        value={`${stats.onlineDevices}/${stats.totalDevices}`}
        subtitle="свързани"
        icon={<Wifi className="w-5 h-5" />}
        color="green"
      />
      
      <StatCard
        title="Активни алерти"
        value={stats.activeAlerts}
        subtitle="изискват внимание"
        icon={<AlertTriangle className="w-5 h-5" />}
        color="blue"
        alert={stats.activeAlerts > 0}
      />
      
      <StatCard
        title="Записващи камери"
        value={stats.recordingCameras}
        subtitle="активно записване"
        icon={<Eye className="w-5 h-5" />}
        color="purple"
      />
      
      <StatCard
        title="Средна батерия"
        value={`${stats.averageBattery}%`}
        subtitle="всички устройства"
        icon={<Battery className="w-5 h-5" />}
        color={stats.averageBattery > 60 ? 'green' : stats.averageBattery > 30 ? 'orange' : 'red'}
      />
      
      <StatCard
        title="Системна активност"
        value="Нормална"
        subtitle="без инциденти"
        icon={<Activity className="w-5 h-5" />}
        color="green"
      />
    </div>
  );
};