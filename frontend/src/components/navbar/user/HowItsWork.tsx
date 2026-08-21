'use client'

import React from 'react';
import { Leaf } from 'lucide-react';

export default function HowItWorksSteps() {
  const steps = [
    {
      step: 1,
      title: "Register",
      desc: "Create your account in minutes.",
      icon: (
        <div className="relative w-10 h-14 bg-white border border-gray-300 rounded-md p-1.5 flex flex-col items-center justify-between shadow-2xs">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-[10px] font-bold">
            👤
          </div>
          <div className="w-full space-y-1">
            <div className="w-full h-1 bg-gray-200 rounded"></div>
            <div className="w-2/3 h-1 bg-gray-200 rounded"></div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0B5B32] rounded-full flex items-center justify-center text-white text-[8px] font-bold ring-2 ring-white">
            ✓
          </div>
        </div>
      ),
    },
    {
      step: 2,
      title: "Submit Vehicle Details",
      desc: "Provide basic details about your vehicle.",
      icon: (
        <div className="relative w-10 h-14 bg-white border border-gray-300 rounded-md p-1 flex flex-col items-center justify-between shadow-2xs">
          <div className="w-7 h-4 bg-[#0B5B32] rounded-xs mt-1 relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 absolute -bottom-0.5 left-0.5"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 absolute -bottom-0.5 right-0.5"></div>
          </div>
          <div className="w-full space-y-1 my-1">
            <div className="w-full h-1 bg-gray-200 rounded"></div>
            <div className="w-3/4 h-1 bg-gray-200 rounded"></div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0B5B32] rounded-full flex items-center justify-center text-white text-[9px] font-bold ring-2 ring-white">
            +
          </div>
        </div>
      ),
    },
    {
      step: 3,
      title: "Get Bids",
      desc: "Receive best offers from verified RVSFs.",
      icon: (
        <div className="flex flex-col items-center justify-center h-14">
          <div className="w-9 h-6 border-t-3 border-r-3 border-slate-800 rotate-45 transform origin-bottom-left -translate-y-1"></div>
          <div className="w-9 h-2 bg-slate-800 rounded-xs"></div>
        </div>
      ),
    },
    {
      step: 4,
      title: "Choose Best Offer",
      desc: "Compare offers and select the best one for you.",
      icon: (
        <div className="w-9 h-14 border border-slate-800 rounded-lg p-1 bg-white flex flex-col justify-between shadow-2xs">
          <div className="w-full h-2.5 bg-gray-100 rounded flex items-center justify-between px-1">
            <span className="text-[7px] font-bold text-gray-700">₹</span>
            <div className="w-3 h-0.5 bg-gray-300"></div>
          </div>
          <div className="w-full h-2.5 bg-[#0B5B32] rounded flex items-center justify-between px-1">
            <span className="text-[7px] font-bold text-white">₹</span>
            <div className="w-3 h-0.5 bg-emerald-200"></div>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded flex items-center justify-between px-1">
            <span className="text-[7px] font-bold text-gray-700">₹</span>
            <div className="w-3 h-0.5 bg-gray-300"></div>
          </div>
        </div>
      ),
    },
    {
      step: 5,
      title: "Schedule Pickup",
      desc: "Accept the offer and choose convenient date and time.",
      icon: (
        <div className="relative w-11 h-12 bg-white border border-gray-300 rounded-md shadow-2xs">
          <div className="w-full h-3 bg-[#0B5B32] rounded-t-xs flex justify-around items-center px-1">
            <div className="w-1 h-1.5 bg-emerald-900 rounded-xs -mt-1"></div>
            <div className="w-1 h-1.5 bg-emerald-900 rounded-xs -mt-1"></div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 border-r border-b border-slate-800 transform rotate-45 -translate-y-0.5 -translate-x-0.5"></div>
          </div>
        </div>
      ),
    },
    {
      step: 6,
      title: "Vehicle Pickup",
      desc: "Our team picks up your vehicle from your location.",
      icon: (
        <div className="flex items-end justify-center h-12 pb-1">
          <div className="relative flex items-end">
            <div className="w-5 h-3.5 bg-[#0B5B32] rounded-xs border-r border-emerald-900"></div>
            <div className="w-4 h-5 bg-[#0B5B32] rounded-r-md flex flex-col justify-between p-0.5">
              <div className="w-2 h-1.5 bg-slate-900 rounded-xs self-end"></div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 absolute -bottom-1 left-0.5 border border-white"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 absolute -bottom-1 right-0.5 border border-white"></div>
          </div>
        </div>
      ),
    },
    {
      step: 7,
      title: "Payment is Done",
      desc: "Payment is processed securely as per the offer.",
      icon: (
        <div className="relative w-9 h-14 border border-slate-800 rounded-lg p-1 bg-white flex flex-col items-center justify-center shadow-2xs">
          <span className="text-lg font-black text-gray-800">₹</span>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0B5B32] rounded-full flex items-center justify-center text-white text-[8px] font-bold ring-2 ring-white">
            ✓
          </div>
        </div>
      ),
    },
    {
      step: 8,
      title: "Vehicle Scrapped Responsibly",
      desc: "Your vehicle is scrapped in an eco-friendly manner.",
      icon: (
        <div className="w-10 h-10 flex items-center justify-center text-[#0B5B32] font-black text-3xl">
          ♻
        </div>
      ),
    },
    {
      step: 9,
      title: "Get Confirmation",
      desc: "Receive certificate & instant updates.",
      icon: (
        <div className="relative w-10 h-14 bg-white border border-gray-300 rounded-md p-1.5 flex flex-col justify-between shadow-2xs">
          <div className="w-full space-y-1">
            <div className="w-full h-1 bg-gray-300 rounded"></div>
            <div className="w-3/4 h-1 bg-gray-200 rounded"></div>
            <div className="w-4/5 h-1 bg-gray-200 rounded"></div>
            <div className="w-2/3 h-1 bg-gray-200 rounded"></div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0B5B32] rounded-full flex items-center justify-center text-white text-[8px] font-bold ring-2 ring-white">
            ✓
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Leaves Watermark */}
      <div className="absolute top-0 left-0 pointer-events-none opacity-20">
        <Leaf size={160} className="text-[#0B5B32] -rotate-45 -translate-x-12 -translate-y-12 stroke-[1]" />
      </div>
      <div className="absolute top-0 right-0 pointer-events-none opacity-20">
        <Leaf size={160} className="text-[#0B5B32] rotate-45 translate-x-12 -translate-y-12 stroke-[1] scale-x-[-1]" />
      </div>

      {/* Title Header */}
      <div className="text-center space-y-1.5 relative z-10">
        <span className="text-[11px] font-extrabold tracking-widest text-[#0B5B32] uppercase">
          HOW IT WORKS
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Simple Steps, <span className="text-[#0B5B32]">Greener Tomorrow</span>
        </h2>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="w-10 h-[1.5px] bg-[#0B5B32]"></div>
          <div className="w-3.5 h-3.5 bg-[#0B5B32] rounded-tl-full rounded-br-full transform rotate-45"></div>
          <div className="w-10 h-[1.5px] bg-[#0B5B32]"></div>
        </div>
      </div>

      {/* Steps Horizontal Flow */}
      <div className="mt-12 overflow-x-auto no-scrollbar pb-2">
        <div className="min-w-[1040px] px-2">
          
          {/* Step Number Timeline */}
          <div className="flex items-center justify-between relative mb-8 px-6">
            {steps.map((item, index) => (
              <React.Fragment key={item.step}>
                <div className="w-9 h-9 rounded-full border border-[#0B5B32] bg-white text-[#0B5B32] font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                  {item.step}
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 flex items-center justify-center mx-1">
                    <div className="w-full border-t border-dashed border-[#0B5B32] relative flex items-center justify-end">
                      <div className="w-1.5 h-1.5 border-t border-r border-[#0B5B32] transform rotate-45 -mr-0.5"></div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Cards & Step Details */}
          <div className="grid grid-cols-9 gap-3 text-center">
            {steps.map((item) => (
              <div key={item.step} className="flex flex-col items-center space-y-3">
                {/* Clean Light Card */}
                <div className="w-full bg-[#F4F6F4] rounded-2xl p-2 h-32 flex items-center justify-center relative">
                  {item.icon}
                </div>

                {/* Text Content */}
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-gray-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] font-medium text-gray-500 leading-tight">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom Feature Pill Bar */}
      <div className="mt-12 bg-[#F4F6F4] rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-200 max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 pt-2 md:pt-0">
          <div className="w-8 h-8 rounded-full bg-[#0B5B32] flex items-center justify-center text-white text-xs font-bold shrink-0">
            ✓
          </div>
          <span className="text-xs font-black text-gray-800 leading-tight text-left">
            Secure &amp;<br />Verified Process
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2 md:pt-0">
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-[#0B5B32] flex items-center justify-center text-[#0B5B32] text-xs font-bold shrink-0">
            🍃
          </div>
          <span className="text-xs font-black text-gray-800 leading-tight text-left">
            Environment<br />Friendly
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2 md:pt-0">
          <div className="w-8 h-8 rounded-full bg-emerald-100 border border-[#0B5B32] flex items-center justify-center text-[#0B5B32] text-xs font-bold shrink-0">
            🕒
          </div>
          <span className="text-xs font-black text-gray-800 leading-tight text-left">
            Quick &amp;<br />Hassle-free
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2 md:pt-0">
          <div className="w-8 h-8 rounded-full bg-[#0B5B32] flex items-center justify-center text-white text-xs font-bold shrink-0">
            ★
          </div>
          <span className="text-xs font-black text-gray-800 leading-tight text-left">
            100% Compliant<br />&amp; Transparent
          </span>
        </div>
      </div>
    </section>
  );
}