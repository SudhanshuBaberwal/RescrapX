'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, Gavel, Award, UserCheck, ShieldCheck, 
  Calendar, Truck, ShieldAlert, DollarSign, FileText, ArrowLeft, 
  Share2, ArrowRight, Star, Clock, Home
} from 'lucide-react';

interface StepComponentProps {
  onContinue: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepNumber: number;
  totalStepsCount: number;
}

export default function VehicleInstantOfferPage({
  onContinue,
  onPrevious,
  currentStepNumber,
  totalStepsCount
}: StepComponentProps) {

  const router = useRouter();

  // Dynamic values parsed down from the global multi-step registration wizard
  const offerDetails = {
    amount: '₹ 78,500',
    id: 'RSX-2026-07-11-7852',
    date: '11 July 2026, 01:45 PM',
    validTill: '18 July 2026, 11:59 PM',
    recycler: {
      name: 'Greenovaa Recyclers Pvt. Ltd.',
      rating: 4.8,
      reviews: 248,
      badges: [
        'Authorized & Certified Recycler',
        '10,000+ Vehicles Scrapped',
        'PAN India Services'
      ]
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'RescrapX Vehicle Offer',
        text: `I just received a scrap offer of ${offerDetails.amount} for my vehicle!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`My RescrapX Offer: ${offerDetails.amount} (ID: ${offerDetails.id})`);
      alert(`Offer details copied to clipboard!`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full text-xs">
      
      {/* MAIN LEFT HERO CONTENT BLOCK */}
      <main className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xs space-y-6">
        
        {/* Banner Announcement Intro Row */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-[#0B5B32] rounded-xl flex items-center justify-center text-xl shadow-2xs shrink-0 border border-emerald-100">
            <CheckCircle2 size={24} className="stroke-[2]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Great News! Your Final Offer is Ready</h1>
            <p className="text-[11px] font-bold text-gray-400">Bidding is complete. We've found the best offer for your vehicle.</p>
          </div>
        </div>

        {/* LARGE INTERACTIVE HERO BANNER VALUE */}
        <div className="border border-emerald-100 rounded-2xl bg-gradient-to-br from-emerald-50/20 to-white p-6 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 z-10">
            <p className="text-[11px] font-black uppercase text-gray-400 tracking-wider">Your Final Offer</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-gray-900 tracking-tight">{offerDetails.amount}</span>
              <span className="text-gray-400 cursor-help font-bold text-sm" title="Guaranteed price based on your verified parameters">ⓘ</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50 font-bold px-2.5 py-1 rounded-md">
                <CheckCircle2 size={12} className="text-[#0B5B32]" />
                <span>Highest competitive bid selected.</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-sm">
                ⭐ Best Offer
              </span>
            </div>
          </div>

          {/* Graphics Vehicle Side Illustration Mockup placeholder */}
          <div className="w-44 h-24 bg-gray-50 border border-gray-100 rounded-xl relative overflow-hidden flex items-center justify-center text-3xl shrink-0 shadow-3xs select-none">
            🚗
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#0B5B32] flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
              ₹
            </div>
          </div>
        </div>

        {/* 4-COLUMN COMPETITIVE BIDDING METRICS RAIL */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { title: 'Competitive Bidding', desc: 'Multiple recyclers competed for your vehicle', icon: Gavel },
            { title: 'Best Offer Selected', desc: 'The highest bid is isolated to maximize your return', icon: Award },
            { title: 'Partner Assigned', desc: 'Your certified local partner is locked in', icon: UserCheck },
            { title: 'Secure & Transparent', desc: '100% legal processing with instant payout', icon: ShieldCheck }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="border border-gray-100 rounded-xl p-3 bg-white text-center flex flex-col items-center justify-start space-y-2 shadow-3xs">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#0B5B32] flex items-center justify-center border border-emerald-100 shrink-0">
                  <Icon size={14} />
                </div>
                <div className="space-y-0.5">
                  <p className="font-black text-gray-800 text-[10px] leading-tight">{item.title}</p>
                  <p className="text-[9px] text-gray-400 font-bold leading-normal">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* SECTION: WHAT HAPPENS NEXT CHRONO TRACK */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-gray-800 tracking-tight uppercase text-gray-400">What happens next?</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
            {[
              { num: '1', name: 'Schedule Pickup', desc: 'Pick a convenient date and time window', icon: Calendar },
              { num: '2', name: 'Free Towing', desc: 'Our pickup agent handles the heavy lifting', icon: Truck },
              { num: '3', name: 'Verification', desc: 'On-site structural evaluation check', icon: ShieldAlert },
              { num: '4', name: 'Instant Payment', desc: 'Funds transferred before hookup', icon: DollarSign },
              { num: '5', name: 'COD Documents', desc: 'Official certificate of destruction issued', icon: FileText }
            ].map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={idx} className="bg-white border border-gray-100 p-3 rounded-xl space-y-2 relative shadow-3xs flex flex-col justify-between">
                  <div className="w-6 h-6 rounded-md bg-emerald-50 text-[#0B5B32] flex items-center justify-center border border-emerald-100 shrink-0">
                    <StepIcon size={12} />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 text-[10px]">{step.num}. {step.name}</h4>
                    <p className="text-[9px] text-gray-400 font-bold leading-tight mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GUARANTEE NO DEDUCTIONS BANNER ROW BAR */}
        <div className="border border-emerald-100 bg-emerald-50/10 p-4 rounded-xl flex items-center justify-between gap-4 shadow-3xs">
          <div className="flex items-start gap-3">
            <ShieldCheck size={18} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-black text-emerald-950 text-[11px]">No hidden charges. No hidden deductions.</h4>
              <p className="text-gray-400 font-bold text-[10px]">The valuation generated matches the digital offer, provided the physical criteria align with your submission.</p>
            </div>
          </div>
          <span className="text-xl shrink-0 hidden sm:block select-none">💵</span>
        </div>

        {/* BOTTOM UTILITY LOWER RAIL TRIGGERS */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={() => router.push('/')}
              className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-4 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-3xs cursor-pointer"
            >
              <Home size={14} strokeWidth={2.5} />
              <span>Home</span>
            </button>

            <button 
              type="button" 
              onClick={onPrevious}
              className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-3xs cursor-pointer"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>Modify Details</span>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button 
              type="button" onClick={handleShare}
              className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-3xs cursor-pointer"
            >
              <Share2 size={13} />
              <span>Share Offer</span>
            </button>
            
            <button 
              type="button" onClick={onContinue}
              className="w-full sm:w-auto bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>Schedule Pickup Now</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>

      </main>

      {/* RIGHT VALUATION BREAKDOWN SIDEBAR */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
        
        {/* PANEL CARD 1: OFFER SUMMARY */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 font-black text-gray-800 text-sm border-b border-gray-50 pb-2">
            <FileText size={16} className="text-[#0B5B32]" />
            <h3>Offer Summary</h3>
          </div>

          <div className="space-y-2.5">
            {[
              { label: 'Offer Amount', value: offerDetails.amount, highlight: true },
              { label: 'Offer ID', value: offerDetails.id },
              { label: 'Generated Date', value: offerDetails.date },
              { label: 'Expiration Window', value: offerDetails.validTill }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center gap-4 py-0.5">
                <span className="text-gray-400 font-bold">{item.label}</span>
                <span className={`font-black ${item.highlight ? 'text-base text-[#0B5B32]' : 'text-gray-800'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100/60 p-3 rounded-xl flex items-start gap-2 text-[11px] leading-relaxed text-gray-600">
            <Clock size={14} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-800">Lock-in price window valid until:</span>{' '}
              <span className="font-black text-emerald-900 block">{offerDetails.validTill}</span>
              <span className="text-gray-400 font-medium text-[10px] block mt-0.5">Secure the configuration to book transportation rates.</span>
            </div>
          </div>
        </div>

        {/* PANEL CARD 2: ASSIGNED RECYCLER BADGE LOGO */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-gray-50 pb-2">
            <h4 className="font-black text-gray-800 text-xs">Assigned Scrapping Yard</h4>
            <span className="text-[9px] font-black bg-emerald-700 text-white px-2 py-0.5 rounded-sm shrink-0">Top Partner</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-[#0B5B32] shadow-3xs text-[9px] text-center p-1 shrink-0 select-none">
              ♻️ LOGO
            </div>
            <div className="space-y-0.5">
              <h4 className="font-black text-gray-900 leading-tight">{offerDetails.recycler.name}</h4>
              <div className="flex items-center gap-1 font-bold text-gray-500 text-[10px]">
                <div className="flex items-center text-amber-500"><Star size={11} className="fill-current" /></div>
                <span className="text-gray-800 font-black">{offerDetails.recycler.rating}</span>
                <span>({offerDetails.recycler.reviews} reviews)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-gray-50">
            {offerDetails.recycler.badges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-600 font-bold text-[10px]">
                <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

      </aside>

    </div>
  );
}