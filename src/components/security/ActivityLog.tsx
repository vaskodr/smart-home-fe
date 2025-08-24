// src/components/security/ActivityLog.tsx
import React from 'react';
import { 
  Activity,
  Lock,
  Unlock,
  Eye,
  AlertTriangle,
  CheckCircle,
  Camera,
  Search
} from 'lucide-react';

interface ActivityItem {
  id: number;
  time: string;
  action: string;
  type: string;
  severity: string;
}

interface ActivityLogProps {
  activities: ActivityItem[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const getActivityIcon = (type: string, severity: string) => {
    const iconClass = `w-4 h-4 ${
      severity === 'error' ? 'text-red-500' :
      severity === 'warning' ? 'text-yellow-500' :
      severity === 'success' ? 'text-green-500' :
      'text-blue-500'
    }`;

    switch (type) {
      case 'lock':
        return <Lock className={iconClass} />;
      case 'unlock':
        return <Unlock className={iconClass} />;
      case 'motion':
        return <Activity className={iconClass} />;
      case 'recording':
        return <Camera className={iconClass} />;
      case 'test':
        return <CheckCircle className={iconClass} />;
      case 'alert':
        return <AlertTriangle className={iconClass} />;
      default:
        return <Eye className={iconClass} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 border-l-red-500';
      case 'warning':
        return 'bg-yellow-100 border-l-yellow-500';
      case 'success':
        return 'bg-green-100 border-l-green-500';
      default:
        return 'bg-blue-100 border-l-blue-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-fit">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Дневник на активността
          </h3>
          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              className={`p-3 rounded-lg border-l-4 ${getSeverityColor(activity.severity)} transition-all hover:shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type, activity.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {activity.action}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      {activity.time}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.severity === 'error' ? 'bg-red-100 text-red-700' :
                      activity.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      activity.severity === 'success' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Показани последните {activities.length} събития
            </span>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Виж всички
            </button>
          </div>
        </div>

        {/* Quick filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors">
            Всички
          </button>
          <button className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200 transition-colors">
            Алерти
          </button>
          <button className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200 transition-colors">
            Движения
          </button>
          <button className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full hover:bg-green-200 transition-colors">
            Заключване
          </button>
        </div>
      </div>
    </div>
  );
};