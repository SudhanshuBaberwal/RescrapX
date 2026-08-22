'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Bell, LogIn, LogOut, User, Menu, X, Calendar, Shield, FileText } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/services/auth.service';
import queryClient from '@/lib/query/queryClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesHovered, setResourcesHovered] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);

  // Get active navigation item from query parameter (defaults to "home")
  const currentNav = searchParams.get('nav') || 'home';

  const navbarItems = [
    { title: "Home", slug: "home", hasDropdown: false },
    { title: "How It Works", slug: "how-it-works", hasDropdown: false },
    { title: "Services", slug: "services", hasDropdown: false },
    { title: "Resources", slug: "resources", hasDropdown: true },
    { title: "About Us", slug: "about-us", hasDropdown: false },
    { title: "Contact Us", slug: "contact-us", hasDropdown: false },
    { title: "FAQs", slug: "faqs", hasDropdown: false }
  ];

  // Helper to handle search parameter navigation
  const handleNavClick = (slug: string) => {
    setMobileMenuOpen(false);
    setResourcesHovered(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set('nav', slug);
    router.push(`/?${params.toString()}`);
  };

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
      <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-10 h-20 lg:h-24 flex items-center justify-between gap-4">

        {/* 1. Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center cursor-pointer select-none py-1 h-full shrink-0"
        >
          <div className="relative w-52 sm:w-64 lg:w-92 h-16 sm:h-20 lg:h-22 flex items-center justify-center">
            <Image
              src="/logo2.png"
              alt="RescrapX Logo"
              width={200}
              height={50}
              className="object-contain object-left"
            />
          </div>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-12 text-base xl:text-lg font-bold text-gray-600">
          {navbarItems.map((item) => {
            const isActive = currentNav === item.slug ||
              (item.slug === 'resources' && (currentNav === 'privacy-policy' || currentNav === 'terms-and-conditions'));

            // Handle "Resources" Dropdown Navigation
            if (item.slug === "resources") {
              return (
                <div
                  key={item.slug}
                  className="relative py-2"
                  onMouseEnter={() => setResourcesHovered(true)}
                  onMouseLeave={() => setResourcesHovered(false)}
                >
                  <button
                    onClick={() => handleNavClick(item.slug)}
                    className={`flex items-center gap-1 transition duration-150 cursor-pointer ${isActive
                        ? "text-[#0B5B32] border-b-2 border-[#0B5B32] pb-1 font-extrabold"
                        : "hover:text-gray-900"
                      }`}
                  >
                    <span>{item.title}</span>
                    <ChevronDown size={14} className={`opacity-70 transition-transform duration-200 ${resourcesHovered ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu using URL Params */}
                  <AnimatePresence>
                    {resourcesHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50"
                      >
                        <button
                          onClick={() => handleNavClick('privacy-policy')}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-700 hover:bg-[#F2F7F3] hover:text-[#0B5B32] transition-colors text-left"
                        >
                          <Shield size={16} className="text-[#0B5B32]" />
                          <span>Privacy Policy</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('terms-and-conditions')}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-700 hover:bg-[#F2F7F3] hover:text-[#0B5B32] transition-colors text-left"
                        >
                          <FileText size={16} className="text-[#0B5B32]" />
                          <span>Terms and Conditions</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // Standard Navigation Items
            return (
              <button
                key={item.slug}
                onClick={() => handleNavClick(item.slug)}
                className={`flex items-center gap-0.5 transition duration-150 cursor-pointer ${isActive
                    ? "text-[#0B5B32] border-b-2 border-[#0B5B32] pb-1 font-extrabold"
                    : "hover:text-gray-900"
                  }`}
              >
                <span>{item.title}</span>
                {item.hasDropdown && <ChevronDown size={12} className="opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Actions & Mobile Toggle Hub */}
        <div className="flex items-center gap-2.5 sm:gap-6 shrink-0">

          <button className="relative p-2 text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition duration-150">
            <Bell size={27} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white"></span>
          </button>

          {userData && <button
            onClick={() => router.push('/?tab=bookings')}
            className="hidden sm:flex items-center gap-2 border border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-50 px-3.5 py-1.5 rounded-lg text-sm font-bold text-[#0B5B32] transition duration-150"
          >
            <span className="text-xs">📋</span>
            <div className="text-left">
              <p className="leading-tight font-black text-[11px]">My Bookings</p>
              <p className="text-[9px] text-[#10B981] font-medium tracking-wide">Track Status</p>
            </div>
          </button>}

          {userData ? (
            <>
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
            {navbarItems.map((item) => {
              const isActive = currentNav === item.slug;

              if (item.slug === "resources") {
                return (
                  <div key={item.slug} className="space-y-1">
                    <button
                      onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50"
                    >
                      <span>Resources</span>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {mobileResourcesOpen && (
                      <div className="pl-4 space-y-1">
                        <button
                          onClick={() => handleNavClick('privacy-policy')}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-600 rounded-lg hover:bg-[#E6F4EA] hover:text-[#0B5B32] text-left"
                        >
                          <Shield size={14} />
                          <span>Privacy Policy</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('terms-and-conditions')}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-600 rounded-lg hover:bg-[#E6F4EA] hover:text-[#0B5B32] text-left"
                        >
                          <FileText size={14} />
                          <span>Terms and Conditions</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.slug}
                  onClick={() => handleNavClick(item.slug)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition ${isActive
                      ? "font-extrabold text-[#0B5B32] bg-[#E6F4EA]"
                      : "font-bold text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <span>{item.title}</span>
                  {item.hasDropdown && <ChevronDown size={16} className="text-gray-400" />}
                </button>
              );
            })}

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