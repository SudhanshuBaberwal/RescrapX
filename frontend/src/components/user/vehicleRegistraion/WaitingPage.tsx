'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, ShieldAlert, ArrowLeft, Home, RefreshCw, 
  CheckCircle2, FileText, PhoneCall, HelpCircle, Car
} from 'lucide-react';

interface ApprovalPendingProps {
  vehicleDetails?: {
    id?: string;
    registrationNumber?: string;
    brandModel?: string;
    submittedDate?: string;
  };
}

export default function VehicleApprovalPendingPage({ vehicleDetails }: ApprovalPendingProps) {
  const router = useRouter();

  // Fallback demo data if props aren't provided
  const details = {
    id: vehicleDetails?.id || 'RSX-2026-9982',
    registrationNumber: vehicleDetails?.registrationNumber || 'MH 02 CL 4589',
    brandModel: vehicleDetails?.brandModel || 'Maruti Suzuki Swift (2015)',
    submittedDate: vehicleDetails?.submittedDate || '04 Aug 2026, 10:15 AM'
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-xs">
      
      {/* MAIN CONTAINER */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-3xs space-y-8">
        
        {/* HERO HEADER STATUS BANNER */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-xl mx-auto pt-2">
          
          {/* Animated Clock / Pending Icon */}
          <div className="relative">
            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center border border-amber-100 shadow-3xs">
              <Clock size={40} className="animate-pulse stroke-[1.75]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-white">
              <ShieldAlert size={14} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/80 text-amber-800 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              Under Verification
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Vehicle Registration Pending Approval
            </h1>
            <p className="text-xs font-semibold text-gray-400 max-w-md mx-auto leading-relaxed">
              Your vehicle details and uploaded documents are currently being reviewed by our verification team.
            </p>
          </div>
        </div>

        {/* STATUS PROGRESS TIMELINE TRACKER */}
        <div className="border border-gray-100 rounded-2xl p-5 bg-[#F9FAFB] space-y-3">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider text-center sm:text-left">
            Approval Progress
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative pt-1">
            
            {/* Step 1: Completed */}
            <div className="flex items-center gap-3 bg-white border border-gray-100 p-3.5 rounded-xl shadow-3xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0B5B32] border border-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="font-black text-gray-800 text-[11px]">1. Form Submitted</p>
                <p className="text-[9px] text-gray-400 font-medium">Completed successfully</p>
              </div>
            </div>

            {/* Step 2: In Progress */}
            <div className="flex items-center gap-3 bg-white border border-amber-200 p-3.5 rounded-xl shadow-3xs ring-2 ring-amber-500/10">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                <Clock size={16} className="animate-spin" />
              </div>
              <div>
                <p className="font-black text-gray-900 text-[11px]">2. Document Review</p>
                <p className="text-[9px] text-amber-600 font-bold">In Progress (Est. 2-4 hrs)</p>
              </div>
            </div>

            {/* Step 3: Pending */}
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-3.5 rounded-xl opacity-60">
              <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                <FileText size={16} />
              </div>
              <div>
                <p className="font-black text-gray-600 text-[11px]">3. Final Offer Unlock</p>
                <p className="text-[9px] text-gray-400 font-medium">Unlocks after approval</p>
              </div>
            </div>

          </div>
        </div>

        {/* DETAILS GRID + ADVISORY BOX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Registered Vehicle Summary Card */}
          <div className="lg:col-span-7 border border-gray-100 rounded-2xl p-5 bg-white space-y-4 shadow-3xs">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3">
              <div className="flex items-center gap-2 font-black text-gray-800 text-xs">
                <Car size={16} className="text-[#0B5B32]" />
                <h3>Application Summary</h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                ID: {details.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-0.5">
                <p className="text-gray-400 font-medium text-[10px]">Vehicle / Model</p>
                <p className="font-black text-gray-800 text-xs">{details.brandModel}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-gray-400 font-medium text-[10px]">Registration Number</p>
                <p className="font-black text-gray-800 text-xs uppercase">{details.registrationNumber}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-gray-400 font-medium text-[10px]">Submission Date</p>
                <p className="font-black text-gray-800 text-xs">{details.submittedDate}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-gray-400 font-medium text-[10px]">Status</p>
                <p className="font-black text-amber-600 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending Admin Review
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Help & Instant Support Card */}
          <div className="lg:col-span-5 border border-emerald-100 rounded-2xl p-5 bg-emerald-50/20 space-y-4 shadow-3xs">
            <div className="flex items-center gap-2 font-black text-emerald-950 text-xs">
              <HelpCircle size={16} className="text-[#0B5B32]" />
              <h3>Need Urgent Approval?</h3>
            </div>
            
            <p className="text-gray-600 font-medium leading-relaxed text-[11px]">
              Our admin team typically verifies records within 2–4 business hours. If you need immediate assistance or uploaded incorrect documents, contact support.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a 
                href="tel:18001234567" 
                className="flex-1 bg-white border border-emerald-200 hover:bg-emerald-50 text-[#0B5B32] font-black py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all text-[11px]"
              >
                <PhoneCall size={13} />
                <span>Call Support</span>
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM ACTION BUTTON RAIL */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={() => router.push('/')}
              className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-3xs cursor-pointer"
            >
              <Home size={14} strokeWidth={2.5} />
              <span>Back to Home</span>
            </button>

            <button 
              type="button" 
              onClick={() => router.back()}
              className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-3xs cursor-pointer"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>Previous Page</span>
            </button>
          </div>

          <button 
            type="button" 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <RefreshCw size={14} strokeWidth={2.5} />
            <span>Check Approval Status</span>
          </button>

        </div>

      </div>

    </div>
  );
}