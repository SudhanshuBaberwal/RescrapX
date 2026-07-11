'use client';

import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, Trash2, ShieldCheck, Info,
  ArrowRight, ArrowLeft, Image as ImageIcon, Sun, 
  Maximize, Eye, HelpCircle, Sparkles
} from 'lucide-react';

interface StepComponentProps {
  onContinue: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepNumber: number;
  totalStepsCount: number;
}

interface PhotoSlot {
  id: string;
  label: string;
  optional?: boolean;
}

export default function VehiclePhotosPage({
  onContinue,
  onPrevious,
  currentStepNumber,
  totalStepsCount
}: StepComponentProps) {
  
  // State to hold binary object URLs for loaded image slot components
  const [photoPreviews, setPhotoPreviews] = useState<Record<string, string>>({});
  
  // Dynamic collection of structural image upload targets matching layout reference
  const photoSlots: PhotoSlot[] = [
    { id: 'front', label: 'Front View' },
    { id: 'rear', label: 'Rear View' },
    { id: 'left', label: 'Left Side View' },
    { id: 'right', label: 'Right Side View' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'engine', label: 'Engine Bay' },
    { id: 'interior', label: 'Interior' },
    { id: 'odometer', label: 'Odometer' },
    { id: 'extra', label: 'Extra Images', optional: true },
  ];

  // Map reference lookup table to connect slots safely with underlying file input triggers
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, slotId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreviews(prev => ({ ...prev, [slotId]: objectUrl }));
    }
  };

  const clearPhoto = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering file upload picker window on wrapper click
    if (photoPreviews[slotId]) {
      URL.revokeObjectURL(photoPreviews[slotId]);
    }
    setPhotoPreviews(prev => {
      const updated = { ...prev };
      delete updated[slotId];
      return updated;
    });
    if (inputRefs.current[slotId]) {
      inputRefs.current[slotId]!.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields (all fields except 'extra')
    const missingFields = photoSlots
      .filter(slot => !slot.optional && !photoPreviews[slot.id])
      .map(slot => slot.label);

    if (missingFields.length > 0) {
      alert(`Please upload the following required photos to proceed:\n• ${missingFields.join('\n• ')}`);
      return;
    }

    onContinue();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      
      {/* MAIN LAYOUT BLOCK CONTAINER */}
      <main className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-3xs space-y-6">
        
        {/* Step Context Title Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#0B5B32] text-white rounded-xl flex items-center justify-center text-xl shadow-xs shrink-0">
            <Camera size={22} className="stroke-[1.75]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-lg font-black text-gray-900 tracking-tight">Upload Vehicle Photos</h1>
            <p className="text-[11px] font-bold text-gray-400">Step {currentStepNumber} of {totalStepsCount}</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <p className="text-gray-400 font-bold mb-2">Please upload clear and recent photos of your vehicle from the required angles.</p>

          {/* DYNAMIC GRID CONTAINER FOR CARDS MAP */}
          {/* Automatically stacks on Mobile, 2 Columns on Tablet, and expands into 4 Columns on widescreen desktops */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {photoSlots.map((slot) => {
              const hasPreview = !!photoPreviews[slot.id];
              return (
                <div 
                  key={slot.id}
                  onClick={() => inputRefs.current[slot.id]?.click()}
                  className={`border border-gray-100 rounded-xl p-3 bg-white shadow-3xs flex flex-col justify-between min-h-[145px] transition-all relative ${
                    hasPreview ? 'group' : 'cursor-pointer hover:border-[#0B5B32]'
                  }`}
                >
                  {/* Hidden Input field references mapped uniquely */}
                  <input 
                    type="file"
                    ref={el => { inputRefs.current[slot.id] = el; }}
                    onChange={(e) => handleFileChange(e, slot.id)}
                    className="hidden"
                    accept="image/*"
                  />

                  {/* Header Title Layer */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="font-black text-gray-800 text-[11px] truncate">{slot.label}</span>
                      {slot.optional && (
                        <span className="text-[9px] text-gray-400 font-semibold shrink-0">(Optional)</span>
                      )}
                    </div>
                    {!slot.optional && <Info size={11} className="text-gray-300 shrink-0" />}
                  </div>

                  {/* Operational Image Render Logic */}
                  {hasPreview ? (
                    <div className="w-full h-[85px] rounded-lg overflow-hidden relative border border-gray-100">
                      <img 
                        src={photoPreviews[slot.id]} 
                        alt={slot.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => clearPhoto(slot.id, e)}
                          className="p-1.5 bg-white text-red-600 rounded-md hover:bg-red-50 shadow-sm transition-all"
                          title="Remove photo"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-200 bg-gray-50/20 rounded-lg h-[85px] flex flex-col items-center justify-center text-center p-2">
                      <Upload size={16} className="text-[#0B5B32] mb-1 opacity-80" />
                      <span className="font-bold text-[9px] text-gray-700">Upload Photo</span>
                      <span className="text-[8px] text-gray-400">or drag and drop</span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Guidelines Banner block bar layout */}
          <div className="bg-emerald-50/30 border border-emerald-100/60 rounded-xl p-3 flex items-start gap-2.5 text-gray-600">
            <ShieldCheck size={14} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <p className="font-bold text-[10px] leading-relaxed">
              You can upload up to 10 MB per image. Supported formats: JPG, PNG, HEIC
            </p>
          </div>

          {/* LOWER PHOTO TIPS RAIL CONTAINER */}
          <div className="border border-gray-100 rounded-xl p-4 bg-[#F9FAFB]/60 space-y-3">
            <h4 className="font-black text-gray-800 text-[11px]">Photo Tips</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 text-[11px]">
              {[
                { title: 'Good Lighting', desc: 'Use natural light for clear photos', icon: Sun },
                { title: 'Full Vehicle Visible', desc: 'Capture the entire vehicle in frame', icon: Maximize },
                { title: 'No Blur', desc: 'Ensure images are sharp', icon: Sparkles },
                { title: 'Multiple Angles', desc: 'Provide all required views for accuracy', icon: Eye }
              ].map((tip, idx) => {
                const TipIcon = tip.icon;
                return (
                  <div key={idx} className="flex gap-2.5 items-start bg-white p-2.5 rounded-lg border border-gray-100/80">
                    <div className="p-1.5 bg-emerald-50 text-[#0B5B32] rounded-md shrink-0">
                      <TipIcon size={12} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-black text-gray-800 leading-tight">{tip.title}</p>
                      <p className="text-[10px] text-gray-400 font-medium leading-tight">{tip.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTION BUTTON RAIL */}
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

      {/* RIGHT SIDEBAR VALUE PANEL */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-3xs space-y-5">
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            Why <span className="text-[#0B5B32]">clear photos</span> matter?
          </h3>

          <div className="space-y-4 text-xs">
            {[
              { id: 1, title: 'Better & Accurate Valuation', desc: 'Clear photos help our AI and partner recyclers assess the vehicle accurately.', icon: Camera },
              { id: 2, title: 'Faster Verification', desc: 'Proper images speed up the verification and offer generation process.', icon: Sparkles },
              { id: 3, title: 'Higher Offers', desc: 'Well-maintained vehicles with clear photos get better and higher offers.', icon: Maximize },
              { id: 4, title: '100% Secure', desc: 'Your photos are encrypted and only used for valuation & verification.', icon: ShieldCheck }
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

          <div className="pt-4 border-t border-gray-100 bg-[#F9FAFB] p-3 rounded-xl flex gap-2.5 text-[#0B5B32]">
            <HelpCircle size={16} className="shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-black text-gray-800">Tip:</span> <span className="text-gray-500 font-semibold">Make sure the vehicle is clean and photos are taken in daylight for best results.</span>
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}