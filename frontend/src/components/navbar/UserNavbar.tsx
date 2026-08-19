'use client'

import React from 'react';
import Image from 'next/image';
import { ChevronDown, Bell, LogIn, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Navbar() {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);

  // Extract user full name or first initial if available
  const fullName = userData?.fullName || userData?.fullName || 'User';
  const firstInitial = fullName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs backdrop-blur-md">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">

        {/* Left Side: RescrapX Official Image Logo */}
        <div 
          onClick={() => router.push('/')} 
          className="flex items-center cursor-pointer select-none py-1 h-full overflow-visible"
        >
          <div className="w-auto relative w-60 sm:w-52 h-14 flex items-center">
            <Image
              src="/logo2.png"
              alt="RescrapX Logo"
              fill
              priority
              className="object-contain scale-175 sm:scale-200 origin-left"
            />
          </div>
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
          <a href="#" className="hover:text-gray-900 transition duration-150">FAQs</a>
        </nav>

        {/* Right Side: Actions Hub */}
        <div className="flex items-center gap-3">

          {/* Notification Alert Icon */}
          <button className="relative p-2 text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-150">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Booking Tracking Shortcut Pill */}
          <button 
            onClick={() => router.push('/?tab=bookings')}
            className="hidden sm:flex items-center gap-2 border border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-50 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#0B5B32] transition duration-150"
          >
            <span className="text-xs">📋</span>
            <div className="text-left">
              <p className="leading-tight font-black text-[11px]">My Bookings</p>
              <p className="text-[9px] text-[#10B981] font-medium tracking-wide">Track Status</p>
            </div>
          </button>

          {/* User Profile or Login CTA */}
          {userData ? (
            <div 
              onClick={() => router.push('/?tab=overview')}
              className="flex items-center gap-2 pl-2 border-l border-gray-100 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center text-xs font-extrabold text-[#0B5B32] group-hover:bg-emerald-100 transition duration-150">
                {firstInitial || <User size={16} />}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-gray-800 group-hover:text-gray-900 transition duration-150">
                  {fullName}
                </p>
              </div>
              <ChevronDown size={12} className="text-gray-400 group-hover:text-gray-600 transition duration-150" />
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="flex items-center gap-1.5 bg-[#0B5B32] hover:bg-[#094d2a] text-white px-4 py-2 rounded-xl text-xs font-black transition-all duration-150 shadow-xs active:scale-[0.98]"
            >
              <LogIn size={14} />
              <span>Login</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}