'use client'

import React from 'react';
import { Leaf, ShieldCheck, Users, Gift, ArrowRight } from 'lucide-react';

export default function AboutUs() {
  const features = [
    {
      icon: Leaf,
      title: "Eco-Friendly",
      desc: "Promoting a cleaner and greener planet.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Compliant",
      desc: "Following government guidelines and standards.",
    },
    {
      icon: Users,
      title: "Trusted Network",
      desc: "Working with authorized RVSFs across India.",
    },
    {
      icon: Gift,
      title: "Rewarding Experience",
      desc: "Better value and transparent process for everyone.",
    },
  ];

  return (
    <section className="w-full bg-[#FAFBF9] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-0">
        
        {/* Main Section: 2 Column Layout to keep Text & Image separate */}
        <div className="relative w-full rounded-t-3xl bg-white overflow-hidden p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Text Content Area */}
          <div className="w-full lg:w-[45%] space-y-6 z-10 shrink-0">
            
            <div className="space-y-3">
              <span className="text-xs font-black tracking-widest text-[#0B5B32] uppercase">
                ABOUT US
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-gray-900 leading-[1.15] tracking-tight">
                Building a Cleaner, <br />
                Better <span className="text-[#0B5B32]">Tomorrow.</span>
              </h1>
              
              <div className="w-10 h-[3px] bg-[#0B5B32] rounded-full mt-2" />
            </div>

            <div className="space-y-4 text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed">
              <p>
                RescrapX is India&apos;s digital platform that makes vehicle scrapping simple, transparent and rewarding for everyone.
              </p>
              <p>
                We connect vehicle owners with trusted RVSFs to ensure safe disposal, environmental protection and complete compliance.
              </p>
            </div>

          </div>

          {/* Right Image Container - Maintains natural aspect ratio */}
          <div className="w-full lg:w-[55%] flex items-center justify-center lg:justify-end">
            <img
              src="/Gemini_Generated_Image_q2253fq2253fq225.png"
              alt="RescrapX Scrapping Truck"
              className="w-full h-auto max-h-[420px] object-contain rounded-2xl"
            />
          </div>

        </div>

        {/* Bottom Feature Cards overlapping smoothly */}
        <div className="relative z-20 -mt-6 sm:-mt-8 mx-2 sm:mx-6 bg-white border border-gray-100/80 rounded-3xl p-6 sm:p-8 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex flex-col items-center text-center space-y-3 ${
                  index !== 0 ? 'pt-6 sm:pt-0 sm:pl-4' : ''
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-[#EAF5EE] flex items-center justify-center text-[#0B5B32] shrink-0">
                  <Icon size={26} className="stroke-[2.2]" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 max-w-[190px] mx-auto leading-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}