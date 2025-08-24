// src/components/climate/TemperatureChart.tsx
'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TemperatureData {
  time: string;
  living: number;
  bedroom: number;
  office: number;
  outdoor: number;
}

interface TemperatureChartProps {
  data: TemperatureData[];
  title: string;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, title }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{`Час: ${label}`}</p>
          {payload.map((entry: any, index: number) => {
            const roomNames: { [key: string]: string } = {
              living: 'Хол',
              bedroom: 'Спалня', 
              office: 'Офис',
              outdoor: 'Навън'
            };
            
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {`${roomNames[entry.dataKey] || entry.dataKey}: ${entry.value.toFixed(1)}°C`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const formatXAxisLabel = (tickItem: string) => {
    return tickItem.split(':')[0] + 'h';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="time" 
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
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              <Line 
                type="monotone" 
                dataKey="living" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="bedroom" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="office" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ fill: '#F59E0B', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: '#F59E0B', strokeWidth: 2, fill: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="outdoor" 
                stroke="#6B7280" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#6B7280', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: '#6B7280', strokeWidth: 2, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Хол</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Спалня</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Офис</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-gray-500" style={{ borderTop: '2px dashed #6B7280' }}></div>
            <span className="text-sm text-gray-600">Навън</span>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-sm text-gray-500">Най-висока</div>
            <div className="text-lg font-semibold text-gray-900">
              {Math.max(...data.flatMap(d => [d.living, d.bedroom, d.office])).toFixed(1)}°C
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Най-ниска</div>
            <div className="text-lg font-semibold text-gray-900">
              {Math.min(...data.flatMap(d => [d.living, d.bedroom, d.office])).toFixed(1)}°C
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};