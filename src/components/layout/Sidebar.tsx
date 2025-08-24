// src/components/layout/Sidebar.tsx - Fixed
'use client';

import React from 'react';
import { SidebarLogo } from './SidebarLogo';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarUserProfile } from './SidebarUserProfile';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  currentPath = '/dashboard' 
}) => {
  return (
    <div className={`h-full flex flex-col bg-slate-900 ${
      isOpen ? 'block' : 'hidden lg:block'
    }`}>
      {/* Logo Section */}
      <SidebarLogo onClose={onClose} />
      
      {/* Navigation - Flexible height */}
      <div className="flex-1 overflow-y-auto">
        <SidebarNavigation currentPath={currentPath} onNavigate={onClose} />
      </div>
      
      {/* User Profile Section - Fixed at bottom */}
      <div className="flex-shrink-0">
        <SidebarUserProfile />
      </div>
    </div>
  );
};