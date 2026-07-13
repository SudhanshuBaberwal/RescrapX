'use client';

import React from 'react';
import { 
  Building2, ShieldCheck, Scale, TrendingUp, UploadCloud, 
  ChevronDown, Headphones
} from 'lucide-react';

export default function SignUpPartnerPortal() {

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
    <div className="min-h-screen bg-white flex w-full text-sm text-gray-700 font-medium antialiased">
      <div className="w-full flex flex-col lg:flex-row items-stretch">
        
        {/* LEFT COLUMN: BRAND MARKETING SIDEBAR (Fluid Width) */}
        <div className="w-full lg:w-[30%] xl:w-[25%] bg-gradient-to-b from-gray-50 to-gray-100 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200 shrink-0">
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

        {/* RIGHT COLUMN: DETAILED STEPPED SHEET SIGN UP CONFIGURATION (Spans remainder of window) */}
        <div className="flex-1 p-6 sm:p-12 md:p-16 flex flex-col justify-between space-y-12 bg-white">
          <div className="text-right hidden sm:block self-end">
            <span className="text-xs font-black text-gray-900 block tracking-tight uppercase">India's Digital Platform</span>
            <span className="text-[11px] text-gray-400 font-bold block mt-0.5">for Responsible Vehicle Scrapping</span>
          </div>

          <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Create Your RVSF Account</h2>
              <p className="text-sm text-gray-400 font-semibold">Register your RVSF and authorized person details</p>
            </div>

            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              
              {/* CATEGORY 1: COMPANY REGISTRATION PARAMETERS BLOCK */}
              <div className="space-y-4">
                <h4 className="font-black text-[#0B5B32] text-xs border-b border-gray-200 pb-2 uppercase tracking-widest">1. RVSF / Company Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Company Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Enter company name" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-700 shadow-2xs" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">GST Number <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Enter GST number" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-700 shadow-2xs" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">PAN Number <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Enter PAN number" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-700 shadow-2xs" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Company Registration Number <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Enter registration number" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-700 shadow-2xs" />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Registered Address <span className="text-red-500">*</span></label>
                    <textarea rows={2.5} placeholder="Enter complete registered address" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-700 resize-none shadow-2xs" />
                  </div>
                </div>
              </div>

              {/* CATEGORY 2: AUTHORIZED SIGNATORY CONTACT */}
              <div className="space-y-4">
                <h4 className="font-black text-[#0B5B32] text-xs border-b border-gray-200 pb-2 uppercase tracking-widest">2. Authorized Person Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Authorized Person Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Enter authorized person name" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-700 shadow-2xs" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="Enter email address" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-base text-gray-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-700 shadow-2xs" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></label>
                    <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50/50 shadow-2xs focus-within:ring-2 focus-within:ring-emerald-700">
                      <div className="px-4 bg-gray-100 border-r border-gray-200 text-gray-700 font-black flex items-center gap-1 text-sm">
                        <span>+91</span>
                        <ChevronDown size={14} className="text-gray-400" />
                      </div>
                      <input type="tel" placeholder="Enter phone number" className="w-full bg-transparent px-4 py-2.5 text-base text-gray-900 font-bold focus:outline-hidden" />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Authorized Signatory ID Proof <span className="text-red-500">*</span></label>
                    <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                      <div className="flex items-start gap-3">
                        <UploadCloud size={22} className="text-gray-400 mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                          <span className="font-bold text-sm text-gray-700 block">Upload ID Proof Document</span>
                          <span className="text-xs text-gray-400 block font-semibold">(Aadhaar Card, PAN Card, Voter ID, or Driving License)</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-bold shrink-0 bg-white px-3 py-1 border border-gray-100 rounded-lg">Max. 5MB (JPG, PNG, PDF)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CATEGORY 3: MANDATORY LEGAL COMPLIANCE DOCUMENTS FILE BOXES */}
              <div className="space-y-4">
                <h4 className="font-black text-[#0B5B32] text-xs border-b border-gray-200 pb-2 uppercase tracking-widest">3. RVSF Documents (Upload)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: 'RVSF Authorization Certificate' },
                    { label: 'GST Certificate' },
                    { label: 'PAN Card' },
                    { label: 'Company Registration Certificate' },
                    { label: 'Bank Account Details', extra: '(Cancelled Cheque / Bank Statement)' },
                  ].map((doc, idx) => (
                    <div key={idx} className="border border-gray-200 bg-gray-50/20 rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-2xs">
                      <div className="space-y-1 min-w-0">
                        <label className="text-sm text-gray-800 font-black block truncate">{doc.label} <span className="text-red-500">*</span></label>
                        {doc.extra && <span className="text-xs text-gray-400 block font-semibold leading-none">{doc.extra}</span>}
                      </div>
                      <button type="button" className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs cursor-pointer w-full mt-2 transition-all">
                        <UploadCloud size={14} className="text-gray-400" />
                        <span>Upload File</span>
                      </button>
                      <span className="text-[10px] text-gray-400 font-semibold block text-center pt-1 border-t border-gray-100">PDF, JPG, PNG — Max. 5MB</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2.5 pt-2">
                <input type="checkbox" id="signup-consent" className="mt-0.5 rounded-sm border-gray-300 text-emerald-700 focus:ring-emerald-700 h-4 w-4 cursor-pointer" />
                <label htmlFor="signup-consent" className="text-xs text-gray-500 font-bold leading-relaxed select-none cursor-pointer">
                  I confirm that all the information provided above is true and correct under standard authorized RVSF compliance declarations.
                </label>
              </div>

              <div className="space-y-4 pt-2">
                <button type="submit" className="w-full bg-[#0B5B32] hover:bg-[#073d21] text-white font-black py-3.5 rounded-xl shadow-xs transition-all text-center text-sm uppercase tracking-wide cursor-pointer">
                  Create Account
                </button>
                <p className="text-center text-sm text-gray-400 font-bold">
                  Already have an account? <a href="/login" className="text-[#0B5B32] font-black hover:underline">Login</a>
                </p>
              </div>
            </form>
          </div>

          {/* LOWER COMPLIANCE FOOTER MARKS */}
          <div className="border-t border-gray-100 pt-6 mt-auto">
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