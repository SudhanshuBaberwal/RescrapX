'use client'

import React from 'react';
import { ChevronDown, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter()
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs backdrop-blur-md">
      {/* max-w-7xl expanded to max-w-full with tight margins to push elements completely to the outer edges */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        
        {/* Left Side: Brand Logo Alignment */}
        <div onClick={() => router.push("/")} className="flex flex-col justify-center select-none">
          <div className="flex items-center gap-1 text-xl font-extrabold text-gray-900 tracking-tight">
            <span className="text-[#0B5B32]">🚗 Rescrap</span>
            <span className="text-[#10B981]">X</span>
          </div>
          <p className="text-[#10B981] text-[9px] font-bold tracking-wider uppercase leading-none mt-0.5">
            Recycle Today, Drive Tomorrow
          </p>
        </div>

        {/* Center: Sleek Navigation Directory */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-600">
          <a href="#" className="text-[#0B5B32] border-b-2 border-[#0B5B32] pb-1 transition duration-150">Home</a>
          <a href="#" className="hover:text-gray-900 transition duration-150">How It Works</a>
          <div className="flex items-center gap-0.5 cursor-pointer hover:text-gray-900 transition duration-150">
            <span>Services</span><ChevronDown size={12} className="opacity-70" />
          </div>
          <div className="flex items-center gap-0.5 cursor-pointer hover:text-gray-900 transition duration-150">
            <span>Resources</span><ChevronDown size={12} className="opacity-70" />
          </div>
          <a href="#" className="hover:text-gray-900 transition duration-150">About Us</a>
          <a href="#" className="hover:text-gray-900 transition duration-150">Contact Us</a>
        </nav>

        {/* Right Side: Consolidated Actions Hub */}
        <div className="flex items-center gap-3">
          
          {/* Notification Alert Icon */}
          <button className="relative p-2 text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-150">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Booking Tracking Shortcut Pill */}
          <button className="hidden sm:flex items-center gap-2 border border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-50 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#0B5B32] transition duration-150">
            <span className="text-xs">📋</span>
            <div className="text-left">
              <p className="leading-tight font-black text-[11px]">My Bookings</p>
              <p className="text-[9px] text-[#10B981] font-medium tracking-wide">Track Status</p>
            </div>
          </button>

          {/* User Profile Container */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-100 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center text-xs font-extrabold text-[#0B5B32] group-hover:bg-emerald-100 transition duration-150">
              S
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-gray-800 group-hover:text-gray-900 transition duration-150">Hi, Shubham</p>
            </div>
            <ChevronDown size={12} className="text-gray-400 group-hover:text-gray-600 transition duration-150" />
          </div>
          
        </div>

      </div>
    </header>
  );
}