'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Bell, LogIn, LogOut, User, Menu, X, Calendar, Shield, FileText } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/services/auth.service';
import queryClient from '@/lib/query/queryClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesHovered, setResourcesHovered] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const { userData } = useSelector((state: RootState) => state.user);

  const currentNav = searchParams.get('nav');

  const navbarItems = [
    { title: "Home", slug: "home" },
    { title: "How It Works", slug: "how-it-works" },
    { title: "Services", slug: "services" },
    { title: "Resources", slug: "resources", hasDropdown: true },
    { title: "About Us", slug: "about-us" },
    { title: "Contact Us", slug: "contact-us" },
    { title: "FAQs", slug: "faqs" }
  ];

  const handleNavClick = (slug: string) => {
    setMobileMenuOpen(false);
    setResourcesHovered(false);
    
    if (slug === 'home') {
      router.push('/');
    } else {
      router.push(`/?nav=${slug}`);
    }
  };

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-2xs w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">

        {/* 1. Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center cursor-pointer select-none shrink-0"
        >
          <div className="relative w-44 sm:w-52 h-14 flex items-center justify-start">
            <Image
              src="/logo2.png"
              alt="RescrapX Logo"
              width={210}
              height={55}
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        {/* 2. Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-10 text-sm xl:text-base font-extrabold text-[#2C3A4B]">
          {navbarItems.map((item) => {
            const isHomePage = pathname === '/';
            const isActive = (isHomePage && !currentNav && item.slug === 'home') || currentNav === item.slug;

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
                    className={`relative flex items-center gap-1.5 transition duration-150 cursor-pointer py-1 ${
                      isActive ? "text-[#0B5B32] font-black" : "hover:text-black"
                    }`}
                  >
                    <span>{item.title}</span>
                    <ChevronDown size={14} className={`opacity-70 transition-transform duration-200 ${resourcesHovered ? 'rotate-180' : ''}`} />
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0B5B32] rounded-full"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {resourcesHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50"
                      >
                        <button
                          onClick={() => handleNavClick('privacy-policy')}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#F2F7F3] hover:text-[#0B5B32] transition-colors text-left"
                        >
                          <Shield size={16} className="text-[#0B5B32]" />
                          <span>Privacy Policy</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('terms-and-conditions')}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-[#F2F7F3] hover:text-[#0B5B32] transition-colors text-left"
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

            return (
              <button
                key={item.slug}
                onClick={() => handleNavClick(item.slug)}
                className={`relative flex items-center transition duration-150 cursor-pointer py-1 ${
                  isActive ? "text-[#0B5B32] font-black" : "hover:text-black"
                }`}
              >
                <span>{item.title}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#0B5B32] rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. Right Action Bar */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl transition duration-150">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white"></span>
          </button>

          {userData && (
            <button
              onClick={() => router.push('/?tab=bookings')}
              className="hidden sm:flex items-center gap-2 border border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-[#0B5B32] transition duration-150"
            >
              <span className="text-sm">📋</span>
              <div className="text-left">
                <p className="leading-tight font-black text-[11px]">My Bookings</p>
                <p className="text-[9px] text-[#10B981] font-bold tracking-wide">Track Status</p>
              </div>
            </button>
          )}

          {userData ? (
            <>
              <div
                onClick={() => router.push('/?tab=overview')}
                className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-gray-200 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-xs font-black text-[#0B5B32] group-hover:bg-emerald-200 transition duration-150">
                  {firstInitial || <User size={16} />}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-800 group-hover:text-black transition duration-150">
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
              className="flex items-center justify-center bg-[#0B5B32] hover:bg-[#094d2a] text-white px-4 py-2 rounded-xl text-xs font-black transition-all duration-150 shadow-xs active:scale-[0.98]"
              title="Login"
            >
              <LogIn size={16} />
              <span className="ml-1.5">Login</span>
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden absolute top-full left-0 right-0 w-full bg-white border-b border-gray-200 px-5 py-5 space-y-2.5 shadow-2xl z-50"
          >
            {navbarItems.map((item) => {
              const isHomePage = pathname === '/';
              const isActive = (isHomePage && !currentNav && item.slug === 'home') || currentNav === item.slug;

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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition ${
                    isActive
                      ? "font-extrabold text-[#0B5B32] bg-[#E6F4EA]"
                      : "font-bold text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{item.title}</span>
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