'use client';

import React, { useState } from 'react';
import { 
  Building2, ShieldCheck, Scale, TrendingUp, Eye, EyeOff, 
  Mail, Smartphone, Headphones
} from 'lucide-react';

export default function LoginPartnerPortal() {
  const [showPassword, setShowPassword] = useState(false);

  const complianceFeatures = [
    { label: 'Government Authorized RVSF Platform', icon: Building2 },
    { label: '100% Legal & Compliant Process', icon: Scale },
    { label: 'Secure & Transparent Operations', icon: ShieldCheck },
    { label: 'Grow Your Business with RescrapX', icon: TrendingUp },
  ];

  const footerHighlights = [
    { label: 'Government Authorized Platform', icon: Building2 },
    { label: 'RVSF Guidelines Compliant', icon: Scale },
    { label: 'Secure & Transparent Process', icon: ShieldCheck },
    { label: 'Dedicated Partner Support', icon: Headphones },
  ];

  return (
   <div className="h-screen overflow-hidden bg-white flex w-full text-sm text-gray-700 font-medium antialiased">
      <div className="w-full flex flex-col lg:flex-row items-stretch">
        
        {/* LEFT COLUMN: BRAND MARKETING SIDEBAR (Fluid Width) */}
        <div className="w-full lg:w-[35%] xl:w-[30%] bg-gradient-to-b from-gray-50 to-gray-100 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200 shrink-0">
          <div className="space-y-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                Rescrap<span className="text-[#0B5B32]">X</span>
              </h1>
              <p className="text-xs text-[#0B5B32] font-black uppercase tracking-widest">RVSF Partner Portal</p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-3 bg-white border border-emerald-100 rounded-xl p-4 shadow-xs">
                <ShieldCheck className="text-[#0B5B32] shrink-0 mt-0.5" size={22} />
                <p className="font-bold text-gray-900 text-sm leading-snug">
                  Authorized RVSF partners building a sustainable and compliant ecosystem.
                </p>
              </div>

              <div className="space-y-4 pl-1">
                {complianceFeatures.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3.5 text-gray-700">
                      <div className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 shrink-0 shadow-2xs">
                        <Icon size={16} />
                      </div>
                      <span className="font-bold text-sm">{feat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 bg-gray-200/50 rounded-2xl border border-gray-200/60 overflow-hidden relative aspect-video flex items-center justify-center text-center p-6 shadow-2xs">
            <div className="absolute inset-0 bg-[#0B4026]/5 mix-blend-multiply z-10" />
            <div className="z-20 text-gray-400 font-bold">
              <p className="text-3xl">🚚</p>
              <p className="text-xs tracking-tight text-gray-600 font-black mt-2">RescrapX Logistics & Fleet Network</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CORE FORM FRAME CONTAINER (Takes full remaining screen space) */}
        <div className="flex-1 p-6 sm:p-12 md:p-16 flex flex-col justify-between space-y-12 bg-white">
          <div className="text-right hidden sm:block self-end">
            <span className="text-3xl font-black text-gray-900 block tracking-tight uppercase">India's Digital Platform</span>
            <span className="text-[15px] text-gray-400 font-bold block mt-0.5">for Responsible Vehicle Scrapping</span>
          </div>

          {/* Form wrapper fluid stretching but centered cleanly */}
          <div className="w-full max-w-xl mx-auto space-y-8 py-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back!</h2>
              <p className="text-sm text-gray-400 font-semibold">Login to your RVSF Partner account</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Registered Email / Mobile Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Enter email or mobile number" 
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-base text-gray-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all shadow-2xs"
                  />
                  <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Password</label>
                  <button type="button" className="text-[#0B5B32] font-black text-xs hover:underline cursor-pointer">Forgot Password?</button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Enter your password" 
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-base text-gray-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all shadow-2xs"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#0B5B32] hover:bg-[#073d21] text-white font-black py-3.5 rounded-xl shadow-xs transition-all text-center text-sm tracking-wide uppercase cursor-pointer mt-4">
                Login
              </button>
            </form>

            <div className="relative flex py-2 items-center justify-center">
              <div className="absolute left-0 right-0 border-t border-gray-200" />
              <span className="relative bg-white px-4 text-xs text-gray-400 font-black tracking-widest uppercase">OR</span>
            </div>

            <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black py-3 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 text-sm cursor-pointer">
              <Smartphone size={16} className="text-[#0B5B32]" />
              <span>Login with Mobile OTP</span>
            </button>

            <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl flex items-center gap-2.5 justify-center text-[#0B5B32] font-black text-xs shadow-2xs">
              <ShieldCheck size={16} />
              <span>Secure login for authorized RVSF partners only.</span>
            </div>

            <p className="text-center text-sm text-gray-400 font-bold">
              Don't have an account? <a href="/signup" className="text-[#0B5B32] font-black hover:underline">Create Account</a>
            </p>
          </div>

          {/* LOWER COMPLIANCE FOOTER MARKS */}
          <div className="border-t border-gray-100 pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {footerHighlights.map((hl, itemIdx) => {
                const HlIcon = hl.icon;
                return (
                  <div key={itemIdx} className="flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-400 font-bold text-xs">
                    <HlIcon size={14} className="text-gray-400 shrink-0" />
                    <span className="leading-tight">{hl.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}