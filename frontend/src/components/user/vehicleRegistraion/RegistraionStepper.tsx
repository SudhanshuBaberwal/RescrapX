'use client'

import React from 'react';
import { Check } from 'lucide-react';

interface RegistrationStepperProps {
  currentStep: number;
}

export default function RegistrationStepper({ currentStep }: RegistrationStepperProps) {
  const steps = [
    { id: 1, label: "Vehicle Details" },
    { id: 2, label: "Vehicle Condition" },
    { id: 3, label: "Major Components" },
    { id: 4, label: "Documents & Keys" },
    { id: 5, label: "Photos" },
    { id: 6, label: "Pickup & Location" },
    { id: 7, label: "Review & Confirm" },
    { id: 8, label: "Waitng For Approval" },
  ];

  return (
    <div className="w-full bg-white p-4 md:py-5 rounded-2xl border border-gray-100 shadow-3xs">

      {/* 1. DESKTOP VIEW: Horizontal Line Progress Track */}
      <div className="hidden md:flex w-full mx-auto px-6 relative items-center justify-between">
        <div className="absolute top-[18px] left-10 right-10 h-[2px] bg-gray-100 z-0" />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center space-y-1.5 z-10 relative flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${isCompleted ? 'bg-[#E6F4EA] border-[#A7F3D0] text-[#0B5B32]' :
                  isActive ? 'bg-[#0B5B32] border-[#0B5B32] text-white' :
                    'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : <span>{step.id}</span>}
              </div>
              <p className={`text-[11px] font-bold tracking-tight text-center ${isActive ? 'text-[#0B5B32]' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* 2. MOBILE VIEW: Vertical Compact Timeline Stack */}
      <div className="flex md:hidden flex-col space-y-3 relative pl-2">
        {/* Continuous vertical timeline connector line */}
        <div className="absolute top-2 bottom-2 left-5.25 w-0.5 bg-gray-100 z-0" />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          // Only render completed, active, and the immediate next step on mobile to keep things compact
          if (step.id > currentStep + 1 && !isActive && !isCompleted) return null;

          return (
            <div key={step.id} className="flex items-center gap-4 z-10 relative">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 transition-all ${isCompleted ? 'bg-[#E6F4EA] border-[#A7F3D0] text-[#0B5B32]' :
                  isActive ? 'bg-[#0B5B32] border-[#0B5B32] text-white' :
                    'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
              >
                {isCompleted ? <Check size={10} strokeWidth={3} /> : <span>{step.id}</span>}
              </div>
              <p className={`text-xs font-bold ${isActive ? 'text-[#0B5B32] font-black' : 'text-gray-500'}`}>
                {step.label} {isActive && <span className="text-[10px] text-gray-400 font-normal">(Active)</span>}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}