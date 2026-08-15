'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Truck, Navigation, MapPin, User, Search,
  RotateCcw, ChevronDown, MoreVertical, X, Loader2, Eye,
  AlertTriangle, ArrowUpDown
} from 'lucide-react';
import { getIncomingVehicleData } from '@/hooks/getIncomingVehiclesData';
import { getVehicle } from '@/services/vehicle.service';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axios from 'axios';
import { IVehicle } from '@/context/vehicleProvider';

const SUPABASE_PROJECT_URL = "https://guqagldnqzyrljirupya.supabase.co";

const getMediaUrl = (pathObj: any): string | null => {
  if (!pathObj) return null;
  let rawPath = '';
  if (typeof pathObj === 'string') rawPath = pathObj;
  else if (typeof pathObj === 'object') {
    rawPath = pathObj.url || pathObj.path?.path || pathObj.path || pathObj.fullPath || pathObj.key || '';
  }
  if (!rawPath || typeof rawPath !== 'string') return null;
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('data:')) return rawPath;
  const cleanPath = rawPath.replace(/^partner-documents\//i, '').replace(/^\/+/, '');
  return cleanPath ? `${SUPABASE_PROJECT_URL}/storage/v1/object/public/partner-documents/${cleanPath}` : null;
};

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export default function IncomingVehiclesDashboard() {
  getIncomingVehicleData();

  const partnerIncomingData = useSelector((state: RootState) => (state as any).partner?.PartnerIncomingVehicleData);

  const rawVehicles: IVehicle[] = useMemo(() => {
    if (Array.isArray(partnerIncomingData)) return partnerIncomingData;
    if (partnerIncomingData?.vehicles && Array.isArray(partnerIncomingData.vehicles)) return partnerIncomingData.vehicles;
    if (partnerIncomingData?.data && Array.isArray(partnerIncomingData.data)) return partnerIncomingData.data;
    return [];
  }, [partnerIncomingData]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

  const [isMounted, setIsMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState<any | null>(null);
  const [isFetchingVehicle, setIsFetchingVehicle] = useState(false);
  const [fetchVehicleError, setFetchVehicleError] = useState<string | null>(null);
  const [loadingVehicleId, setLoadingVehicleId] = useState<string | null>(null);

  const [resolvedPhotos, setResolvedPhotos] = useState<{ label: string; url: string }[]>([]);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedVehicleDetails) {
      setResolvedPhotos([]);
      setActivePhoto(null);
      return;
    }

    const rawPhotos = selectedVehicleDetails.photos || selectedVehicleDetails.vehiclePhotos || {};
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
        const rawPath = typeof photoObj === 'string' ? photoObj : photoObj?.path || '';
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
              "http://localhost:8000/api/vehicle/register/view-document",
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
      if (updatedList.length > 0) {
        setActivePhoto(updatedList[0].url);
      }
    };

    fetchSignedUrls();
  }, [selectedVehicleDetails]);

  const handleViewVehicleDetails = async (vehicleId: string, fallbackObj?: any) => {
    const targetId = vehicleId || fallbackObj?._id || fallbackObj?.id;

    if (!targetId || !isValidObjectId(targetId)) {
      if (fallbackObj) {
        setSelectedVehicleDetails(fallbackObj);
        setIsDrawerOpen(true);
        return;
      }
      setFetchVehicleError(`Invalid Vehicle ID: "${targetId}". Cannot fetch details.`);
      setIsDrawerOpen(true);
      return;
    }

    setLoadingVehicleId(targetId);
    setIsFetchingVehicle(true);
    setFetchVehicleError(null);
    setIsDrawerOpen(true);

    try {
      const response = await getVehicle(targetId);
      const actualVehicle = response?.data?.data || response?.data || response;
      setSelectedVehicleDetails(actualVehicle || fallbackObj);
    } catch (error: any) {
      console.error('Error fetching vehicle details:', error);
      if (fallbackObj) {
        setSelectedVehicleDetails(fallbackObj);
      } else {
        setFetchVehicleError(error?.message || 'Failed to fetch vehicle details.');
      }
    } finally {
      setIsFetchingVehicle(false);
      setLoadingVehicleId(null);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedVehicleDetails(null);
    setFetchVehicleError(null);
  };

  const metrics = useMemo(() => [
    { title: 'Total Incoming', count: rawVehicles.length, meta: 'Vehicles', icon: Truck, iconColor: 'text-emerald-600 bg-emerald-50' },
    { title: 'On The Way', count: rawVehicles.filter(v => v.status === "IN_TRANSIT").length, meta: 'Vehicles', icon: Navigation, iconColor: 'text-blue-600 bg-blue-50' },
    { title: 'Driver Assigned', count: rawVehicles.filter(v => v.status === 'DRIVER_ASSIGNED').length, meta: 'Vehicles', icon: User, iconColor: 'text-purple-600 bg-purple-50' },
  ], [rawVehicles]);

  const availableLocations = useMemo(() => {
    const locations = rawVehicles
      .map(v => `${v.pickup?.city || ''}${v.pickup?.city && v.pickup?.state ? ', ' : ''}${v.pickup?.state || ''}`)
      .filter(Boolean);
    return Array.from(new Set(locations));
  }, [rawVehicles]);

  const processedVehicles = useMemo(() => {
    return rawVehicles
      .filter((item: any) => {
        const details = item.vehicleDetails || item;
        const pickup = item.pickup || {};
        const search = searchQuery.toLowerCase().trim();

        const matchesSearch =
          !search ||
          (item.owner && String(item.owner).toLowerCase().includes(search)) ||
          (details.carName && String(details.carName).toLowerCase().includes(search)) ||
          (details.manufacturer && String(details.manufacturer).toLowerCase().includes(search)) ||
          (details.model && String(details.model).toLowerCase().includes(search)) ||
          (details.registrationNumber && String(details.registrationNumber).toLowerCase().includes(search)) ||
          (pickup.city && String(pickup.city).toLowerCase().includes(search)) ||
          (pickup.state && String(pickup.state).toLowerCase().includes(search));

        const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

        const locationString = `${pickup.city || ''}${pickup.city && pickup.state ? ', ' : ''}${pickup.state || ''}`;
        const matchesLocation = locationFilter === 'ALL' || locationString === locationFilter;

        return matchesSearch && matchesStatus && matchesLocation;
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
      });
  }, [rawVehicles, searchQuery, statusFilter, locationFilter, sortOrder]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setLocationFilter('ALL');
    setSortOrder('NEWEST');
  };

  // Helper variables for drawer rendering
  const activeDetails = selectedVehicleDetails?.vehicleDetails || selectedVehicleDetails || {};
  const activeCondition = selectedVehicleDetails?.vehicleCondition || selectedVehicleDetails?.condition || {};
  const activeComponents = selectedVehicleDetails?.majorComponents || selectedVehicleDetails?.components || {};
  const activePickup = selectedVehicleDetails?.pickup || {};

  const manufacturerDisplay = activeDetails.carName || activeDetails.manufacturer || activeDetails.make || 'N/A';
  const modelDisplay = activeDetails.model || 'N/A';
  const regDisplay = activeDetails.registrationNumber || activeDetails.regNo || activeDetails.regNumber || 'N/A';
  const fuelDisplay = activeDetails.fuelType || activeDetails.fuel || 'N/A';
  const transDisplay = activeDetails.transmission || 'N/A';
  const kmsDisplay = activeDetails.kmsDriven ? `${activeDetails.kmsDriven} km` : activeDetails.mileage ? `${activeDetails.mileage} km` : 'N/A';

  const accidentDisplay = activeCondition.accidentType || activeCondition.accident || 'None';
  const structureDisplay = activeCondition.structure || activeCondition.bodyStructure || 'Intact';
  const airbagsDisplay = activeCondition.airbagsDeployed !== undefined ? (activeCondition.airbagsDeployed ? 'Yes' : 'No') : 'No';
  const engineDisplay = activeComponents.engine || activeCondition.engineCondition || activeCondition.engine || 'Good';

  return (
    <div className="space-y-6 w-full text-xs text-gray-700 antialiased relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-black text-gray-900 text-sm tracking-tight">Incoming Vehicles</h3>
          <p className="text-[10px] text-gray-400 font-bold">Track all vehicles that are on the way to your facility.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-gray-400 font-bold block text-[10px] leading-tight">{m.title}</span>
                <div>
                  <span className="text-xl font-black text-gray-900 tracking-tight block">{m.count}</span>
                  <span className="text-[9px] text-gray-400 font-bold block mt-0.5">{m.meta}</span>
                </div>
              </div>
              <div className={`p-2 rounded-xl ${m.iconColor}`}><Icon size={14} /></div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
          <div className="space-y-1 sm:col-span-2 md:col-span-1">
            <label className="text-[10px] text-gray-400 font-black block">Search Vehicle</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search make, model, ID..."
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-900 font-bold placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#0B5B32] focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 font-black block">Pickup Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-900 font-bold appearance-none focus:outline-hidden focus:ring-1 focus:ring-[#0B5B32] focus:bg-white cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="DRIVER_ASSIGNED">Driver Assigned</option>
                <option value="IN_TRANSIT">On The Way</option>
                <option value="PICKED_UP">Picked Up</option>
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 font-black block">Location</label>
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-900 font-bold appearance-none focus:outline-hidden focus:ring-1 focus:ring-[#0B5B32] focus:bg-white cursor-pointer"
              >
                <option value="ALL">All Locations</option>
                {availableLocations.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-2 items-end">
            <div className="space-y-1 flex-1">
              <label className="text-[10px] text-gray-400 font-black block">Sort</label>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-900 font-bold appearance-none focus:outline-hidden focus:ring-1 focus:ring-[#0B5B32] focus:bg-white cursor-pointer"
                >
                  <option value="NEWEST">Newest First</option>
                  <option value="OLDEST">Oldest First</option>
                </select>
                <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={handleClearFilters}
              className="text-gray-400 hover:text-gray-600 font-black py-2 px-3 flex items-center justify-center gap-1 cursor-pointer border border-gray-200 rounded-xl hover:bg-gray-50 h-[34px]"
            >
              <RotateCcw size={12} />
              <span className="text-[10px]">Clear</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-black">Vehicle Details</th>
                <th className="py-3 px-4 font-black">Pickup Details</th>
                <th className="py-3 px-4 font-black">Driver Details</th>
                <th className="py-3 px-4 font-black">Pickup Status</th>
                <th className="py-3 px-4 text-right font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {processedVehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 font-bold">
                    No matching incoming vehicles found.
                  </td>
                </tr>
              ) : (
                processedVehicles.map((item: any) => {
                  const details = item.vehicleDetails || item;
                  const pickup = item.pickup || {};
                  const driver = item?.pickup?.assignedDriver || "";
                  const recordId = item._id || item.id || item.owner;

                  const carName = details.carName || details.manufacturer || details.make;
                  const vehicleTitle = carName && details.model
                    ? `${carName} ${details.model} ${details.manufacturingYear || ''}`
                    : `Vehicle ID: ${String(recordId).slice(-8).toUpperCase()}`;

                  return (
                    <tr key={recordId} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex gap-3 items-start">
                          <div className="w-12 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-base shrink-0 overflow-hidden shadow-3xs">
                            🚗
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="font-black text-gray-900 text-[12px] tracking-tight leading-tight">
                              {vehicleTitle}
                            </h4>
                            <p className="text-[9px] text-gray-400 font-bold">
                              {[details.fuelType, details.transmission, details.kmsDriven ? `${details.kmsDriven} KM` : null].filter(Boolean).join(' • ') || 'N/A'}
                            </p>
                            <p className="text-[10px] font-black text-gray-600 mt-0.5">
                              {details.registrationNumber || `ID: ${String(recordId).slice(-8)}`}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1 text-gray-600">
                          <p className="flex items-center gap-1 font-bold text-gray-800">
                            <MapPin size={12} className="text-gray-400 shrink-0" />
                            <span>{pickup.city || pickup.area || 'N/A'}, {pickup.state || ''}</span>
                          </p>
                          {pickup.formattedAddress && (
                            <p className="text-[9px] text-gray-400 font-medium line-clamp-1">
                              {pickup.formattedAddress}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold shrink-0">
                            <User size={13} />
                          </div>
                          <div className="space-y-px">
                            <p className="font-black text-gray-900 leading-none">{driver || 'Assigned Agent'}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className={`px-2.5 py-1 rounded-md font-black text-[9px] uppercase tracking-wider border inline-block ${item.status === 'PICKED_UP'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : item.status === 'IN_TRANSIT'
                              ? 'bg-blue-50 text-blue-700 border-blue-100'
                              : 'bg-purple-50 text-purple-700 border-purple-100'
                            }`}>
                            {item.status?.replace(/_/g, ' ') || 'DRIVER ASSIGNED'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewVehicleDetails(item._id || item.id, item)}
                            disabled={loadingVehicleId === (item._id || item.id || item.owner)}
                            className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-3 py-1.5 rounded-xl text-[10px] shadow-3xs transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            {loadingVehicleId === (item._id || item.id || item.owner) ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <span>View Details</span>
                            )}
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                            <MoreVertical size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isMounted && isDrawerOpen && createPortal(
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={handleCloseDrawer} />
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">

              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-50 text-[#0B5B32] rounded-xl"><Eye size={18} /></span>
                  <div>
                    <h2 className="text-sm font-black text-gray-900">Incoming Vehicle Inspection Details</h2>
                    <p className="text-[10px] text-gray-400 font-bold">Complete logistics, photos & specifications breakdown</p>
                  </div>
                </div>
                <button onClick={handleCloseDrawer} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-gray-700">
                {isFetchingVehicle ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-[#0B5B32] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="font-bold text-gray-400">Fetching vehicle profile...</p>
                  </div>
                ) : fetchVehicleError ? (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center space-y-1">
                    <AlertTriangle size={24} className="mx-auto text-red-500" />
                    <p className="font-black text-xs">{fetchVehicleError}</p>
                  </div>
                ) : selectedVehicleDetails ? (
                  <>
                    {resolvedPhotos.length > 0 && (
                      <div className="space-y-3">
                        <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 relative">
                          <img src={activePhoto || resolvedPhotos[0]?.url} alt="Vehicle preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {resolvedPhotos.map((photo, i) => (
                            <button
                              key={i}
                              onClick={() => setActivePhoto(photo.url)}
                              className={`w-16 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${activePhoto === photo.url ? 'border-[#0B5B32] scale-95' : 'border-transparent opacity-70'}`}
                            >
                              <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block">Manufacturer</span>
                        <span className="font-black text-gray-900">{manufacturerDisplay}</span>
                      </div>
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block">Model</span>
                        <span className="font-black text-gray-900">{modelDisplay}</span>
                      </div>
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block">Reg. Number</span>
                        <span className="font-black text-gray-900">{regDisplay}</span>
                      </div>
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block">Fuel Type</span>
                        <span className="font-black text-gray-900">{fuelDisplay}</span>
                      </div>
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block">Transmission</span>
                        <span className="font-black text-gray-900">{transDisplay}</span>
                      </div>
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block">Driven KMs</span>
                        <span className="font-black text-gray-900">{kmsDisplay}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-black text-gray-900 border-b border-gray-100 pb-1">Vehicle Condition</h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex justify-between p-2 bg-gray-50/50 rounded-lg">
                          <span className="text-gray-400 font-bold">Accident Type:</span>
                          <span className="font-black text-gray-800">{accidentDisplay}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50/50 rounded-lg">
                          <span className="text-gray-400 font-bold">Structure:</span>
                          <span className="font-black text-gray-800">{structureDisplay}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50/50 rounded-lg">
                          <span className="text-gray-400 font-bold">Airbags Deployed:</span>
                          <span className="font-black text-gray-800">{airbagsDisplay}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50/50 rounded-lg">
                          <span className="text-gray-400 font-bold">Engine Condition:</span>
                          <span className="font-black text-gray-800">{engineDisplay}</span>
                        </div>
                      </div>
                    </div>

                    {activePickup && (
                      <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 space-y-2 text-[11px]">
                        <h4 className="font-black text-xs text-gray-900">Pickup Location Address</h4>
                        <p className="font-bold text-gray-600 flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#0B5B32]" />
                          {activePickup.formattedAddress || `${activePickup.houseNumber || ''} ${activePickup.street || ''} ${activePickup.city || ''}, ${activePickup.state || ''}`.trim() || 'Address not available'}
                        </p>
                      </div>
                    )}
                  </>
                ) : null}
              </div>

              <div className="p-4 border-t border-gray-100 bg-white">
                <button
                  onClick={handleCloseDrawer}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-black py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Close Details
                </button>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}