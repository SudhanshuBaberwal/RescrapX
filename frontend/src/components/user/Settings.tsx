'use client'

import React, { useState } from 'react';
import { 
  User, Lock, Sliders, Shield, Edit2, CheckCircle2, 
  Mail, Phone, Bell, FileText, Trash2, AlertTriangle, Check, MessageSquare
} from 'lucide-react';

export default function CustomerSettingsLayout() {
  const [activeTab, setActiveTab] = useState('profile');

  // Preferences Toggle States
  const [preferences, setPreferences] = useState({
    sms: true,
    email: true,
    whatsapp: true,
    promotional: false,
    policy: true
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'profile', name: 'Personal Profile', icon: User },
    { id: 'password', name: 'Change Password', icon: Lock },
    { id: 'preferences', name: 'Notification Preferences', icon: Sliders },
    { id: 'security', name: 'Security & Account', icon: Shield },
  ];

  return (
    <div className="w-full space-y-6 text-[#374151]">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Settings</h1>
        <p className="text-xs font-semibold text-gray-400 mt-0.5">Manage your personal details, account security, and notification preferences.</p>
      </div>

      {/* ========================================== */}
      {/* TAB NAVIGATION                              */}
      {/* ========================================== */}
      <div className="border-b border-gray-100 flex gap-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-xs font-bold pb-3 px-1 border-b-2 transition-all whitespace-nowrap ${
                isActive 
                  ? 'border-[#0B5B32] text-[#0B5B32] font-black' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={14} />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* TAB CONTENT: PERSONAL PROFILE              */}
      {/* ========================================== */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Personal Details */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-5">
            <div className="flex justify-between items-center pb-1">
              <div>
                <h3 className="text-sm font-black text-gray-900">Personal Information</h3>
                <p className="text-[11px] text-gray-400 font-medium">Update your personal identity details and contact methods.</p>
              </div>
              <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-2xs">
                <Edit2 size={12} />
                <span>Edit Details</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                <p className="font-extrabold text-gray-800 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/70">Shubham Mavi</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date of Birth</label>
                <p className="font-bold text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/70">15 May 1998</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                <div className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/70">
                  <span className="font-extrabold text-gray-800">+91 98765 43210</span>
                  <span className="inline-flex items-center gap-1 bg-[#E6F4EA] text-[#0B5B32] text-[9px] font-black px-1.5 py-0.5 rounded-md">
                    <Check size={10} strokeWidth={3} /> Verified
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gender</label>
                <p className="font-bold text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/70">Male</p>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                <div className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/70">
                  <span className="font-extrabold text-gray-800">shubham@gmail.com</span>
                  <span className="inline-flex items-center gap-1 bg-[#E6F4EA] text-[#0B5B32] text-[9px] font-black px-1.5 py-0.5 rounded-md">
                    <Check size={10} strokeWidth={3} /> Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Address Cards */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-5">
            <div className="flex justify-between items-center pb-1">
              <div>
                <h3 className="text-sm font-black text-gray-900">Address Information</h3>
                <p className="text-[11px] text-gray-400 font-medium">Manage your address layout used for logistics and vehicle inspections.</p>
              </div>
              <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-2xs">
                <Edit2 size={12} />
                <span>Edit Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Address Type</label>
                  <span className="bg-[#E6F4EA] text-[#0B5B32] text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Primary Address</span>
                </div>
                <div className="space-y-1 pt-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Address Details</label>
                  <div className="font-bold text-gray-700 bg-gray-50/50 p-3 rounded-lg border border-gray-100/70 leading-relaxed">
                    Laxmi Nagar, Near Metro Station <br />
                    Delhi, Delhi - 110092 <br />
                    India
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pincode</label>
                  <p className="font-extrabold text-gray-800 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/70">110092</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Landmark (Optional)</label>
                  <p className="font-bold text-gray-600 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/70">Near Laxmi Nagar Metro Station</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB CONTENT: CHANGE PASSWORD               */}
      {/* ========================================== */}
      {activeTab === 'password' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-sm font-black text-gray-900">Security Credentials</h3>
            <p className="text-[11px] text-gray-400 font-medium">Ensure your account is using a secure long password structure.</p>
          </div>

          <div className="max-w-md space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">New Password</label>
              <input type="password" placeholder="Min. 8 characters" className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Confirm New Password</label>
              <input type="password" placeholder="Re-type new password" className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32]" />
            </div>
            <button className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-xs">
              Update Password
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB CONTENT: NOTIFICATION PREFERENCES      */}
      {/* ========================================== */}
      {activeTab === 'preferences' && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-sm font-black text-gray-900">Communication Channels</h3>
            <p className="text-[11px] text-gray-400 font-medium">Control the alert flows you want to get during the scrap journey updates.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-500 rounded-lg"><Phone size={14} /></div>
                  <div>
                    <p className="text-xs font-black text-gray-800">SMS Notifications</p>
                    <p className="text-[10px] text-gray-400 font-medium">Receive updates via SMS</p>
                  </div>
                </div>
                <button onClick={() => handleToggle('sms')} className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${preferences.sms ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences.sms ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-500 rounded-lg"><Mail size={14} /></div>
                  <div>
                    <p className="text-xs font-black text-gray-800">Email Notifications</p>
                    <p className="text-[10px] text-gray-400 font-medium">Receive updates via Email</p>
                  </div>
                </div>
                <button onClick={() => handleToggle('email')} className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${preferences.email ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences.email ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-500 rounded-lg"><MessageSquare size={14} /></div>
                  <div>
                    <p className="text-xs font-black text-gray-800">WhatsApp Notifications</p>
                    <p className="text-[10px] text-gray-400 font-medium">Receive updates via WhatsApp</p>
                  </div>
                </div>
                <button onClick={() => handleToggle('whatsapp')} className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${preferences.whatsapp ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences.whatsapp ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-500 rounded-lg"><Bell size={14} /></div>
                  <div>
                    <p className="text-xs font-black text-gray-800">Promotional Updates</p>
                    <p className="text-[10px] text-gray-400 font-medium">Receive offers and tips</p>
                  </div>
                </div>
                <button onClick={() => handleToggle('promotional')} className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${preferences.promotional ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences.promotional ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 text-gray-500 rounded-lg"><FileText size={14} /></div>
                  <div>
                    <p className="text-xs font-black text-gray-800">Policy & Legal Updates</p>
                    <p className="text-[10px] text-gray-400 font-medium">Important policy updates</p>
                  </div>
                </div>
                <button onClick={() => handleToggle('policy')} className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${preferences.policy ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences.policy ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB CONTENT: SECURITY & ACCOUNT            */}
      {/* ========================================== */}
      {activeTab === 'security' && (
        <div className="bg-red-50/20 border border-red-100 rounded-2xl p-5 md:p-6 space-y-4">
          <div>
            <h3 className="text-sm font-black text-red-600">Danger Zone</h3>
            <p className="text-[11px] text-gray-400 font-medium">Sensitive modifications connected permanently to data extraction routines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0"><AlertTriangle size={16} /></div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-gray-800">Deactivate Account</h4>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">Temporarily hide your profile details securely.</p>
                </div>
              </div>
              <button className="border border-amber-200 text-amber-700 hover:bg-amber-50/50 text-[10px] font-black px-3 py-2 rounded-xl transition shrink-0">
                Deactivate
              </button>
            </div>

            <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0"><Trash2 size={16} /></div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-gray-800">Delete Account</h4>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">Wipe all history metrics and file indices permanently.</p>
                </div>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-3 py-2 rounded-xl transition shrink-0 shadow-xs">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}