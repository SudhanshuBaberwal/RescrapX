'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck, Edit2, Car, ShieldAlert, Settings, FileText,
  Camera, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2,
  XCircle, Search, RefreshCw, Loader2, AlertCircle, X, Maximize2
} from 'lucide-react';
import axios from 'axios';

import { getVehicle, reviewAndSubmit } from '@/services/vehicle.service';

interface StepComponentProps {
  vehicleId: string;
  onContinue: () => void;
  onPrevious: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  currentStepNumber: number;
  totalStepsCount: number;
  goToStep?: (stepNumber: number) => void;
}

const SUPABASE_PROJECT_URL = "https://guqagldnqzyrljirupya.supabase.co";

const getMediaUrl = (pathObj: any): string | null => {
  if (!pathObj) return null;

  let rawPath = '';

  if (typeof pathObj === 'string') {
    rawPath = pathObj;
  } else if (typeof pathObj === 'object') {
    rawPath =
      pathObj.url ||
      pathObj.path?.path ||
      pathObj.path ||
      pathObj.fullPath ||
      pathObj.key ||
      '';
  }

  if (!rawPath || typeof rawPath !== 'string') return null;

  if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('data:')) {
    return rawPath;
  }

  const cleanPath = rawPath
    .replace(/^partner-documents\//i, '')
    .replace(/^\/+/, '');

  if (!cleanPath) return null;

  return `${SUPABASE_PROJECT_URL}/storage/v1/object/public/partner-documents/${cleanPath}`;
};

export default function VehicleReviewConfirmPage({
  vehicleId,
  onContinue,
  onPrevious,
  currentStepNumber,
  totalStepsCount,
  goToStep
}: StepComponentProps) {

  const [vehicleData, setVehicleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>('');

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'submitting' | 'success' | 'failed'>('idle');

  // Resolved signed photo URLs
  const [resolvedPhotos, setResolvedPhotos] = useState<{ label: string; url: string }[]>([]);

  // State for image inspection modal (Lightbox)
  const [previewImage, setPreviewImage] = useState<{ url: string; label: string } | null>(null);

  // ==========================================
  // 1. FETCH VEHICLE DATA ON MOUNT
  // ==========================================
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!vehicleId) {
        setFetchError("Vehicle ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await getVehicle(vehicleId);
        const responseData = res?.data?.data || res?.data || res;
        if (responseData) {
          setVehicleData(responseData);
        } else {
          setFetchError("Failed to load vehicle details.");
        }
      } catch (error: any) {
        console.error("Error fetching vehicle:", error);
        setFetchError(error?.message || "Something went wrong while fetching vehicle data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [vehicleId]);

  // ==========================================
  // RESOLVE SIGNED PHOTO URLS
  // ==========================================
  useEffect(() => {
    if (!vehicleData) return;

    const rawPhotos = vehicleData.photos || {};
    const initialList: { label: string; rawPath: string; url: string }[] = [];

    if (Array.isArray(rawPhotos)) {
      rawPhotos.forEach((item: any) => {
        const url = getMediaUrl(item);
        const rawPath = typeof item === 'string' ? item : item?.path || item?.fullPath || '';
        if (url) initialList.push({ label: item?.name || 'Photo', rawPath, url });
      });
    } else if (rawPhotos && typeof rawPhotos === 'object') {
      Object.entries(rawPhotos).forEach(([key, photoObj]) => {
        const url = getMediaUrl(photoObj);
        const rawPath = typeof photoObj === 'string' ? photoObj : (photoObj as { path?: string })?.path || '';
        if (url) {
          initialList.push({
            label: key.replace(/([A-Z])/g, ' $1').toUpperCase(),
            rawPath,
            url,
          });
        }
      });
    }

    const fetchSignedUrls = async () => {
      const updatedList = await Promise.all(
        initialList.map(async (item) => {
          try {
            const res = await axios.post(
              `http://localhost:8000/api/vehicle/register/view-document`,
              { path: item.rawPath },
              { withCredentials: true }
            );
            const signedUrl = res.data?.data?.url || res.data?.url || res.data?.data || res.data || item.url;
            return { label: item.label, url: signedUrl };
          } catch {
            return { label: item.label, url: item.url };
          }
        })
      );

      setResolvedPhotos(updatedList);
    };

    fetchSignedUrls();
  }, [vehicleData]);

  // Handle Edit Action Step Navigation
  const handleEditClick = (stepNum: number) => {
    if (goToStep) {
      goToStep(stepNum);
    } else {
      alert(`Redirecting to edit Step ${stepNum}...`);
    }
  };

  // ==========================================
  // 2. FINAL SUBMISSION API HANDLER
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed) {
      alert("Please check the confirmation box to declare that your provided details are accurate.");
      return;
    }

    setRegistrationStatus('submitting');

    try {
      const response = await reviewAndSubmit(vehicleId);
      if (response && (response.data?.success || response.data?.status === 200 || response.data)) {
        setRegistrationStatus('success');
      } else {
        setRegistrationStatus('failed');
      }
    } catch (error) {
      console.error("Submission error:", error);
      setRegistrationStatus('failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white border border-gray-100 rounded-2xl p-8 text-center space-y-4 shadow-3xs">
        <Loader2 className="animate-spin text-[#0B5B32]" size={44} />
        <div className="space-y-1">
          <h2 className="text-base font-black text-gray-900">Loading Vehicle Summary</h2>
          <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto">Fetching your registered vehicle details for final review...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white border border-gray-100 rounded-2xl p-8 text-center space-y-5 shadow-3xs">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
          <AlertCircle size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-black text-gray-900">Error Loading Details</h2>
          <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">{fetchError}</p>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-6 py-2.5 rounded-xl transition-all text-xs cursor-pointer"
        >
          Reload Page
        </button>
      </div>
    );
  }

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
          <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">We encountered an issue finalizing your scrap application records. Please try again.</p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setRegistrationStatus('idle')}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-5 py-2.5 rounded-xl transition-all text-xs cursor-pointer"
          >
            Review Details Again
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-6 py-2.5 rounded-xl transition-all text-xs cursor-pointer"
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
          <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">Your vehicle entry has been confirmed. Bidding is complete and your digital value reports are ready.</p>
        </div>
        <button
          type="button"
          onClick={onContinue}
          className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-8 py-3 rounded-xl flex items-center gap-2 shadow-xs transition-all text-xs cursor-pointer"
        >
          <span>View Instant Offer</span>
          <ArrowRight size={14} strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  // Extract nested objects dynamically with fallbacks
  const details = vehicleData?.vehicleDetails || {};
  const condition = vehicleData?.vehicleCondition || {};
  const components = vehicleData?.majorComponents || {};
  const docs = vehicleData?.documents || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full text-xs">

      {/* MAIN DATA REVIEW GRID CONTAINER */}
      <main className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-3xs space-y-6">

        {/* Header Summary Banner */}
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
                className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-lg font-bold text-gray-600 transition-all text-[10px] cursor-pointer"
              >
                <Edit2 size={10} /> <span>Edit</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div className="space-y-0.5">
                <p className="font-black text-gray-800 break-words">{details.brand || '-'} {details.model || ''}</p>
                <p className="text-[10px] text-gray-400 font-medium">Car / Model</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-gray-800 break-words">{details.registrationNumber || '-'}</p>
                <p className="text-[10px] text-gray-400 font-medium">Registration No.</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-gray-800 break-words">{details.manufacturingYear || '-'}</p>
                <p className="text-[10px] text-gray-400 font-medium">Mfg. Year</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-gray-800 break-words">{details.fuelType || '-'}</p>
                <p className="text-[10px] text-gray-400 font-medium">Fuel Type</p>
              </div>
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
                className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-lg font-bold text-gray-600 transition-all text-[10px] cursor-pointer"
              >
                <Edit2 size={10} /> <span>Edit</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div className="space-y-0.5">
                <p className="font-black text-gray-800 break-words">{condition.isAccidental ? 'Accidental' : 'No Accident'}</p>
                <p className="text-[10px] text-gray-400 font-medium">Accident History</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-gray-800 break-words">{condition.structuralDamage ? 'Damaged' : 'No Damage'}</p>
                <p className="text-[10px] text-gray-400 font-medium">Structural Damage</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-gray-800 break-words">{condition.airbagsDeployed ? 'Yes' : 'No'}</p>
                <p className="text-[10px] text-gray-400 font-medium">Airbags Deployed</p>
              </div>
              <div className="space-y-0.5">
                <p className="font-black text-gray-800 break-words">{condition.remarks || 'No remarks'}</p>
                <p className="text-[10px] text-gray-400 font-medium">Remarks</p>
              </div>
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
                className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-lg font-bold text-gray-600 transition-all text-[10px] cursor-pointer"
              >
                <Edit2 size={10} /> <span>Edit</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1">
              {Object.keys(components).length > 0 ? (
                Object.entries(components).map(([key, val]: [string, any], idx) => (
                  <div key={idx} className="flex items-center gap-1.5 font-bold text-gray-700 capitalize">
                    <span>{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-gray-900 font-black">{String(val)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 font-bold">No component details available.</p>
              )}
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
                className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-lg font-bold text-gray-600 transition-all text-[10px] cursor-pointer"
              >
                <Edit2 size={10} /> <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {Object.entries(docs).map(([docKey, docVal]: [string, any], idx) => {
                const isUploaded = Boolean(docVal);
                return (
                  <div key={idx} className="border border-gray-100 rounded-xl p-2.5 flex items-start gap-2 bg-white">
                    {isUploaded ? (
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={14} className="text-gray-300 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="font-black text-gray-800 text-[11px] truncate capitalize">
                        {docKey.replace(/([A-Z])/g, ' $1')}
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold">
                        {isUploaded ? 'Available' : 'Not Uploaded'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BLOCK 5: PHOTOS (UPDATED WITH SIGNED RESOLVED THUMBNAILS) */}
          <div className="border border-gray-100 rounded-2xl p-4 space-y-3 relative bg-white shadow-3xs">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <div className="flex items-center gap-2 font-black text-gray-800 text-sm">
                <Camera size={16} className="text-[#0B5B32]" />
                <h3>Photos Uploaded</h3>
              </div>
              <button
                type="button" onClick={() => handleEditClick(5)}
                className="flex items-center gap-1 border border-gray-200 hover:bg-gray-50 px-2.5 py-1 rounded-lg font-bold text-gray-600 transition-all text-[10px] cursor-pointer"
              >
                <Edit2 size={10} /> <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
              {resolvedPhotos.length > 0 ? (
                resolvedPhotos.map((photo, idx) => (
                  <div key={idx} className="space-y-1 group">
                    <div
                      onClick={() => setPreviewImage({ url: photo.url, label: photo.label })}
                      className="aspect-square bg-gray-50 border border-gray-200 hover:border-[#0B5B32] rounded-xl overflow-hidden flex items-center justify-center relative cursor-pointer transition-all duration-200 hover:shadow-md"
                    >
                      <img
                        src={photo.url}
                        alt={photo.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 size={16} />
                      </div>
                    </div>
                    <p className="text-[9px] text-gray-500 font-bold text-center truncate capitalize">
                      {photo.label}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 font-bold col-span-full py-2">No photos uploaded.</p>
              )}
            </div>
          </div>

          {/* Confirmation Checkbox */}
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
              className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-3xs cursor-pointer"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
            >
              <span>Confirm & Get Offer</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>

        </form>
      </main>

      {/* RIGHT SIDEBAR */}
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
              <RefreshCw size={15} className="text-gray-400" />
              <div className="text-[11px]">
                <p className="font-black text-gray-800">Need to make changes?</p>
                <p className="text-gray-400 font-bold">You can go back and edit any section before confirming.</p>
              </div>
            </div>
          </div>

        </div>
      </aside>

      {/* PHOTO PREVIEW LIGHTBOX MODAL */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
              <h4 className="font-black text-gray-800 capitalize text-sm">
                {previewImage.label}
              </h4>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-2 bg-gray-900 flex items-center justify-center overflow-auto max-h-[75vh]">
              <img
                src={previewImage.url}
                alt={previewImage.label}
                className="max-h-[70vh] w-auto object-contain rounded-lg"
              />
            </div>

            <div className="px-5 py-3 border-t border-gray-100 text-center bg-white">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-5 py-2 rounded-xl transition-all text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}