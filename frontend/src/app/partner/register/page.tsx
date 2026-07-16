'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2, ShieldCheck, Scale, TrendingUp, ChevronDown, Headphones, Loader2
} from 'lucide-react';
import { useToast } from '@/lib/ui/toast/ToastContext';
import { partnerRegister } from '@/services/partner.service';

export default function SignUpPartnerPortal() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Aligned form states (Excluding basic user signup fields)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => {
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

  // Client-side structural validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      newErrors.phoneNumber = "Phone number must be between 10 to 15 digits";
    }

    if (formData.companyName.trim().length < 2) newErrors.companyName = "Company name is required";
    if (formData.gstNumber.trim().length !== 15) newErrors.gstNumber = "Invalid GST Number (exactly 15 characters required)";
    if (formData.panNumber.trim().length !== 10) newErrors.panNumber = "Invalid PAN Number (exactly 10 characters required)";
    if (formData.registrationNumber.trim().length < 3) newErrors.registrationNumber = "Registration number is required";
    if (formData.address.trim().length < 5) newErrors.address = "Address must be at least 5 characters";
    if (formData.city.trim().length < 2) newErrors.city = "City is required";
    if (formData.state.trim().length < 2) newErrors.state = "State is required";
    if (formData.pincode.trim().length !== 6) newErrors.pincode = "Pincode must be exactly 6 digits";

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
      };

      await partnerRegister(payload);

      showToast('Profile registered! Redirecting to upload verification documents...', 'success');
      
      // Navigate to documents upload flow
      router.push('/partner/verify-documents');
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
        <div className="flex-1 p-6 sm:p-12 md:p-16 flex flex-col justify-between space-y-12 bg-white">
          <div className="text-right hidden sm:block self-end">
            <span className="text-xs font-black text-gray-900 block tracking-tight uppercase">India's Digital Platform</span>
            <span className="text-[11px] text-gray-400 font-bold block mt-0.5">for Responsible Vehicle Scrapping</span>
          </div>

          <div className="w-full max-w-3xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Create Your RVSF Account</h2>
              <p className="text-sm text-gray-400 font-semibold">Register your RVSF and authorized contact details</p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>

              {/* SECTION 1: SYSTEM CONTROLS & CONTACT */}
              <div className="space-y-4">
                <h4 className="font-black text-[#0B5B32] text-xs border-b border-gray-150 pb-2.5 uppercase tracking-widest">1. Contact Verification</h4>
                <div className="grid grid-cols-1 gap-4">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Phone Number <span className="text-red-500">*</span></label>
                    <div className={`flex rounded-xl overflow-hidden border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'} bg-gray-50/50 shadow-3xs focus-within:ring-2 focus-within:ring-emerald-700/20 focus-within:border-emerald-700 transition-all`}>
                      <div className="px-4 bg-gray-100 border-r border-gray-200 text-gray-600 font-black flex items-center gap-1.5 text-sm select-none">
                        <span>+91</span>
                        <ChevronDown size={14} className="text-gray-400" />
                      </div>
                      <input 
                        type="tel" 
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter 10-digit phone number" 
                        className="w-full bg-transparent px-4 py-3 text-base text-gray-900 font-bold focus:outline-none" 
                        required 
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-xs text-red-500 font-bold mt-1">{errors.phoneNumber}</p>}
                  </div>

                </div>
              </div>

              {/* SECTION 2: COMPANY DETAILS */}
              <div className="space-y-5">
                <h4 className="font-black text-[#0B5B32] text-xs border-b border-gray-150 pb-2.5 uppercase tracking-widest">2. RVSF / Company Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Company Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Enter company legal name" 
                      className={`w-full bg-gray-50/50 border ${errors.companyName ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all shadow-3xs`}
                      required 
                    />
                    {errors.companyName && <p className="text-xs text-red-500 font-bold mt-1">{errors.companyName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">GST Number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      maxLength={15}
                      placeholder="15-character GSTIN" 
                      className={`w-full bg-gray-50/50 border ${errors.gstNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all shadow-3xs uppercase`}
                      required 
                    />
                    {errors.gstNumber && <p className="text-xs text-red-500 font-bold mt-1">{errors.gstNumber}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">PAN Number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      maxLength={10}
                      placeholder="10-character PAN" 
                      className={`w-full bg-gray-50/50 border ${errors.panNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all shadow-3xs uppercase`}
                      required 
                    />
                    {errors.panNumber && <p className="text-xs text-red-500 font-bold mt-1">{errors.panNumber}</p>}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Company Registration Number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="Enter registration or CIN number" 
                      className={`w-full bg-gray-50/50 border ${errors.registrationNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all shadow-3xs`}
                      required 
                    />
                    {errors.registrationNumber && <p className="text-xs text-red-500 font-bold mt-1">{errors.registrationNumber}</p>}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Registered Address <span className="text-red-500">*</span></label>
                    <textarea 
                      rows={3} 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter office / RVSF site address" 
                      className={`w-full bg-gray-50/50 border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 resize-none transition-all shadow-3xs`}
                      required 
                    />
                    {errors.address && <p className="text-xs text-red-500 font-bold mt-1">{errors.address}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">City <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter City" 
                      className={`w-full bg-gray-50/50 border ${errors.city ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all shadow-3xs`}
                      required 
                    />
                    {errors.city && <p className="text-xs text-red-500 font-bold mt-1">{errors.city}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">State <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter State" 
                      className={`w-full bg-gray-50/50 border ${errors.state ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all shadow-3xs`}
                      required 
                    />
                    {errors.state && <p className="text-xs text-red-500 font-bold mt-1">{errors.state}</p>}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs text-gray-500 font-black block uppercase tracking-wider">Pincode <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      placeholder="6-digit postal code" 
                      className={`w-full bg-gray-50/50 border ${errors.pincode ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all shadow-3xs`}
                      required 
                    />
                    {errors.pincode && <p className="text-xs text-red-500 font-bold mt-1">{errors.pincode}</p>}
                  </div>

                </div>
              </div>

              {/* Consent and Action Buttons */}
              <div className="flex items-start gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="signup-consent" 
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="mt-1 rounded-sm border-gray-300 text-emerald-700 focus:ring-emerald-700 h-4 w-4 cursor-pointer" 
                  required 
                />
                <label htmlFor="signup-consent" className="text-xs text-gray-500 font-bold leading-relaxed select-none cursor-pointer">
                  I confirm that all the information provided above is true and correct under standard authorized RVSF compliance declarations.
                </label>
              </div>

              <div className="space-y-4 pt-2">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#0B5B32] hover:bg-[#073d21] text-white font-black py-4 rounded-xl shadow-xs transition-all text-center text-sm uppercase tracking-wide cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying & Creating...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
                <p className="text-center text-sm text-gray-400 font-bold">
                  Already have an account? <a href="/login" className="text-[#0B5B32] font-black hover:underline">Login</a>
                </p>
              </div>
            </form>
          </div>

          {/* LOWER COMPLIANCE FOOTER MARKS */}
          <div className="border-t border-gray-150 pt-6 mt-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {footerHighlights.map((hl, itemIdx) => {
                const HlIcon = hl.icon;
                return (
                  <div key={itemIdx} className="flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-400 font-bold text-xs">
                    <HlIcon size={14} className="text-gray-400 shrink-0" />
                    <span className="leading-tight">{hl.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}