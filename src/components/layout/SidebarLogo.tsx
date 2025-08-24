// src/components/layout/SidebarLogo.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Home, X } from 'lucide-react';

interface SidebarLogoProps {
  onClose: () => void;
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-700">
      <Link href="/dashboard" className="flex items-center gap-3 group">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
          <Home className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
            Smart Home
          </span>
          <span className="text-xs text-slate-400 -mt-0.5">Control Panel</span>
        </div>
      </Link>
      
      <button 
        onClick={onClose}
        className="lg:hidden p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};