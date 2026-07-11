'use client';

import React from 'react';
import { Menu, Search, Bell, CalendarDays, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function PartnerNavbar({ onMenuToggle }: NavbarProps) {
  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 w-full text-xs shrink-0 z-10">
      
      {/* Left: Mobile Trigger + Greetings text */}
      <div className="flex items-center gap-3 min-w-0">
        <button 
          onClick={onMenuToggle}
          type="button"
          className="text-gray-500 hover:text-gray-700 lg:hidden p-1.5 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer shrink-0"
          aria-label="Open side menu"
        >
          <Menu size={20} />
        </button>
        <div className="space-y-0.5 truncate">
          <h2 className="text-sm sm:text-base font-black text-gray-900 tracking-tight">Dashboard</h2>
          <p className="text-gray-400 font-bold text-[10px] hidden sm:block truncate">Welcome back, GreenAuto Recyclers Pvt. Ltd.</p>
        </div>
      </div>

      {/* Middle: Desktop Global Search Input Layout */}
      <div className="hidden lg:flex items-center relative max-w-xs xl:max-w-md w-full">
        <Search className="absolute left-3 text-gray-400" size={13} />
        <input 
          type="text" 
          placeholder="Search vehicles, orders, bids..." 
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-700 font-medium focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0B5B32] transition-all placeholder-gray-400"
        />
      </div>

      {/* Right: Actions Triggers Strip */}
      <div className="flex items-center gap-3 shrink-0">
        <button className="relative w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all">
          <Bell size={15} />
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-black text-[8px] px-1 rounded-full border-2 border-white">12</span>
        </button>

        <div className="hidden xs:flex items-center gap-2 border-l border-gray-100 pl-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0B5B32] font-black flex items-center justify-center text-[10px]">GA</div>
        </div>

        <button className="bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-1.5 font-black text-gray-700 shadow-3xs transition-all text-[11px]">
          <CalendarDays size={13} className="text-[#0B5B32]" />
          <span>8 July 2026</span>
          <ChevronDown size={11} className="text-gray-400" />
        </button>
      </div>

    </header>
  );
}