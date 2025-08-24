// src/components/climate/ClimateStats.tsx
import React from 'react';
import { 
  Thermometer, 
  Zap, 
  Activity, 
  Droplets,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

interface ClimateStatsProps {
  stats: {
    averageTemp: number;
    totalPowerUsage: number;
    activeDevices: number;
    totalDevices: number;
    energyEfficiency: number;
    averageHumidity: number;
    optimalRooms: number;
  };
}

export const ClimateStats: React.FC<ClimateStatsProps> = ({ stats }) => {
  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = 'blue',
    progress 
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    color?: 'blue' | 'green' | 'orange' | 'purple';
    progress?: number;
  }) => {
    const colorClasses = {
      blue: 'from-blue-50 to-cyan-50 border-blue-200 text-blue-700',
      green: 'from-green-50 to-emerald-50 border-green-200 text-green-700',
      orange: 'from-orange-50 to-amber-50 border-orange-200 text-orange-700',
      purple: 'from-purple-50 to-pink-50 border-purple-200 text-purple-700'
    };

    const iconBgColors = {
      blue: 'bg-blue-200 text-blue-700',
      green: 'bg-green-200 text-green-700',
      orange: 'bg-orange-200 text-orange-700',
      purple: 'bg-purple-200 text-purple-700'
    };

    return (
      <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl p-4 border`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconBgColors[color]}`}>
            {icon}
          </div>
          <div className="flex-1">
            <p className={`text-sm ${colorClasses[color]}`}>{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
            {progress !== undefined && (
              <div className="mt-2">
                <div className="w-full bg-white/60 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      color === 'blue' ? 'bg-blue-500' :
                      color === 'green' ? 'bg-green-500' :
                      color === 'orange' ? 'bg-orange-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        title="Средна температура"
        value={stats.averageTemp.toFixed(1)}
        subtitle="°C в дома"
        icon={<Thermometer className="w-5 h-5" />}
        color="blue"
      />
      
      <StatCard
        title="Общо потребление"
        value={stats.totalPowerUsage}
        subtitle="W активно"
        icon={<Zap className="w-5 h-5" />}
        color="orange"
      />
      
      <StatCard
        title="Активни устройства"
        value={`${stats.activeDevices}/${stats.totalDevices}`}
        subtitle="в момента"
        icon={<Activity className="w-5 h-5" />}
        color="green"
        progress={(stats.activeDevices / stats.totalDevices) * 100}
      />
      
      <StatCard
        title="Средна влажност"
        value={stats.averageHumidity}
        subtitle="% в дома"
        icon={<Droplets className="w-5 h-5" />}
        color="blue"
        progress={stats.averageHumidity}
      />
      
      <StatCard
        title="Енергийна ефективност"
        value={stats.energyEfficiency}
        subtitle="% оптимално"
        icon={<TrendingUp className="w-5 h-5" />}
        color="green"
        progress={stats.energyEfficiency}
      />
      
      <StatCard
        title="Оптимални стаи"
        value={stats.optimalRooms}
        subtitle="комфортни"
        icon={<CheckCircle className="w-5 h-5" />}
        color="purple"
      />
    </div>
  );
};