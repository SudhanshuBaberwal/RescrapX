'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin, Navigation, Crosshair, Phone, ShieldCheck,
  User, Truck, Info, ArrowLeft, ArrowRight, Loader2
} from 'lucide-react';

import dynamic from "next/dynamic";
import { useCurrentLocation } from '@/hooks/getCurrentUserLocation';
import { reverseGeocode } from '@/lib/location';
import { pickupLocation } from '@/services/vehicle.service'; // Path according to your app

const LocationMap = dynamic<{ lat: number; lng: number }>(
  () => import("@/components/location/LocationMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-48 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-medium">
        Loading map...
      </div>
    ),
  }
);

interface StepComponentProps {
  vehicleId: string; // Added vehicleId Prop
  onContinue: () => void;
  onPrevious: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  currentStepNumber: number;
  totalStepsCount: number;
}

export default function VehiclePickupLocationPage({
  vehicleId,
  onContinue,
  onPrevious,
  currentStepNumber,
  totalStepsCount
}: StepComponentProps) {

  // Form State matched with Zod Enum representations
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
    vehicleLocationType: 'HOME', // Enum: HOME | OFFICE | PARKING | WORKSHOP | OTHER
    towTruckAccess: 'YES',      // Enum: YES | NO | NOT_SURE
    vehicleStatus: 'ON_ROAD'    // Enum: ON_ROAD | BASEMENT | SOCIETY | ROADSIDE | GARAGE
  });

  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const { location, loading, getLocation } = useCurrentLocation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFetchCurrentLocation = async () => {
    try {
      setIsFetchingAddress(true);
      await getLocation();
    } catch (error) {
      console.error("Error getting location:", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  useEffect(() => {
    const autoFillFromLocation = async () => {
      if (!location?.latitude || !location?.longitude) return;

      try {
        setIsFetchingAddress(true);
        const geoData = await reverseGeocode(location.latitude, location.longitude);

        if (geoData) {
          setFormData(prev => ({
            ...prev,
            houseNo: geoData.houseNo || prev.houseNo,
            street: geoData.street || geoData.road || prev.street,
            area: geoData.area || geoData.locality || prev.area,
            pincode: geoData.pincode || geoData.postalCode || prev.pincode,
            city: geoData.city || geoData.town || prev.city,
            state: geoData.state || prev.state
          }));
        }
      } catch (err) {
        console.error("Failed to reverse geocode location:", err);
      } finally {
        setIsFetchingAddress(false);
      }
    };

    autoFillFromLocation();
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    // Field Verification
    const requiredFields = ['houseNo', 'street', 'area', 'pincode', 'city', 'state', 'contactName', 'mobileNumber'];
    const missing = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missing.length > 0) {
      setApiError('Please fill out all required fields marked with an asterisk (*)');
      return;
    }

    // Pincode length check
    if (formData.pincode.length !== 6) {
      setApiError('Pincode must be exactly 6 digits.');
      return;
    }

    // Indian Mobile Number Check
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      setApiError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    try {
      setIsSubmitting(true);

      const formattedAddress = `${formData.houseNo}, ${formData.street}, ${formData.area}, ${formData.city}, ${formData.state} - ${formData.pincode}`;

      // Construct Payload to match Zod Schema exactly
      const payload = {
        houseNumber: formData.houseNo,
        street: formData.street,
        area: formData.area,
        landmark: formData.landmark || undefined,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        formattedAddress: formattedAddress,
        placeId: "manual_entry",
        contactName: formData.contactName,
        mobileNumber: formData.mobileNumber,
        alternateNumber: formData.alternateNumber || undefined,
        vehicleLocation: formData.vehicleLocationType,
        towAccessibility: formData.towTruckAccess,
        currentVehiclePosition: formData.vehicleStatus,
      };

      const response = await pickupLocation(vehicleId, payload);

      if (response && (response.success || response.data)) {
        onContinue();
      } else {
        setApiError(response?.message || "Failed to save pickup location.");
      }

    } catch (error: any) {
      console.error("Pickup Location API Error:", error);
      const msg = error?.response?.data?.message || error?.message || "An error occurred while saving.";
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full text-xs">

      <main className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-3xs space-y-6">

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#0B5B32] text-white rounded-xl flex items-center justify-center text-xl shadow-xs shrink-0">
            <MapPin size={22} className="stroke-[1.75]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-lg font-black text-gray-900 tracking-tight">Where is your vehicle located?</h1>
            <p className="text-[11px] font-bold text-gray-400">Step {currentStepNumber} of {totalStepsCount}</p>
          </div>
        </div>

        <p className="text-gray-400 font-bold -mt-2">
          Providing accurate pickup location helps us connect you with the right recyclers and get you the best offers.
        </p>

        <hr className="border-gray-100" />

        {/* Global Error Banner */}
        {apiError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-bold text-xs">
            {apiError}
          </div>
        )}

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
                <label className="font-bold text-gray-500">Landmark (Optional)</label>
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
                  maxLength={6}
                  placeholder="6 digit pincode"
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

          {/* DYNAMIC MAP INTEGRATION BLOCK */}
          <div className="space-y-3">
            <label className="font-bold text-gray-700 block">Select Location on Map</label>
            <p className="text-gray-400 font-medium -mt-1 text-[11px]">You can use your GPS location to pin the exact coordinates for pickup.</p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleFetchCurrentLocation}
                disabled={loading || isFetchingAddress}
                className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white font-bold hover:bg-gray-50 transition-all text-[#0B5B32] disabled:opacity-60 cursor-pointer"
              >
                {(loading || isFetchingAddress) ? (
                  <Loader2 size={14} className="animate-spin text-[#0B5B32]" />
                ) : (
                  <Crosshair size={14} />
                )}
                <span>{loading ? "Detecting location..." : "Use Current Location"}</span>
              </button>
            </div>

            {location?.latitude && location?.longitude ? (
              <div className="space-y-2">
                <div className="w-full h-56 rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
                  <LocationMap lat={location.latitude} lng={location.longitude} />
                </div>
                <div className="flex items-center gap-4 text-[10px] text-gray-500 font-semibold bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span>Lat: {location.latitude.toFixed(6)}</span>
                  <span>Lng: {location.longitude.toFixed(6)}</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-40 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center p-4 text-center">
                <Navigation size={20} className="text-gray-400 mb-1" />
                <p className="font-bold text-gray-600">No location selected yet</p>
                <p className="text-gray-400 text-[10px]">Click 'Use Current Location' to map your vehicle coordinates.</p>
              </div>
            )}
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
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-500 font-semibold">Alternate Number (Optional)</label>
                <input
                  type="tel" name="alternateNumber" value={formData.alternateNumber} onChange={handleInputChange}
                  maxLength={10}
                  placeholder="Enter alternate number"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ADDITIONAL INFORMATION WITH EXACT ENUMS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-black text-gray-800">
              <Truck size={16} className="text-[#0B5B32]" />
              <h3>Additional Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4 rounded-xl border border-gray-100 bg-gray-50/10">

              {/* vehicleLocation */}
              <div className="space-y-2.5">
                <h4 className="font-black text-gray-800 text-[11px]">Where is the vehicle currently?</h4>
                {[
                  { label: 'Home', value: 'HOME' },
                  { label: 'Office', value: 'OFFICE' },
                  { label: 'Parking', value: 'PARKING' },
                  { label: 'Workshop', value: 'WORKSHOP' },
                  { label: 'Other', value: 'OTHER' }
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-2.5 cursor-pointer font-bold text-gray-600 select-none">
                    <input
                      type="radio"
                      checked={formData.vehicleLocationType === item.value}
                      onChange={() => handleRadioChange('vehicleLocationType', item.value)}
                      className="accent-[#0B5B32] w-3.5 h-3.5"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

              {/* towAccessibility */}
              <div className="space-y-2.5">
                <h4 className="font-black text-gray-800 text-[11px]">Can the tow truck reach the vehicle?</h4>
                {[
                  { label: 'Yes, easily accessible', value: 'YES' },
                  { label: 'No, restricted access', value: 'NO' },
                  { label: 'Not sure', value: 'NOT_SURE' }
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-2.5 cursor-pointer font-bold text-gray-600 select-none">
                    <input
                      type="radio"
                      checked={formData.towTruckAccess === item.value}
                      onChange={() => handleRadioChange('towTruckAccess', item.value)}
                      className="accent-[#0B5B32] w-3.5 h-3.5"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

              {/* currentVehiclePosition */}
              <div className="space-y-2.5">
                <h4 className="font-black text-gray-800 text-[11px]">Vehicle is currently</h4>
                {[
                  { label: 'On Road', value: 'ON_ROAD' },
                  { label: 'Basement Parking', value: 'BASEMENT' },
                  { label: 'Society Parking', value: 'SOCIETY' },
                  { label: 'Roadside', value: 'ROADSIDE' },
                  { label: 'Garage / Workshop', value: 'GARAGE' }
                ].map((item) => (
                  <label key={item.value} className="flex items-center gap-2.5 cursor-pointer font-bold text-gray-600 select-none">
                    <input
                      type="radio"
                      checked={formData.vehicleStatus === item.value}
                      onChange={() => handleRadioChange('vehicleStatus', item.value)}
                      className="accent-[#0B5B32] w-3.5 h-3.5"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

            </div>
          </div>

          <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-xl p-3 flex items-start gap-2.5 text-gray-600">
            <Info size={14} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <p className="font-bold text-[10px] leading-relaxed">
              Your pickup location is shared only with authorized recyclers for bidding and logistics.
            </p>
          </div>

          {/* ACTION BUTTON RAIL */}
          <div className="flex flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
            <button
              type="button" 
              onClick={onPrevious}
              disabled={isSubmitting}
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-3xs disabled:opacity-50 cursor-pointer"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving Location...</span>
                </>
              ) : (
                <>
                  <span>Continue to Review & Confirm</span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </>
              )}
            </button>
          </div>

        </form>
      </main>

      {/* RIGHT SIDEBAR */}
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