'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UserNavbar from '@/components/navbar/user/UserNavbar';
import Footer from '@/components/footer/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { IVehicle } from '@/context/vehicleProvider';
import { getAllVehicles } from '@/hooks/getAllVehicles';
import {
  Car, ShieldCheck, Calendar, Fuel, Gauge, ArrowLeft,
  XCircle, CheckCircle2, AlertCircle, FileText, MapPin,
  RefreshCw, Eye, Gavel, Truck, Loader2
} from 'lucide-react';
import axios from 'axios';
import { getUserProfileData } from '@/hooks/getUserProfileData';
import { applyForAuction } from '@/services/auction/auctionVehicle.service';
import { useToast } from '@/lib/ui/toast/ToastContext';

// API call to approve vehicle for pickup
export const approveVehicleForPickup = async (vehicleId: string) => {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/register/approve-pickup?vehicleId=${vehicleId}`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const formatDate = (dateValue?: string | Date) => {
  if (!dateValue) return 'N/A';
  return new Date(dateValue).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

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

export default function VehicleDetailsPage() {
  getAllVehicles();
  getUserProfileData();

  const { userProfileData } = useSelector((state: RootState) => state.user);
  const params = useParams();
  const router = useRouter();
  const vehicleId = params?.Id as string;
  const { showToast } = useToast();
  const { allVehiclesData } = useSelector((state: RootState) => state.vehicle);
  const [vehicle, setVehicle] = useState<IVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [auctionError, setAuctionError] = useState<string | null>(null);

  // States for pickup approval
  const [isApprovingPickup, setIsApprovingPickup] = useState(false);
  const [isPickupApproved, setIsPickupApproved] = useState(false);

  const [resolvedPhotos, setResolvedPhotos] = useState<{ label: string; url: string }[]>([]);

  useEffect(() => {
    if (!vehicle) return;

    // Set initial pickup approval state from vehicle record if present
    if ((vehicle as any)?.isPickupApproved || (vehicle as any)?.pickupApproved) {
      setIsPickupApproved(true);
    }

    const rawPhotos = vehicle.photos || {};
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
              `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/register/view-document`,
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
      if (updatedList.length > 0 && !activePhoto) {
        setActivePhoto(updatedList[0].url);
      }
    };

    fetchSignedUrls();
  }, [vehicle]);

  useEffect(() => {
    let isMounted = true;

    if (allVehiclesData && allVehiclesData.length > 0 && vehicleId) {
      const found = allVehiclesData.find((item: IVehicle) => item._id === vehicleId);
      if (found) {
        setVehicle(found);
        setLoading(false);
        return;
      }
    }

    if (vehicleId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/register/get-vehicle?vehicleId=${vehicleId}`, { withCredentials: true })
        .then((res) => {
          if (isMounted) {
            setVehicle(res.data?.data || res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Direct fetch error:", err);
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [allVehiclesData, vehicleId]);

  const handleViewPDF = async (path: string, directUrl: string) => {
    if (!path) return;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/register/view-document`,
        { path },
        { withCredentials: true }
      );
      const targetUrl = typeof response.data === 'string'
        ? response.data
        : response.data?.data?.url || response.data?.data || response.data?.url || directUrl;

      window.open(targetUrl || directUrl, "_blank");
    } catch (err) {
      window.open(directUrl, "_blank");
    }
  };

  const status = vehicle?.status?.toUpperCase() || '';
  const auctionStatus = (vehicle as any)?.auctionStatus?.toUpperCase() || '';

  const isVehicleVerified = status === 'VERIFIED' || status === 'APPROVED';
  const isUserProfileVerified = Boolean(userProfileData?.isVerifiedProfile);

  // Statuses where "Register Vehicle for Auction" button MUST be hidden
  const hiddenStatuses = [
    'READY FOR BIDDING',
    'READY_FOR_BIDDING',
    'BIDDING',
    'SOLD',
    'UNSOLD',
    'READY_FOR_PICKUP'
  ];

  const isRegisteredForAuction = Boolean(
    (vehicle as any)?.isRegisteredForAuction ||
    (vehicle as any)?.registeredForAuction ||
    (vehicle as any)?.isAuctionRegistered
  );

  const shouldHideAuctionButton =
    isRegisteredForAuction ||
    hiddenStatuses.includes(status) ||
    hiddenStatuses.includes(auctionStatus);

  const isSold = status === 'SOLD' || auctionStatus === 'SOLD';

  const handleRegisterForAuction = async () => {
    try {
      setAuctionError(null);
      if (!isUserProfileVerified && !isVehicleVerified) {
        setAuctionError("You and your vehicle are not verified by admin.");
        return;
      }
      if (!isUserProfileVerified) {
        setAuctionError("You are not verified by admin.");
        return;
      }
      if (!isVehicleVerified) {
        setAuctionError("Your vehicle is not verified by admin.");
        return;
      }
      await applyForAuction(vehicleId);
      showToast("Vehicle Registered For Auction Successfully", 'success');
    } catch (error) {
      console.log(error);
    }
  };

  // Handler for pickup approval
  const handleApprovePickup = async () => {
    try {
      setIsApprovingPickup(true);
      await approveVehicleForPickup(vehicleId);
      setIsPickupApproved(true);
      showToast("Vehicle pickup approved successfully!", 'success');
    } catch (error) {
      showToast("Failed to approve vehicle pickup. Please try again.", 'error');
    } finally {
      setIsApprovingPickup(false);
    }
  };

  if (loading || !vehicle) {
    return (
      <div className="w-full min-h-screen bg-[#F9FAFB] flex flex-col justify-between antialiased">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5">
          <UserNavbar />
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Car size={36} className="text-[#0B5B32] animate-bounce" />
            <p className="text-xs font-bold text-gray-400">Loading vehicle details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const details = vehicle.vehicleDetails || {};
  const pickup = vehicle.pickup || {};
  const isRejected = status === 'REJECTED';

  const rawDocs = (vehicle.documents || {}) as Record<string, any>;
  const docKeys = [
    { key: 'rcbook', label: 'RC Book' },
    { key: 'insurance', label: 'Insurance' },
    { key: 'puc', label: 'PUC Certificate' },
    { key: 'loanClosure', label: 'Loan Closure / NOC' },
  ];

  const docList = docKeys
    .map((d) => {
      const pathObj = rawDocs[d.key];
      const rawPath = typeof pathObj === 'string' ? pathObj : pathObj?.path || '';
      return { label: d.label, rawPath, url: getMediaUrl(pathObj) };
    })
    .filter((d) => d.url);

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] text-[#374151] flex flex-col justify-between antialiased">
      <div>
        <div className="w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-6">
          <UserNavbar />

          {/* BACK BAR & ACTION BUTTON */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => router.push('/user/my-vehicles')}
              className="inline-flex items-center gap-1.5 text-xs font-black text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to My Vehicles
            </button>

            {/* REGISTER FOR AUCTION BUTTON */}
            {!shouldHideAuctionButton && (
              <button
                type="button"
                onClick={handleRegisterForAuction}
                className="inline-flex items-center gap-2 text-xs font-black text-white bg-[#0B5B32] hover:bg-[#084827] px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <Gavel size={15} /> Register Vehicle for Auction
              </button>
            )}
          </div>

          {/* VEHICLE PICKUP APPROVAL CARD FOR SOLD VEHICLES */}
          {isSold && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2.5 bg-[#0B5B32] text-white rounded-xl shrink-0">
                  <Truck size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">
                    Vehicle Sold – Pickup Approval Required
                  </h3>
                  <p className="text-xs text-emerald-800 font-medium">
                    {isPickupApproved
                      ? 'You have approved this vehicle for pickup. Logistics details are now active.'
                      : 'This vehicle is sold. Please authorize and approve the pickup schedule.'}
                  </p>
                </div>
              </div>

              <div>
                {isPickupApproved ? (
                  <span className="inline-flex items-center gap-1.5 bg-[#0B5B32] text-white text-xs font-black px-4 py-2 rounded-xl shadow-2xs">
                    <CheckCircle2 size={15} /> Pickup Approved
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleApprovePickup}
                    disabled={isApprovingPickup}
                    className="inline-flex items-center gap-2 text-xs font-black text-white bg-[#0B5B32] hover:bg-[#084827] px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isApprovingPickup ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={15} /> Approve Vehicle for Pickup
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* AUCTION ERROR MESSAGE BANNER */}
          {auctionError && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-amber-600 shrink-0" />
                <p className="text-xs font-bold">{auctionError}</p>
              </div>
              <button
                type="button"
                onClick={() => setAuctionError(null)}
                className="text-xs font-black text-amber-700 hover:text-amber-900"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* REJECTION REASON BANNER */}
          {isRejected && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-2xs space-y-3">
              <div className="flex items-start gap-3">
                <XCircle size={22} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-rose-900 uppercase tracking-wide">
                    Vehicle Application Rejected
                  </h3>
                  <p className="text-xs text-rose-700 font-semibold leading-relaxed">
                    {vehicle.rejectionReason || 'Your vehicle registration was rejected during admin verification due to incomplete or unclear documents.'}
                  </p>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => router.push(`/register-vehicle/${vehicle._id}/1`)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <RefreshCw size={13} /> Re-submit Details
                </button>
              </div>
            </div>
          )}

          {/* VERIFIED BANNER */}
          {isVehicleVerified && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={22} className="text-[#0B5B32] shrink-0" />
                <div>
                  <h3 className="text-sm font-black text-[#0B5B32]">Vehicle Verified</h3>
                  <p className="text-xs text-emerald-700 font-medium">This vehicle has been successfully verified by our team.</p>
                </div>
              </div>
              <span className="bg-[#0B5B32] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Active Listing
              </span>
            </div>
          )}

          {/* HEADER CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${isRejected ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-[#0B5B32]'} rounded-2xl flex items-center justify-center shrink-0`}>
                <Car size={28} />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-gray-900">
                  {details.carName || 'Vehicle Details'} {details.model || ''}
                </h1>
                <p className="text-xs text-gray-400 font-mono font-medium mt-0.5">
                  REG NO: <span className="text-gray-700 font-bold">{details.registrationNumber || 'N/A'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Status</span>
                <span className={`text-xs font-black ${isRejected ? 'text-rose-600' : isVehicleVerified ? 'text-[#0B5B32]' : 'text-amber-600'}`}>
                  {vehicle.status || 'DRAFT'}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Created On</span>
                <span className="text-xs font-bold text-gray-700">{formatDate(vehicle.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* MAIN DATA GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT 2 COLUMNS */}
            <div className="lg:col-span-2 space-y-6">

              {/* SPECIFICATIONS */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">Specifications</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 block">Manufacturing Year</span>
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#0B5B32]" />
                      {details.manufacturingYear || 'N/A'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 block">Fuel Type</span>
                    <span className="font-bold text-gray-800 flex items-center gap-1.5 capitalize">
                      <Fuel size={13} className="text-[#0B5B32]" />
                      {details.fuelType || 'N/A'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 block">Kilometers Driven</span>
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Gauge size={13} className="text-[#0B5B32]" />
                      {details.kmsDriven ? `${details.kmsDriven} KM` : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 block">Transmission</span>
                    <span className="font-bold text-gray-800 flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-[#0B5B32]" />
                      {details.transmission || 'Manual'}
                    </span>
                  </div>
                </div>
              </div>

              {/* PHOTOS GALLERY */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">Vehicle Photos</h2>
                {resolvedPhotos.length > 0 ? (
                  <div className="space-y-3">
                    <div className="bg-gray-900 rounded-xl h-72 overflow-hidden flex items-center justify-center relative">
                      <img
                        src={activePhoto || resolvedPhotos[0]?.url}
                        alt="Vehicle Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {resolvedPhotos.map((p, idx) => {
                        const isSelected = (activePhoto || resolvedPhotos[0]?.url) === p.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActivePhoto(p.url)}
                            className={`group relative aspect-square rounded-xl border-2 overflow-hidden transition-all cursor-pointer bg-gray-100 ${isSelected ? 'border-[#0B5B32] ring-2 ring-[#0B5B32]/20' : 'border-gray-200 hover:border-gray-400'
                              }`}
                          >
                            <img
                              src={p.url}
                              alt={p.label}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold py-0.5 px-1 truncate text-center">
                              {p.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-xs text-gray-400 font-bold">
                    No vehicle photos uploaded.
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">

              {/* PICKUP ADDRESS */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">Pickup Location</h2>
                <div className="flex items-start gap-3 bg-gray-50 p-3.5 rounded-xl text-xs">
                  <MapPin size={16} className="text-[#0B5B32] shrink-0 mt-0.5" />
                  <div className="space-y-0.5 font-medium text-gray-700">
                    <p className="font-bold text-gray-900">{pickup.formattedAddress || 'Address not specified'}</p>
                    <p>{pickup.area || ''} {pickup.city || ''}</p>
                    <p>{pickup.state || ''} - {pickup.pincode || ''}</p>
                  </div>
                </div>
              </div>

              {/* DOCUMENTS */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-3xs space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">Uploaded Documents</h2>
                {docList.length > 0 ? (
                  <div className="space-y-2">
                    {docList.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl text-xs font-medium border border-gray-100">
                        <div className="flex items-center gap-2">
                          <FileText size={15} className="text-[#0B5B32]" />
                          <span className="font-bold text-gray-800">{doc.label}</span>
                        </div>
                        <button
                          onClick={() => handleViewPDF(doc.rawPath, doc.url || '')}
                          className="text-[11px] font-black text-[#0B5B32] hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Eye size={12} /> View
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center text-xs text-gray-400 font-bold">
                    No documents uploaded.
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}