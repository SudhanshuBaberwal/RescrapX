'use client'

import React from 'react';
import {
  ArrowRight, Play, ShieldCheck, IndianRupee, Truck, Leaf,
  Calendar, Clock, Copy, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/getCurrentUser';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function UserDashBoard() {
  useCurrentUser()
  const {userData} = useSelector((state:RootState) => state.user)
  const handleCopy = () => {
    navigator.clipboard.writeText('RX240015');
  };

  const router = useRouter()

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
      {/* ========================================== */}
      {/* CENTER COLUMN: MAIN HERO TEXT & CALL TO ACTION */}
      {/* ========================================== */}
      <div className="lg:col-span-7 space-y-6">
        {/* Welcome Tag Pill */}
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#0B5B32] text-xs font-bold px-3 py-1.5 rounded-full w-fit">
          <span>Welcome back, Shubham!</span> 👋
        </div>

        {/* Main Hero Header */}
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[1.15]">
          Let's create a <br />
          <span className="text-[#0B5B32]">greener tomorrow.</span>
        </h1>

        <p className="text-gray-500 font-semibold text-xs sm:text-sm max-w-xl leading-relaxed">
          India's most trusted platform for end-of-life vehicle scrapping and responsible recycling operations.
        </p>

        {/* Dynamic Badges Block */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-[11px] font-black text-gray-600">
          <div className="flex items-center gap-1"><ShieldCheck size={14} className="text-[#0B5B32]" /> 100% Legal & Compliant</div>
          <div className="flex items-center gap-1"><IndianRupee size={14} className="text-[#0B5B32]" /> Best Price Assured</div>
          <div className="flex items-center gap-1"><Truck size={14} className="text-[#0B5B32]" /> Hassle-free Pickup</div>
          <div className="flex items-center gap-1"><Leaf size={14} className="text-[#0B5B32]" /> Eco-friendly Process</div>
        </div>

        {/* Action Row Interactive Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-xs px-5 py-3.5 rounded-xl flex items-center gap-2 shadow-xs transition">
            <span>Get Instant Valuation</span>
            <ArrowRight size={14} />
          </button>
          <button onClick={() => router.push("/user/my-vehicles")} className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs px-5 py-3.5 rounded-xl flex items-center gap-2 shadow-2xs transition">
            <span >{userData ? "My Vehicles" : "Check My"}</span>
            <Play size={12} className="fill-gray-500 stroke-none" />
          </button>
        </div>

        {/* Social Verification Footer Node */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="flex -space-x-2">
            <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop" alt="User asset avatar" />
            <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop" alt="User asset avatar" />
            <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=60&h=60&fit=crop" alt="User asset avatar" />
          </div>
          <p className="text-[11px] font-bold text-gray-400">
            <span className="text-gray-800 font-extrabold">10,000+</span> vehicles scrapped responsibly by RescrapX users.
          </p>
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT COLUMN: CURRENT LIVE BOOKING CARD PANEL */}
      {/* ========================================== */}
      {/* <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <h3 className="text-xs font-black text-gray-900 tracking-wide">Your Current Booking</h3>
          <span className="bg-[#E6F4EA] text-[#0B5B32] text-[9px] font-black px-2 py-0.5 rounded-md uppercase">Active</span>
        </div>

        <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Booking ID</p>
            <p className="text-xs font-black text-gray-800">RX240015</p>
          </div>
          <button
            onClick={handleCopy}
            className="text-gray-400 hover:text-gray-600 p-1.5 bg-white rounded-lg border border-gray-200 shadow-2xs transition"
          >
            <Copy size={12} />
          </button>
        </div>

        <div className="flex items-center gap-3 py-1">
          <img
            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=120&q=80"
            alt="Maruti Swift Dzire asset"
            className="w-16 object-contain mix-blend-multiply"
          />
          <div className="space-y-0.5">
            <h4 className="text-xs font-black text-gray-900">2014 Maruti Swift Dzire</h4>
            <p className="text-[11px] font-bold text-gray-400">Petrol • Manual</p>
            <div className="inline-block bg-gray-100 border border-gray-200 text-gray-700 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
              DL 12 AB 1234
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-3 space-y-2">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Current Status</p>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#0B5B32] mt-0.5">
              <span>🛻</span>
              <h4>Pickup Scheduled</h4>
            </div>
            <p className="text-[11px] text-gray-500 font-semibold mt-0.5 leading-relaxed">
              Our executive will pick up your vehicle as per the scheduled time.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-lg p-2.5 space-y-1.5 text-[11px] font-black text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar size={12} className="text-[#0B5B32]" />
              <span>10 July 2026, Wednesday</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-[#0B5B32]" />
              <span>11:00 AM – 02:00 PM</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-[#0B5B32] hover:bg-[#094d2a] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition">
          <span>Track Booking</span>
          <ArrowRight size={14} />
        </button>

        <button className="w-full text-center text-[11px] font-bold text-gray-400 hover:text-gray-700 flex items-center justify-center gap-0.5 transition">
          <span>View All Bookings</span>
          <ChevronRight size={12} />
        </button>
      </div> */}
    </div>
  );
}