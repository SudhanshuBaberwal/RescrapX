'use client';

import React, { useState } from 'react';
import { 
  Trophy, Truck, FileText, IndianRupee, RefreshCw, 
  Calendar, ShieldCheck, Timer, Check, SlidersHorizontal, 
  CalendarDays, ChevronDown, ChevronLeft, ChevronRight, MoreVertical,
  Mail, MessageSquare, Bell, Moon, Settings, ArrowUpRight
} from 'lucide-react';

export default function NotificationsDashboard() {
  const [activeSegment, setActiveSegment] = useState('All Notifications');

  // Segment Filter Tabs configuration
  const tabs = [
    { name: 'All Notifications', count: 12, bg: 'bg-emerald-50 text-emerald-700' },
    { name: 'Unread', count: 5, bg: 'bg-amber-50 text-amber-700' },
    { name: 'Important', count: 3, bg: 'bg-red-50 text-red-700' },
  ];

  // Primary Notification Feed Dataset
  const notifications = [
    {
      id: 1,
      title: 'You have won a vehicle!',
      description: 'Congratulations! You have won the auction for Maruti Swift Dzire 2014 (HR26AX1122).',
      time: 'Today, 09:30 AM',
      unread: true,
      icon: Trophy,
      iconColor: 'text-emerald-600 bg-emerald-50',
      actionText: 'View Details',
      actionType: 'link'
    },
    {
      id: 2,
      title: 'Pickup completed successfully',
      description: 'Pickup for Hyundai i20 2016 (HR26AZ7789) has been completed.',
      time: 'Today, 08:15 AM',
      unread: true,
      icon: Truck,
      iconColor: 'text-blue-600 bg-blue-50',
      actionText: 'View Details',
      actionType: 'link'
    },
    {
      id: 3,
      title: 'Document verification pending',
      description: '2 documents for Order WO-250708-0012 are pending verification.',
      time: 'Yesterday, 04:15 PM',
      unread: true,
      icon: FileText,
      iconColor: 'text-amber-600 bg-amber-50',
      actionText: 'Go to Documents',
      actionType: 'link'
    },
    {
      id: 4,
      title: 'Payment received',
      description: 'Payment of ₹31,000 received for Order WO-250708-0009.',
      time: 'Yesterday, 03:45 PM',
      unread: false,
      icon: IndianRupee,
      iconColor: 'text-purple-600 bg-purple-50',
      actionText: 'View Details',
      actionType: 'link'
    },
    {
      id: 5,
      title: 'Vehicle sent for recycling',
      description: 'Honda City 2012 (DL3CBE5678) has been sent for recycling.',
      time: 'Yesterday, 11:20 AM',
      unread: false,
      icon: RefreshCw,
      iconColor: 'text-emerald-600 bg-emerald-50',
      actionText: 'View Details',
      actionType: 'link'
    },
    {
      id: 6,
      title: 'Pickup scheduled',
      description: 'Pickup scheduled for Tata Indica Vista 2011 (HR51AS7789) on 10 Jul 2025 at 10:00 AM.',
      time: '07 Jul 2025, 06:30 PM',
      unread: false,
      icon: Calendar,
      iconColor: 'text-amber-600 bg-amber-50',
      actionText: 'View Schedule',
      actionType: 'link'
    },
    {
      id: 7,
      title: 'Account verified',
      description: 'Your account has been successfully verified by RescrapX.',
      time: '07 Jul 2025, 02:10 PM',
      unread: false,
      icon: ShieldCheck,
      iconColor: 'text-teal-600 bg-teal-50',
      actionText: '',
      actionType: 'none'
    },
    {
      id: 8,
      title: 'Auction ending soon',
      description: 'Auction for Maruti Alto 800 2016 (RJ14CA1234) ends in 30 minutes.',
      time: '07 Jul 2025, 01:40 PM',
      unread: false,
      icon: Timer,
      iconColor: 'text-red-600 bg-red-50',
      actionText: 'View Auction',
      actionType: 'link'
    }
  ];

  // Summary widgets metadata metrics
  const summaries = [
    { title: 'Total Notifications', value: '12', desc: 'All time', icon: Bell, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Unread', value: '5', desc: 'Require your attention', icon: Timer, color: 'text-amber-600 bg-amber-50' },
    { title: 'Important', value: '3', desc: 'High priority alerts', icon: FileText, color: 'text-red-600 bg-red-50' },
    { title: 'This Week', value: '12', desc: '8 Jun - 8 Jul 2025', icon: CalendarDays, color: 'text-blue-600 bg-blue-50' }
  ];

  // Channel settings profiles mapping configurations
  const preferenceSettings = [
    { title: 'Email Notifications', desc: 'Manage email preferences', icon: Mail },
    { title: 'SMS Notifications', desc: 'Manage SMS preferences', icon: MessageSquare },
    { title: 'Push Notifications', desc: 'Manage push preferences', icon: Bell },
    { title: 'Quiet Hours', desc: 'Set notification quiet hours', icon: Moon }
  ];

  return (
    <div className="space-y-6 w-full text-xs">
      
      {/* HEADER ROW BAR PANEL CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-black text-gray-900 text-sm">Notifications</h3>
          <p className="text-[10px] text-gray-400 font-bold">Stay updated with important alerts and activities.</p>
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-3 py-1.5 font-black text-gray-700 flex items-center gap-2 self-start sm:self-auto shadow-3xs cursor-pointer">
          <CalendarDays size={13} className="text-[#0B5B32]" />
          <span>8 Jun 2025 - 8 Jul 2025</span>
          <ChevronDown size={11} className="text-gray-400" />
        </button>
      </div>

      {/* SEGMENT FILTERS TOOLBAR CONTROLS STRIP */}
      <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-3xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Horizontal scroll guard navigation segments wrapper */}
        <div className="overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0 scrollbar-none">
          <div className="flex gap-4 min-w-max pb-px">
            {tabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSegment(tab.name)}
                className={`pb-2 pt-1 font-black transition-all relative cursor-pointer flex items-center gap-2 text-[11px] ${
                  activeSegment === tab.name ? 'text-[#0B5B32]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span>{tab.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                  activeSegment === tab.name ? tab.bg : 'bg-gray-100 text-gray-500'
                }`}>{tab.count}</span>
                {activeSegment === tab.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B5B32] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Global actions control clusters configuration */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex-1 sm:flex-none border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-3 py-2 rounded-xl shadow-3xs transition-all flex items-center justify-center gap-1.5 h-[32px] cursor-pointer">
            <Check size={13} className="text-gray-400" /> <span>Mark all as read</span>
          </button>
          <button className="flex-1 sm:flex-none border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-3 py-2 rounded-xl shadow-3xs transition-all flex items-center justify-center gap-1.5 h-[32px] cursor-pointer">
            <SlidersHorizontal size={12} className="text-gray-400" /> <span>Filters</span>
            <ChevronDown size={11} className="text-gray-400" />
          </button>
        </div>

      </div>

      {/* MASTER TWO-COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        
        {/* LEFT COLUMN PANEL: MAIN NOTIFICATIONS ACTIVITY LIST */}
        <div className="lg:col-span-2 xl:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">
          <div className="divide-y divide-gray-50">
            {notifications.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.id} className={`p-4 flex gap-3 sm:gap-4 relative transition-all hover:bg-gray-50/40 ${item.unread ? 'bg-emerald-50/5' : ''}`}>
                  
                  {/* Dynamic absolute left unread indicator badge marker */}
                  {item.unread && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500 shadow-xs" />
                  )}

                  {/* Core asset identity category symbol box */}
                  <div className={`p-2.5 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center ${item.iconColor}`}>
                    <IconComponent size={15} />
                  </div>

                  {/* Context text details message box block */}
                  <div className="flex-1 min-w-0 space-y-1 pr-6 sm:pr-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                      <h4 className={`text-[13px] tracking-tight leading-snug truncate ${item.unread ? 'font-black text-gray-900' : 'font-bold text-gray-800'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-bold shrink-0 sm:pl-3 flex items-center gap-1.5">
                        {item.time}
                        {item.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block sm:hidden" />}
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-2xl">{item.description}</p>
                    
                    {item.actionType === 'link' && (
                      <button className="text-[#0B5B32] font-black text-[11px] pt-1 flex items-center gap-0.5 hover:underline transition-all cursor-pointer group">
                        <span>{item.actionText}</span>
                        <ArrowUpRight size={12} className="opacity-70 group-hover:translate-x-px group-hover:-translate-y-px transition-transform" />
                      </button>
                    )}
                  </div>

                  {/* Inline interactive menu operations dropdown button */}
                  <div className="absolute right-3 top-3 sm:relative sm:right-auto sm:top-auto self-start sm:self-center shrink-0">
                    <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors cursor-pointer">
                      <MoreVertical size={14} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* INTERNAL DATA LIST PAGINATION CONTAINER STRIP */}
          <div className="bg-white border-t border-gray-100 px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 font-bold text-[11px]">
            <span>Showing <strong className="text-gray-800 font-black">1 to 8</strong> of <strong className="text-gray-800 font-black">12</strong> notifications</span>
            
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all disabled:opacity-40" disabled>
                <ChevronLeft size={14} />
              </button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black bg-[#0B5B32] text-white shadow-3xs">1</button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">2</button>
              <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN PANEL: METRICS OVERVIEWS & CHANNEL PREFERENCES */}
        <div className="space-y-6">
          
          {/* NOTIFICATION METRICS CONTEXT BANNER CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-4">
            <h4 className="font-black text-gray-900 text-[12px] tracking-tight border-b border-gray-50 pb-2">Notification Summary</h4>
            <div className="divide-y divide-gray-50">
              {summaries.map((s, idx) => {
                const SummaryIcon = s.icon;
                return (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 ${s.color}`}>
                        <SummaryIcon size={13} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-gray-800 truncate leading-tight">{s.title}</p>
                        <p className="text-[9px] text-gray-400 font-bold truncate mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-gray-900 shrink-0">{s.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PREFERENCE CHANNEL CONTROLS LIST CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-4">
            <h4 className="font-black text-gray-900 text-[12px] tracking-tight border-b border-gray-50 pb-2">Notification Settings</h4>
            <div className="space-y-1">
              {preferenceSettings.map((sett, idx) => {
                const SettingIcon = sett.icon;
                return (
                  <button key={idx} className="w-full text-left p-2 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 flex items-center justify-between gap-3 group transition-all cursor-pointer">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-500 shrink-0 group-hover:bg-white group-hover:text-gray-700 transition-all">
                        <SettingIcon size={13} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-gray-800 truncate leading-none">{sett.title}</p>
                        <p className="text-[9px] text-gray-400 font-bold truncate mt-1">{sett.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Comprehensive configuration operational button container */}
            <div className="pt-2">
              <button className="w-full bg-white border border-emerald-800/20 hover:bg-emerald-50 text-[#0B5B32] font-black py-2 rounded-xl text-center shadow-3xs transition-all flex items-center justify-center gap-1.5 h-8 border-dashed cursor-pointer">
                <Settings size={13} /> <span>Manage Preferences</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}