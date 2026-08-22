'use client'

import React from 'react';
import {
  ArrowRight, Play, ShieldCheck, IndianRupee, Truck, Leaf,
  Calendar, Clock, Copy, ChevronLeft, ChevronRight,
  MapPin, CheckCircle2, FileText, ClipboardCheck,
  CreditCard, Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/getCurrentUser';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function UserDashBoard() {
  useCurrentUser();
  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  return (
    /* Center container with max-width matching navbar and side padding */
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 space-y-12 py-8 w-full">

      {/* HERO SECTION */}
      <div className="w-full space-y-5 pt-1">
        <div className="inline-flex items-center gap-1.5 bg-[#E6F4EA] text-[#0B5B32] text-xs font-bold px-3 py-1 rounded-full w-fit">
          <span>Welcome back, {userData?.fullName?.split(' ')[0] || ""}!</span> 👋
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
          Let's create a <span className="text-[#0B5B32]">greener tomorrow.</span>
        </h1>

        <p className="text-gray-500 font-semibold text-xs sm:text-sm max-w-3xl leading-relaxed">
          India's most trusted platform for end-of-life vehicle scrapping and responsible recycling operations.
        </p>

        {/* Inline feature badges with balanced spacing */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-[11px] sm:text-xs font-black text-gray-600">
          <div className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-[#0B5B32]" /> 100% Legal & Compliant</div>
          <div className="flex items-center gap-1.5"><IndianRupee size={16} className="text-[#0B5B32]" /> Best Price Assured</div>
          <div className="flex items-center gap-1.5"><Truck size={16} className="text-[#0B5B32]" /> Hassle-free Pickup</div>
          <div className="flex items-center gap-1.5"><Leaf size={16} className="text-[#0B5B32]" /> Eco-friendly Process</div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer">
            <span>Get Instant Valuation</span>
            <ArrowRight size={16} />
          </button>
          <button onClick={() => router.push("/user/my-vehicles")} className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-2xs transition active:scale-95 cursor-pointer">
            <span>{userData ? "My Vehicles" : "How it's work"}</span>
            <Play size={12} className="fill-gray-500 stroke-none" />
          </button>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 w-full">
          <div className="flex -space-x-2">
            <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop" alt="User" />
            <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop" alt="User" />
            <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=60&h=60&fit=crop" alt="User" />
          </div>
          <p className="text-xs font-bold text-gray-400">
            <span className="text-gray-800 font-extrabold">10,000+</span> vehicles scrapped responsibly by RescrapX users.
          </p>
        </div>
      </div>

      {/* HOW RESCRAPX WORKS STEPS */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-gray-900">How <span className="text-[#0B5B32]">RescrapX</span> Works</h2>
          <p className="text-xs text-gray-500 font-semibold">A hassle-free process in simple steps</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: "1", title: "Book Pickup", desc: "Schedule a free pickup online" },
            { step: "2", title: "We Arrive", desc: "Our team arrives at your location" },
            { step: "3", title: "Free Inspection", desc: "We inspect your vehicle & offer best price" },
            { step: "4", title: "RVSFs Compete", desc: "Verified RVSFs give competitive offers" },
            { step: "5", title: "Free Pickup", desc: "We pick up your vehicle from your doorstep" },
            { step: "6", title: "Payment & Certificate", desc: "Get instant payment & certificate of destruction" },
          ].map((item) => (
            <div key={item.step} className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl text-center space-y-2 relative group hover:bg-white hover:shadow-xs transition">
              <div className="w-7 h-7 bg-[#0B5B32] text-white font-black text-xs rounded-full flex items-center justify-center mx-auto">
                {item.step}
              </div>
              <h4 className="text-xs font-black text-gray-900 leading-tight">{item.title}</h4>
              <p className="text-[10px] font-medium text-gray-500 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* GREEN IMPACT BANNER */}
      <div className="bg-[#0B5B32] text-white p-6 sm:p-8 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-sm">
        <div>
          <h3 className="text-xl sm:text-2xl font-black">1,500+ Tons</h3>
          <p className="text-[11px] text-emerald-200 font-bold mt-0.5">of CO₂ Reduced</p>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black">650+ Tons</h3>
          <p className="text-[11px] text-emerald-200 font-bold mt-0.5">of Metal Recycled</p>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black">3,600+ MWh</h3>
          <p className="text-[11px] text-emerald-200 font-bold mt-0.5">of Energy Saved</p>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-black">10,000+</h3>
          <p className="text-[11px] text-emerald-200 font-bold mt-0.5">Happy Customers</p>
        </div>
      </div>

      {/* READY TO SCRAP BANNER */}
      <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=200&q=80"
            alt="Scrap Car CTA"
            className="w-24 h-16 object-contain rounded-lg shrink-0"
          />
          <div>
            <h3 className="text-lg font-black text-gray-900">Ready to <span className="text-[#0B5B32]">Scrap</span> Your Vehicle?</h3>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              Get the highest value for your vehicle with a safe, transparent and hassle-free process.
            </p>
          </div>
        </div>

        <button className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 shrink-0 transition shadow-xs cursor-pointer">
          <span>Get Instant Valuation</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* WHY RESCRAPX IS DIFFERENT */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-gray-900 text-center">
          Why <span className="text-[#0B5B32]">RescrapX</span> is Different
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Traditional Scrapping */}
          <div className="bg-[#F3F4F8] rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
            <h3 className="text-base font-black text-gray-900 tracking-tight">Traditional Scrapping</h3>

            <div className="relative w-36 h-28 flex items-end justify-center">
              <svg className="w-24 h-24 text-gray-400" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="35" r="18" stroke="currentColor" strokeWidth="3" />
                <path d="M 40 32 A 3 3 0 0 1 42 32 M 58 32 A 3 3 0 0 1 60 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M 42 45 Q 50 40 58 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M 20 90 C 20 65 30 58 50 58 C 70 58 80 65 80 90" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
              <div className="absolute right-0 bottom-2 bg-white border border-gray-300 rounded-lg p-1.5 shadow-xs flex items-center gap-1 rotate-12">
                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">₹</div>
                <div className="w-6 h-2 bg-gray-200 rounded-xs"></div>
              </div>
            </div>

            <div className="space-y-3.5 text-left w-full max-w-xs mx-auto">
              {["Local Buyers", "Unverified Pricing", "Lengthy Paperwork", "Hidden Fees"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs font-bold text-gray-700">
                  <div className="w-4 h-4 rounded-full bg-[#1A2353] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                    ✕
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RescrapX Way */}
          <div className="bg-[#EBF7EE] rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
            <h3 className="text-base font-black text-[#0B5B32] tracking-tight">RescrapX Way</h3>

            <div className="relative w-36 h-28 flex items-end justify-center">
              <svg className="w-24 h-24 text-emerald-800" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="35" r="18" stroke="currentColor" strokeWidth="3" />
                <path d="M 40 32 A 3 3 0 0 1 42 32 M 58 32 A 3 3 0 0 1 60 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M 42 42 Q 50 48 58 42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <path d="M 20 90 C 20 65 30 58 50 58 C 70 58 80 65 80 90" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
              <div className="absolute left-2 top-8 bg-[#0B5B32] text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shadow-xs">
                ₹
              </div>
              <div className="absolute -right-2 bottom-6 bg-white border border-emerald-200 rounded-lg p-2 shadow-xs flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#0B5B32] text-white flex items-center justify-center text-xs font-bold">₹</div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              </div>
            </div>

            <div className="space-y-3.5 text-left w-full max-w-xs mx-auto">
              {["Verified RVSFs", "Transparent Pricing", "Advanced Process", "No Hidden Fees"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs font-bold text-gray-800">
                  <div className="w-4 h-4 rounded-full bg-[#0B5B32] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                    ✓
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME VEHICLE TRACKING SECTION */}
      <div className="bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 space-y-8 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-900">Real-time Vehicle Tracking</h3>
          <button className="text-xs font-bold text-[#0B5B32] hover:underline flex items-center gap-1 cursor-pointer">
            <span>View All</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center justify-between min-w-[700px] relative px-2">

            <div className="flex flex-col items-center gap-2 relative z-10 w-28 text-center">
              <FileText size={22} className="text-gray-400" />
              <span className="text-[11px] font-bold text-gray-700 leading-tight">Request<br />Received</span>
            </div>

            <ArrowRight size={14} className="text-[#0B5B32] shrink-0" />

            <div className="flex flex-col items-center gap-2 relative z-10 w-28 text-center">
              <ClipboardCheck size={22} className="text-gray-400" />
              <span className="text-[11px] font-bold text-gray-700 leading-tight">Inspection<br />Scheduled</span>
            </div>

            <ArrowRight size={14} className="text-[#0B5B32] shrink-0" />

            <div className="flex flex-col items-center gap-2 relative z-10 w-28 text-center">
              <Truck size={22} className="text-gray-400" />
              <span className="text-[11px] font-bold text-gray-700 leading-tight">Vehicle<br />Picked Up</span>
            </div>

            <ArrowRight size={14} className="text-[#0B5B32] shrink-0" />

            <div className="flex flex-col items-center gap-2 relative z-10 w-28 text-center">
              <div className="p-2 bg-[#0B5B32] text-white rounded-full shadow-xs">
                <MapPin size={16} />
              </div>
              <span className="text-[11px] font-black text-[#0B5B32] leading-tight">At RVSF<br />Facility</span>
            </div>

            <ArrowRight size={14} className="text-gray-400 shrink-0" />

            <div className="flex flex-col items-center gap-2 relative z-10 w-28 text-center">
              <CreditCard size={22} className="text-gray-400" />
              <span className="text-[11px] font-bold text-gray-700 leading-tight">Payment<br />In Process</span>
            </div>

            <ArrowRight size={14} className="text-gray-400 shrink-0" />

            <div className="flex flex-col items-center gap-2 relative z-10 w-28 text-center">
              <CheckCircle2 size={22} className="text-gray-400" />
              <span className="text-[11px] font-bold text-gray-700 leading-tight">Completed</span>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">

          <div className="lg:col-span-4 space-y-5">
            <div>
              <h4 className="text-base font-black text-[#0B5B32]">At RVSF Facility</h4>
              <p className="text-xs font-semibold text-gray-500 mt-1 leading-relaxed">
                Your vehicle has reached the authorized RVSF facility and is under inspection.
              </p>
            </div>

            <div className="space-y-3 text-xs pt-1">
              <div>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Facility Name</p>
                <p className="text-gray-900 font-black text-xs mt-0.5">Green Planet Recycling Pvt. Ltd.</p>
              </div>
              <div>
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Location</p>
                <p className="text-gray-900 font-black text-xs mt-0.5">Chakan, Pune, Maharashtra</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center items-center py-4">
            <div className="relative w-full max-w-[280px] h-[170px] flex items-center justify-center">
              <div className="absolute bottom-2 w-64 h-8 bg-gray-200/80 rounded-[100%] blur-xs -z-0"></div>
              <img src="/Tow.jpeg" alt="img" className='rounded-3xl' />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <div className="bg-[#F8FAFC] border border-gray-100 p-4 rounded-2xl space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tracker ID</p>
              <p className="text-sm font-black text-gray-900 font-mono">RX48271</p>
            </div>

            <div className="bg-[#F8FAFC] border border-gray-100 p-4 rounded-2xl space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Updated At</p>
              <p className="text-xs font-black text-gray-900">Today, 10:30 AM</p>
              <div className="flex items-center gap-1.5 text-[11px] font-black text-[#0B5B32] pt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#0B5B32] animate-pulse"></span>
                <span>Live</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CUSTOMER REVIEWS SECTION */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">What Our Customers Say</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"><ChevronLeft size={16} /></button>
            <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition cursor-pointer"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Rohan P.", city: "Pune", text: "RescrapX made selling my old car a breeze. Got the best price!" },
            { name: "Ankita K.", city: "Bangalore", text: "The transparent process and prompt payment were excellent." },
            { name: "Sameer S.", city: "Delhi", text: "Truly a reliable company. Service is top-notch!" },
          ].map((review) => (
            <div key={review.name} className="bg-gray-50/60 border border-gray-100 p-4 rounded-xl space-y-3">
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400" />)}
              </div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed italic">"{review.text}"</p>
              <div>
                <h4 className="text-xs font-black text-gray-900">{review.name}</h4>
                <p className="text-[10px] font-bold text-gray-400">{review.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}