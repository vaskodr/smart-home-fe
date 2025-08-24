// src/components/layout/SidebarUserProfile.tsx
'use client';

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronUp, 
  Shield,
  Moon,
  Sun
} from 'lucide-react';

export const SidebarUserProfile: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock user data
  const user = {
    name: 'Васил Василев',
    email: 'vasil@smarthome.bg',
    role: 'Admin',
    avatar: null, // Could be URL to avatar image
    isOnline: true
  };

  return (
    <div className="border-t border-slate-700">
      {/* Main Profile Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-3 hover:bg-slate-800 transition-colors"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-slate-300" />
            )}
          </div>
          {user.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
          )}
        </div>
        
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-white truncate">{user.name}</p>
          <p className="text-xs text-slate-400 truncate">{user.role}</p>
        </div>
        
        <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform ${
          isExpanded ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Expanded Menu */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-slate-700/50">
          <div className="py-2">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">
              Профил
            </p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>

          {/* Profile Menu Items */}
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
            <User className="w-4 h-4" />
            Моят профил
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
            <Shield className="w-4 h-4" />
            Сигурност
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
            <Settings className="w-4 h-4" />
            Предпочитания
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              Тема
            </div>
            <span className="text-xs text-slate-500">
              {isDarkMode ? 'Тъмна' : 'Светла'}
            </span>
          </button>

          <div className="border-t border-slate-700/50 pt-2 mt-2">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors">
              <LogOut className="w-4 h-4" />
              Изход
            </button>
          </div>
        </div>
      )}
    </div>
  );
};