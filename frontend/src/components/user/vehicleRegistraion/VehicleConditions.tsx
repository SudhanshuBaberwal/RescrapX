'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, Info, ArrowRight, ArrowLeft, Target, 
  Eye, Users, ShieldCheck, Flame, Droplet, MoreHorizontal, ShieldX
} from 'lucide-react';

interface StepComponentProps {
  onContinue: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepNumber: number;
  totalStepsCount: number;
}

export default function VehicleConditionPage({
  onContinue,
  onPrevious,
  currentStepNumber,
  totalStepsCount
}: StepComponentProps) {
  
  const [accidentType, setAccidentType] = useState('no-accident');
  const [structuralDamage, setStructuralDamage] = useState('no-damage');
  const [airbags, setAirbags] = useState('no');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  const damageCards = [
    { id: 'no-accident', label: 'No Accident', icon: ShieldCheck, color: 'text-emerald-600' },
    { id: 'accidental', label: 'Accidental Damage', icon: ShieldAlert, color: 'text-orange-500' },
    { id: 'burnt', label: 'Burnt', icon: Flame, color: 'text-red-500' },
    { id: 'flooded', label: 'Flooded / Water Damaged', icon: Droplet, color: 'text-blue-500' },
    { id: 'others', label: 'Others', icon: MoreHorizontal, color: 'text-gray-500' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      
      {/* MAIN DATA INPUT CONTAINER */}
      <main className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-3xs space-y-6">
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#0B5B32] text-white rounded-xl flex items-center justify-center text-xl shadow-xs shrink-0">
            <ShieldAlert size={22} className="stroke-[1.75]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-lg font-black text-gray-900 tracking-tight">Vehicle Condition</h1>
            <p className="text-[11px] font-bold text-gray-400">Step {currentStepNumber} of {totalStepsCount}</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <p className="text-gray-400 font-bold mb-2">Help us understand your vehicle's current condition</p>

          {/* BLOCK 1: ACCIDENT / DAMAGE SELECTION */}
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              <label className="font-extrabold text-gray-700">Accident / Damage</label>
              <Info size={12} className="text-gray-400" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {damageCards.map((card) => {
                const Icon = card.icon;
                const isSelected = accidentType === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setAccidentType(card.id)}
                    className={`p-4 border rounded-xl flex flex-col items-center text-center justify-between gap-3 transition-all relative min-h-[105px] ${
                      isSelected 
                        ? 'border-[#0B5B32] bg-emerald-50/20 ring-1 ring-[#0B5B32]' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full border flex items-center justify-center border-gray-300">
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#0B5B32]" />}
                    </div>
                    <div className="flex-1 flex items-center justify-center mt-2">
                      <Icon size={24} className={card.color} />
                    </div>
                    <p className="font-bold text-[10px] leading-tight text-gray-700">{card.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* BLOCK 2: STRUCTURAL DAMAGE & AIRBAGS SELECTION MATRIX */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Structural Damage options track */}
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <label className="font-extrabold text-gray-700">Structural Damage (Frame / Chassis)</label>
                <Info size={12} className="text-gray-400" />
              </div>
              <div className="space-y-2">
                {[
                  { id: 'no-damage', label: 'No Damage', color: 'text-emerald-700 font-bold' },
                  { id: 'minor-damage', label: 'Minor Damage', color: 'text-amber-600 font-bold' },
                  { id: 'major-damage', label: 'Major Damage', color: 'text-red-600 font-bold' }
                ].map((item) => (
                  <label 
                    key={item.id}
                    className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                      structuralDamage === item.id ? 'border-[#0B5B32] bg-emerald-50/10' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={item.color}>{item.label}</span>
                    <input 
                      type="radio" 
                      name="structural" 
                      checked={structuralDamage === item.id}
                      onChange={() => setStructuralDamage(item.id)}
                      className="accent-[#0B5B32] h-4 w-4"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Airbags deployed tracking segment */}
            <div className="space-y-3">
              <div className="flex items-center gap-1">
                <label className="font-extrabold text-gray-700">Airbags Deployed</label>
                <Info size={12} className="text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {['Yes', 'No'].map((option) => {
                  const isSelected = airbags === option.toLowerCase();
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAirbags(option.toLowerCase())}
                      className={`p-3.5 border rounded-xl font-bold flex items-center justify-between transition-all ${
                        isSelected ? 'border-[#0B5B32] bg-emerald-50/20 text-[#0B5B32]' : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      <span>{option}</span>
                      <div className="w-4 h-4 rounded-full border flex items-center justify-center border-gray-300">
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#0B5B32]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* BLOCK 3: BRIEF DESCRIPTION OPTIONAL INPUT */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-gray-700">Brief Description (Optional)</label>
            <div className="relative">
              <textarea
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Front impact, right side damage, etc."
                className="w-full min-h-[80px] bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs resize-none"
              />
              <span className="absolute bottom-2 right-3 text-[10px] font-bold text-gray-400">
                {description.length}/200
              </span>
            </div>
          </div>

          <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5 text-emerald-800">
            <Info size={14} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <p className="font-bold text-[11px] leading-relaxed text-gray-600">
              This helps our partner recyclers provide you a more accurate valuation.
            </p>
          </div>

          {/* DYNAMIC NAVIGATION CONTROL RAIL */}
          <div className="flex flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
            <button 
              type="button"
              onClick={onPrevious}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black text-xs px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-3xs"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>Back</span>
            </button>
            
            <button 
              type="submit"
              className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black text-xs px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
            >
              <span>Continue</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>

        </form>
      </main>

      {/* RIGHT SIDEBAR VALUE PROPOSITION */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-3xs space-y-5">
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            Why accurate condition details matter?
          </h3>

          <div className="space-y-4 text-xs">
            {[
              { id: 1, title: 'Better Valuation Accuracy', desc: 'Accurate details help us generate a fair and precise offer.', icon: Target },
              { id: 2, title: 'Transparent Process', desc: 'No surprises! What you tell us helps us serve you better.', icon: Eye },
              { id: 3, title: 'Trusted by Recyclers', desc: 'Verified details build trust with our partner recyclers.', icon: Users },
              { id: 4, title: 'Faster Pickup & Settlement', desc: 'Smooth verification ensures quick pickup and payment.', icon: ShieldCheck }
            ].map((perk) => {
              const Icon = perk.icon;
              return (
                <div key={perk.id} className="flex gap-3.5 items-start">
                  <div className="p-2 bg-emerald-50 text-[#0B5B32] border border-emerald-100 rounded-xl shrink-0">
                    <Icon size={15} />
                  </div>
                  <div className="space-y-0.5 mt-0.5">
                    <h4 className="font-black text-gray-800">{perk.title}</h4>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-50 flex flex-col items-center text-center">
            <div className="relative w-full max-w-[160px] aspect-square flex items-center justify-center">
              <span className="text-5xl animate-pulse">🚗</span>
              <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
                <ShieldCheck size={16} />
              </div>
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}