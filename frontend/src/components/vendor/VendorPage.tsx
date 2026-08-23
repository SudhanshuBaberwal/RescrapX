'use client';

import React, { useEffect, useState } from 'react';
import PartnerSidebar from './PartnerSidebar';
import PartnerNavbar from '../navbar/PartnerNabar'; 
import VendorLayoutPage from './VendorLayoutPage';
import PartnerFooter from '../footer/PartnerFooter';

export default function VendorPage() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isMobileSidebarOpen) {
      const timeout = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(timeout);
    } else {
      setAnimate(false);
    }
  }, [isMobileSidebarOpen]);

  const closeSidebar = () => {
    setAnimate(false);
    setTimeout(() => setIsMobileSidebarOpen(false), 300);
  };

  return (
    <div className="flex w-screen max-w-full h-screen bg-[#F9FAFB] text-gray-900 overflow-hidden antialiased font-sans">
      
      {/* SIDEBAR: Desktop */}
      <div className="hidden lg:block shrink-0 h-full">
        <PartnerSidebar />
      </div>

      {/* SIDEBAR: Mobile/Tablet Drawer Layout */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-out ${
              animate ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeSidebar}
          />
          <div 
            className={`relative flex w-64 max-w-xs flex-1 flex-col h-full bg-[#062614] shadow-xl transition-transform duration-300 ease-out transform ${
              animate ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <PartnerSidebar onClose={closeSidebar} />
          </div>
        </div>
      )}
      
      {/* MAIN LAYOUT CANVAS */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-x-hidden">
        <PartnerNavbar onMenuToggle={() => setIsMobileSidebarOpen(true)} />
        
        {/* Scrollable Main View Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col justify-between w-full">
          <main className="flex-1 w-full p-4 sm:p-6 max-w-(screen-2xl) mx-auto box-border min-w-0">
            <VendorLayoutPage />
          </main>
          <PartnerFooter />
        </div>
      </div>
      
    </div>
  );
}