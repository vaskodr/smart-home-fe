// src/components/energy/EnergyStats.tsx
import React from 'react';
import { 
  Zap, 
  Sun,
  TrendingUp,
  DollarSign,
  Leaf,
  Target
} from 'lucide-react';

interface EnergyStatsProps {
  stats: {
    consumption: number;
    generation: number;
    exported: number;
    savings: number;
    carbonReduced: number;
  };
  goals: {
    monthlyTarget: number;
    currentProgress: number;
    carbonTarget: number;
    carbonProgress: number;
    savingsTarget: number;
    savingsProgress: number;
  };
}

export const EnergyStats: React.FC<EnergyStatsProps> = ({ stats, goals }) => {
  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = 'blue',
    progress,
    target 
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
    progress?: number;
    target?: number;
  }) => {
    const colorClasses = {
      blue: 'from-blue-50 to-cyan-50 border-blue-200',
      green: 'from-green-50 to-emerald-50 border-green-200', 
      orange: 'from-orange-50 to-yellow-50 border-orange-200',
      purple: 'from-purple-50 to-pink-50 border-purple-200',
      red: 'from-red-50 to-pink-50 border-red-200'
    };

    const iconColors = {
      blue: 'bg-blue-200 text-blue-700',
      green: 'bg-green-200 text-green-700',
      orange: 'bg-orange-200 text-orange-700', 
      purple: 'bg-purple-200 text-purple-700',
      red: 'bg-red-200 text-red-700'
    };

    const progressColors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500', 
      red: 'bg-red-500'
    };

    const progressPercent = progress && target ? Math.min((progress / target) * 100, 100) : 0;

    return (
      <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl p-4 border`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`p-2 rounded-lg ${iconColors[color]}`}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        
        {progress !== undefined && target !== undefined && (
          <div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Цел: {target}</span>
              <span>{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/60 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${progressColors[color]}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        title="Потребление този месец"
        value={stats.consumption}
        subtitle="kWh общо"
        icon={<Zap className="w-5 h-5" />}
        color="orange"
        progress={goals.currentProgress}
        target={goals.monthlyTarget}
      />
      
      <StatCard
        title="Произведена енергия"
        value={stats.generation}
        subtitle="kWh от слънце"
        icon={<Sun className="w-5 h-5" />}
        color="green"
      />
      
      <StatCard
        title="Експортирана енергия"
        value={stats.exported}
        subtitle="kWh в мрежата"
        icon={<TrendingUp className="w-5 h-5" />}
        color="blue"
      />
      
      <StatCard
        title="Спестени разходи"
        value={`${stats.savings} лв`}
        subtitle="този месец"
        icon={<DollarSign className="w-5 h-5" />}
        color="purple"
        progress={goals.savingsProgress}
        target={goals.savingsTarget}
      />
      
      <StatCard
        title="Намален CO₂"
        value={`${stats.carbonReduced} kg`}
        subtitle="въглеродни емисии"
        icon={<Leaf className="w-5 h-5" />}
        color="green"
        progress={goals.carbonProgress}
        target={goals.carbonTarget}
      />
      
      <StatCard
        title="Ефективност"
        value={`${Math.round((stats.generation / stats.consumption) * 100)}%`}
        subtitle="енергийна независимост"
        icon={<Target className="w-5 h-5" />}
        color={stats.generation > stats.consumption ? 'green' : 
               stats.generation > stats.consumption * 0.7 ? 'orange' : 'red'}
      />
    </div>
  );
};