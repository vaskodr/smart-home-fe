// src/components/lighting/RoomSelector.tsx
'use client';

import React from 'react';
import { Home, Users, Bed, ChefHat, Bath, Briefcase, Navigation } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  deviceCount: number;
}

interface Light {
  room: string;
  status: boolean;
  powerUsage: number;
}

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoom: string;
  onRoomSelect: (roomId: string) => void;
  lights: Light[];
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({
  rooms,
  selectedRoom,
  onRoomSelect,
  lights
}) => {
  const getRoomIcon = (roomId: string) => {
    switch (roomId) {
      case 'all': return Home;
      case 'living': return Users;
      case 'bedroom': return Bed;
      case 'kitchen': return ChefHat;
      case 'bathroom': return Bath;
      case 'office': return Briefcase;
      case 'hallway': return Navigation;
      default: return Home;
    }
  };

  const getRoomStats = (roomId: string) => {
    const roomLights = roomId === 'all' ? lights : lights.filter(l => l.room === roomId);
    const activeLights = roomLights.filter(l => l.status);
    const totalPower = roomLights.reduce((sum, light) => sum + (light.status ? light.powerUsage : 0), 0);
    
    return {
      active: activeLights.length,
      total: roomLights.length,
      power: totalPower
    };
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-xl font-semibold text-gray-900">Стаи</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {rooms.map((room) => {
            const Icon = getRoomIcon(room.id);
            const stats = getRoomStats(room.id);
            const isSelected = selectedRoom === room.id;
            const hasActiveLights = stats.active > 0;
            
            return (
              <button
                key={room.id}
                onClick={() => onRoomSelect(room.id)}
                className={`group relative p-4 rounded-xl transition-all duration-300 text-left ${
                  isSelected
                    ? 'bg-blue-50 border-2 border-blue-500 shadow-lg scale-105'
                    : 'bg-gray-50 border-2 border-transparent hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Active lights indicator */}
                {hasActiveLights && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}

                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`p-3 rounded-lg transition-all duration-300 ${
                    isSelected 
                      ? 'bg-blue-100' 
                      : hasActiveLights 
                        ? 'bg-yellow-100 group-hover:bg-yellow-200'
                        : 'bg-gray-200 group-hover:bg-gray-300'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isSelected 
                        ? 'text-blue-600' 
                        : hasActiveLights 
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div>
                    <h3 className={`font-medium text-sm ${
                      isSelected ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {room.name}
                    </h3>
                    
                    <div className="space-y-1">
                      <p className={`text-xs ${
                        isSelected ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {stats.active}/{stats.total} активни
                      </p>
                      
                      {stats.power > 0 && (
                        <p className={`text-xs ${
                          isSelected ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {stats.power}W
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500/10 rounded-xl animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Room summary */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {selectedRoom === 'all' ? 'Всички стаи' : rooms.find(r => r.id === selectedRoom)?.name}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                {getRoomStats(selectedRoom).active} от {getRoomStats(selectedRoom).total} лампи
              </span>
              <span className="font-medium text-gray-900">
                {getRoomStats(selectedRoom).power}W общо
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};