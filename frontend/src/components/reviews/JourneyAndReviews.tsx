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
            onClick={() => router.push("/user/my-vehicles")}
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