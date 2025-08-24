// src/components/energy/EnergyChart.tsx
'use client';

import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface EnergyData {
  hour: number;
  consumption: number;
  generation: number;
  battery: number;
}

interface EnergyChartProps {
  data: EnergyData[];
  timeRange: 'day' | 'week' | 'month';
  title: string;
}

export const EnergyChart: React.FC<EnergyChartProps> = ({ data, timeRange, title }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
          <p className="font-medium text-gray-900 mb-2">
            {timeRange === 'day' ? `${label}:00` : `Ден ${label}`}
          </p>
          {payload.map((entry: any, index: number) => {
            const labels: { [key: string]: string } = {
              consumption: 'Потребление',
              generation: 'Генериране',
              battery: 'Батерия'
            };
            
            return (
              <div key={index} className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{labels[entry.dataKey] || entry.dataKey}</span>
                </div>
                <span className="font-semibold" style={{ color: entry.color }}>
                  {entry.value.toFixed(1)} kW
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const formatXAxisLabel = (tickItem: number) => {
    if (timeRange === 'day') {
      return tickItem < 10 ? `0${tickItem}:00` : `${tickItem}:00`;
    }
    return `Ден ${tickItem + 1}`;
  };

  // Calculate net energy (generation - consumption)
  const enhancedData = data.map(item => ({
    ...item,
    net: item.generation - item.consumption
  }));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Потребление</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Генериране</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Батерия</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={enhancedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="consumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="generation" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="battery" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="hour" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={formatXAxisLabel}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={(value) => `${value} kW`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="2 2" />
              
              <Area 
                type="monotone" 
                dataKey="generation" 
                stroke="#10B981" 
                fillOpacity={1}
                fill="url(#generation)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="consumption" 
                stroke="#F97316" 
                fillOpacity={1}
                fill="url(#consumption)"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="battery" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 0, r: 2 }}
                activeDot={{ r: 4, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-500">Общо потребление</div>
              <div className="text-xl font-bold text-orange-600">
                {data.reduce((sum, item) => sum + item.consumption, 0).toFixed(1)} kWh
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Общо генериране</div>
              <div className="text-xl font-bold text-green-600">
                {data.reduce((sum, item) => sum + item.generation, 0).toFixed(1)} kWh
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Нетен баланс</div>
              <div className={`text-xl font-bold ${
                data.reduce((sum, item) => sum + (item.generation - item.consumption), 0) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {data.reduce((sum, item) => sum + (item.generation - item.consumption), 0) >= 0 ? '+' : ''}
                {data.reduce((sum, item) => sum + (item.generation - item.consumption), 0).toFixed(1)} kWh
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};