'use client'

import React, { useState } from 'react';
import {
  Car, Info, ArrowRight, ShieldCheck, ChevronDown,
  Flame, Settings2, Gauge, Loader2
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setVehicleData } from '@/store/vehicleSlice';
import { basicDetails } from '@/services/vehicle.service';

interface StepComponentProps {
  vehicleId: string;
  onContinue: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepNumber: number;
  totalStepsCount: number;
}

export default function VehicleDetailsPage({
  vehicleId,
  onContinue,
  currentStepNumber,
  totalStepsCount
}: StepComponentProps) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    carName: '',
    model: '',
    registrationNumber: '',
    manufacturingYear: '2018',
    variant: '',
    fuelType: '',
    transmission: '',
    odometerReading: '0',
    ownership: '1'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};

    // 1. Validations
    if (!formData.carName.trim() || formData.carName.trim().length < 2) {
      newErrors.carName = 'Car Name / Brand must be at least 2 characters';
    }
    if (!formData.model.trim()) newErrors.model = 'Car Model is required';
    if (!formData.variant.trim()) newErrors.variant = 'Variant is required';
    if (!formData.fuelType) newErrors.fuelType = 'Please select a fuel type';
    if (!formData.transmission) newErrors.transmission = 'Please select a transmission type';

    const currentYear = new Date().getFullYear();
    const yearNum = Number(formData.manufacturingYear);
    if (!formData.manufacturingYear || isNaN(yearNum) || yearNum < 1990 || yearNum > currentYear) {
      newErrors.manufacturingYear = `Year must be between 1990 and ${currentYear}`;
    }

    if (formData.odometerReading === '' || isNaN(Number(formData.odometerReading)) || Number(formData.odometerReading) < 0) {
      newErrors.odometerReading = 'Please enter a valid odometer reading';
    }

    if (formData.ownership === '' || isNaN(Number(formData.ownership)) || Number(formData.ownership) < 1) {
      newErrors.ownership = 'Ownership must be at least 1';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      // Backend Zod Payload Exact Alignment
      const payload = {
        carName: formData.carName.trim(),
        model: formData.model.trim(),
        variant: formData.variant.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        manufacturingYear: Number(formData.manufacturingYear),
        fuelType: formData.fuelType.toUpperCase(),
        transmission: formData.transmission.toUpperCase(),
        odometerReading: Number(formData.odometerReading),
        ownership: Number(formData.ownership),
      };

      // 2. Call API
      const response = await basicDetails(vehicleId, payload);

      // 3. STRICT CHECK: Sirf success hone par hi Redux store update aur Next Page navigate hoga
      if (response && (response.success || response.data)) {
        if (response.data) {
          dispatch(setVehicleData(response.data));
        }
        
        // SUCCESS: Next Page Render hoga
        onContinue();
      } else {
        // Agar response success na ho
        setErrors({ apiError: response?.message || 'Failed to update vehicle details.' });
      }

    } catch (error: any) {
      console.error('Submission failed:', error);
      const apiErrMsg = error?.response?.data?.message || 'Failed to save vehicle details. Please try again.';
      setErrors({ apiError: apiErrMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">

      {/* LEFT PANEL */}
      <main className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-5 md:p-8 shadow-3xs space-y-6">

        {/* Header */}
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

        {errors.apiError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold text-xs">
            {errors.apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <p className="text-gray-400 font-bold mb-2">Please enter your vehicle's basic information</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

            {/* Field: carName */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700">Car Name / Brand *</label>
              <input
                type="text"
                placeholder="e.g., Maruti Suzuki"
                value={formData.carName}
                onChange={(e) => handleInputChange('carName', e.target.value)}
                className={`w-full bg-white border ${errors.carName ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs`}
              />
              {errors.carName && <p className="text-red-500 text-[10px] font-bold">{errors.carName}</p>}
            </div>

            {/* Field: Model */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700">Model *</label>
              <input
                type="text"
                placeholder="e.g., Swift"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className={`w-full bg-white border ${errors.model ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs`}
              />
              {errors.model && <p className="text-red-500 text-[10px] font-bold">{errors.model}</p>}
            </div>

            {/* Field: Registration Number */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700">Registration Number</label>
              <input
                type="text"
                placeholder="e.g., DL01AB1234"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs"
              />
            </div>

            {/* Field: Manufacturing Year */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700">Manufacturing Year *</label>
              <input
                type="number"
                placeholder="e.g., 2018"
                value={formData.manufacturingYear}
                onChange={(e) => handleInputChange('manufacturingYear', e.target.value)}
                className={`w-full bg-white border ${errors.manufacturingYear ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs`}
              />
              {errors.manufacturingYear && <p className="text-red-500 text-[10px] font-bold">{errors.manufacturingYear}</p>}
            </div>

            {/* Field: Variant */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700">Variant *</label>
              <input
                type="text"
                placeholder="e.g., VXI"
                value={formData.variant}
                onChange={(e) => handleInputChange('variant', e.target.value)}
                className={`w-full bg-white border ${errors.variant ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs`}
              />
              {errors.variant && <p className="text-red-500 text-[10px] font-bold">{errors.variant}</p>}
            </div>

            {/* Field: Fuel Type */}
            <div className="space-y-1.5 relative">
              <label className="font-extrabold text-gray-700">Fuel Type *</label>
              <div className="relative">
                <select
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className={`w-full bg-white border ${errors.fuelType ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 pr-10 font-bold text-gray-700 appearance-none focus:outline-none focus:border-[#0B5B32] shadow-3xs cursor-pointer`}
                >
                  <option value="">Select</option>
                  <option value="PETROL">Petrol</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="EV">Electric</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.fuelType && <p className="text-red-500 text-[10px] font-bold">{errors.fuelType}</p>}
            </div>

            {/* Field: Transmission */}
            <div className="space-y-1.5 relative">
              <label className="font-extrabold text-gray-700">Transmission *</label>
              <div className="relative">
                <select
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  className={`w-full bg-white border ${errors.transmission ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 pr-10 font-bold text-gray-700 appearance-none focus:outline-none focus:border-[#0B5B32] shadow-3xs cursor-pointer`}
                >
                  <option value="">Select</option>
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATIC">Automatic</option>
                  <option value="CVT">CVT</option>
                  <option value="DCT">DCT</option>
                  <option value="AMT">AMT</option>
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.transmission && <p className="text-red-500 text-[10px] font-bold">{errors.transmission}</p>}
            </div>

            {/* Field: odometerReading */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700">Odometer Reading (KM) *</label>
              <input
                type="number"
                placeholder="e.g., 85000"
                value={formData.odometerReading}
                onChange={(e) => handleInputChange('odometerReading', e.target.value)}
                className={`w-full bg-white border ${errors.odometerReading ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs`}
              />
              {errors.odometerReading && <p className="text-red-500 text-[10px] font-bold">{errors.odometerReading}</p>}
            </div>

            {/* Field: Ownership */}
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700">Ownership *</label>
              <input
                type="number"
                placeholder="e.g., 1"
                value={formData.ownership}
                onChange={(e) => handleInputChange('ownership', e.target.value)}
                className={`w-full bg-white border ${errors.ownership ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 font-semibold focus:outline-none focus:border-[#0B5B32] shadow-3xs`}
              />
              {errors.ownership && <p className="text-red-500 text-[10px] font-bold">{errors.ownership}</p>}
            </div>
          </div>

          <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-3.5 flex items-start gap-2.5 text-emerald-800">
            <Info size={14} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <p className="font-bold text-[11px] leading-relaxed">
              Don't worry if you don't remember exact details. You can edit them later.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2.5 text-gray-400 text-[10px]">
              <ShieldCheck size={16} className="text-emerald-600" />
              <div>
                <p className="font-black text-gray-700 leading-tight">100% Secure</p>
                <p className="font-medium mt-0.5">Your information is safe</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black text-xs px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] ml-auto disabled:opacity-70 cursor-pointer"
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

      {/* RIGHT SIDEBAR */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-3xs space-y-5">
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            Why get valuation from <span className="text-[#0B5B32]">RescrapX?</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex gap-3.5 items-start">
              <div className="p-2 bg-emerald-50 text-[#0B5B32] border border-emerald-100 rounded-xl shrink-0">
                <Flame size={15} />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <h4 className="font-black text-gray-800">Instant & Accurate Valuation</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">AI-powered pricing based on real market data</p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="p-2 bg-emerald-50 text-[#0B5B32] border border-emerald-100 rounded-xl shrink-0">
                <Settings2 size={15} />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <h4 className="font-black text-gray-800">Trusted Recycler Network</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Offers from verified & authorized recyclers</p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="p-2 bg-emerald-50 text-[#0B5B32] border border-emerald-100 rounded-xl shrink-0">
                <Gauge size={15} />
              </div>
              <div className="space-y-0.5 mt-0.5">
                <h4 className="font-black text-gray-800">Hassle-Free Process</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Doorstep pickup, documentation & deregistration</p>
              </div>
            </div>

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
        </div>
      </aside>

    </div>
  );
}