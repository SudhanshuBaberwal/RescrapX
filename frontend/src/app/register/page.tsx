'use client'

import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckSquare, Square } from 'lucide-react';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-4 md:p-8 font-sans text-gray-800">
      
      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto my-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[820px]">
        
        {/* Left Column: Form Content */}
        <div className="col-span-1 lg:col-span-7 p-8 md:p-14 flex flex-col justify-between h-full order-2 lg:order-1">
          
          {/* Mobile Head Logo */}
          <div className="flex flex-col items-center mb-6 lg:hidden">
            <div className="flex items-center gap-1 text-2xl font-bold text-gray-900 tracking-tight">
              <span className="text-[#0B5B32]">🚗 Rescrap</span>
              <span className="text-[#10B981]">X</span>
            </div>
            <p className="text-[#10B981] text-xs font-medium tracking-wide mt-1">Recycle Today, Drive Tomorrow</p>
          </div>

          <div className="max-w-xl w-full mx-auto my-auto space-y-6">
            {/* Header Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Your Account</h2>
              <p className="text-gray-500 text-sm">Join RescrapX and initiate your green vehicle scrapping journey</p>
            </div>

            {/* Stepper Wizard Indicator Component */}
            <div className="flex items-center justify-center lg:justify-start max-w-sm mx-auto lg:mx-0 py-2">
              <div className="flex flex-col items-center lg:items-start flex-1">
                <div className="w-8 h-8 rounded-full bg-[#0B5B32] text-white flex items-center justify-center text-xs font-bold ring-4 ring-emerald-50">1</div>
                <span className="text-[11px] font-bold text-[#0B5B32] mt-1.5">Basic Info</span>
              </div>
              <div className="h-0.5 bg-gray-100 w-16 -mt-5"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold">2</div>
                <span className="text-[11px] font-semibold text-gray-400 mt-1.5">Verify</span>
              </div>
              <div className="h-0.5 bg-gray-100 w-16 -mt-5"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold">3</div>
                <span className="text-[11px] font-semibold text-gray-400 mt-1.5">Complete</span>
              </div>
            </div>

            {/* Main Multi-input Form */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Full Name</label>
                <div className="relative flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition">
                  <User size={18} className="absolute left-4 text-gray-400" />
                  <input type="text" placeholder="Enter your full name" className="w-full pl-11 pr-4 py-3 text-sm outline-none font-medium text-gray-800" />
                </div>
              </div>

              {/* Mobile Input */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Mobile Number</label>
                <div className="flex border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition">
                  <div className="flex items-center bg-gray-50 px-4 border-r border-gray-100 gap-2 text-sm font-semibold text-gray-700">
                    <span className="w-5 h-3.5 bg-orange-400 block relative overflow-hidden rounded-sm">
                      <span className="absolute inset-x-0 top-1/3 bottom-1/3 bg-white"></span>
                      <span className="absolute inset-x-0 bottom-0 bg-green-600"></span>
                    </span>
                    <span>+91</span>
                    <span className="text-gray-400 text-[10px]">▼</span>
                  </div>
                  <input type="tel" placeholder="Enter your mobile number" className="w-full px-4 py-3 text-sm outline-none font-medium text-gray-800" />
                </div>
              </div>

              {/* Email Fields */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Email Address <span className="text-gray-400 font-normal lowercase">(optional)</span></label>
                <div className="relative flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition">
                  <Mail size={18} className="absolute left-4 text-gray-400" />
                  <input type="email" placeholder="Enter your email address" className="w-full pl-11 pr-4 py-3 text-sm outline-none font-medium text-gray-800" />
                </div>
              </div>

              {/* Create Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Password</label>
                <div className="relative flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition">
                  <Lock size={18} className="absolute left-4 text-gray-400" />
                  <input type={showPassword ? "text" : "password"} placeholder="Create a password" className="w-full pl-11 pr-10 py-3 text-sm outline-none font-medium text-gray-800" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                <p className="text-[10px] text-gray-400 font-medium mt-1 leading-normal">Min. 8 characters with numbers & letters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Confirm Password</label>
                <div className="relative flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition">
                  <Lock size={18} className="absolute left-4 text-gray-400" />
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" className="w-full pl-11 pr-10 py-3 text-sm outline-none font-medium text-gray-800" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 text-gray-400">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>

              {/* Terms and conditions segment */}
              <div className="sm:col-span-2 flex items-start gap-3 py-2">
                <button type="button" onClick={() => setAgreeTerms(!agreeTerms)} className="mt-0.5 text-[#0B5B32] flex-shrink-0">
                  {agreeTerms ? <CheckSquare size={20} className="fill-[#0B5B32] stroke-white" /> : <Square size={20} className="text-gray-300" />}
                </button>
                <p className="text-xs text-gray-500 leading-normal font-medium">
                  I expressly verify and agree to the <a href="#" className="text-[#0B5B32] font-bold hover:underline">Terms & Conditions</a> along with the company's detailed <a href="#" className="text-[#0B5B32] font-bold hover:underline">Privacy Policy</a>.
                </p>
              </div>

              {/* Register Call to Action */}
              <div className="sm:col-span-2">
                <button type="submit" className="w-full bg-[#0B5B32] hover:bg-[#094d2a] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition">
                  <span>Continue Registration</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>

            {/* Social Oauth Splitting */}
            <div className="relative flex items-center pt-2">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-400 font-bold uppercase tracking-wider">or sign up with</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 border-2 border-gray-100 rounded-xl py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition">Google</button>
              <button className="flex items-center justify-center gap-2 border-2 border-gray-100 rounded-xl py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition">Apple ID</button>
            </div>
          </div>

          {/* Core redirection linking */}
          <div className="text-center mt-6 text-sm text-gray-500 font-medium">
            Already registered an account?{' '}
            <a href="/login" className="text-[#10B981] font-extrabold hover:underline">
              Login here
            </a>
          </div>
        </div>

        {/* Right Column: Dynamic Informative Feature Grid Showcase Sidebar (Visible on lg layout) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-tr from-gray-900 to-emerald-950 p-12 flex-col justify-between text-white relative order-1 lg:order-2">
          
          {/* Top Brand Tag */}
          <div>
            <div className="flex items-center gap-1.5 text-2xl font-bold tracking-tight">
              <span>🚗 Rescrap</span>
              <span className="text-[#10B981]">X</span>
            </div>
            <p className="text-emerald-400 text-xs font-medium tracking-wide mt-1">Recycle Today, Drive Tomorrow</p>
          </div>

          {/* Core Corporate Values List Block */}
          <div className="space-y-8 my-auto pr-4">
            <div>
              <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">01 / Secure Assets</h4>
              <h3 className="text-lg font-bold text-white mb-2">Bank-Level Security Structuring</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Every piece of user information, document upload, and credential hash is preserved under protected isolated databases.</p>
            </div>

            <div>
              <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">02 / Open Framework</h4>
              <h3 className="text-lg font-bold text-white mb-2">100% Operational Transparency</h3>
              <p className="text-gray-400 text-xs leading-relaxed">No hidden processing dues, zero regulatory surprises. Keep real-time tracking loops over valuation estimates directly.</p>
            </div>

            <div>
              <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">03 / Certified Scrapping</h4>
              <h3 className="text-lg font-bold text-white mb-2">Legal Compliance Protocols</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Fully aligned with governmental vehicle deregistration frameworks, delivering formal destruction certifications seamlessly.</p>
            </div>
          </div>

          {/* Footer stats signature */}
          <div className="border-t border-emerald-800/60 pt-4 flex justify-between items-center text-[11px] font-medium text-emerald-300">
            <span>Clean Tech Certified Platform</span>
            <span>v2.4.0</span>
          </div>
        </div>

      </div>

      <p className="text-center text-xs text-gray-400 font-medium mt-8">
        © 2026 RescrapX Inc. All legal architecture secured.
      </p>
    </div>
  );
}