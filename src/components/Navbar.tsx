/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Activity, 
  Send, 
  Radio, 
  Settings, 
  LayoutDashboard, 
  Clock, 
  CheckCircle2,
  Calendar,
  LayoutGrid,
  Truck,
  Users
} from 'lucide-react';
import { ActiveTab, Shift } from '../types.ts';
import { SHIFT_DETAILS } from '../constants.ts';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  shift: Shift;
  formattedDate: string;
  pozActiveCount: number;
  pozTotalCount: number;
  meccActiveCount: number;
  meccTotalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  shift,
  formattedDate,
  pozActiveCount,
  pozTotalCount,
  meccActiveCount,
  meccTotalCount
}) => {
  const totalActive = pozActiveCount + meccActiveCount;
  const totalFleet = pozTotalCount + meccTotalCount;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string; highlight?: boolean }[] = [
    {
      id: 'landing',
      label: 'Utama',
      icon: <LayoutGrid size={18} />,
    },
    {
      id: 'dashboard',
      label: 'Dashboard Ambulans',
      icon: <LayoutDashboard size={18} />,
      badge: `${totalActive}/${totalFleet} Siap`,
      highlight: true
    },
    {
      id: 'poz',
      label: 'POZ Updater',
      icon: <Activity size={18} />,
      badge: `${pozActiveCount}/${pozTotalCount}`
    },
    {
      id: 'mecc',
      label: 'MECC Status',
      icon: <Radio size={18} />,
      badge: `${meccActiveCount}/${meccTotalCount}`
    },
    {
      id: 'responders',
      label: 'Senarai Responder',
      icon: <Users size={18} />
    },
    {
      id: 'settings',
      label: 'Tetapan',
      icon: <Settings size={18} />
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Identity */}
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-md shadow-rose-900/30 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-xl tracking-tight text-white group-hover:text-rose-300 transition-colors uppercase">
                  MECC MANAGEMENT BOARD
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  SEMUA WILAYAH
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide">
                KLANG • BANTING • SHAH ALAM • HASA
              </p>
            </div>
          </div>

          {/* Center / Right: Shift & Info */}
          <div className="hidden md:flex items-center gap-3 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Calendar size={13} className="text-rose-400" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="h-3 w-[1px] bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock size={13} className="text-amber-400" />
              <span>Shift:</span>
              <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-rose-600/30 text-rose-300 border border-rose-500/40">
                {shift} ({SHIFT_DETAILS[shift]?.time})
              </span>
            </div>
          </div>

          {/* Quick Direct Actions & Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40 ring-1 ring-rose-400' 
                      : item.highlight
                      ? 'text-rose-300 bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/40 hover:text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title={item.label}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="hidden md:inline">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold hidden sm:inline-block ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : item.highlight
                        ? 'bg-rose-500/30 text-rose-200 border border-rose-500/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>
      </div>

      {/* Sub-bar for mobile showing shift & date */}
      <div className="md:hidden bg-slate-950 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
        <div className="flex items-center gap-1 truncate">
          <Calendar size={12} className="text-rose-400 shrink-0" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} className="text-amber-400 shrink-0" />
          <span>Shift {shift} ({SHIFT_DETAILS[shift]?.time})</span>
        </div>
      </div>
    </header>
  );
};
