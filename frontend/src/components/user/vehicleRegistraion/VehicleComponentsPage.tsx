'use client';

import React, { useState } from 'react';
import { 
  Cpu, Wrench, ArrowRight, ArrowLeft, Activity, Compass,
  ShieldCheck, Flame, Fuel, Disc, Eye,
  Layers, Sun, Lightbulb, UserCheck, CheckCircle2, HelpCircle, Loader2,
  BatteryCharging
} from 'lucide-react';
import { majorComponents } from '@/services/vehicle.service';

interface StepComponentProps {
  vehicleId: string;
  onContinue: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepNumber: number;
  totalStepsCount: number;
}

type ComponentStatus = 'GOOD' | 'NOT_WORKING' | 'MISSING';

interface ComponentItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

export default function VehicleComponentsPage({
  vehicleId,
  onContinue,
  onPrevious,
  currentStepNumber,
  totalStepsCount
}: StepComponentProps) {
  
  // Structural layout options with EXACT keys expected by backend Zod Schema
  const componentsList: ComponentItem[] = [
    { id: 'engine', label: 'Engine', icon: Cpu },
    { id: 'battery', label: 'Battery', icon: BatteryCharging },
    { id: 'radiator', label: 'Radiator / Cooling', icon: Activity },
    { id: 'fuelSystem', label: 'Fuel System', icon: Fuel },
    { id: 'gearbox', label: 'Gearbox / Transmission', icon: Layers },
    { id: 'suspension', label: 'Suspension', icon: Compass },
    { id: 'steering', label: 'Steering', icon: Wrench },
    { id: 'electrical', label: 'Electrical (Wiring / ECU)', icon: Cpu },
    { id: 'exhaust', label: 'Exhaust System', icon: Flame },
    { id: 'tyres', label: 'Tyres & Wheels', icon: Disc },
    { id: 'ac', label: 'AC / HVAC (Compressor)', icon: Sun },
    { id: 'bodyPanels', label: 'Body Panels', icon: Layers },
    { id: 'glass', label: 'Glass (Windshield & Windows)', icon: Eye },
    { id: 'lights', label: 'Lights (Headlight, Tail light, Indicators)', icon: Lightbulb },
    { id: 'interior', label: 'Interior (Seats, Dashboard, etc.)', icon: UserCheck },
  ];

  // Component states initialized to UPPERCASE Enums (Matching Zod Schema)
  const [componentStates, setComponentStates] = useState<Record<string, ComponentStatus>>({
    engine: 'GOOD',
    battery: 'GOOD',
    radiator: 'GOOD',
    fuelSystem: 'GOOD',
    gearbox: 'GOOD',
    suspension: 'GOOD',
    steering: 'GOOD',
    electrical: 'GOOD',
    exhaust: 'NOT_WORKING',
    tyres: 'GOOD',
    ac: 'GOOD',
    bodyPanels: 'GOOD',
    glass: 'GOOD',
    lights: 'GOOD',
    interior: 'GOOD',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleStatusChange = (componentId: string, status: ComponentStatus) => {
    setComponentStates(prev => ({ ...prev, [componentId]: status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    try {
      setIsSubmitting(true);

      // Payload strictly aligned with backend Zod schema keys & values
      const payload = {
        engine: componentStates.engine,
        bettery: componentStates.battery,
        radiator: componentStates.radiator,
        fuelSystem: componentStates.fuelSystem,
        gearbox: componentStates.gearbox,
        suspension: componentStates.suspension,
        steering: componentStates.steering,
        electrical: componentStates.electrical,
        exhaust: componentStates.exhaust,
        tyres: componentStates.tyres,
        ac: componentStates.ac,
        bodyPanels: componentStates.bodyPanels,
        glass: componentStates.glass,
        lights: componentStates.lights,
        interior: componentStates.interior,
      };

      const response = await majorComponents(vehicleId, payload);

      if (response) {
        onContinue();
      } else {
        setApiError(response?.message || 'Failed to update major components details.');
      }

    } catch (error: any) {
      console.error("Major components submission error:", error);
      const errorMsg = error?.response?.data?.message || 'Failed to update major components. Please try again.';
      setApiError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      
      {/* MAIN DATA GRID FOR MAJOR COMPONENTS */}
      <main className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-3xs space-y-6">
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#0B5B32] text-white rounded-xl flex items-center justify-center text-xl shadow-xs shrink-0">
            <Wrench size={22} className="stroke-[1.75]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-lg font-black text-gray-900 tracking-tight">Major Components</h1>
            <p className="text-[11px] font-bold text-gray-400">Step {currentStepNumber} of {totalStepsCount}</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* API Error Notification */}
        {apiError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold text-xs">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <p className="text-gray-400 font-bold mb-2">Tell us the condition of major components to help us calculate the right value.</p>

          {/* DYNAMIC RESPONSIVE COMPONENT MATRIX GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {componentsList.map((item) => {
              const ItemIcon = item.icon;
              const currentStatus = componentStates[item.id];

              return (
                <div key={item.id} className="p-3.5 border border-gray-100 rounded-xl bg-white shadow-3xs flex flex-col gap-2.5">
                  
                  {/* Row Info Label header */}
                  <div className="flex items-center gap-2 font-extrabold text-gray-800">
                    <ItemIcon size={15} className="text-gray-500" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {/* Component Option Row Pill Toggle Block */}
                  <div className="grid grid-cols-3 gap-1.5">
                    
                    {/* OPTION: GOOD STATUS */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'GOOD')}
                      className={`py-2 px-1 text-[10px] font-bold rounded-lg border text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        currentStatus === 'GOOD'
                          ? 'border-emerald-600 bg-emerald-50/40 text-emerald-700 font-extrabold ring-1 ring-emerald-600'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span>Good</span>
                      {currentStatus === 'GOOD' && <CheckCircle2 size={11} className="fill-emerald-600 text-white shrink-0" />}
                    </button>

                    {/* OPTION: NOT WORKING STATUS */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'NOT_WORKING')}
                      className={`py-2 px-1 text-[10px] font-bold rounded-lg border text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        currentStatus === 'NOT_WORKING'
                          ? 'border-red-500 bg-red-50/40 text-red-600 font-extrabold ring-1 ring-red-500'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span>Not Working</span>
                      {currentStatus === 'NOT_WORKING' && <CheckCircle2 size={11} className="fill-red-500 text-white shrink-0" />}
                    </button>

                    {/* OPTION: MISSING STATUS */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(item.id, 'MISSING')}
                      className={`py-2 px-1 text-[10px] font-bold rounded-lg border text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        currentStatus === 'MISSING'
                          ? 'border-amber-500 bg-amber-50/40 text-amber-600 font-extrabold ring-1 ring-amber-500'
                          : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span>Missing</span>
                      {currentStatus === 'MISSING' && <CheckCircle2 size={11} className="fill-amber-500 text-white shrink-0" />}
                    </button>

                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
            <button 
              type="button"
              onClick={onPrevious}
              disabled={isSubmitting}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black text-xs px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-3xs disabled:opacity-50 cursor-pointer"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>Back</span>
            </button>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black text-xs px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>

        </form>
      </main>

      {/* RIGHT SIDEBAR TRUST BLOCK */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-3xs space-y-5">
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            Why <span className="text-[#0B5B32]">component condition</span> matters?
          </h3>

          <div className="space-y-4 text-xs">
            {[
              { id: 1, title: 'Accurate Valuation', desc: 'Component condition helps us calculate the right market value.', icon: ShieldCheck },
              { id: 2, title: 'Better Offers', desc: 'Well-maintained parts can increase your vehicle’s value.', icon: Activity },
              { id: 3, title: 'Trusted by Experts', desc: 'Our partner recyclers use this data for fair and transparent offers.', icon: UserCheck },
              { id: 4, title: 'Faster Process', desc: 'Accurate details speed up pickup and settlement.', icon: CheckCircle2 }
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
              <span className="font-black text-gray-800">Tip:</span> <span className="text-gray-500 font-semibold">Be honest about the condition. It helps us give you the best and most accurate offer.</span>
            </div>
          </div>

        </div>
      </aside>

    </div>
  );
}