'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Star, PlusCircle, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setVehicleData } from '@/store/vehicleSlice';
import { createDraftVehicle } from '@/services/vehicle.service';

export default function JourneyAndReviews() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const { vehicleData } = useSelector((state: RootState) => state.vehicle);

  const handleRegister = async () => {
    if (vehicleData != null) {
      router.push(`/register-vehicle/${vehicleData.currentStep}`);
      return;
    }
    setLoading(true);
    try {
      await createDraftVehicle();
      router.push("/user/my-vehicles");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-4 space-y-14 bg-white">

      {/* WORKFLOW STEP COMPONENT TIMELINE */}
      <div className="text-center space-y-8">
        <div>
          <h2 className="text-2xl font-black text-[#1F2937] tracking-tight">
            Your Vehicle's Journey With <span className="text-[#0B5B32]">RescrapX</span>
          </h2>
          <div className="w-14 h-0.75 bg-[#10B981] mx-auto mt-2.5 rounded-full"></div>
        </div>

        {/* Scrollable Timeline Track */}
        <div className="relative overflow-x-auto pb-4 scrollbar-none">
          <div className="min-w-237.5 flex justify-between items-start px-2 relative">

            {/* Dashed Progress Connector Line */}
            <div className="absolute top-7 left-14 right-14 h-0.5 border-t-2 border-dashed border-gray-200 z-0"></div>

            {/* Render Steps with Local SVG Assets */}
            {[
              { id: 1, label: "Valuation Completed", icon: "/01_valuation_completed.svg", done: true },
              { id: 2, label: "Offer Accepted", icon: "/02_offer_accepted.svg", done: true },
              { id: 3, label: "Pickup Scheduled", icon: "/03_pickup_scheduled.svg", current: true },
              { id: 4, label: "Vehicle Picked", icon: "/04_vehicle_picked.svg" },
              { id: 5, label: "Verification Completed", icon: "/05_verification_completed.svg" },
              { id: 6, label: "Payment Initiated", icon: "/06_payment_initiated.svg" },
              { id: 7, label: "Certificate Issued", icon: "/07_certificate_issued.svg" },
              { id: 8, label: "RC Deregistration", icon: "/08_rc_deregistration.svg" }
            ].map((step) => (
              <div key={step.id} className="flex flex-col items-center space-y-2.5 z-10 w-24">

                {/* Main Step SVG Icon Badge Wrapper */}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center p-1 border transition-all ${step.current
                      ? 'bg-white border-[#0B5B32] shadow-md ring-2 ring-[#0B5B32]/20'
                      : step.done
                        ? 'bg-white border-[#10B981]'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}>
                    <Image
                      src={step.icon}
                      alt={step.label}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Step Completed Indicator Ring */}
                  {step.done && (
                    <div className="absolute -bottom-0.5 -right-0.5 bg-[#10B981] rounded-full p-0.5 border border-white">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Step ID Counter Label */}
                <div className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border transition-all ${step.current
                    ? 'bg-[#10B981] text-white border-[#10B981]'
                    : step.done
                      ? 'bg-[#E6F4EA] text-[#0B5B32] border-[#A7F3D0]'
                      : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}>
                  {step.id}
                </div>

                {/* Step Copywriting */}
                <p className={`text-[11px] leading-tight font-bold tracking-tight text-center ${step.current ? 'text-[#0B5B32] font-extrabold' : 'text-gray-500'
                  }`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Form Redirection CTA */}
        <div className="pt-2">
          <button
            onClick={handleRegister}
            className="inline-flex items-center gap-2 bg-[#E6F4EA] hover:bg-[#d8f0dd] text-[#0B5B32] font-black text-xs px-6 py-3 rounded-full transition-all duration-200 shadow-3xs hover:shadow-2xs active:scale-[0.99]"
          >
            <PlusCircle size={15} className="stroke-[2.5]" />
            <span>{loading ? <Loader className="animate-spin" size={15} /> : "Register a New Vehicle for Scrapping"}</span>
            <ArrowRight size={14} className="stroke-[2.5] ml-0.5" />
          </button>
        </div>
      </div>

      {/* AUXILIARY FLEET EXPANSION BANNER */}
      <div className="bg-[#F3F4F6] border border-gray-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden relative shadow-2xs">
        <div className="space-y-2 text-center md:text-left z-10 md:max-w-lg">
          <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Have another vehicle <br className="sm:hidden" /> to scrap?</h3>
          <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed">
            Get instant valuation and the best price in just a few clicks.
          </p>
        </div>

        <div className="flex items-center gap-6 z-10 w-full md:w-auto justify-between md:justify-end flex-wrap sm:flex-nowrap">
          <button
            onClick={() => router.push('?tab=register-vehicle')}
            className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-xs transition w-full sm:w-auto justify-center"
          >
            <span>Get Instant Valuation</span>
            <ArrowRight size={16} />
          </button>

          <div className="hidden lg:flex items-center opacity-80 mix-blend-multiply pointer-events-none select-none">
            <span className="text-5xl">🚚</span>
          </div>
        </div>
      </div>

      {/* BRAND REVIEW STATISTICS BAR */}
      <div className="bg-white border border-gray-100 rounded-xl px-2 py-4 shadow-2xs grid grid-cols-2 md:grid-cols-5 gap-4 text-center items-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-gray-900">
            <span className="text-base font-black tracking-tight">10,000+</span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Happy Customers</p>
        </div>

        <div className="space-y-1 border-l border-gray-100">
          <div className="flex items-center justify-center gap-1 text-gray-900">
            <span className="text-base font-black tracking-tight">4.8/5</span>
            <Star size={13} className="fill-amber-400 stroke-amber-400" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Google Rating</p>
        </div>

        <div className="space-y-1 border-l border-gray-100">
          <div className="flex items-center justify-center gap-1.5 text-gray-900">
            <span className="text-base font-black tracking-tight">100%</span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Secure Payments</p>
        </div>

        <div className="space-y-1 md:border-l border-gray-100">
          <div className="flex items-center justify-center gap-1.5 text-gray-900">
            <span className="text-base font-black tracking-tight">ISO 14001</span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Certified Process</p>
        </div>

        <div className="space-y-1 border-l border-gray-100 col-span-2 md:col-span-1">
          <div className="flex items-center justify-center gap-1.5 text-gray-900">
            <span className="text-base font-black tracking-tight">MoRTH</span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Compliant Platform</p>
        </div>
      </div>

    </section>
  );
}