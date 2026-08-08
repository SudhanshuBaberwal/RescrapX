'use client';

import { IVehicle } from '@/context/vehicleProvider';
import { getAllVehiclesForAdmin } from '@/hooks/getAllVehiclesForAdmin';
import { updateVehicleStatus } from '@/services/vehicle.service';
import { RootState } from '@/store/store';
import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

export type VehicleStatus = "VERIFIED" | "REJECTED";

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Custom Hook to Fetch Signed URL for Private Supabase Vehicle Images
function useSignedUrl(pathObj: any) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const rawPath = typeof pathObj === 'object'
    ? pathObj?.path || pathObj?.url || pathObj?.fullPath || pathObj?.key
    : pathObj;

  useEffect(() => {
    let isMounted = true;

    if (!rawPath) {
      setSignedUrl(null);
      return;
    }

    if (typeof rawPath === 'string' && (rawPath.startsWith('http://') || rawPath.startsWith('https://'))) {
      setSignedUrl(rawPath);
      return;
    }

    const fetchSignedUrl = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.post(
          "http://localhost:8000/api/vehicle/register/view-document",
          { path: rawPath },
          { withCredentials: true }
        );

        const url =
          response.data?.data?.url ||
          response.data?.url ||
          response.data?.data ||
          response.data?.message ||
          (typeof response.data === 'string' ? response.data : null);

        if (isMounted) {
          if (url && typeof url === 'string') {
            setSignedUrl(url);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Error fetching signed URL for vehicle image:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSignedUrl();

    return () => {
      isMounted = false;
    };
  }, [rawPath]);

  return { signedUrl, loading, error, rawPath };
}

// Sub-component for Main Display Image
const MainVehicleImage: React.FC<{ photoItem: any; title: string }> = ({ photoItem, title }) => {
  const { signedUrl, loading, error } = useSignedUrl(photoItem);

  if (loading) {
    return (
      <div className="flex items-center justify-center text-slate-400 text-xs font-semibold">
        <span>Loading image...</span>
      </div>
    );
  }

  if (error || !signedUrl) {
    return (
      <div className="flex flex-col items-center justify-center text-slate-400 text-xs p-2 text-center">
        <span>⚠️ Failed to load photo preview</span>
      </div>
    );
  }

  return (
    <img
      src={signedUrl}
      alt={title}
      className="w-full h-full object-contain"
    />
  );
};

// Sub-component for Thumbnail Selector Buttons
const VehicleThumbnailButton: React.FC<{
  photoItem: any;
  title: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ photoItem, title, isActive, onClick }) => {
  const { signedUrl, loading, error } = useSignedUrl(photoItem);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`aspect-video rounded overflow-hidden border relative cursor-pointer bg-slate-100 flex items-center justify-center ${
        isActive ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-400'
      }`}
    >
      {loading ? (
        <span className="text-[9px] text-slate-400">...</span>
      ) : signedUrl && !error ? (
        <img src={signedUrl} alt={title} className="w-full h-full object-cover" />
      ) : (
        <span className="text-[8px] font-bold text-slate-400 uppercase p-0.5 truncate">{title}</span>
      )}
    </button>
  );
};

const getStatusStyle = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'AUCTION_LIVE':
    case 'AUCTION LIVE':
      return { label: 'Auction Live', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    case 'OFFER_ACCEPTED':
    case 'OFFER ACCEPTED':
      return { label: 'Offer Accepted', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'PICKUP_SCHEDULED':
    case 'PICKUP SCHEDULED':
      return { label: 'Pickup Scheduled', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'IN_TRANSIT':
    case 'IN TRANSIT':
      return { label: 'In Transit', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    case 'VERIFIED':
    case 'APPROVED':
    case 'COMPLETED':
      return { label: 'VERIFIED', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'REJECTED':
      return { label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    case 'DRAFT':
    case 'PENDING':
    default:
      return { label: 'Draft / Pending', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
};

export default function VehiclesDashboard() {
  getAllVehiclesForAdmin();

  const { allVehiclesData } = useSelector((state: RootState) => state.vehicle) || { allVehiclesData: [] };
  
  const [vehiclesList, setVehiclesList] = useState<any[]>([]);

  useEffect(() => {
    if (allVehiclesData?.length) {
      const registeredAndNotRejected = allVehiclesData.filter(
        (item: IVehicle) => item.isRegistered === true && item.status?.toUpperCase() !== 'REJECTED'
      );
      setVehiclesList(registeredAndNotRejected);
    }
  }, [allVehiclesData]);

  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('ALL');
  const [fuelTypeFilter, setFuelTypeFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');

  useEffect(() => {
    if (vehiclesList.length > 0 && (!selectedVehicle || selectedVehicle.status?.toUpperCase() === 'REJECTED')) {
      setSelectedVehicle(vehiclesList[0]);
    } else if (vehiclesList.length === 0) {
      setSelectedVehicle(null);
    }
  }, [vehiclesList]);

  useEffect(() => {
    setActivePhotoIndex(0);
  }, [selectedVehicle]);

  // Dynamic Filtering
  const filteredVehiclesList = useMemo(() => {
    return vehiclesList.filter((item: any) => {
      const details = item.vehicleDetails || {};
      const pickup = item.pickup || {};
      const rc = details.registrationNumber || '';
      const name = `${details.manufacturer || details.make || ''} ${details.model || ''}`;

      const matchesSearch =
        searchQuery === '' ||
        rc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item._id?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'VERIFIED' && (item.status === 'VERIFIED' || item.status === 'APPROVED')) ||
        (statusFilter === 'PENDING' && (item.status === 'PENDING' || item.status === 'DRAFT' || !item.status));

      const matchesFuel = fuelTypeFilter === 'ALL' || details.fuelType?.toUpperCase() === fuelTypeFilter.toUpperCase();
      const matchesState = stateFilter === 'ALL' || pickup.state?.toUpperCase() === stateFilter.toUpperCase();

      return matchesSearch && matchesStatus && matchesFuel && matchesState;
    });
  }, [vehiclesList, searchQuery, statusFilter, fuelTypeFilter, stateFilter]);

  // UI Table mapping
  const mappedVehicles = filteredVehiclesList.map((item: any) => {
    const details = item.vehicleDetails || {};
    const pickup = item.pickup || {};
    const ownerObj = typeof item.owner === 'object' ? item.owner : {};
    const statusInfo = getStatusStyle(item.status);
    const locationParts = [pickup.area, pickup.city || pickup.state].filter(Boolean);

    return {
      raw: item,
      id: details._id
        ? `RXV${details._id.slice(-7).toUpperCase()}`
        : item._id
          ? `RXV${item._id.slice(-7).toUpperCase()}`
          : 'N/A',
      dbId: item._id,
      name: `${details.manufacturer || details.make || ''} ${details.model || 'Vehicle'} ${details.manufacturingYear || details.year || ''}`.trim(),
      details: `${details.fuelType || 'N/A'} • ${details.transmission || 'Manual'}`,
      rc: details.registrationNumber || 'N/A',
      owner: ownerObj.name || ownerObj.fullName || (typeof item.owner === 'string' ? `${item.owner.slice(0, 8)}...` : 'N/A'),
      phone: ownerObj.phone || ownerObj.phoneNumber || 'N/A',
      location: locationParts.length > 0 ? locationParts.join(', ') : 'N/A',
      status: statusInfo.label,
      statusColor: statusInfo.color,
      stage: `Step ${item.currentStep || 1}`,
      created: formatDate(item.createdAt),
    };
  });

  // Extract Raw Photos Safely
  const rawPhotos = selectedVehicle?.photos || {};
  const photoKeys = ['front', 'rear', 'left', 'right', 'dashboard', 'engine', 'odometer', 'interior', 'chassisNumber'];
  const vehiclePhotosList: { title: string; rawItem: any }[] = [];

  if (Array.isArray(rawPhotos)) {
    rawPhotos.forEach((item: any) => {
      if (item) vehiclePhotosList.push({ title: (item.name || item.type || 'PHOTO').toUpperCase(), rawItem: item });
    });
  } else if (typeof rawPhotos === 'object' && rawPhotos !== null) {
    photoKeys.forEach((key) => {
      const photoItem = rawPhotos[key];
      if (photoItem) {
        vehiclePhotosList.push({ title: key.replace(/([A-Z])/g, ' $1').toUpperCase(), rawItem: photoItem });
      }
    });
  }

  // Extract Documents Safely
  const rawDocs = selectedVehicle?.documents || {};
  const docKeys = [
    { key: 'rcbook', label: 'RC Book' },
    { key: 'insurance', label: 'Insurance' },
    { key: 'puc', label: 'PUC Certificate' },
    { key: 'loanClosure', label: 'Loan Closure / NOC' },
    { key: 'other', label: 'Other Documents' },
  ];

  const vehicleDocsList = docKeys
    .map((doc) => {
      const rawPathObj = rawDocs[doc.key];
      const rawPathStr = typeof rawPathObj === 'string' ? rawPathObj : rawPathObj?.path || rawPathObj?.url || '';
      return {
        label: doc.label,
        rawPath: rawPathStr,
      };
    })
    .filter((doc) => doc.rawPath !== '');

  const activeDetails = selectedVehicle?.pickup || {};
  const activeVehicleDetails = selectedVehicle?.vehicleDetails || {};
  const activeStatus = getStatusStyle(selectedVehicle?.status);

  const isVehicleVerified = selectedVehicle?.status?.toUpperCase() === 'VERIFIED' || selectedVehicle?.status?.toUpperCase() === 'APPROVED';

  // Approve Handler
  const handleApprove = async () => {
    if (!selectedVehicle?._id) return;
    try {
      setIsUpdatingStatus(true);
      await updateVehicleStatus(selectedVehicle._id, 'VERIFIED');
      setVehiclesList((prev) =>
        prev.map((v) => (v._id === selectedVehicle._id ? { ...v, status: 'VERIFIED' } : v))
      );
      setSelectedVehicle((prev: any) => (prev ? { ...prev, status: 'VERIFIED' } : null));
    } catch (error) {
      console.error('Error approving vehicle:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Reject Handler
  const handleReject = async () => {
    if (!selectedVehicle?._id) return;
    const reason = prompt('Please enter a rejection reason:');
    if (reason === null || !reason.trim()) return;

    try {
      setIsUpdatingStatus(true);
      await updateVehicleStatus(selectedVehicle._id, 'REJECTED', reason);
      setVehiclesList((prev) => {
        const updated = prev.filter((v) => v._id !== selectedVehicle._id);
        if (updated.length > 0) {
          setSelectedVehicle(updated[0]);
        } else {
          setSelectedVehicle(null);
          setIsDetailsOpen(false);
        }
        return updated;
      });
    } catch (error) {
      console.error('Error rejecting vehicle:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleViewPDF = async (path: string) => {
    if (!path) return;
    try {
      const response = await axios.post(
        "http://localhost:8000/api/vehicle/register/view-document",
        { path },
        { withCredentials: true }
      );
      const targetUrl =
        response.data?.data?.url ||
        response.data?.url ||
        response.data?.data ||
        response.data?.message ||
        (typeof response.data === 'string' ? response.data : null);

      if (targetUrl) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Failed to view document:", err);
    }
  };

  const summaryMetrics = [
    { title: 'Total Vehicles', count: vehiclesList.length, trend: '+18% vs last month' },
    { title: 'Valuation Requests', count: vehiclesList.length, trend: '+22% vs last month' },
    { title: 'Auction Live', count: '48', trend: '+14% vs last month' },
    { title: 'Offer Accepted', count: '246', trend: '+16% vs last month' },
    { title: 'Pickup Scheduled', count: '192', trend: '+7% vs last month' },
    { title: 'Completed', count: '442', trend: '+12% vs last month' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased w-full">
      <div className="p-4 md:p-6 mx-auto max-w-[1750px] space-y-6">

        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vehicles</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage and monitor all vehicles across the platform.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-600 outline-none shadow-2xs">
              <option>01 Jun 2025 - 02 Jun 2025</option>
            </select>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors shadow-2xs">
              + Add Vehicle Manually
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3 py-2 rounded-lg transition-colors shadow-2xs">
              Export ▾
            </button>
            {!isDetailsOpen && (
              <button onClick={() => setIsDetailsOpen(true)} className="bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-lg shadow-2xs cursor-pointer">
                👁️ Inspector Panel
              </button>
            )}
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {summaryMetrics.map((m, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.title}</span>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">{m.count}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded shrink-0">{m.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Core Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {/* LEFT: Filters + Table */}
          <div className={`${isDetailsOpen ? 'xl:col-span-8' : 'xl:col-span-12'} space-y-6 transition-all`}>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="flex flex-col gap-1 lg:col-span-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Search</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by RC, Vehicle, ID..."
                    className="bg-white border border-slate-200 rounded-lg p-2 outline-none w-full text-slate-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Draft / Pending</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Vehicle Type</label>
                  <select
                    value={vehicleTypeFilter}
                    onChange={(e) => setVehicleTypeFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"
                  >
                    <option value="ALL">All Types</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Fuel Type</label>
                  <select
                    value={fuelTypeFilter}
                    onChange={(e) => setFuelTypeFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"
                  >
                    <option value="ALL">All Fuel Types</option>
                    <option value="PETROL">Petrol</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="ELECTRIC">Electric</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">State</label>
                  <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"
                  >
                    <option value="ALL">All States</option>
                    <option value="RAJASTHAN">Rajasthan</option>
                    <option value="KARNATAKA">Karnataka</option>
                  </select>
                </div>
                <div className="flex items-end gap-1">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('ALL');
                      setFuelTypeFilter('ALL');
                      setStateFilter('ALL');
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">All Vehicles ({mappedVehicles.length})</h3>

              <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600 min-w-250">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="p-3 w-8" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded" /></th>
                      <th className="p-3">Vehicle ID</th>
                      <th className="p-3">Vehicle Details</th>
                      <th className="p-3">RC Number</th>
                      <th className="p-3">Owner Name</th>
                      <th className="p-3">Location</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3">Current Stage</th>
                      <th className="p-3">Created On</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mappedVehicles.map((vehicle: any, idx: number) => {
                      const isSelected = selectedVehicle?._id === vehicle.dbId;
                      return (
                        <tr
                          key={vehicle.dbId || idx}
                          onClick={() => {
                            setSelectedVehicle(vehicle.raw);
                            setIsDetailsOpen(true);
                          }}
                          className={`cursor-pointer transition-colors ${isSelected ? 'bg-slate-100/80 font-medium' : 'hover:bg-slate-50/50'}`}
                        >
                          <td className="p-3" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-900">{vehicle.id}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-800">{vehicle.name}</div>
                            <div className="text-[10px] text-slate-400">{vehicle.details}</div>
                          </td>
                          <td className="p-3 font-mono font-medium text-slate-700">{vehicle.rc}</td>
                          <td className="p-3">
                            <div className="font-medium text-slate-800">{vehicle.owner}</div>
                            <div className="text-[10px] font-mono text-slate-400">{vehicle.phone}</div>
                          </td>
                          <td className="p-3 text-slate-700 font-medium">{vehicle.location}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${vehicle.statusColor}`}>
                              {vehicle.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 font-medium text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              {vehicle.stage}
                            </div>
                          </td>
                          <td className="p-3 text-slate-500 font-medium whitespace-nowrap">{vehicle.created}</td>
                          <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedVehicle(vehicle.raw);
                                  setIsDetailsOpen(true);
                                }}
                                className="border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 px-2.5 py-1 rounded font-bold text-[11px] cursor-pointer shadow-3xs"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT: Inspector Panel Side Sheet */}
          {isDetailsOpen && selectedVehicle && (
            <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-2xs space-y-5 sticky top-6 w-full">
              <button onClick={() => setIsDetailsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer">✕</button>

              {/* Inspector Header Block */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    {activeVehicleDetails.manufacturer || activeVehicleDetails.make || 'Vehicle'} {activeVehicleDetails.model || ''}
                  </h3>
                  <span className={`border text-[9px] font-bold px-1.5 py-0.5 rounded ${activeStatus.color}`}>
                    {activeStatus.label}
                  </span>
                </div>
                <div className="flex gap-4 mt-2 text-[10px] font-mono text-slate-400">
                  <div>RC <span className="block text-slate-800 font-bold mt-0.5">{activeVehicleDetails.registrationNumber || 'N/A'}</span></div>
                  <div>ID <span className="block text-slate-800 font-bold mt-0.5">{selectedVehicle?._id ? `RXV${selectedVehicle._id.slice(-7).toUpperCase()}` : 'N/A'}</span></div>
                </div>
              </div>

              {/* Vehicle Photos Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Vehicle Photos ({vehiclePhotosList.length})
                  </span>
                  {vehiclePhotosList.length > 0 && (
                    <span className="text-[10px] font-bold text-slate-500">
                      {vehiclePhotosList[activePhotoIndex]?.title}
                    </span>
                  )}
                </div>

                {vehiclePhotosList.length > 0 ? (
                  <>
                    <div className="bg-slate-900 h-52 rounded-lg flex items-center justify-center relative overflow-hidden border border-slate-200">
                      <MainVehicleImage
                        photoItem={vehiclePhotosList[activePhotoIndex]?.rawItem}
                        title={vehiclePhotosList[activePhotoIndex]?.title || "Vehicle Photo"}
                      />
                      {vehiclePhotosList.length > 1 && (
                        <>
                          <button
                            onClick={() => setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : vehiclePhotosList.length - 1))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-xs text-slate-800 shadow-md font-bold cursor-pointer z-10"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() => setActivePhotoIndex((prev) => (prev < vehiclePhotosList.length - 1 ? prev + 1 : 0))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-xs text-slate-800 shadow-md font-bold cursor-pointer z-10"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {vehiclePhotosList.slice(0, 5).map((photo, i) => (
                        <VehicleThumbnailButton
                          key={i}
                          photoItem={photo.rawItem}
                          title={photo.title}
                          isActive={activePhotoIndex === i}
                          onClick={() => setActivePhotoIndex(i)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-slate-50 h-32 rounded-lg flex flex-col items-center justify-center text-slate-400 border border-slate-200 text-xs">
                    <span>📷 No photos available</span>
                  </div>
                )}
              </div>

              {/* Documents Section */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Documents ({vehicleDocsList.length})
                </span>
                {vehicleDocsList.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {vehicleDocsList.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📄</span>
                          <span className="font-semibold text-slate-700">{doc.label}</span>
                        </div>
                        <button
                          onClick={() => handleViewPDF(doc.rawPath)}
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 cursor-pointer"
                        >
                          View Doc ↗
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-400 text-center text-[11px]">
                    No documents uploaded
                  </div>
                )}
              </div>

              {/* Technical Specifications Parameter List */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vehicle Information</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100 font-medium text-slate-700">
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="text-slate-400">Fuel Type</span><span>{activeVehicleDetails.fuelType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="text-slate-400">Odometer</span>
                    <span>{activeDetails.kmsDriven ? `${activeDetails.kmsDriven} KM` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="text-slate-400">Transmission</span><span>{activeVehicleDetails.transmission || 'Manual'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="text-slate-400">Engine No.</span><span className="font-mono">{activeVehicleDetails.registrationNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mfg Year</span><span>{activeVehicleDetails.manufacturingYear || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ownership</span><span>{activeVehicleDetails.ownership || 'First Owner'}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Timeline</span>
                <div className="space-y-3 pl-3 relative before:absolute before:left-[3.75px] before:top-1 before:bottom-1 before:w-0.5 before:bg-slate-100 text-[11px]">
                  <div className="relative">
                    <span className="absolute -left-[15px] top-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="font-bold text-slate-800">Valuation Request Submitted</p>
                    <span className="text-[10px] text-slate-400">{formatDate(selectedVehicle?.createdAt)}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[15px] top-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="font-bold text-slate-800">Images Verified by Admin</p>
                    <span className="text-[10px] text-slate-400">{formatDate(selectedVehicle?.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="pt-3 border-t border-slate-100">
                {isVehicleVerified ? (
                  <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs py-2.5 rounded-lg text-center flex items-center justify-center gap-1.5">
                    <span>✓</span> Vehicle Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleApprove}
                      disabled={isUpdatingStatus}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold text-xs py-2.5 rounded-lg transition-colors shadow-2xs text-center cursor-pointer"
                    >
                      ✓ Approve Vehicle
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={isUpdatingStatus}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold text-xs py-2.5 rounded-lg transition-colors shadow-2xs text-center cursor-pointer"
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}