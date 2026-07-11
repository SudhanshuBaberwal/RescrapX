'use client'

import React, { useState } from 'react';
import { 
  User, Lock, Sliders, Shield, Edit2, CheckCircle, 
  MessageSquare, Mail, Phone, Bell, FileText, Trash2,
  AlertTriangle, Check
} from 'lucide-react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('Personal Information');

  // Toggle States for Preferences
  const [preferences, setPreferences] = useState({
    sms: true,
    email: true,
    whatsapp: true,
    promotional: false,
    policy: true
  });

  const tabs = [
    { name: 'Personal Information', icon: User },
    { name: 'Change Password', icon: Lock },
    { name: 'Preferences', icon: Sliders },
    { name: 'Security', icon: Shield },
  ];

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full space-y-6 text-[#374151]">
      
      {/* ========================================== */}
      {/* HEADER PAGE SECTION                        */}
      {/* ========================================== */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Profile Settings</h1>
        <p className="text-xs font-semibold text-gray-400 mt-0.5">Manage your personal information and account preferences.</p>
      </div>

      {/* ========================================== */}
      {/* SUB TAB CONTROLS NAVIGATION                 */}
      {/* ========================================== */}
      <div className="border-b border-gray-100 flex gap-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 text-xs font-bold pb-3 px-1 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.name 
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
      {/* SECTION 1: PERSONAL INFORMATION FRAME      */}
      {/* ========================================== */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-5">
        <div className="flex justify-between items-center pb-1">
          <div>
            <h3 className="text-sm font-black text-gray-900">Personal Information</h3>
            <p className="text-[11px] text-gray-400 font-medium">Update your personal details and contact information.</p>
          </div>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-2xs">
            <Edit2 size={12} />
            <span>Edit</span>
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
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Preferred Language</label>
            <p className="font-bold text-gray-700 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/70">English</p>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* SECTION 2: ADDRESS INFORMATION FRAME       */}
      {/* ========================================== */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-5">
        <div className="flex justify-between items-center pb-1">
          <div>
            <h3 className="text-sm font-black text-gray-900">Address Information</h3>
            <p className="text-[11px] text-gray-400 font-medium">Manage your address for pickups and correspondence.</p>
          </div>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-2xs">
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Address Type</label>
              <span className="bg-[#E6F4EA] text-[#0B5B32] text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Primary Address</span>
            </div>
            <div className="space-y-1 pt-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Address</label>
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

      {/* ========================================== */}
      {/* SECTION 3: COMMUNICATION PREFERENCES       */}
      {/* ========================================== */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-5">
        <div>
          <h3 className="text-sm font-black text-gray-900">Communication Preferences</h3>
          <p className="text-[11px] text-gray-400 font-medium">Choose how you want to receive updates and notifications.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {/* Left Column Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 text-gray-500 rounded-lg"><Phone size={14} /></div>
                <div>
                  <p className="text-xs font-black text-gray-800">SMS Notifications</p>
                  <p className="text-[10px] text-gray-400 font-medium">Receive updates via SMS</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('sms')}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${preferences.sms ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${preferences.sms ? 'translate-x-4' : 'translate-x-0'}`} />
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
              <button 
                onClick={() => handleToggle('email')}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${preferences.email ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${preferences.email ? 'translate-x-4' : 'translate-x-0'}`} />
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
              <button 
                onClick={() => handleToggle('whatsapp')}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${preferences.whatsapp ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${preferences.whatsapp ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Right Column Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 text-gray-500 rounded-lg"><Bell size={14} /></div>
                <div>
                  <p className="text-xs font-black text-gray-800">Promotional Updates</p>
                  <p className="text-[10px] text-gray-400 font-medium">Receive offers and tips</p>
                </div>
              </div>
              <button 
                onClick={() => handleToggle('promotional')}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${preferences.promotional ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${preferences.promotional ? 'translate-x-4' : 'translate-x-0'}`} />
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
              <button 
                onClick={() => handleToggle('policy')}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${preferences.policy ? 'bg-[#0B5B32]' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${preferences.policy ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* SECTION 4: DANGER ZONE ACTIONS             */}
      {/* ========================================== */}
      <div className="bg-red-50/20 border border-red-100 rounded-2xl p-5 md:p-6 space-y-4">
        <div>
          <h3 className="text-sm font-black text-red-600">Danger Zone</h3>
          <p className="text-[11px] text-gray-400 font-medium">Irreversible and sensitive actions for your account.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Deactivate Box */}
          <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0"><AlertTriangle size={16} /></div>
              <div>
                <h4 className="text-xs font-black text-gray-800">Deactivate Account</h4>
                <p className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">Temporarily deactivate your account and hide your data.</p>
              </div>
            </div>
            <button className="border border-amber-200 hover:bg-amber-50/50 text-amber-700 text-[10px] font-black px-3 py-2 rounded-xl transition shrink-0">
              Deactivate
            </button>
          </div>

          {/* Delete Box */}
          <div className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0"><Trash2 size={16} /></div>
              <div>
                <h4 className="text-xs font-black text-gray-800">Delete Account</h4>
                <p className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">Permanently delete your account and all associated data.</p>
              </div>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-black px-3 py-2 rounded-xl transition shrink-0 shadow-xs">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* CUSTOMER SUPPORT CONTACT CENTER CONTEXT    */}
      {/* ========================================== */}
      <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 relative bg-white border border-emerald-100 rounded-xl flex items-center justify-center text-2xl shadow-2xs shrink-0">
            👩‍💻
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">Need help with your account?</h4>
            <p className="text-xs text-gray-400 font-medium max-w-md mt-0.5 leading-relaxed">
              Our support team is here to assist you with any account related queries.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-lg border border-gray-100 text-[#0B5B32] shadow-2xs"><Phone size={14} /></div>
            <div>
              <p className="text-gray-900 font-black">+91 98765 43210</p>
              <p className="text-[10px] font-medium text-gray-400">Mon – Sat | 9:00 AM – 7:00 PM</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-lg border border-gray-100 text-[#0B5B32] shadow-2xs"><Mail size={14} /></div>
            <div>
              <p className="text-gray-900 font-black">support@rescrapx.com</p>
              <p className="text-[10px] font-medium text-gray-400">We reply within 2 hours</p>
            </div>
          </div>

          <button className="bg-white border border-gray-200 text-gray-700 hover:text-gray-900 font-bold px-4 py-2.5 rounded-xl transition shadow-2xs flex items-center gap-1.5 shrink-0">
            <span>Contact Support</span>
          </button>
        </div>
      </div>

    </div>
  );
}