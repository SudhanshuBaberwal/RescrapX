'use client';

import React, { useState } from 'react';
import { 
  ClipboardCheck, Edit2, Car, ShieldAlert, Settings, FileText, 
  Camera, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, 
  XCircle, Search, RefreshCw, Loader2, AlertCircle
} from 'lucide-react';

interface StepComponentProps {
  onContinue: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepNumber: number;
  totalStepsCount: number;
  goToStep?: (stepNumber: number) => void; 
}

export default function VehicleReviewConfirmPage({
  onContinue,
  onPrevious,
  currentStepNumber,
  totalStepsCount,
  goToStep
}: StepComponentProps) {
  
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'submitting' | 'success' | 'failed'>('idle');

  const handleEditClick = (stepNum: number) => {
    if (goToStep) {
      goToStep(stepNum);
    } else {
      alert(`Redirecting to edit Step ${stepNum}...`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) {
      alert("Please check the confirmation box to declare that your provided details are accurate.");
      return;
    }

    // Begin processing submission state
    setRegistrationStatus('submitting');

    try {
      // Simulating an API network request for vehicle registration
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Change to true to simulate a backend error state / catch block trigger
          const simulateError = false; 
          if (simulateError) reject(new Error("Server error"));
          else resolve(true);
        }, 2000);
      });

      setRegistrationStatus('success');
    } catch (error) {
      setRegistrationStatus('failed');
    }
  };

  // Mocked state array mirroring the values rendered in your visual layout
  const summaryData = {
    details: [
      { label: 'Car / Model', value: 'Maruti Swift VXi' },
      { label: 'Registration No.', value: 'DL01AB1234' },
      { label: 'Manufacturing Year', value: '2018' },
      { label: 'Fuel Type', value: 'Petrol' },
      { label: 'Odometer Reading', value: '45,000 km' },
    ],
    condition: [
      { label: 'Accident / Damage', value: 'No Accident', status: true },
      { label: 'Structural Damage', value: 'No Damage', status: true },
      { label: 'Airbags Deployed', value: 'No', status: true },
      { label: 'Brief Description', value: 'No additional remarks', status: true },
    ],
    components: [
      { name: 'Engine', status: 'Good' },
      { name: 'Radiator', status: 'Good' },
      { name: 'Gearbox', status: 'Good' },
      { name: 'Suspension', status: 'Good' },
    ],
    documents: [
      { name: 'RC Book', state: 'Uploaded', active: true },
      { name: 'Insurance', state: 'Uploaded', active: true },
      { name: 'PUC Certificate', state: 'Uploaded', active: true },
      { name: 'Loan Closure', state: 'Not Available', active: false },
    ],
    photos: [
      { label: 'Front View', url: '/placeholder-car.jpg' },
      { label: 'Rear View', url: '/placeholder-car.jpg' },
      { label: 'Left Side View', url: '/placeholder-car.jpg' },
      { label: 'Right Side View', url: '/placeholder-car.jpg' },
      { label: 'Dashboard', url: '/placeholder-car.jpg' },
      { label: 'Engine Bay', url: '/placeholder-car.jpg' },
      { label: 'Odometer', url: '/placeholder-car.jpg' },
    ]
  };

  /* ==========================================================================
     STATE INTERFACES: SUBMITTING / SUCCESS / ERROR CORES
     ========================================================================== */

  if (registrationStatus === 'submitting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white border border-gray-100 rounded-2xl p-8 text-center space-y-4 shadow-3xs">
        <Loader2 className="animate-spin text-[#0B5B32]" size={44} />
        <div className="space-y-1">
          <h2 className="text-base font-black text-gray-900">Registering Vehicle for Scrapping</h2>
          <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto">Please wait while we securely transmit data configurations and initialize bidding queues...</p>
        </div>
      </div>
    );
  }

  if (registrationStatus === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white border border-gray-100 rounded-2xl p-8 text-center space-y-5 shadow-3xs">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
          <AlertCircle size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-black text-gray-900">Vehicle Registration Failed</h2>
          <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">We encountered an issue finalizing your scrap connection application records. Please check network configurations and try again.</p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button 
            type="button" 
            onClick={() => setRegistrationStatus('idle')}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-5 py-2.5 rounded-xl transition-all text-xs"
          >
            Review Details Again
          </button>
          <button 
            type="button" 
            onClick={handleSubmit}
            className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-6 py-2.5 rounded-xl transition-all text-xs"
          >
            Retry Submission
          </button>
        </div>
      </div>
    );
  }

  if (registrationStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white border border-gray-100 rounded-2xl p-8 text-center space-y-5 shadow-3xs">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#0B5B32] border border-emerald-100">
          <CheckCircle2 size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-black text-gray-900">Vehicle Registered Successfully!</h2>
          <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">Your vehicle entry has been added to the database. Bidding is complete and your digital value generation reports are ready.</p>
        </div>
        <button 
          type="button" 
          onClick={onContinue}
          className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-8 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-all text-xs"
        >
          <span>View Instant Offer</span>
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  /* ==========================================================================
     DEFAULT BASEVIEW: FORM EDIT AND VALUATION CONFIRMATION
     ========================================================================== */
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full text-xs">
      
      {/* MAIN DATA REVIEW GRID CONTAINER */}
      <main className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-3xs space-y-6">
        
        {/* Header Summary block title banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#0B5B32] text-white rounded-xl flex items-center justify-center text-xl shadow-xs shrink-0">
              <ClipboardCheck size={22} className="stroke-[1.75]" />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-lg font-black text-gray-900 tracking-tight">Review & Confirm</h1>
              <p className="text-[11px] font-bold text-gray-400">Step {currentStepNumber} of {totalStepsCount}</p>
            </div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-3 flex items-center gap-3 self-start sm:self-auto">
            <span className="text-lg">🎉</span>
            <div>
              <p className="font-black text-emerald-900 text-[11px]">Almost There!</p>
              <p className="text-emerald-700/80 font-semibold text-[10px]">Just one step away from your offer</p>
            </div>
          </div>
        </div>

        <p className="text-gray-400 font-bold -mb-2">Please review all the information below. You can edit any section if needed.</p>

        <hr className="border-gray-100" />

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BLOCK 1: VEHICLE DETAILS */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-3 relative bg-white shadow-3xs">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <div className="flex items-center gap-2 font-black text-gray-800 text-sm">
                <Car size={16} className="text-[#0B5B32]" />
                <h3>Vehicle Details</h3>
              </div>
              <button 
                type="button" onClick={() => handleEditClick(1)}
                className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-lg font-bold text-gray-600 transition-all text-[10px]"
              >
                <Edit2 size={10} /> <span>Edit</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-1">
              {summaryData.details.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <p className="font-black text-gray-800 break-words">{item.value}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BLOCK 2: VEHICLE CONDITION */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-3 relative bg-white shadow-3xs">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <div className="flex items-center gap-2 font-black text-gray-800 text-sm">
                <ShieldAlert size={16} className="text-[#0B5B32]" />
                <h3>Vehicle Condition</h3>
              </div>
              <button 
                type="button" onClick={() => handleEditClick(2)}
                className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-lg font-bold text-gray-600 transition-all text-[10px]"
              >
                <Edit2 size={10} /> <span>Edit</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              {summaryData.condition.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <p className="font-black text-gray-800 break-words">{item.value}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BLOCK 3: MAJOR COMPONENTS */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-3 relative bg-white shadow-3xs">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <div className="flex items-center gap-2 font-black text-gray-800 text-sm">
                <Settings size={16} className="text-[#0B5B32]" />
                <h3>Major Components</h3>
              </div>
              <button 
                type="button" onClick={() => handleEditClick(3)}
                className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-lg font-bold text-gray-600 transition-all text-[10px]"
              >
                <Edit2 size={10} /> <span>Edit</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
              {summaryData.components.map((comp, idx) => (
                <div key={idx} className="flex items-center gap-1.5 font-bold text-gray-700">
                  <span>{comp.name}:</span>
                  <span className="text-gray-900 font-black">{comp.status}</span>
                </div>
              ))}
              <span className="text-[#0B5B32] font-black bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">+ 8 more</span>
            </div>
          </div>

          {/* BLOCK 4: DOCUMENTS & KEYS */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-3 relative bg-white shadow-3xs">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <div className="flex items-center gap-2 font-black text-gray-800 text-sm">
                <FileText size={16} className="text-[#0B5B32]" />
                <h3>Documents & Keys</h3>
              </div>
              <button 
                type="button" onClick={() => handleEditClick(4)}
                className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-lg font-bold text-gray-600 transition-all text-[10px]"
              >
                <Edit2 size={10} /> <span>Edit</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              {summaryData.documents.map((doc, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-2.5 flex items-start gap-2 bg-white">
                  {doc.active ? (
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={14} className="text-gray-300 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className="font-black text-gray-800 text-[11px] truncate">{doc.name}</p>
                    <p className="text-[9px] text-gray-400 font-bold">{doc.state}</p>
                  </div>
                </div>
              ))}
              <div className="border border-gray-100 bg-gray-50/50 rounded-xl p-2.5 flex flex-col justify-center items-center text-center">
                <span className="font-black text-gray-700 text-[10px]">+ 1 more</span>
                <span className="text-[9px] text-gray-400 font-bold">Document</span>
              </div>
            </div>
          </div>

          {/* BLOCK 5: PHOTOS (MANDATORY) */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-3 relative bg-white shadow-3xs">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <div className="flex items-center gap-2 font-black text-gray-800 text-sm">
                <Camera size={16} className="text-[#0B5B32]" />
                <h3>Photos (Mandatory)</h3>
              </div>
              <button 
                type="button" onClick={() => handleEditClick(5)}
                className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-lg font-bold text-gray-600 transition-all text-[10px]"
              >
                <Edit2 size={10} /> <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-1">
              {summaryData.photos.map((pic, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="aspect-[4/3] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden text-base">
                    🚗
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold text-center truncate">{pic.label}</p>
                </div>
              ))}
              <div className="aspect-[4/3] border border-dashed border-gray-200 bg-gray-50/50 rounded-lg flex flex-col justify-center items-center text-center p-1">
                <span className="font-black text-gray-700 text-[9px]">+ 1 more</span>
                <span className="text-[8px] text-gray-400 font-bold leading-none">Images</span>
              </div>
            </div>
          </div>

          {/* Explicit User Confirmation Switch Rail Block */}
          <label className="flex items-start gap-3 cursor-pointer p-1 select-none">
            <input 
              type="checkbox" 
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="accent-[#0B5B32] w-4 h-4 mt-0.5 shrink-0 rounded-sm"
            />
            <div className="space-y-0.5 text-[11px] leading-normal text-gray-600">
              <p className="font-black text-gray-800">I confirm that all the information provided is accurate to the best of my knowledge.</p>
              <p className="text-gray-400 font-medium">Incorrect information may affect the offer and verification process.</p>
            </div>
          </label>

          {/* ACTION BUTTON RAIL */}
          <div className="flex flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
            <button 
              type="button" onClick={onPrevious}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-3xs"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>Back</span>
            </button>
            
            <button 
              type="submit"
              className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99]"
            >
              <span>Confirm & Get Offer</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>

        </form>
      </main>

      {/* RIGHT SIDEBAR VALUE PANEL */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-3xs space-y-5">
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            Why review <span className="text-[#0B5B32]">before getting offer</span>?
          </h3>

          <div className="space-y-4 text-xs">
            {[
              { title: 'Accurate Valuation', desc: 'Correct information helps us calculate the best possible offer for your vehicle.', icon: Search },
              { title: 'Smooth Verification', desc: 'Accurate details speed up the verification and pickup process.', icon: ShieldCheck },
              { title: 'Better & Transparent Offers', desc: 'Complete and correct details get you better and transparent offers.', icon: ClipboardCheck },
              { title: 'Faster Pickup & Settlement', desc: 'Verified information helps in quicker pickup and instant payment.', icon: CheckCircle2 }
            ].map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div key={idx} className="flex gap-3.5 items-start">
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

          <div className="pt-4 border-t border-gray-100 bg-[#F9FAFB] p-3.5 rounded-xl flex gap-3 text-gray-700 items-center justify-between">
            <div className="flex gap-2 items-center">
              <RefreshCw size={15} className="text-gray-400 animate-spin-slow" />
              <div className="text-[11px]">
                <p className="font-black text-gray-800">Need to make changes?</p>
                <p className="text-gray-400 font-bold">You can go back and edit any section before confirming.</p>
              </div>
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}