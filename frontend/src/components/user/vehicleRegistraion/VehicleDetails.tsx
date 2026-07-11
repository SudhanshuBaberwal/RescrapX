'use client'

import React, { useState } from 'react';
import { 
  Car, Info, ArrowRight, ShieldCheck, ChevronDown, 
  Flame, Settings2, Gauge, ArrowLeft 
} from 'lucide-react';

interface StepComponentProps {
  onContinue: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepNumber: number;
  totalStepsCount: number;
}

export default function VehicleDetailsPage({
  onContinue,
  onPrevious,
  isFirstStep,
  isLastStep,
  currentStepNumber,
  totalStepsCount
}: StepComponentProps) {
  
  const [formData, setFormData] = useState({
    carModel: '',
    regNumber: '',
    mfgYear: '',
    variant: '',
    fuelType: '',
    transmission: '',
    odometer: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue(); // Call multi-step dynamic function progression handler
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      
      {/* LEFT PANEL: ACTIVE INFORMATION CARD CONTAINER */}
      <main className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-5 md:p-8 shadow-3xs space-y-6">
        
        {/* Form Title Block Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#0B5B32] text-white rounded-xl flex items-center justify-center text-xl shadow-xs shrink-0">
            <Car size={22} className="stroke-[1.75]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-lg font-black text-gray-900 tracking-tight">Vehicle Details</h1>
            <p className="text-[11px] font-bold text-gray-400">Step {currentStepNumber} of {totalStepsCount}</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <p className="text-gray-400 font-bold mb-2">Please enter your vehicle's basic information</p>

          {/* Form Input Matrix Element Stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            {/* Field: Car Model */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700">Car Name / Model</label>
              <input 
                type="text" 
                placeholder="e.g., Maruti Swift"
                value={formData.carModel}
                onChange={(e) => handleInputChange('carModel', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs"
                required
              />
            </div>

            {/* Field: Registration Number */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700">Registration Number (RC No.)</label>
              <input 
                type="text" 
                placeholder="e.g., DL01AB1234 (Optional)"
                value={formData.regNumber}
                onChange={(e) => handleInputChange('regNumber', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs"
              />
            </div>

            {/* Field: Manufacturing Year */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700">Manufacturing Year</label>
              <input 
                type="text" 
                placeholder="e.g., 2018"
                value={formData.mfgYear}
                onChange={(e) => handleInputChange('mfgYear', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs"
                required
              />
            </div>

            {/* Field: Variant */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700">Variant</label>
              <input 
                type="text" 
                placeholder="e.g., VXi"
                value={formData.variant}
                onChange={(e) => handleInputChange('variant', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs"
                required
              />
            </div>

            {/* Field: Fuel Type Custom Dropdown Selector */}
            <div className="space-y-1.5 relative">
              <label className="font-extrabold text-gray-700">Fuel Type</label>
              <div className="relative">
                <select 
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 pr-10 font-bold text-gray-700 appearance-none focus:outline-none focus:border-[#0B5B32] shadow-3xs cursor-pointer"
                  required
                >
                  <option value="">Select</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                  <option value="electric">Electric</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Field: Transmission Custom Dropdown Selector */}
            <div className="space-y-1.5 relative">
              <label className="font-extrabold text-gray-700">Transmission</label>
              <div className="relative">
                <select 
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 pr-10 font-bold text-gray-700 appearance-none focus:outline-none focus:border-[#0B5B32] shadow-3xs cursor-pointer"
                  required
                >
                  <option value="">Select</option>
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Field: Odometer */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700">Odometer Reading (KM)</label>
              <input 
                type="text" 
                placeholder="e.g., 85000"
                value={formData.odometer}
                onChange={(e) => handleInputChange('odometer', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs"
                required
              />
            </div>

          </div>

          {/* Informational Assistance Note Pill */}
          <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5 text-emerald-800">
            <Info size={14} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <p className="font-bold text-[11px] leading-relaxed">
              Don't worry if you don't remember exact details. You can edit them later.
            </p>
          </div>

          {/* Secondary Bottom Actions Interface Layout Container */}
          <div className="flex flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
            
            {/* Back button visible step > 1 */}
            {!isFirstStep ? (
              <button 
                type="button"
                onClick={onPrevious}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs px-5 py-3.5 rounded-xl flex items-center gap-2 transition-all"
              >
                <ArrowLeft size={14} strokeWidth={2.5} />
                <span>Back</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5 text-gray-400 text-[10px]">
                <ShieldCheck size={16} className="text-emerald-600" />
                <div>
                  <p className="font-black text-gray-700 leading-tight">100% Secure</p>
                  <p className="font-medium mt-0.5">Your information is safe</p>
                </div>
              </div>
            )}
            
            <button 
              type="submit"
              className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black text-xs px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] ml-auto"
            >
              <span>Continue</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>

        </form>
      </main>

      {/* RIGHT PANEL: VALUE PROPOSITION TRUST CARD SIDEBAR */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-3xs space-y-5">
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            Why get valuation from <span className="text-[#0B5B32]">RescrapX?</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Perk 1 */}
            <div className="flex gap-3.5 items-start">
              <div className="p-2 bg-emerald-50 text-[#0B5B32] border border-emerald-100 rounded-xl shrink-0">
                <Flame size={15} />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <h4 className="font-black text-gray-800">Instant & Accurate Valuation</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">AI-powered pricing based on real market data</p>
              </div>
            </div>

            {/* Perk 2 */}
            <div className="flex gap-3.5 items-start">
              <div className="p-2 bg-emerald-50 text-[#0B5B32] border border-emerald-100 rounded-xl shrink-0">
                <Settings2 size={15} />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <h4 className="font-black text-gray-800">Trusted Recycler Network</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Offers from verified & authorized recyclers</p>
              </div>
            </div>

            {/* Perk 3 */}
            <div className="flex gap-3.5 items-start">
              <div className="p-2 bg-emerald-50 text-[#0B5B32] border border-emerald-100 rounded-xl shrink-0">
                <Gauge size={15} />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <h4 className="font-black text-gray-800">Hassle-Free Process</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Doorstep pickup, documentation & deregistration</p>
              </div>
            </div>

            {/* Perk 4 */}
            <div className="flex gap-3.5 items-start">
              <div className="p-2 bg-emerald-50 text-[#0B5B32] border border-emerald-100 rounded-xl shrink-0">
                <ShieldCheck size={15} />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <h4 className="font-black text-gray-800">Best Price Guarantee</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">We ensure you get the best value for your vehicle</p>
              </div>
            </div>
          </div>

          {/* Graphic Elements Vector Illustration Card Frame Container */}
          <div className="pt-4 relative flex justify-center items-end border-t border-gray-50 bg-gradient-to-b from-transparent to-emerald-50/20 overflow-hidden rounded-b-2xl">
            <div className="relative z-10 w-full max-w-[200px] pb-4">
              <div className="bg-gray-900 rounded-2xl p-2 pb-1 text-white shadow-lg border border-gray-800">
                <div className="bg-gray-900 rounded-xl p-2.5 text-center space-y-1 border border-gray-800">
                  <p className="text-[7px] tracking-widest text-emerald-400 font-bold uppercase">Instant Valuation</p>
                  <p className="text-sm font-black tracking-tight text-white">₹72,500</p>
                  <span className="inline-block text-[6px] bg-emerald-600/30 border border-emerald-500/40 px-1.5 py-0.5 rounded-full text-emerald-300 font-bold">Best Offer</span>
                </div>
              </div>
            </div>
            
            <div className="absolute right-0 bottom-4 text-3xl select-none pointer-events-none filter drop-shadow-md z-20">
              🚗
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}