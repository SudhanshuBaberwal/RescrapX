'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, ShieldCheck, Scale, TrendingUp, Headphones, Loader2,
  MapPin, Crosshair, Navigation
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useToast } from '@/lib/ui/toast/ToastContext';
import { partnerRegister } from '@/services/partner.service';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setUserData } from '@/store/userSlice';
import { useCurrentLocation } from '@/hooks/getCurrentUserLocation';
import { reverseGeocode } from '@/lib/location';

const LocationMap = dynamic<{ lat: number; lng: number }>(
  () => import('@/components/location/LocationMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-44 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-medium text-xs">
        Loading map...
      </div>
    ),
  }
);

export default function SignUpPartnerPortal() {
  const router = useRouter();
  const { showToast } = useToast();

  const { userData } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Current Location Hook
  const { location, loading: isGpsLoading, getLocation } = useCurrentLocation();
  const [isFetchingAddress, setIsFetchingAddress] = useState<boolean>(false);

  // Form State including Lat/Lng coordinates
  const [formData, setFormData] = useState({
    phoneNumber: '',
    companyName: '',
    gstNumber: '',
    panNumber: '',
    registrationNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: 0,
    longitude: 0,
    consent: false
  });

  // Client-side validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const complianceFeatures = [
    { label: 'Government Authorized RVSF Platform', icon: Building2 },
    { label: '100% Legal & Compliant Process', icon: Scale },
    { label: 'Secure & Transparent Operations', icon: ShieldCheck },
    { label: 'Grow Your Business with RescrapX', icon: TrendingUp },
  ];

  const footerHighlights = [
    { label: 'Government Authorized Platform', icon: Building2 },
    { label: 'RVSF Guidelines Compliant', icon: Scale },
    { label: 'Secure & Transparent Process', icon: ShieldCheck },
    { label: 'Dedicated Partner Support', icon: Headphones },
  ];

  // Trigger GPS detection
  const handleFetchCurrentLocation = async () => {
    try {
      setIsFetchingAddress(true);
      await getLocation();
    } catch (error) {
      console.error('Error getting location:', error);
      showToast('Failed to acquire GPS location. Please check browser permissions.', 'error');
    } finally {
      setIsFetchingAddress(false);
    }
  };

  // Update Lat/Lng and Reverse Geocode address fields whenever location changes
  useEffect(() => {
    const autoFillFromLocation = async () => {
      if (!location?.latitude || !location?.longitude) return;

      // Update lat/lng in form data state
      setFormData((prev) => ({
        ...prev,
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      try {
        setIsFetchingAddress(true);
        const geoData = await reverseGeocode(location.latitude, location.longitude);

        if (geoData) {
          const house = geoData.houseNo || '';
          const street = geoData.street || geoData.road || '';
          const area = geoData.area || geoData.locality || '';

          const fullAddressParts = [house, street, area].filter(Boolean);
          const fullAddress = fullAddressParts.length > 0 ? fullAddressParts.join(', ') : '';

          setFormData((prev) => ({
            ...prev,
            address: fullAddress || prev.address,
            pincode: geoData.pincode || geoData.postalCode || prev.pincode,
            city: geoData.city || geoData.town || prev.city,
            state: geoData.state || prev.state,
          }));

          showToast('Location coordinates and address updated!', 'success');
        }
      } catch (err) {
        console.error('Failed to reverse geocode location:', err);
        showToast('Coordinates updated, but address lookup failed.', 'warning');
      } finally {
        setIsFetchingAddress(false);
      }
    };

    autoFillFromLocation();
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      newErrors.phoneNumber = 'Phone number must be between 10 to 15 digits';
    }

    if (formData.companyName.trim().length < 2) newErrors.companyName = 'Company name is required';
    if (formData.gstNumber.trim().length !== 15) newErrors.gstNumber = 'Invalid GST Number (exactly 15 characters required)';
    if (formData.panNumber.trim().length !== 10) newErrors.panNumber = 'Invalid PAN Number (exactly 10 characters required)';
    if (formData.registrationNumber.trim().length < 3) newErrors.registrationNumber = 'Registration number is required';
    if (formData.address.trim().length < 5) newErrors.address = 'Address must be at least 5 characters';
    if (formData.city.trim().length < 2) newErrors.city = 'City is required';
    if (formData.state.trim().length < 2) newErrors.state = 'State is required';
    if (formData.pincode.trim().length !== 6) newErrors.pincode = 'Pincode must be exactly 6 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please resolve validation errors in the form.', 'warning');
      return;
    }

    if (!formData.consent) {
      showToast('Please agree to the compliance consent terms.', 'warning');
      return;
    }

    try {
      setIsLoading(true);

      // Backend Payload with explicit Latitude and Longitude values
      const payload = {
        phoneNumber: formData.phoneNumber,
        companyName: formData.companyName,
        gstNumber: formData.gstNumber.toUpperCase(),
        panNumber: formData.panNumber.toUpperCase(),
        registrationNumber: formData.registrationNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        latitude: formData.latitude || location?.latitude || 0,
        longitude: formData.longitude || location?.longitude || 0,
      };

      const result = await partnerRegister(payload);
      dispatch(setUserData(result?.data));
      showToast('Profile registered successfully', 'success');
      router.replace('/partner/verify-documents');
    } catch (err: any) {
      console.error(err);
      showToast(
        err?.response?.data?.message || 'Registration failed. Please verify form values.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex w-full text-sm text-gray-700 font-medium antialiased">
      <div className="w-full flex flex-col lg:flex-row items-stretch">

        {/* LEFT COLUMN: BRAND MARKETING SIDEBAR */}
        <div className="w-full lg:w-[32%] xl:w-[28%] bg-gradient-to-b from-gray-50 via-gray-50/80 to-gray-100 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200 shrink-0">
          <div className="space-y-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-1.5">
                Rescrap<span className="text-[#0B5B32]">X</span>
              </h1>
              <p className="text-xs text-[#0B5B32] font-black uppercase tracking-widest">RVSF Partner Portal</p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-3 bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs">
                <ShieldCheck className="text-[#0B5B32] shrink-0 mt-0.5" size={22} />
                <p className="font-bold text-gray-900 text-sm leading-snug">
                  Authorized RVSF partners building a sustainable and compliant ecosystem.
                </p>
              </div>

              <div className="space-y-3.5 pl-1">
                {complianceFeatures.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3.5 text-gray-700">
                      <div className="p-2 bg-white border border-gray-150 rounded-xl text-gray-500 shrink-0 shadow-3xs">
                        <Icon size={16} />
                      </div>
                      <span className="font-bold text-sm text-gray-800">{feat.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 bg-gray-200/40 rounded-2xl border border-gray-200/50 overflow-hidden relative aspect-video flex items-center justify-center text-center p-6 shadow-3xs">
            <div className="absolute inset-0 bg-[#0B4026]/5 mix-blend-multiply z-10" />
            <div className="z-20 text-gray-400 font-bold">
              <p className="text-3xl">🚚</p>
              <p className="text-xs tracking-tight text-gray-600 font-black mt-2">RescrapX Logistics & Fleet Network</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED PARTNER SIGN UP */}
        <div className="flex-1 p-6 sm:p-12 md:p-16 flex flex-col justify-between space-y-10 bg-white">
          <div className="text-right hidden sm:block self-end">
            <span className="text-xs font-black text-gray-900 block tracking-tight uppercase">India's Digital Platform</span>
            <span className="text-[11px] text-gray-400 font-bold block mt-0.5">for Responsible Vehicle Scrapping</span>
          </div>

          <div className="max-w-3xl space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Partner Business Registration</h2>
              <p className="text-xs font-bold text-gray-400">
                Register your RVSF facility or scrapping facility to access verified vehicle scrap listings.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* COMPANY & CONTACT DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Company / Business Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter business name"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                  />
                  {errors.companyName && <p className="text-[10px] text-red-500 font-bold">{errors.companyName}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Business Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter business phone"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                  />
                  {errors.phoneNumber && <p className="text-[10px] text-red-500 font-bold">{errors.phoneNumber}</p>}
                </div>
              </div>

              {/* IDENTIFICATION NUMBERS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">GST Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="gstNumber"
                    maxLength={15}
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="15 character GSTIN"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32] uppercase"
                  />
                  {errors.gstNumber && <p className="text-[10px] text-red-500 font-bold">{errors.gstNumber}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">PAN Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="panNumber"
                    maxLength={10}
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="10 character PAN"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32] uppercase"
                  />
                  {errors.panNumber && <p className="text-[10px] text-red-500 font-bold">{errors.panNumber}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">RVSF Reg. Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="Facility Reg Number"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                  />
                  {errors.registrationNumber && <p className="text-[10px] text-red-500 font-bold">{errors.registrationNumber}</p>}
                </div>
              </div>

              {/* CURRENT LOCATION / GPS MAP INTEGRATION */}
              <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#0B5B32]" />
                    <span className="text-xs font-black text-gray-800">Facility GPS Location</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleFetchCurrentLocation}
                    disabled={isGpsLoading || isFetchingAddress}
                    className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 py-2 bg-white font-bold text-[11px] hover:bg-gray-50 transition-all text-[#0B5B32] shadow-2xs disabled:opacity-60 cursor-pointer"
                  >
                    {isGpsLoading || isFetchingAddress ? (
                      <Loader2 size={13} className="animate-spin text-[#0B5B32]" />
                    ) : (
                      <Crosshair size={13} />
                    )}
                    <span>{isGpsLoading ? 'Detecting Location...' : 'Use Current Location'}</span>
                  </button>
                </div>

                {formData.latitude && formData.longitude ? (
                  <div className="space-y-2">
                    <div className="w-full h-44 rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
                      <LocationMap lat={formData.latitude} lng={formData.longitude} />
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-gray-500 font-semibold bg-white p-2 rounded-lg border border-gray-100">
                      <span>Latitude: {formData.latitude.toFixed(6)}</span>
                      <span>Longitude: {formData.longitude.toFixed(6)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-28 rounded-xl bg-white border border-dashed border-gray-200 flex flex-col items-center justify-center p-3 text-center">
                    <Navigation size={18} className="text-gray-400 mb-1" />
                    <p className="font-bold text-gray-600 text-xs">No GPS coordinates captured</p>
                    <p className="text-gray-400 text-[10px]">Click 'Use Current Location' to record latitude and longitude for backend storage.</p>
                  </div>
                )}
              </div>

              {/* ADDRESS FIELD */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 block">Facility Address <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street / Premises Address"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                />
                {errors.address && <p className="text-[10px] text-red-500 font-bold">{errors.address}</p>}
              </div>

              {/* CITY, STATE & PINCODE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">City <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                  />
                  {errors.city && <p className="text-[10px] text-red-500 font-bold">{errors.city}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">State <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                  />
                  {errors.state && <p className="text-[10px] text-red-500 font-bold">{errors.state}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 block">Pincode <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="pincode"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6 digit pincode"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-xs outline-hidden focus:border-[#0B5B32] focus:ring-1 focus:ring-[#0B5B32]"
                  />
                  {errors.pincode && <p className="text-[10px] text-red-500 font-bold">{errors.pincode}</p>}
                </div>
              </div>

              {/* COMPLIANCE CONSENT CHECKBOX */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer font-bold text-gray-600 text-xs select-none">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="accent-[#0B5B32] w-4 h-4 rounded-md shrink-0 mt-0.5"
                  />
                  <span className="leading-relaxed">
                    I confirm that our facility is an authorized RVSF / scrapping unit compliant with Ministry of Road Transport & Highways guidelines.
                  </span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0B5B32] hover:bg-[#084827] text-white font-black py-3.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Registering Partner Profile...</span>
                  </>
                ) : (
                  <span>Complete Partner Registration</span>
                )}
              </button>

            </form>
          </div>

          {/* FOOTER HIGHLIGHTS */}
          <div className="pt-8 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {footerHighlights.map((hl, idx) => {
              const Icon = hl.icon;
              return (
                <div key={idx} className="flex items-center gap-2 text-gray-500">
                  <Icon size={14} className="text-[#0B5B32] shrink-0" />
                  <span className="text-[10px] font-bold leading-tight">{hl.label}</span>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}