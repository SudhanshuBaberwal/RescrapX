'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UserNavbar from '@/components/navbar/UserNavbar';
import Footer from '@/components/footer/Footer';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { IVehicle } from '@/context/vehicleProvider';
import { getAllVehicles } from '@/hooks/getAllVehicles';
import {
  Car, ShieldCheck, Calendar, Fuel, Gauge, ArrowLeft,
  XCircle, CheckCircle2, AlertCircle, FileText, MapPin,
  RefreshCw, Eye
} from 'lucide-react';
import axios from 'axios';

const formatDate = (dateValue?: string | Date) => {
  if (!dateValue) return 'N/A';
  return new Date(dateValue).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getMediaUrl = (pathObj: any) => {
  if (!pathObj) return null;
  let rawPath = '';
  if (typeof pathObj === 'string') rawPath = pathObj;
  else if (typeof pathObj === 'object') {
    rawPath = pathObj.path || pathObj.fullPath || pathObj.url || pathObj.key || '';
  }

  if (!rawPath) return null;
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) return rawPath;

  const cleanPath = rawPath.replace(/^partner-documents\//i, '').replace(/^\/+/, '');
  const SUPABASE_PROJECT_URL = "https://guqagldnqzyrljirupya.supabase.co";

  return `${SUPABASE_PROJECT_URL}/storage/v1/object/public/partner-documents/${cleanPath}`;
};

export default function VehicleDetailsPage() {
  // Trigger custom hook to fetch all vehicles on reload
  getAllVehicles();

  const params = useParams();
  const router = useRouter();
  const vehicleId = params?.Id as string;

  const { allVehiclesData } = useSelector((state: RootState) => state.vehicle);
  const [vehicle, setVehicle] = useState<IVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Sync from Redux OR fetch directly if Redux takes time
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

    // Direct API fallback call on page refresh
    if (vehicleId) {
      axios
        .get(`http://localhost:8000/api/vehicle/register/get-vehicle?vehicleId=${vehicleId}`, { withCredentials: true })
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
        "http://localhost:8000/api/vehicle/register/view-document",
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
  const status = vehicle.status?.toUpperCase();
  const isRejected = status === 'REJECTED';
  const isVerified = status === 'VERIFIED' || status === 'APPROVED';

  // Photo Extraction
  const rawPhotos = vehicle.photos || {};
  const photoList: { label: string; url: string }[] = [];

  if (Array.isArray(rawPhotos)) {
    rawPhotos.forEach((item: any) => {
      const url = getMediaUrl(item);
      if (url) photoList.push({ label: item.name || 'Photo', url });
    });
  } else if (rawPhotos && typeof rawPhotos === 'object') {
    Object.entries(rawPhotos).forEach(([key, photoObj]) => {
      const url = getMediaUrl(photoObj);
      if (url) photoList.push({ label: key.replace(/([A-Z])/g, ' $1').toUpperCase(), url });
    });
  }

  // Document Extraction
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
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-6">
          <UserNavbar />

          {/* BACK BAR */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/user/my-vehicles')}
              className="inline-flex items-center gap-1.5 text-xs font-black text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3.5 py-2 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to My Vehicles
            </button>
          </div>

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
          {isVerified && (
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
                  {details.manufacturer || 'Vehicle Details'} {details.model || ''}
                </h1>
                <p className="text-xs text-gray-400 font-mono font-medium mt-0.5">
                  REG NO: <span className="text-gray-700 font-bold">{details.registrationNumber || 'N/A'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Status</span>
                <span className={`text-xs font-black ${isRejected ? 'text-rose-600' : isVerified ? 'text-[#0B5B32]' : 'text-amber-600'}`}>
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
                {photoList.length > 0 ? (
                  <div className="space-y-3">
                    <div className="bg-gray-900 rounded-xl h-64 overflow-hidden flex items-center justify-center relative">
                      <img
                        src={activePhoto || photoList[0].url}
                        alt="Vehicle Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {photoList.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePhoto(p.url)}
                          className="aspect-square rounded-lg border border-gray-200 overflow-hidden hover:border-[#0B5B32] transition-colors cursor-pointer"
                        >
                          <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
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