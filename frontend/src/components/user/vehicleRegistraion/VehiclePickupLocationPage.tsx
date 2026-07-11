'use client';

import React, { useState } from 'react';
import { 
  MapPin, Navigation, Crosshair, Phone, ShieldCheck, 
  User, Truck, Info, ArrowLeft, ArrowRight, HelpCircle
} from 'lucide-react';

interface StepComponentProps {
  onContinue: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepNumber: number;
  totalStepsCount: number;
}

export default function VehiclePickupLocationPage({
  onContinue,
  onPrevious,
  currentStepNumber,
  totalStepsCount
}: StepComponentProps) {
  
  // State variables for the complete location form
  const [formData, setFormData] = useState({
    houseNo: '',
    street: '',
    area: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    contactName: '',
    mobileNumber: '',
    alternateNumber: '',
    vehicleLocationType: 'Home',
    towTruckAccess: 'Yes, easily accessible',
    vehicleStatus: 'On Road'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const simulateCurrentLocation = () => {
    setFormData(prev => ({
      ...prev,
      houseNo: 'Flat 402, Building B',
      street: 'Barakhamba Road',
      area: 'Connaught Place',
      pincode: '110001',
      city: 'New Delhi',
      state: 'Delhi'
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Required fields verification
    const requiredFields = ['houseNo', 'street', 'area', 'pincode', 'city', 'state', 'contactName', 'mobileNumber'];
    const missing = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      alert('Please fill out all required fields marked with a red asterisk (*)');
      return;
    }
    
    onContinue();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full text-xs">
      
      {/* MAIN LAYOUT BLOCK CONTAINER */}
      <main className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-3xs space-y-6">
        
        {/* Step Context Title Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#0B5B32] text-white rounded-xl flex items-center justify-center text-xl shadow-xs shrink-0">
            <MapPin size={22} className="stroke-[1.75]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-lg font-black text-gray-900 tracking-tight">Where is your vehicle located?</h1>
            <p className="text-[11px] font-bold text-gray-400">Step {currentStepNumber} of {totalStepsCount}</p>
          </div>
        </div>

        <p className="text-gray-400 font-bold -mt-2">Providing accurate pickup location helps us connect you with the right recyclers and get you the best offers.</p>

        <hr className="border-gray-100" />

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: PICKUP ADDRESS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-gray-800">
              <MapPin size={16} className="text-[#0B5B32]" />
              <h3>Pickup Address</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">House No. / Building <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="houseNo" value={formData.houseNo} onChange={handleInputChange}
                  placeholder="Enter house no. / building"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Street / Road <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="street" value={formData.street} onChange={handleInputChange}
                  placeholder="Enter street / road"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Area / Locality <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="area" value={formData.area} onChange={handleInputChange}
                  placeholder="Enter area / locality"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-500 font-semibold">Landmark (Optional)</label>
                <input 
                  type="text" name="landmark" value={formData.landmark} onChange={handleInputChange}
                  placeholder="E.g. Near City Mall"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Pincode <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="pincode" value={formData.pincode} onChange={handleInputChange}
                  placeholder="Enter pincode"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">City <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="city" value={formData.city} onChange={handleInputChange}
                  placeholder="Enter city"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">State <span className="text-red-500">*</span></label>
                <select 
                  name="state" value={formData.state} onChange={handleInputChange}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs bg-white outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32] appearance-none cursor-pointer"
                >
                  <option value="">Select state</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
            </div>
          </div>

          {/* MAP WRAPPER GEOLOCATION BLOCK */}
          <div className="space-y-3">
            <label className="font-bold text-gray-700 block">Select Location on Map (Optional)</label>
            <p className="text-gray-400 font-medium -mt-1 text-[11px]">You can use the map to pin the exact location for easier pickup.</p>
            
            <div className="flex flex-wrap gap-3">
              <button 
                type="button" onClick={simulateCurrentLocation}
                className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white font-bold hover:bg-gray-50 transition-all text-[#0B5B32]"
              >
                <Crosshair size={14} />
                <span>Use Current Location</span>
              </button>
              <button 
                type="button"
                className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white font-bold hover:bg-gray-50 transition-all text-gray-700"
              >
                <Navigation size={14} className="text-emerald-600" />
                <span>Select on Google Maps</span>
              </button>
            </div>

            {/* Static Simulated Map Graphic Mockup container */}
            <div className="w-full h-48 rounded-xl bg-gray-100 border border-gray-200 relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="absolute top-1/2 left-1/3 -translate-y-1/2 bg-white border border-gray-100 p-2.5 rounded-lg shadow-md flex items-start gap-2 max-w-[240px] z-10">
                <MapPin size={18} className="text-[#0B5B32] shrink-0 mt-0.5 fill-[#0B5B32]/10" />
                <div>
                  <p className="font-black text-gray-800 text-[10px]">Pickup Location</p>
                  <p className="text-[9px] text-gray-400 font-medium leading-tight">Connaught Place, New Delhi, Delhi 110001, India</p>
                </div>
              </div>
              
              {/* Center pointer pinpoint */}
              <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 text-2xl drop-shadow-md">📍</div>

              {/* Zoom Buttons Controls mockup layout */}
              <div className="absolute bottom-3 right-3 flex flex-col border border-gray-200 bg-white rounded-lg shadow-sm">
                <button type="button" className="w-7 h-7 font-bold text-gray-600 border-b border-gray-100 hover:bg-gray-50 flex items-center justify-center text-sm">+</button>
                <button type="button" className="w-7 h-7 font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center text-sm">-</button>
              </div>
            </div>
          </div>

          {/* SECTION 2: CONTACT PERSON */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-gray-800">
              <User size={16} className="text-[#0B5B32]" />
              <h3>Contact Person</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Contact Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" name="contactName" value={formData.contactName} onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
                <input 
                  type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-500 font-semibold">Alternate Number (Optional)</label>
                <input 
                  type="tel" name="alternateNumber" value={formData.alternateNumber} onChange={handleInputChange}
                  placeholder="Enter alternate number"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ADDITIONAL INFORMATION RADIO MULTIPLEX GRID */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-gray-800">
              <Truck size={16} className="text-[#0B5B32]" />
              <h3>Additional Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 rounded-xl border border-gray-100 bg-gray-50/10">
              
              {/* Radio Group A */}
              <div className="space-y-2.5">
                <h4 className="font-black text-gray-800 text-[11px]">Where is the vehicle currently?</h4>
                {['Home', 'Office', 'Parking', 'Workshop', 'Other'].map((item) => (
                  <label key={item} className="flex items-center gap-2.5 cursor-pointer font-bold text-gray-600 select-none">
                    <input 
                      type="radio" 
                      checked={formData.vehicleLocationType === item} 
                      onChange={() => handleRadioChange('vehicleLocationType', item)}
                      className="accent-[#0B5B32] w-3.5 h-3.5"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {/* Radio Group B */}
              <div className="space-y-2.5">
                <h4 className="font-black text-gray-800 text-[11px]">Can the tow truck reach the vehicle?</h4>
                {['Yes, easily accessible', 'No, narrow / restricted access', 'Not sure'].map((item) => (
                  <label key={item} className="flex items-center gap-2.5 cursor-pointer font-bold text-gray-600 select-none">
                    <input 
                      type="radio" 
                      checked={formData.towTruckAccess === item} 
                      onChange={() => handleRadioChange('towTruckAccess', item)}
                      className="accent-[#0B5B32] w-3.5 h-3.5"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {/* Radio Group C */}
              <div className="space-y-2.5">
                <h4 className="font-black text-gray-800 text-[11px]">Vehicle is currently</h4>
                {['On Road', 'Basement Parking', 'Society Parking', 'Roadside', 'Garage / Workshop'].map((item) => (
                  <label key={item} className="flex items-center gap-2.5 cursor-pointer font-bold text-gray-600 select-none">
                    <input 
                      type="radio" 
                      checked={formData.vehicleStatus === item} 
                      onChange={() => handleRadioChange('vehicleStatus', item)}
                      className="accent-[#0B5B32] w-3.5 h-3.5"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

            </div>
          </div>

          {/* Logistics Data Safe Informational Box */}
          <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-xl p-3 flex items-start gap-2.5 text-gray-600">
            <Info size={14} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <p className="font-bold text-[10px] leading-relaxed">
              Your pickup location is shared only with authorized recyclers for bidding and logistics. It helps us calculate transportation costs and generate the most accurate offers.
            </p>
          </div>

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
              <span>Continue to Review & Confirm</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>

        </form>
      </main>

      {/* RIGHT SIDEBAR VALUE PANEL */}
      <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-6 text-xs">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6 shadow-3xs space-y-5">
          <h3 className="text-sm font-black text-gray-900 tracking-tight">
            Why we need your <span className="text-[#0B5B32]">location</span>?
          </h3>

          <div className="space-y-4">
            {[
              { title: 'Accurate Offers', desc: 'Location helps recyclers calculate transportation cost and give better offers.', icon: MapPin },
              { title: 'Faster Pickup', desc: 'Helps us assign the nearest partner for quick pickup.', icon: Truck },
              { title: 'Smooth Logistics', desc: 'Accurate location avoids delays and ensures a hassle-free experience.', icon: Navigation },
              { title: '100% Secure', desc: 'Your location is safe with us and shared only with authorized recyclers.', icon: ShieldCheck }
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

          <div className="pt-4 border-t border-gray-100 bg-[#F9FAFB] p-3.5 rounded-xl space-y-2">
            <div className="flex gap-2.5 text-gray-700 items-center">
              <Phone size={15} className="text-[#0B5B32]" />
              <div>
                <p className="font-black text-gray-800">Need Help?</p>
                <p className="text-gray-400 font-bold text-[10px]">Our support team is here to help you at every step.</p>
              </div>
            </div>
            <a 
              href="tel:18001234567"
              className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-center rounded-xl font-black text-gray-700 block transition-all text-xs"
            >
              Call 1800 123 4567
            </a>
          </div>

        </div>
      </aside>

    </div>
  );
}