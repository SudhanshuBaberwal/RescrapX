'use client';

import React, { useState } from 'react';
import { 
  User, Building2, Shield, Sliders, Bell, Camera, 
  Calendar, Trophy, CircleDollarSign, CheckCircle2, FileSpreadsheet,
  Lock, Key, Download, FileText, Eye, AlertTriangle, 
  Headphones, ChevronRight, ArrowUpRight, ChevronDown
} from 'lucide-react';

export default function ProfileSettingsDashboard() {
  const [activeTab, setActiveTab] = useState('Profile Information');

  // Inner Navigation Tabs configuration
  const navigationTabs = [
    { name: 'Profile Information', icon: User },
    { name: 'Company Details', icon: Building2 },
    { name: 'Security', icon: Shield },
    { name: 'Preferences', icon: Sliders },
    { name: 'Notification Settings', icon: Bell }
  ];

  // Completion Progress Steps Checklist
  const completionSteps = [
    { label: 'Basic Information', completed: true },
    { label: 'Company Details', completed: true },
    { label: 'KYC Verification', completed: true },
    { label: 'Bank Details', completed: true },
    { label: 'Security Setup', completed: true },
    { label: 'Notification Preferences', completed: false }
  ];

  // Quick Action Panel Items
  const quickLinks = [
    { label: 'Change Password', icon: Lock },
    { label: 'Manage API Key', icon: Key },
    { label: 'Download Invoices', icon: Download },
    { label: 'Terms & Conditions', icon: FileText },
    { label: 'Privacy Policy', icon: Eye }
  ];

  // Summary Grid Stats Configuration
  const accountStats = [
    { label: 'Member Since', value: '12 Jan 2024', subtext: '1.5 Years', icon: Calendar, linkText: '' },
    { label: 'Total Auctions Won', value: '24', subtext: 'View Details', icon: Trophy, linkText: 'View Details' },
    { label: 'Total Spend', value: '₹28,56,000', subtext: 'View Details', icon: CircleDollarSign, linkText: 'View Details' },
    { label: 'Verification Status', value: 'Verified', subtext: 'View Details', icon: CheckCircle2, isBadge: true, badgeStyle: 'text-emerald-600', linkText: 'View Details' },
    { label: 'KYC Status', value: 'Completed', subtext: 'View Details', icon: FileSpreadsheet, isBadge: true, badgeStyle: 'text-emerald-700', linkText: 'View Details' }
  ];

  return (
    <div className="space-y-6 w-full text-xs text-gray-700 antialiased">
      
      {/* 1. SECTION TOP TITLE PROFILE HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-black text-gray-900 text-sm tracking-tight">Profile & Settings</h3>
          <p className="text-[10px] text-gray-400 font-bold">Manage your account details, preferences and security settings.</p>
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-3 py-1.5 font-black text-gray-700 flex items-center gap-2 self-start sm:self-auto shadow-3xs cursor-pointer">
          <Calendar size={13} className="text-[#0B5B32]" />
          <span>8 Jun 2025 - 8 Jul 2025</span>
          <ChevronDown size={11} className="text-gray-400" />
        </button>
      </div>

      {/* 2. SUB NAVIGATION CONTROL STRIP */}
      <div className="border-b border-gray-200 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-6 min-w-max">
          {navigationTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-3 font-black text-[11px] transition-all relative cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.name ? 'text-[#0B5B32]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B5B32] rounded-full" />
              )}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. CORE TWO-COLUMN DASHBOARD CANVAS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        
        {/* LEFT COMPARTMENT COLUMN: FORMS & LOGS AREA */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          
          {/* PROFILE INFORMATIVE USER FORM BLOCK */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-5">
            <div>
              <h4 className="font-black text-gray-900 text-[12px] tracking-tight">Profile Information</h4>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">Update your personal details and profile information.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              
              {/* Profile Avatar Frame Upload Selector */}
              <div className="flex flex-col items-center space-y-2 shrink-0 self-center sm:self-start mx-auto sm:mx-0">
                <div className="w-20 h-20 rounded-full bg-[#0B4026] text-white font-black text-xl flex items-center justify-center relative group border-4 border-emerald-50 shadow-inner">
                  <span>GA</span>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white text-gray-600 rounded-full border border-gray-200 shadow-3xs hover:bg-gray-50 transition-all cursor-pointer">
                    <Camera size={12} />
                  </button>
                </div>
                <div className="text-center">
                  <button className="text-[#0B5B32] font-black hover:underline cursor-pointer">Change Photo</button>
                  <p className="text-[8px] text-gray-400 font-medium mt-0.5">JPG, PNG (Max. 2MB)</p>
                </div>
              </div>

              {/* Data Form Inputs Core Structure Sheet */}
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {[
                  { label: 'Full Name', val: 'Amit Sharma', type: 'text' },
                  { label: 'Email Address', val: 'amit.sharma@greenauto.com', type: 'email' },
                  { label: 'Phone Number', val: '+91 98765 43210', type: 'text' },
                  { label: 'Designation', val: 'Operations Manager', type: 'select' },
                  { label: 'Alternate Phone (Optional)', val: '+91 91234 56789', type: 'text' },
                  { label: 'Language Preference', val: 'English', type: 'select' }
                ].map((input, idx) => (
                  <div key={idx} className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-black block">{input.label}</label>
                    {input.type === 'select' ? (
                      <div className="relative">
                        <select className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-900 font-bold appearance-none focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white cursor-pointer">
                          <option>{input.val}</option>
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    ) : (
                      <input 
                        type={input.type} 
                        defaultValue={input.val}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-bold focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white" 
                      />
                    )}
                  </div>
                ))}

                <div className="sm:col-span-2 pt-2">
                  <button className="bg-[#0B5B32] text-white hover:bg-[#073d21] rounded-xl px-4 py-2 font-black shadow-3xs transition-all flex items-center justify-center cursor-pointer">
                    Update Profile
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* INTERNAL ACCOUNT METRICS WIDGET BAR SHEET */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-4">
            <div>
              <h4 className="font-black text-gray-900 text-[12px] tracking-tight">Account Summary</h4>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">Overview of your account activity and status.</p>
            </div>

            <div className="overflow-x-auto scrollbar-none -mx-5 px-5 sm:mx-0 sm:px-0">
              <div className="grid grid-cols-5 gap-4 min-w-[640px] divide-x divide-gray-100 text-center">
                {accountStats.map((stat, sIdx) => {
                  const StatIcon = stat.icon;
                  return (
                    <div key={sIdx} className="space-y-2 first:pl-0 pl-2 flex flex-col items-center justify-between">
                      <div className="space-y-2 flex flex-col items-center">
                        <div className="p-2 rounded-xl bg-emerald-50 text-[#0B5B32] w-fit">
                          <StatIcon size={13} />
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold block leading-tight">{stat.label}</span>
                      </div>
                      
                      <div className="space-y-1 w-full">
                        <span className={`text-xs font-black block truncate ${stat.isBadge ? stat.badgeStyle : 'text-gray-900'}`}>
                          {stat.value}
                        </span>
                        {stat.linkText ? (
                          <button className="text-[#0B5B32] font-black text-[9px] hover:underline block mx-auto cursor-pointer flex items-center gap-0.5 opacity-80">
                            <span>{stat.linkText}</span>
                            <ArrowUpRight size={10} />
                          </button>
                        ) : (
                          <span className="text-[9px] text-gray-400 font-medium block">{stat.subtext}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* DANGER DESTRUCTION ACTION ZONE BLOCK */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-4">
            <div>
              <h4 className="font-black text-gray-900 text-[12px] tracking-tight">Danger Zone</h4>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">Irreversible and sensitive actions for your account.</p>
            </div>

            <div className="border border-red-100/60 rounded-xl divide-y divide-red-50/60 overflow-hidden bg-red-50/5">
              
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded-xl bg-red-50 text-red-600 shrink-0 mt-0.5"><AlertTriangle size={13} /></div>
                  <div className="space-y-0.5">
                    <h5 className="font-black text-red-700 text-[11px]">Deactivate Account</h5>
                    <p className="text-[10px] text-gray-400 font-medium">Temporarily deactivate your account. You can reactivate it anytime by logging in.</p>
                  </div>
                </div>
                <button className="border border-red-200 bg-white hover:bg-red-50 text-red-600 font-black px-4 py-1.5 rounded-xl shadow-3xs transition-all text-[11px] cursor-pointer shrink-0">
                  Deactivate
                </button>
              </div>

              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded-xl bg-red-50 text-red-600 shrink-0 mt-0.5"><AlertTriangle size={13} /></div>
                  <div className="space-y-0.5">
                    <h5 className="font-black text-red-700 text-[11px]">Delete Account</h5>
                    <p className="text-[10px] text-gray-400 font-medium">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  </div>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-1.5 rounded-xl shadow-3xs transition-all text-[11px] cursor-pointer shrink-0">
                  Delete Permanently
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COMPARTMENT COLUMN: STATUS PROFILE TRACKERS & WIDGETS */}
        <div className="space-y-6 lg:sticky lg:top-4">
          
          {/* PROFILE ARCHITECTURE PROGRESS FILL RADIAL WIDGET */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-4">
            <h4 className="font-black text-gray-900 text-[12px] tracking-tight border-b border-gray-50 pb-2">Profile Completion</h4>
            
            <div className="flex items-center gap-4 bg-gray-50/40 border border-gray-100/50 p-3 rounded-xl">
              <div className="relative flex items-center justify-center shrink-0">
                {/* SVG Radial Engine Container ring design */}
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="5" fill="transparent" />
                  <circle cx="32" cy="32" r="26" stroke="#0B5B32" strokeWidth="5" fill="transparent" 
                          strokeDasharray={2 * Math.PI * 26}
                          strokeDashoffset={2 * Math.PI * 26 * (1 - 0.85)} />
                </svg>
                <span className="absolute font-black text-gray-900 text-[13px] tracking-tighter">85%</span>
              </div>
              <div className="min-w-0">
                <p className="font-black text-gray-800 text-[11px]">Almost there!</p>
                <p className="text-[9px] text-gray-400 font-medium mt-0.5 leading-relaxed">Complete your profile to unlock all features.</p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {completionSteps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[10px] font-bold">
                  <CheckCircle2 size={13} className={step.completed ? 'text-emerald-600' : 'text-gray-200'} fill={step.completed ? 'currentColor' : 'none'} stroke={step.completed ? 'white' : 'currentColor'} />
                  <span className={step.completed ? 'text-gray-700' : 'text-gray-400 font-medium'}>{step.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-50 flex justify-end">
              <button className="text-[#0B5B32] font-black text-[10px] hover:underline flex items-center gap-0.5 cursor-pointer">
                <span>Update remaining details</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>

          {/* QUICK OPERATION ACCESSIBILITY PANEL LINKS */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
            <h4 className="font-black text-gray-900 text-[12px] tracking-tight border-b border-gray-50 pb-2">Quick Links</h4>
            <div className="space-y-0.5">
              {quickLinks.map((link, lIdx) => {
                const LinkIcon = link.icon;
                return (
                  <button key={lIdx} className="w-full p-2 rounded-xl flex items-center justify-between group hover:bg-gray-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-2.5 min-w-0 text-gray-600 group-hover:text-gray-900">
                      <LinkIcon size={13} className="text-gray-400 group-hover:text-[#0B5B32]" />
                      <span className="font-bold text-[11px] truncate">{link.label}</span>
                    </div>
                    <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUPPORT CUSTOMER CONTACT BANNER WIDGET */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
            <div className="flex gap-2.5 items-start">
              <div className="p-2 bg-emerald-50 text-[#0B5B32] rounded-xl shrink-0"><Headphones size={14} /></div>
              <div className="space-y-0.5">
                <h4 className="font-black text-gray-900 text-[11px]">Need Help?</h4>
                <p className="text-[9px] text-gray-400 font-medium leading-relaxed">Facing an issue? Our support team is here to help you.</p>
              </div>
            </div>
            <button className="w-full bg-white border border-emerald-800/20 hover:bg-emerald-50 text-[#0B5B32] font-black py-2 rounded-xl text-center shadow-3xs transition-all flex items-center justify-center gap-1.5 h-8 border-dashed cursor-pointer">
              <Headphones size={13} /> <span>Contact Support</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}