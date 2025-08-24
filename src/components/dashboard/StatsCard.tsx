// src/components/dashboard/StatsCard.tsx - Improved Design
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'orange' | 'purple';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
  className = ''
}) => {
  const colorClasses = {
    blue: {
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trendPositive: 'text-emerald-600',
      trendNegative: 'text-red-500'
    },
    green: {
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      trendPositive: 'text-emerald-600',
      trendNegative: 'text-red-500'
    },
    yellow: {
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      trendPositive: 'text-emerald-600',
      trendNegative: 'text-red-500'
    },
    red: {
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      trendPositive: 'text-emerald-600',
      trendNegative: 'text-red-500'
    },
    orange: {
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      trendPositive: 'text-emerald-600',
      trendNegative: 'text-red-500'
    },
    purple: {
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trendPositive: 'text-emerald-600',
      trendNegative: 'text-red-500'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            {icon && (
              <div className={`p-2.5 rounded-lg ${colors.iconBg}`}>
                <div className={colors.iconColor}>
                  {icon}
                </div>
              </div>
            )}
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          
          {/* Value */}
          <div className="mb-2">
            <p className="text-3xl font-bold text-gray-900 leading-none">{value}</p>
          </div>
          
          {/* Subtitle and Trend */}
          <div className="flex items-center justify-between">
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
            
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                trend.isPositive ? colors.trendPositive : colors.trendNegative
              }`}>
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};