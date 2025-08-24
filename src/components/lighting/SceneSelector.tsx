// src/components/lighting/SceneSelector.tsx
'use client';

import React from 'react';
import { Play, Loader2 } from 'lucide-react';

interface Scene {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  lightsCount: number;
}

interface SceneSelectorProps {
  scenes: Scene[];
  onSceneSelect: (sceneId: string) => void;
  isLoading: boolean;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({
  scenes,
  onSceneSelect,
  isLoading
}) => {
  const getSceneGradient = (sceneId: string) => {
    switch (sceneId) {
      case 'morning': return 'from-orange-100 to-yellow-100';
      case 'work': return 'from-blue-100 to-cyan-100';
      case 'evening': return 'from-purple-100 to-pink-100';
      case 'night': return 'from-indigo-100 to-purple-100';
      default: return 'from-gray-100 to-gray-200';
    }
  };

  const getSceneAccent = (sceneId: string) => {
    switch (sceneId) {
      case 'morning': return 'border-orange-400 bg-orange-50';
      case 'work': return 'border-blue-400 bg-blue-50';
      case 'evening': return 'border-purple-400 bg-purple-50';
      case 'night': return 'border-indigo-400 bg-indigo-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Сценарии</h2>
          <div className="text-sm text-gray-500">
            Бързо активиране на режими
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenes.map((scene) => {
            const Icon = scene.icon;
            
            return (
              <button
                key={scene.id}
                onClick={() => !isLoading && onSceneSelect(scene.id)}
                disabled={isLoading}
                className={`group relative p-6 rounded-xl transition-all duration-300 text-left ${
                  scene.active
                    ? `border-2 ${getSceneAccent(scene.id)} shadow-lg scale-105`
                    : 'border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
                } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-102'}`}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${getSceneGradient(scene.id)} opacity-20`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg transition-all duration-300 ${
                      scene.active 
                        ? 'bg-white shadow-sm' 
                        : 'bg-white/70 group-hover:bg-white group-hover:shadow-sm'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        scene.id === 'morning' ? 'text-orange-600' :
                        scene.id === 'work' ? 'text-blue-600' :
                        scene.id === 'evening' ? 'text-purple-600' :
                        scene.id === 'night' ? 'text-indigo-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    
                    {scene.active && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-green-600">Активен</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{scene.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{scene.lightsCount} устройства</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        {scene.active ? 'Работи сега' : 'Готов за активиране'}
                      </div>
                      
                      <div className={`p-2 rounded-full transition-all duration-300 ${
                        scene.active
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
                      }`}>
                        {isLoading && scene.active ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ripple effect when active */}
                {scene.active && (
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Активен сценарий: <span className="font-medium">
                {scenes.find(s => s.active)?.name || 'Няма'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                disabled={isLoading}
              >
                Редактирай
              </button>
              <button 
                className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                disabled={isLoading}
              >
                Нов сценарий
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};