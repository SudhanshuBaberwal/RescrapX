'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Bell, LogIn, LogOut, User, Menu, X, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/services/auth.service';
import queryClient from '@/lib/query/queryClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);

  // Extract user full name or first initial if available
  const fullName = userData?.fullName || 'User';
  const firstInitial = fullName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.removeQueries({ queryKey: ["current-user"] });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs relative">
      <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-10 h-20 flex items-center justify-between">

        {/* 1. Logo (Increased Size & Clear Alignment) */}
        <div
          onClick={() => {
            setMobileMenuOpen(false);
            router.push('/');
          }}
          className="flex items-center cursor-pointer select-none py-1 h-full shrink-0"
        >
          <div className="relative w-50 sm:w-56 h-14 sm:h-20 flex items-center">
            <Image
              src="/logo2.png"
              alt="RescrapX Logo"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-20 text-lg font-bold text-gray-600">
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

        {/* Right Side: Actions & Mobile Toggle Hub */}
        <div className="flex items-center gap-2.5 sm:gap-6">

          {/* Notification Alert Icon */}
          <button className="relative p-2 text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-150">
            <Bell size={27} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Booking Tracking Shortcut Pill (Desktop & Tablet) */}
          <button
            onClick={() => router.push('/?tab=bookings')}
            className="hidden sm:flex items-center gap-2 border border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-50 px-3.5 py-1.5 rounded-lg text-sm font-bold text-[#0B5B32] transition duration-150"
          >
            <span className="text-xs">📋</span>
            <div className="text-left">
              <p className="leading-tight font-black text-[11px]">My Bookings</p>
              <p className="text-[9px] text-[#10B981] font-medium tracking-wide">Track Status</p>
            </div>
          </button>

          {/* 2. Login/Logout Button */}
          {userData ? (
            <>
              {/* Desktop Profile View */}
              <div
                onClick={() => router.push('/?tab=overview')}
                className="hidden lg:flex items-center gap-2 pl-2 border-l border-gray-100 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center text-xs font-extrabold text-[#0B5B32] group-hover:bg-emerald-100 transition duration-150">
                  {firstInitial || <User size={16} />}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-800 group-hover:text-gray-900 transition duration-150">
                    {fullName}
                  </p>
                </div>
                <ChevronDown size={12} className="text-gray-400 group-hover:text-gray-600 transition duration-150" />
              </div>

              {/* Mobile Icon-Only Logout Button */}
              <button
                onClick={handleLogout}
                className="lg:hidden p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition duration-150 border border-red-100"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="flex items-center justify-center bg-[#0B5B32] hover:bg-[#094d2a] text-white p-2.5 sm:px-4 sm:py-2 rounded-xl text-xs font-black transition-all duration-150 shadow-xs active:scale-[0.98]"
              title="Login"
            >
              <LogIn size={18} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline ml-1.5">Login</span>
            </button>
          )}

          {/* 3. Mobile Top Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-xl transition duration-150 border border-gray-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

      </div>

      {/* Floating Overlay Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="lg:hidden absolute top-full left-0 right-0 w-full bg-white border-b border-gray-200 px-5 py-5 space-y-2.5 shadow-2xl z-50"
          >
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-extrabold text-[#0B5B32] bg-[#E6F4EA]"
            >
              <span>Home</span>
            </a>

            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              <span>How It Works</span>
            </a>

            <div className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition">
              <span>Services</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition">
              <span>Resources</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>

            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              <span>About Us</span>
            </a>

            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              <span>Contact Us</span>
            </a>

            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              <span>FAQs</span>
            </a>

            {/* Bookings Tracker Button */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/?tab=bookings');
                }}
                className="w-full flex items-center justify-between border border-emerald-300 bg-[#E6F4EA]/80 px-4 py-3 rounded-2xl text-sm font-extrabold text-[#0B5B32]"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar size={18} className="text-[#0B5B32]" />
                  <span>My Bookings</span>
                </div>
                <span className="text-xs bg-[#0B5B32] text-white px-3 py-1 rounded-lg font-black">
                  Track
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}