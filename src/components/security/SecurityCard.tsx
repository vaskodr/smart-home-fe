// src/components/security/SecurityCard.tsx
'use client';

import React from 'react';
import { 
  Lock, 
  Unlock,
  Eye,
  Flame,
  Activity,
  Wifi,
  WifiOff,
  Battery,
  AlertTriangle,
  CheckCircle,
  Home
} from 'lucide-react';

interface SecurityDevice {
  id: number;
  name: string;
  type: 'door_lock' | 'window_sensor' | 'motion_sensor' | 'smoke_detector' | 'glass_sensor';
  room: string;
  roomName: string;
  status: 'locked' | 'unlocked' | 'closed' | 'open' | 'active' | 'inactive' | 'normal' | 'alert';
  batteryLevel: number;
  lastActivity: string;
  isOnline: boolean;
  hasAlert: boolean;
}

interface SecurityCardProps {
  device: SecurityDevice;
  onAction: (action: string) => void;
  isLoading?: boolean;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({
  device,
  onAction,
  isLoading = false
}) => {
  const getDeviceIcon = (type: string, status: string) => {
    switch (type) {
      case 'door_lock':
        return status === 'locked' ? 
          <Lock className="w-5 h-5 text-green-600" /> : 
          <Unlock className="w-5 h-5 text-red-600" />;
      case 'window_sensor':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'motion_sensor':
        return <Activity className="w-5 h-5 text-purple-600" />;
      case 'smoke_detector':
        return <Flame className="w-5 h-5 text-orange-600" />;
      case 'glass_sensor':
        return <Eye className="w-5 h-5 text-cyan-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (type: string, status: string, hasAlert: boolean) => {
    if (hasAlert) return 'bg-red-50 border-red-200';
    if (!device.isOnline) return 'bg-gray-50 border-gray-300';
    
    switch (type) {
      case 'door_lock':
        return status === 'locked' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200';
      case 'motion_sensor':
        return status === 'active' ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200';
      case 'smoke_detector':
        return status === 'normal' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
      default:
        return status === 'closed' || status === 'normal' ? 
          'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200';
    }
  };

  const getStatusText = (type: string, status: string) => {
    const statusMap: { [key: string]: { [key: string]: string } } = {
      door_lock: { locked: 'Заключена', unlocked: 'Отключена' },
      window_sensor: { closed: 'Затворен', open: 'Отворен' },
      motion_sensor: { active: 'Движение', inactive: 'Без движение' },
      smoke_detector: { normal: 'Нормално', alert: 'ТРЕВОГА' },
      glass_sensor: { normal: 'Нормално', alert: 'Счупване' }
    };
    
    return statusMap[type]?.[status] || status;
  };

  const getBatteryIcon = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getActionButton = (type: string, status: string) => {
    switch (type) {
      case 'door_lock':
        return {
          text: status === 'locked' ? 'Отключи' : 'Заключи',
          action: status === 'locked' ? 'unlock' : 'lock',
          color: status === 'locked' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        };
      case 'motion_sensor':
        return {
          text: status === 'active' ? 'Деактивирай' : 'Активирай',
          action: status === 'active' ? 'deactivate' : 'activate',
          color: 'bg-purple-600 hover:bg-purple-700'
        };
      default:
        return {
          text: 'Тест',
          action: 'test',
          color: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const actionButton = getActionButton(device.type, device.status);

  return (
    <div className={`rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-md ${
      getStatusColor(device.type, device.status, device.hasAlert)
    } ${isLoading ? 'opacity-70' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            {getDeviceIcon(device.type, device.status)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{device.name}</h3>
            <p className="text-xs text-gray-500">{device.roomName}</p>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-2">
          {device.hasAlert && (
            <div className="p-1 bg-red-100 rounded-full">
              <AlertTriangle className="w-3 h-3 text-red-600" />
            </div>
          )}
          {device.isOnline ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
          device.hasAlert ? 'bg-red-100 text-red-800' :
          device.status === 'locked' || device.status === 'closed' || device.status === 'normal' ?
            'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {getStatusText(device.type, device.status)}
        </div>
      </div>

      {/* Battery and last activity */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Battery className={`w-4 h-4 ${getBatteryIcon(device.batteryLevel)}`} />
            <span className="text-gray-600">Батерия</span>
          </div>
          <span className={`font-medium ${getBatteryIcon(device.batteryLevel)}`}>
            {device.batteryLevel}%
          </span>
        </div>
        
        <div className="text-xs text-gray-500">
          Последна активност: {new Date(device.lastActivity).toLocaleString('bg-BG')}
        </div>
      </div>

      {/* Battery level bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            device.batteryLevel > 50 ? 'bg-green-500' :
            device.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${device.batteryLevel}%` }}
        ></div>
      </div>

      {/* Action button */}
      <button
        onClick={() => onAction(actionButton.action)}
        disabled={isLoading || !device.isOnline}
        className={`w-full py-2 px-4 rounded-lg text-white text-sm font-medium transition-colors ${
          actionButton.color
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? 'Изпълнява се...' : actionButton.text}
      </button>
    </div>
  );
};