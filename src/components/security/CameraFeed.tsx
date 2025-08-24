// src/components/security/CameraFeed.tsx
'use client';

import React from 'react';
import { 
  Camera,
  Play,
  Pause,
  Eye,
  EyeOff,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Moon,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

interface CameraDevice {
  id: number;
  name: string;
  room: string;
  roomName: string;
  status: 'recording' | 'standby' | 'privacy';
  isOnline: boolean;
  resolution: string;
  nightVision: boolean;
  motionDetection: boolean;
  hasAlert: boolean;
  lastMotion: string;
}

interface CameraFeedProps {
  camera: CameraDevice;
  showFeed: boolean;
  onAction: (action: string) => void;
  isLoading?: boolean;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  camera,
  showFeed,
  onAction,
  isLoading = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recording': return 'bg-red-50 border-red-200';
      case 'standby': return 'bg-green-50 border-green-200';
      case 'privacy': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'recording': return 'Записване';
      case 'standby': return 'В готовност';
      case 'privacy': return 'Поверителност';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'recording': 
        return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>;
      case 'standby': 
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
      case 'privacy': 
        return <EyeOff className="w-3 h-3 text-gray-500" />;
      default: 
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  return (
    <div className={`rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-md ${
      getStatusColor(camera.status)
    } ${isLoading ? 'opacity-70' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{camera.name}</h3>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">{camera.roomName}</p>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{camera.resolution}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {camera.hasAlert && (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            {camera.isOnline ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {getStatusIcon(camera.status)}
            <span className={`text-sm font-medium ${
              camera.status === 'recording' ? 'text-red-700' :
              camera.status === 'standby' ? 'text-green-700' :
              'text-gray-700'
            }`}>
              {getStatusText(camera.status)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {camera.nightVision && (
              <div className="p-1 bg-purple-100 rounded-md">
                <Moon className="w-3 h-3 text-purple-600" />
              </div>
            )}
            {camera.motionDetection && (
              <div className="p-1 bg-blue-100 rounded-md">
                <Eye className="w-3 h-3 text-blue-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Feed Area */}
      <div className="relative bg-gray-900 aspect-video">
        {showFeed && camera.status !== 'privacy' && camera.isOnline ? (
          <>
            {/* Simulated video feed */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900">
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Live Feed</p>
                </div>
              </div>
            </div>

            {/* Recording indicator */}
            {camera.status === 'recording' && (
              <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/70 px-2 py-1 rounded-md">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-xs">REC</span>
              </div>
            )}

            {/* Timestamp */}
            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded-md">
              <span className="text-white text-xs">
                {new Date().toLocaleString('bg-BG')}
              </span>
            </div>

            {/* Controls overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <div className="flex items-center gap-3">
                <button className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                  {camera.status === 'recording' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              {camera.status === 'privacy' ? (
                <>
                  <EyeOff className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Поверителност активна</p>
                </>
              ) : !camera.isOnline ? (
                <>
                  <WifiOff className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Извън мрежата</p>
                </>
              ) : (
                <>
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Камерата е скрита</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-white/50">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-500">
            Последно движение: {new Date(camera.lastMotion).toLocaleString('bg-BG')}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Volume2 className="w-3 h-3" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
              <Eye className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onAction(camera.status === 'recording' ? 'stop' : 'record')}
            disabled={isLoading || !camera.isOnline}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              camera.status === 'recording' 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {camera.status === 'recording' ? 'Спри' : 'Записвай'}
          </button>
          
          <button
            onClick={() => onAction(camera.status === 'privacy' ? 'unprivacy' : 'privacy')}
            disabled={isLoading}
            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {camera.status === 'privacy' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};