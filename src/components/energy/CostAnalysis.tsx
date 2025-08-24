// src/components/energy/CostAnalysis.tsx
import React from 'react';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap
} from 'lucide-react';

interface CostAnalysisProps {
  monthlyStats: {
    consumption: number;
    generation: number;
    exported: number;
    savings: number;
    carbonReduced: number;
  };
  tariffs: {
    current: 'flat' | 'time_of_use';
    currentRate: number;
    peakRate: number;
    offPeakRate: number;
    exportRate: number;
  };
}

export const CostAnalysis: React.FC<CostAnalysisProps> = ({ monthlyStats, tariffs }) => {
  // Calculate costs
  const gridConsumptionCost = (monthlyStats.consumption - monthlyStats.generation) > 0 
    ? (monthlyStats.consumption - monthlyStats.generation) * tariffs.currentRate 
    : 0;
  
  const exportRevenue = monthlyStats.exported * tariffs.exportRate;
  const totalBill = Math.max(0, gridConsumptionCost - exportRevenue);
  const withoutSolar = monthlyStats.consumption * tariffs.currentRate;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-fit">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Финансов анализ
        </h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Current Bill */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700 mb-1">
              {totalBill.toFixed(2)} лв
            </div>
            <div className="text-sm text-green-600">Текуща сметка за месеца</div>
            <div className="flex items-center justify-center gap-1 mt-2 text-sm text-green-600">
              <TrendingDown className="w-4 h-4" />
              Спестявате {monthlyStats.savings} лв
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Разбивка на разходите:</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">Мрежово потребление</span>
              </div>
              <span className="font-semibold text-red-700">
                {gridConsumptionCost.toFixed(2)} лв
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Експортни приходи</span>
              </div>
              <span className="font-semibold text-green-700">
                -{exportRevenue.toFixed(2)} лв
              </span>
            </div>

            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Крайна сметка</span>
                <span className="text-lg font-bold text-gray-900">
                  {totalBill.toFixed(2)} лв
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Comparison */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">Без слънчеви панели:</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Месечна сметка щеше да е:</span>
              <span className="font-semibold text-blue-900">{withoutSolar.toFixed(2)} лв</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Спестени пари:</span>
              <span className="font-semibold text-green-600">
                {(withoutSolar - totalBill).toFixed(2)} лв
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Спестен процент:</span>
              <span className="font-semibold text-green-600">
                {((1 - totalBill / withoutSolar) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Tariff Information */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Тарифи:</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Пикова тарифа</span>
              </div>
              <span className="text-sm font-medium">{tariffs.peakRate.toFixed(3)} лв/kWh</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Извън пикова</span>
              </div>
              <span className="text-sm font-medium">{tariffs.offPeakRate.toFixed(3)} лв/kWh</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700">Експорт</span>
              </div>
              <span className="text-sm font-medium">{tariffs.exportRate.toFixed(3)} лв/kWh</span>
            </div>
          </div>
        </div>

        {/* Annual Projection */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-3">Годишна прогноза:</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-700">Спестени разходи:</span>
              <span className="font-semibold text-purple-900">
                {(monthlyStats.savings * 12).toFixed(0)} лв
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-700">Намален CO₂:</span>
              <span className="font-semibold text-purple-900">
                {(monthlyStats.carbonReduced * 12 / 1000).toFixed(1)} тона
              </span>
            </div>
          </div>
        </div>

        {/* ROI Information */}
        <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="text-sm text-yellow-700 mb-1">Възвръщаемост на инвестицията</div>
          <div className="text-xl font-bold text-yellow-900">~7.2 години</div>
          <div className="text-xs text-yellow-600 mt-1">
            При текущите спестявания
          </div>
        </div>
      </div>
    </div>
  );
};