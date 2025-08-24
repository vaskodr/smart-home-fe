// src/components/layout/SidebarNavigation.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Lightbulb, 
  Thermometer, 
  Shield, 
  Zap, 
  Settings,
  BarChart3,
  Calendar,
  Bell
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  description?: string;
}

interface SidebarNavigationProps {
  currentPath: string;
  onNavigate: () => void;
}

const navigationItems: NavigationItem[] = [
  { 
    name: 'Табло', 
    href: '/dashboard', 
    icon: Home,
    description: 'Общ преглед'
  },
  { 
    name: 'Осветление', 
    href: '/dashboard/lighting', 
    icon: Lightbulb,
    description: 'Контрол на лампите'
  },
  { 
    name: 'Климат', 
    href: '/dashboard/climate', 
    icon: Thermometer,
    description: 'Температура и влажност'
  },
  { 
    name: 'Сигурност', 
    href: '/dashboard/security', 
    icon: Shield,
    description: 'Камери и сензори',
    badge: 2
  },
  { 
    name: 'Енергия', 
    href: '/dashboard/energy', 
    icon: Zap,
    description: 'Потребление и производство'
  },
  { 
    name: 'Аналитика', 
    href: '/dashboard/analytics', 
    icon: BarChart3,
    description: 'Статистики и отчети'
  },
  { 
    name: 'Автоматизация', 
    href: '/dashboard/automation', 
    icon: Calendar,
    description: 'Сценарии и планиране'
  },
  { 
    name: 'Известия', 
    href: '/dashboard/notifications', 
    icon: Bell,
    description: 'Алерти и уведомления',
    badge: 3
  },
  { 
    name: 'Настройки', 
    href: '/dashboard/settings', 
    icon: Settings,
    description: 'Системни настройки'
  },
];

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ 
  currentPath, 
  onNavigate 
}) => {
  const pathname = usePathname();
  
  return (
    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <div className={`flex-shrink-0 ${
              isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="truncate">{item.name}</span>
                {item.badge && item.badge > 0 && (
                  <span className={`inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
              {item.description && (
                <p className={`text-xs mt-0.5 truncate ${
                  isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-400'
                }`}>
                  {item.description}
                </p>
              )}
            </div>
            
            {/* Active indicator */}
            {isActive && (
              <div className="absolute right-0 w-0.5 h-full bg-white rounded-l-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};