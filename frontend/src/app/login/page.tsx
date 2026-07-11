'use client'

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-4 md:p-8 font-sans text-gray-800">
      
      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto my-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
        
        {/* Left Column: Visual Hero Side (Visible on lg devices) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-emerald-50 via-emerald-100/40 to-white p-12 flex-col justify-between relative overflow-hidden border-r border-gray-100">
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            {/* Minimal abstract city grid graphic line placeholder */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-emerald-200/50 to-transparent border-t border-dashed border-emerald-300"></div>
          </div>

          {/* Logo Branding */}
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-2xl font-bold text-gray-900 tracking-tight">
              <span className="text-[#0B5B32]">🚗 Rescrap</span>
              <span className="text-[#10B981]">X</span>
            </div>
            <p className="text-[#10B981] text-xs font-semibold tracking-wide mt-1">Recycle Today, Drive Tomorrow</p>
          </div>

          {/* Big Featured Graphic Showcase */}
          <div className="relative my-auto flex flex-col items-center text-center z-10">
            <div className="relative mb-6">
              <div className="absolute -right-4 -top-4 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg shadow-emerald-500/20 z-20 animate-bounce-slow">
                <ShieldCheck size={32} className="stroke-2" />
              </div>
              <img 
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=500&q=80" 
                alt="White Sedan showcasing vehicle scrapping service" 
                className="w-72 object-contain drop-shadow-2xl mix-blend-multiply"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Eco-Friendly Vehicle Scrapping</h3>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              Turn your old vehicle into sustainable value. Transparent, certified, and completely hassle-free.
            </p>
          </div>

          {/* Micro Trust badge */}
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-100/60 w-fit px-3 py-1.5 rounded-full z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            100% Government Approved Process
          </div>
        </div>

        {/* Right Column: Login Form Content */}
        <div className="col-span-1 lg:col-span-7 p-8 md:p-14 flex flex-col justify-between h-full">
          
          {/* Mobile Logo View (hidden on lg) */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="flex items-center gap-1 text-2xl font-bold text-gray-900 tracking-tight">
              <span className="text-[#0B5B32]">🚗 Rescrap</span>
              <span className="text-[#10B981]">X</span>
            </div>
            <p className="text-[#10B981] text-xs font-medium tracking-wide mt-1">Recycle Today, Drive Tomorrow</p>
          </div>

          <div className="max-w-md w-full mx-auto my-auto space-y-7">
            {/* Header Description */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-500 text-sm">Login to manage your vehicle scrapping progress</p>
            </div>

            {/* Input Form Fields */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              {/* Mobile Input Component */}
              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-2">Mobile Number</label>
                <div className="flex border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition bg-gray-50/50">
                  <div className="flex items-center bg-gray-50 px-4 border-r border-gray-100 gap-2 text-sm font-semibold text-gray-700">
                    <span className="w-5 h-3.5 bg-orange-400 block relative overflow-hidden rounded-sm shadow-sm">
                      <span className="absolute inset-x-0 top-1/3 bottom-1/3 bg-white"></span>
                      <span className="absolute inset-x-0 bottom-0 bg-green-600"></span>
                    </span>
                    <span>+91</span>
                    <span className="text-gray-400 text-[10px]">▼</span>
                  </div>
                  <input 
                    type="tel" 
                    placeholder="Enter your mobile number" 
                    className="w-full px-4 py-3.5 text-sm bg-white outline-none placeholder-gray-400 font-medium text-gray-800"
                  />
                </div>
              </div>

              {/* Password Input Component */}
              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-2">Password</label>
                <div className="relative flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    className="w-full px-4 py-3.5 text-sm outline-none placeholder-gray-400 font-medium text-gray-800 pr-12"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="text-right mt-2">
                  <a href="#" className="text-[#10B981] text-xs font-bold hover:underline tracking-wide">Forgot Password?</a>
                </div>
              </div>

              {/* Action Button */}
              <button type="submit" className="w-full bg-[#0B5B32] hover:bg-[#094d2a] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 transition duration-150 transform active:scale-[0.99] mt-2">
                <span>Login Securely</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Separator Layout */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-400 font-bold tracking-wider uppercase">or continue with</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Social Authentication */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2.5 border-2 border-gray-100 rounded-xl py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.38-2.31V6.54H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.46l4.11-3.22z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.46l4.11 3.22c.94-2.85 3.57-4.93 6.68-4.93z"/></svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2.5 border-2 border-gray-100 rounded-xl py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition">
                <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.74-1.2 1.88-1.05 3 .1 1.12 1.19 1.93 2.12 1.93.1 0 .21-.01.31-.02.6-.57 1.1-1.36 1.44-2.36z"/></svg>
                Apple Identity
              </button>
            </div>

            {/* Inline Privacy Note */}
            <div className="flex gap-3 items-start bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
              <ShieldCheck className="text-[#10B981] flex-shrink-0 mt-0.5" size={18} />
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                Your data security is our priority. We deploy military-grade encryption protocols to insulate sensitive operational information.
              </p>
            </div>
          </div>

          {/* Toggle Redirection */}
          <div className="text-center mt-8 text-sm text-gray-500 font-medium">
            Don't have a secure account?{' '}
            <a href="/signup" className="text-[#10B981] font-extrabold hover:underline transition">
              Create Account
            </a>
          </div>
        </div>

      </div>

      {/* Corporate Copyright text */}
      <p className="text-center text-xs text-gray-400 font-medium mt-8">
        © 2026 RescrapX Inc. All legal architecture secured.
      </p>
    </div>
  );
}