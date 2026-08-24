'use client'

import React, { useState } from 'react';
import {
  Car, Info, ArrowRight, ShieldCheck, ChevronDown,
  Flame, Settings2, Gauge, Loader2
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setVehicleData } from '@/store/vehicleSlice';
import { basicDetails } from '@/services/vehicle.service';

// Dependent Data Mapping
export const CAR_DATA: Record<string, Record<string, string[]>> = {
  'Maruti Suzuki': {
    'Alto K10': ['Std', 'LXI', 'VXI', 'VXI+'],
    'S-Presso': ['Std', 'LXI', 'VXI', 'VXI+'],
    'Celerio': ['LXI', 'VXI', 'ZXI', 'ZXI+'],
    'Wagon R': ['LXI', 'VXI', 'ZXI'],
    'Swift': ['LXI', 'VXI', 'ZXI', 'ZXI+'],
    'Dzire': ['LXI', 'VXI', 'ZXI', 'ZXI+'],
    'Baleno': ['Sigma', 'Delta', 'Zeta', 'Alpha'],
    'Ignis': ['Sigma', 'Delta', 'Zeta', 'Alpha'],
    'Fronx': ['Sigma', 'Delta', 'Delta+', 'Zeta', 'Alpha'],
    'Brezza': ['LXI', 'VXI', 'ZXI', 'ZXI+'],
    'Ertiga': ['LXI', 'VXI', 'ZXI', 'ZXI+'],
    'XL6': ['Zeta', 'Alpha', 'Alpha+'],
    'Grand Vitara': ['Sigma', 'Delta', 'Zeta', 'Alpha'],
    'Jimny': ['Zeta', 'Alpha'],
    'Ciaz': ['Sigma', 'Delta', 'Zeta', 'Alpha'],
    'Invicto': ['Zeta+', 'Alpha+'],
    'Victoris': ['LXi', 'VXi', 'ZXi', 'ZXi+']
  },

  'Hyundai': {
    'Grand i10 Nios': ['Era', 'Magna', 'Sportz', 'Asta'],
    'i20': ['Era', 'Magna', 'Sportz', 'Asta', 'Asta (O)'],
    'i20 N Line': ['N6', 'N8', 'N8 Dual Tone'],
    'Aura': ['E', 'S', 'SX', 'SX (O)'],
    'Exter': ['EX', 'S', 'SX', 'SX (O)'],
    'Venue': ['E', 'S', 'S+', 'S(O)', 'SX', 'SX (O)'],
    'Venue N Line': ['N6', 'N8'],
    'Creta': ['E', 'EX', 'S', 'S(O)', 'SX', 'SX Tech', 'SX (O)'],
    'Verna': ['EX', 'S', 'SX', 'SX (O)'],
    'Alcazar': ['Prestige', 'Platinum', 'Signature'],
    'Tucson': ['Platinum', 'Signature'],
    'Ioniq 5': ['Standard'],
    'Ioniq 6': ['Standard']
  },

  'Tata': {
    'Tiago': ['XE', 'XM', 'XT', 'XZ', 'XZ+'],
    'Tiago EV': ['XE', 'XT', 'XZ+'],
    'Tigor': ['XE', 'XM', 'XZ', 'XZ+'],
    'Tigor EV': ['XE', 'XZ+'],
    'Altroz': ['XE', 'XM', 'XT', 'XZ', 'XZ+'],
    'Punch': ['Pure', 'Adventure', 'Accomplished', 'Creative'],
    'Punch.ev': ['Smart', 'Adventure', 'Empowered'],
    'Nexon': ['Smart', 'Smart+', 'Pure', 'Creative', 'Creative+', 'Fearless'],
    'Nexon.ev': ['Creative', 'Fearless', 'Empowered'],
    'Curvv': ['Pure', 'Pure+', 'Creative', 'Creative+', 'Accomplished', 'Accomplished+'],
    'Curvv EV': ['Creative', 'Accomplished', 'Empowered'],
    'Harrier': ['Smart', 'Pure', 'Adventure', 'Fearless'],
    'Harrier EV': ['Adventure', 'Accomplished', 'Empowered'],
    'Safari': ['Smart', 'Pure', 'Adventure', 'Accomplished', 'Fearless'],
    'Sierra': ['Smart', 'Pure', 'Adventure', 'Accomplished', 'Fearless']
  },

  'Mahindra': {
    'Bolero': ['B4', 'B6', 'B6(O)'],
    'Bolero Neo': ['N4', 'N8', 'N10', 'N10(O)'],
    'Thar': ['AX (O)', 'LX', 'Earth Edition'],
    'Thar Roxx': ['MX1', 'MX3', 'AX3L', 'AX5L', 'AX7L'],
    'Scorpio Classic': ['S', 'S11'],
    'Scorpio N': ['Z2', 'Z4', 'Z6', 'Z8', 'Z8L'],
    'XUV 3XO': ['MX1', 'MX2', 'MX3', 'AX5', 'AX7'],
    'XUV400 EV': ['EC Pro', 'EL Pro'],
    'XUV700': ['MX', 'AX3', 'AX5', 'AX7', 'AX7L'],
    'BE 6': ['Pack One', 'Pack Two', 'Pack Three'],
    'XEV 9e': ['Pack One', 'Pack Two', 'Pack Three'],
    'XEV 9S': ['Pack One', 'Pack Two', 'Pack Three'],
    'Marazzo': ['M2', 'M4+', 'M6+', 'M8']
  },

  'Kia': {
    'Sonet': ['HTE', 'HTK', 'HTK+', 'HTX', 'HTX+', 'GTX+', 'X-Line'],
    'Seltos': ['HTE', 'HTK', 'HTK+', 'HTX', 'HTX+', 'GTX+', 'X-Line'],
    'Carens': ['Premium', 'Prestige', 'Prestige Plus', 'Luxury', 'Luxury Plus'],
    'Carens Clavis': ['Premium', 'Prestige', 'Prestige Plus', 'Luxury', 'Luxury Plus'],
    'Carens Clavis EV': ['HTK+', 'HTX', 'HTX+', 'GTX+'],
    'Syros': ['HTK', 'HTK+', 'HTX', 'HTX+'],
    'EV6': ['GT Line', 'GT Line AWD'],
    'EV9': ['GT Line'],
  },

  'Toyota': {
    'Glanza': ['E', 'S', 'G', 'V'],
    'Urban Cruiser Taisor': ['E', 'S', 'S+', 'G', 'V'],
    'Urban Cruiser Hyryder': ['E', 'S', 'G', 'V'],
    'Rumion': ['S', 'G', 'V'],
    'Innova Crysta': ['GX', 'VX', 'ZX'],
    'Innova Hycross': ['GX', 'VX', 'VX (O)', 'ZX', 'ZX (O)'],
    'Fortuner': ['4x2 MT', '4x2 AT', '4x4 MT', '4x4 AT'],
    'Fortuner Legender': ['4x2 AT', '4x4 AT'],
    'Hilux': ['Standard', 'High'],
    'Camry': ['2.5 Hybrid'],
    'Vellfire': ['Hi', 'VIP Grade']
  },

  'Honda': {
    'Amaze': ['V', 'VX', 'ZX'],
    'City': ['SV', 'V', 'VX', 'ZX'],
    'City e:HEV': ['V', 'ZX'],
    'Elevate': ['SV', 'V', 'VX', 'ZX']
  },

  'MG': {
    'Comet EV': ['Executive', 'Excite', 'Exclusive'],
    'Windsor EV': ['Excite', 'Exclusive', 'Essence'],
    'Astor': ['Sprint', 'Shine', 'Select', 'Smart', 'Savvy'],
    'Hector': ['Style', 'Shine', 'Select', 'Smart', 'Sharp'],
    'Gloster': ['Sharp', 'Savvy'],
    'ZS EV': ['Executive', 'Excite Pro', 'Exclusive Plus', 'Essence Pro'],
    'Cyberster': ['Trophy', 'GT'],
    'M9': ['Luxury']
  },

  'Skoda': {
    'Slavia': ['Classic', 'Signature', 'Prestige'],
    'Kushaq': ['Classic', 'Signature', 'Prestige'],
    'Kylaq': ['Classic', 'Classic Plus', 'Signature', 'Prestige', 'Sportline'],
    'Kodiaq': ['Style', 'Sportline', 'L&K'],
    'Octavia RS': ['RS']
  },

  'Volkswagen': {
    'Virtus': ['Comfortline', 'Highline', 'Topline', 'GT', 'GT Plus'],
    'Taigun': ['Comfortline', 'Highline', 'Topline', 'GT', 'GT Plus'],
    'Tiguan': ['Elegance'],
    'Golf GTI': ['GTI']
  },

  'Nissan': {
    'Magnite': ['XE', 'XL', 'XV', 'XV Premium'],
    'X-Trail': ['Standard'],
    'Tekton': ['XE', 'XL', 'XV', 'XV Premium']
  },

  'Renault': {
    'Kwid': ['RXE', 'RXL', 'RXT', 'Climber'],
    'Triber': ['RXE', 'RXL', 'RXT', 'RXZ'],
    'Kiger': ['RXE', 'RXL', 'RXT', 'RXZ']
  },

  'Jeep': {
    'Compass': ['Sport', 'Longitude', 'Limited', 'Model S'],
    'Meridian': ['Limited', 'Limited Plus', 'Overland'],
    'Wrangler': ['Unlimited', 'Rubicon'],
    'Grand Cherokee': ['Limited']
  },

  'Citroen': {
    'C3': ['Live', 'Feel', 'Shine'],
    'C3 Aircross': ['You', 'Plus', 'Max'],
    'eC3': ['Live', 'Feel', 'Shine'],
    'C5 Aircross': ['Shine'],
    'Basalt': ['You', 'Plus', 'Max']
  },

  'BYD': {
    'Atto 3': ['Dynamic', 'Premium', 'Superior'],
    'e6': ['GL', 'VX'],
    'Seal': ['Dynamic', 'Premium', 'Performance'],
    'Sealion 7': ['Dynamic', 'Premium Anniversary Edition', 'Performance Anniversary Edition']
  },

  'BMW': {
    '2 Series': ['220i M Sport', '220d M Sport'],
    '3 Series': ['320ld M Sport', 'M340i xDrive'],
    '5 Series': ['520d Luxury Line', '530i M Sport', '530d M Sport'],
    '7 Series': ['740i', '740d'],
    'X1': ['sDrive18i xLine', 'sDrive18d M Sport'],
    'X1 LWB': ['sDrive18Li M Sport'],
    'X3': ['xDrive20d Luxury Edition', 'xDrive30i SportX Plus'],
    'X5': ['xDrive40i M Sport', 'xDrive30d xLine'],
    'X7': ['xDrive40i M Sport', 'xDrive40d M Sport'],
    'i4': ['eDrive40'],
    'i5': ['M60 xDrive', 'First Edition'],
    'i7': ['xDrive50', 'M70 xDrive'],
    'iX': ['xDrive50'],
    'XM': ['Label']
  },

  'Mercedes-Benz': {
    'A-Class Limousine': ['A 200', 'A 200d'],
    'C-Class': ['C 200', 'C 220d', 'C 300d'],
    'E-Class': ['E 200', 'E 220d', 'E 350d'],
    'S-Class': ['S 350d', 'S 450'],
    'GLA': ['200', '220d', '220d 4MATIC'],
    'GLB': ['200', '220d'],
    'GLC': ['300 4MATIC', '220d 4MATIC'],
    'GLE': ['300d 4MATIC', '450 4MATIC'],
    'GLS': ['450 4MATIC', '580 4MATIC'],
    'EQS': ['580 4MATIC'],
    'EQS SUV': ['580 4MATIC'],
    'Maybach GLS': ['600']
  },

  'Audi': {
    'A4': ['Premium', 'Premium Plus', 'Technology'],
    'A6': ['Premium Plus', 'Technology'],
    'A8': ['L'],
    'Q3': ['Premium', 'Premium Plus', 'Technology'],
    'Q5': ['Premium Plus', 'Technology'],
    'Q7': ['Premium Plus', 'Technology'],
    'Q8': ['Celebration', 'Technology'],
    'e-tron': ['50', '55'],
    'e-tron GT': ['Quattro', 'RS']
  },

  'Volvo': {
    'XC40 Recharge': ['Plus', 'Ultimate'],
    'EX30': ['Plus', 'Ultra'],
    'XC60': ['B5 Ultimate'],
    'XC90': ['B6 Ultimate'],
    'C40 Recharge': ['Ultimate'],
    'EX40': ['Plus', 'Ultimate']
  },

  'Lexus': {
    'ES': ['300h Exquisite', '300h Luxury'],
    'NX': ['350h Exquisite', '350h Luxury', '350h F-Sport'],
    'RX': ['350h Luxury', '500h F-Sport'],
    'LX': ['500d'],
    'LM': ['350h']
  },

  'Land Rover': {
    'Defender': ['90 SE', '110 SE', '110 HSE', '130 SE'],
    'Range Rover Evoque': ['SE'],
    'Range Rover Velar': ['HSE Dynamic'],
    'Range Rover Sport': ['Dynamic SE', 'Dynamic HSE', 'Autobiography'],
    'Range Rover': ['HSE', 'Autobiography'],
    'Discovery': ['Dynamic SE'],
    'Discovery Sport': ['Dynamic SE']
  },

  'Jaguar': {
    'F-PACE': ['R-Dynamic S'],
    'I-PACE': ['HSE'],
    'F-TYPE': ['2.0 Coupe', '5.0 V8 Coupe']
  },

  'Force': {
    'Gurkha': ['3 Door', '5 Door'],
    'Trax Cruiser': ['9 Seater', '13 Seater']
  },

  'Datsun': {
    'GO': ['D', 'A', 'T', 'T(O)'],
    'GO+': ['D', 'A', 'T', 'T(O)'],
    'redi-GO': ['D', 'A', 'T', 'T(O)']
  }
};
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

  // Cascading Selection Handlers
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBrand = e.target.value;
    setFormData(prev => ({
      ...prev,
      carName: selectedBrand,
      model: '',   // Reset model when brand changes
      variant: ''  // Reset variant when brand changes
    }));
    if (errors.carName) setErrors(prev => ({ ...prev, carName: '' }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedModel = e.target.value;
    setFormData(prev => ({
      ...prev,
      model: selectedModel,
      variant: ''  // Reset variant when model changes
    }));
    if (errors.model) setErrors(prev => ({ ...prev, model: '' }));
  };

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

    if (!formData.carName.trim()) newErrors.carName = 'Please select a car brand';
    if (!formData.model.trim()) newErrors.model = 'Please select a car model';
    if (!formData.variant.trim()) newErrors.variant = 'Please select a variant';
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

      const response = await basicDetails(vehicleId, payload);

      if (response && (response.success || response.data)) {
        if (response.data) {
          dispatch(setVehicleData(response.data));
        }
        onContinue();
      } else {
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

  // Helper arrays based on current selections
  const availableModels = formData.carName ? Object.keys(CAR_DATA[formData.carName] || {}) : [];
  const availableVariants = (formData.carName && formData.model)
    ? CAR_DATA[formData.carName]?.[formData.model] || []
    : [];

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

            {/* Field: Car Brand (Dropdown) */}
            <div className="space-y-1.5 relative">
              <label className="font-extrabold text-gray-700">Car Name / Brand *</label>
              <div className="relative">
                <select
                  value={formData.carName}
                  onChange={handleBrandChange}
                  className={`w-full bg-white border ${errors.carName ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 pr-10 font-bold text-gray-700 appearance-none focus:outline-none focus:border-[#0B5B32] shadow-3xs cursor-pointer`}
                >
                  <option value="">Select Brand</option>
                  {Object.keys(CAR_DATA).map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.carName && <p className="text-red-500 text-[10px] font-bold">{errors.carName}</p>}
            </div>

            {/* Field: Model (Dropdown) */}
            <div className="space-y-1.5 relative">
              <label className="font-extrabold text-gray-700">Model *</label>
              <div className="relative">
                <select
                  value={formData.model}
                  onChange={handleModelChange}
                  disabled={!formData.carName}
                  className={`w-full bg-white border ${errors.model ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 pr-10 font-bold text-gray-700 appearance-none focus:outline-none focus:border-[#0B5B32] shadow-3xs disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer`}
                >
                  <option value="">{formData.carName ? 'Select Model' : 'Select Brand First'}</option>
                  {availableModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
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

            {/* Field: Variant (Dropdown) */}
            <div className="space-y-1.5 relative">
              <label className="font-extrabold text-gray-700">Variant *</label>
              <div className="relative">
                <select
                  value={formData.variant}
                  onChange={(e) => handleInputChange('variant', e.target.value)}
                  disabled={!formData.model}
                  className={`w-full bg-white border ${errors.variant ? 'border-red-500' : 'border-gray-200'} rounded-xl p-3 pr-10 font-bold text-gray-700 appearance-none focus:outline-none focus:border-[#0B5B32] shadow-3xs disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer`}
                >
                  <option value="">{formData.model ? 'Select Variant' : 'Select Model First'}</option>
                  {availableVariants.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
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

            {/* Field: Odometer Reading */}
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