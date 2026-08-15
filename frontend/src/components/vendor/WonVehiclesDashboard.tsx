'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, RotateCcw, ChevronDown, Trophy, Truck, IndianRupee, 
  MoreVertical, MapPin, Clock, Tag, ArrowUpDown, X, Loader2, Eye, AlertTriangle 
} from 'lucide-react';
import { wonVehiclesData } from '@/hooks/wonVehiclesData';
import { getVehicle } from '@/services/vehicle.service';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import axios from 'axios';

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

// Helper: MongoDB ObjectId Validator
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export interface WonVehicleDetails {
  vehicleId: string;
  sellerId: string;
  latitude: number;
  longitude: number;
  state: string;
  district: string;
  minimumBid: number;
  bidIncrement: number;
  reservePrice: number;
  currentHighestBid: number;
  highestBidder: string;
  totalBids: number;
  assignedPartnerId: string;
  assignedStatus: string;
  winnerBid: number;
}

export interface WonVehicleItem {
  auctionId: string;
  startTime: string;
  endTime: string;
  completedAt: string | null;
  auctionStatus: string;
  vehicle: WonVehicleDetails;
}

export interface PartnerWonVehiclesData {
  stats?: {
    totalWonVehicles: number;
    totalWonValue: number;
  };
  vehicles?: WonVehicleItem[];
}

interface FullVehicle {
  _id: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  isRegistered?: boolean;
  vehicleDetails?: {
    registrationNumber?: string;
    manufacturer?: string;
    model?: string;
    manufacturingYear?: number;
    fuelType?: string;
    transmission?: string;
    chassisNumber?: string;
    engineNumber?: string;
    kmsDriven?: number;
  };
  pickup?: {
    houseNumber?: string;
    street?: string;
    area?: string;
    landmark?: string;
    city?: string;
    state?: string;
    pincode?: string;
    formattedAddress?: string;
  };
  vehicleCondition?: {
    accidentType?: string;
    structure?: string;
    airbagsDeployed?: boolean;
    engineCondition?: string;
  };
  photos?: any;
  documents?: Record<string, any>;
  [key: string]: any;
}

export default function WonVehiclesDashboard() {
  // Execute data hook to fetch latest data into Redux store
  wonVehiclesData();

  // Redux store selector
  const partnerData = useSelector((state: RootState) => (state as any).partner?.PartnerWonVehiclesdata) as PartnerWonVehiclesData | undefined;
  
  // Extract raw backend vehicles list
  const rawVehicles: WonVehicleItem[] = useMemo(() => {
    return partnerData?.vehicles || [];
  }, [partnerData]);

  // Extract raw backend stats
  const backendStats = partnerData?.stats;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [pickupStatusFilter, setPickupStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST' | 'PRICE_HIGH' | 'PRICE_LOW'>('NEWEST');

  // Portal and Vehicle Details Drawer States
  const [isMounted, setIsMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState<FullVehicle | null>(null);
  const [isFetchingVehicle, setIsFetchingVehicle] = useState(false);
  const [fetchVehicleError, setFetchVehicleError] = useState<string | null>(null);
  const [loadingVehicleId, setLoadingVehicleId] = useState<string | null>(null);

  // Photo Resolution States
  const [resolvedPhotos, setResolvedPhotos] = useState<{ label: string; url: string }[]>([]);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect to resolve signed photo URLs inside side drawer
  useEffect(() => {
    if (!selectedVehicleDetails) {
      setResolvedPhotos([]);
      setActivePhoto(null);
      return;
    }

    const rawPhotos = selectedVehicleDetails.photos || {};
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

  // Handler to open sidebar and fetch vehicle details via API service
  const handleViewVehicleDetails = async (vehicleId: string) => {
    if (!vehicleId || !isValidObjectId(vehicleId)) {
      setFetchVehicleError(`Invalid Vehicle ID: "${vehicleId}". Cannot fetch details.`);
      setIsDrawerOpen(true);
      return;
    }

    setLoadingVehicleId(vehicleId);
    setIsFetchingVehicle(true);
    setFetchVehicleError(null);
    setIsDrawerOpen(true);

    try {
      const response = await getVehicle(vehicleId);
      const actualVehicle = response?.data?.data || response?.data || response;
      setSelectedVehicleDetails(actualVehicle);
    } catch (error: any) {
      console.error('Error fetching vehicle details:', error);
      setFetchVehicleError(error?.message || 'Failed to fetch vehicle details.');
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

  // Dynamic Metrics Cards Setup
  const stats = useMemo(() => [
    { 
      title: 'Total Won Vehicles', 
      count: backendStats?.totalWonVehicles ?? rawVehicles.length ?? 0, 
      sub: 'All time', 
      icon: Trophy, 
      bg: 'bg-emerald-50 text-emerald-700' 
    },
    { 
      title: 'Awaiting Pickup', 
      count: rawVehicles.filter(v => v.vehicle?.assignedStatus === 'ASSIGNED').length, 
      sub: 'To be picked up', 
      icon: Truck, 
      bg: 'bg-blue-50 text-blue-700' 
    },
    { 
      title: 'Total Won Value', 
      count: `₹${(backendStats?.totalWonValue ?? rawVehicles.reduce((acc, curr) => acc + (curr.vehicle?.winnerBid || 0), 0)).toLocaleString('en-IN')}`, 
      sub: 'All time', 
      icon: IndianRupee, 
      bg: 'bg-teal-50 text-teal-700', 
      isValue: true 
    },
  ], [backendStats, rawVehicles]);

  // Unique Location items for Filter Dropdown
  const availableLocations = useMemo(() => {
    const locations = rawVehicles.map(item => `${item.vehicle?.district}, ${item.vehicle?.state}`).filter(Boolean);
    return Array.from(new Set(locations));
  }, [rawVehicles]);

  // Dynamic Filter & Sorting Logic
  const processedVehicles = useMemo(() => {
    return rawVehicles
      .filter((item) => {
        const vehicle = item.vehicle || {};
        const search = searchQuery.toLowerCase().trim();

        const matchesSearch = 
          !search ||
          item.auctionId.toLowerCase().includes(search) ||
          vehicle.vehicleId?.toLowerCase().includes(search) ||
          vehicle.district?.toLowerCase().includes(search) ||
          vehicle.state?.toLowerCase().includes(search);

        const matchesPickupStatus = 
          pickupStatusFilter === 'ALL' || 
          vehicle.assignedStatus === pickupStatusFilter;

        const matchesLocation = 
          locationFilter === 'ALL' || 
          `${vehicle.district}, ${vehicle.state}` === locationFilter;

        return matchesSearch && matchesPickupStatus && matchesLocation;
      })
      .sort((a, b) => {
        if (sortOrder === 'NEWEST') {
          return new Date(b.endTime || b.startTime).getTime() - new Date(a.endTime || a.startTime).getTime();
        }
        if (sortOrder === 'OLDEST') {
          return new Date(a.endTime || a.startTime).getTime() - new Date(b.endTime || b.startTime).getTime();
        }
        if (sortOrder === 'PRICE_HIGH') {
          return (b.vehicle?.winnerBid || 0) - (a.vehicle?.winnerBid || 0);
        }
        if (sortOrder === 'PRICE_LOW') {
          return (a.vehicle?.winnerBid || 0) - (b.vehicle?.winnerBid || 0);
        }
        return 0;
      });
  }, [rawVehicles, searchQuery, pickupStatusFilter, locationFilter, sortOrder]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setPickupStatusFilter('ALL');
    setLocationFilter('ALL');
    setSortOrder('NEWEST');
  };

  return (
    <div className="space-y-6 w-full text-xs text-gray-700 antialiased relative">
      
      {/* 1. TOP TITLE HEADER BAR */}
      <div className="border-b border-gray-100 pb-3">
        <h3 className="font-black text-gray-900 text-sm tracking-tight">Won Vehicles</h3>
        <p className="text-[10px] text-gray-400 font-bold">View all vehicles you have won in auctions and track their progress.</p>
      </div>

      {/* 2. ANALYTICS ROW GRID PANEL */}
      <div className="overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex lg:grid lg:grid-cols-3 gap-4 min-w-max lg:min-w-0">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex items-start gap-4 w-52 lg:w-auto shrink-0">
                <div className={`p-2.5 rounded-xl ${item.bg} shrink-0`}>
                  <Icon size={16} />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] text-gray-400 font-bold block truncate leading-none">{item.title}</span>
                  <span className="text-base font-black block tracking-tight text-gray-900">{item.count}</span>
                  <span className="text-[9px] text-gray-400 font-medium block leading-none">{item.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MULTI-FILTER WORKSPACE TOOLBAR STRIP */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 items-end">
          
          {/* Search Term Input */}
          <div className="space-y-1 xl:col-span-2">
            <label className="text-[10px] text-gray-400 font-black block">Search Vehicle</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by ID, District, or State..." 
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-900 font-bold placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#0B5B32] focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Pickup Status Filter Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 font-black block">Pickup Status</label>
            <div className="relative">
              <select 
                value={pickupStatusFilter}
                onChange={(e) => setPickupStatusFilter(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-900 font-bold appearance-none focus:outline-hidden focus:ring-1 focus:ring-[#0B5B32] focus:bg-white cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="UNASSIGNED">Unassigned</option>
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Location Filter Dropdown */}
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

          {/* Sorting Order Selector */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 font-black block">Sort Order</label>
            <div className="relative">
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-900 font-bold appearance-none focus:outline-hidden focus:ring-1 focus:ring-[#0B5B32] focus:bg-white cursor-pointer"
              >
                <option value="NEWEST">Date: Newest First</option>
                <option value="OLDEST">Date: Oldest First</option>
                <option value="PRICE_HIGH">Bid: High to Low</option>
                <option value="PRICE_LOW">Bid: Low to High</option>
              </select>
              <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Clear Filter Button */}
          <div className="flex gap-2 w-full pt-1 sm:pt-0">
            <button 
              onClick={handleClearFilters}
              className="w-full text-gray-400 hover:text-gray-600 font-black py-2 px-1 flex items-center justify-center gap-1 cursor-pointer border border-gray-200 rounded-xl hover:bg-gray-50"
            >
              <RotateCcw size={12} />
              <span className="text-[10px]">Clear All</span>
            </button>
          </div>

        </div>
      </div>

      {/* 4. CORE VEHICLES DATA SHEET GRID */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-3xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] text-gray-400 font-black uppercase tracking-wider bg-gray-50/40">
                <th className="py-3 px-4 font-black">Vehicle Details</th>
                <th className="py-3 px-4 font-black">Auction Details</th>
                <th className="py-3 px-4 font-black">Winning Bid</th>
                <th className="py-3 px-4 font-black">Pickup Status</th>
                <th className="py-3 px-4 font-black">Won On</th>
                <th className="py-3 px-4 text-right font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {processedVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-bold">
                    No matching won vehicles found.
                  </td>
                </tr>
              ) : (
                processedVehicles.map((row) => {
                  const endDate = new Date(row.endTime || row.startTime);
                  const formattedDate = endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  const formattedTime = endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                  return (
                    <tr key={row.auctionId} className="hover:bg-gray-50/30 transition-colors">
                      
                      {/* Column A: Vehicle Specs Details */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-base shrink-0 overflow-hidden shadow-3xs">
                            🚗
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="font-black text-gray-900 text-[11px] leading-tight tracking-tight">
                              Vehicle ID: {row.vehicle?.vehicleId?.slice(-8).toUpperCase() || 'N/A'}
                            </h4>
                            <p className="text-[9px] text-gray-400 font-medium leading-none">
                              Seller: {row.vehicle?.sellerId?.slice(-8).toUpperCase() || 'N/A'}
                            </p>
                            <div className="flex gap-1 flex-wrap pt-0.5">
                              <span className="px-1.5 py-0.5 rounded-sm text-[8px] font-black tracking-tight bg-emerald-50 text-emerald-700">
                                Total Bids: {row.vehicle?.totalBids ?? 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column B: Auction Details */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 text-[10px] text-gray-500 font-bold">
                          <div className="flex items-center gap-1 text-gray-700 font-black">
                            <Tag size={10} className="text-gray-400" />
                            <span>AUC-{row.auctionId?.slice(0, 8).toUpperCase()}</span>
                          </div>
                          <div className="flex items-center gap-1 font-medium text-gray-400">
                            <MapPin size={10} />
                            <span>{row.vehicle?.district}, {row.vehicle?.state}</span>
                          </div>
                        </div>
                      </td>

                      {/* Column C: Winning Bid */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-black text-emerald-700 text-[11px] block">
                            ₹{(row.vehicle?.winnerBid || 0).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9px] text-gray-400 font-medium block leading-none">
                            Min Incr: ₹{row.vehicle?.bidIncrement ?? 0}
                          </span>
                        </div>
                      </td>

                      {/* Column D: Pickup Status */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black inline-block border ${
                            row.vehicle?.assignedStatus === 'ASSIGNED' 
                              ? 'bg-blue-50 text-blue-700 border-blue-100' 
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {row.vehicle?.assignedStatus || 'UNASSIGNED'}
                          </span>
                        </div>
                      </td>

                      {/* Column E: Won On Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-black text-gray-800 block">{formattedDate}</span>
                          <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium leading-none">
                            <Clock size={9} />
                            <span>{formattedTime}</span>
                          </div>
                        </div>
                      </td>

                      {/* Column F: Action Trigger Utilities */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => handleViewVehicleDetails(row.vehicle?.vehicleId)}
                            disabled={loadingVehicleId === row.vehicle?.vehicleId}
                            className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-2.5 py-1 rounded-xl text-[10px] shadow-3xs transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            {loadingVehicleId === row.vehicle?.vehicleId ? (
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

      {/* 5. SLIDE-OVER VEHICLE DETAILS SIDEBAR DRAWER (PORTAL MATCHING LIVE BIDS FILE) */}
      {isMounted && isDrawerOpen && createPortal(
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={handleCloseDrawer} />
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">
              
              {/* Drawer Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-50 text-[#0B5B32] rounded-xl"><Eye size={18} /></span>
                  <div>
                    <h2 className="text-sm font-black text-gray-900">Vehicle Inspection Details</h2>
                    <p className="text-[10px] text-gray-400 font-bold">Complete condition & document breakdown</p>
                  </div>
                </div>
                <button onClick={handleCloseDrawer} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600 cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content Body */}
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
                    {/* Media Gallery */}
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

                    {/* Specifications & Overview Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block">Manufacturer</span>
                        <span className="font-black text-gray-900">{selectedVehicleDetails.vehicleDetails?.manufacturer || 'N/A'}</span>
                      </div>
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block">Model</span>
                        <span className="font-black text-gray-900">{selectedVehicleDetails.vehicleDetails?.model || 'N/A'}</span>
                      </div>
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block">Reg. Number</span>
                        <span className="font-black text-gray-900">{selectedVehicleDetails.vehicleDetails?.registrationNumber || 'N/A'}</span>
                      </div>
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block">Fuel Type</span>
                        <span className="font-black text-gray-900">{selectedVehicleDetails.vehicleDetails?.fuelType || 'N/A'}</span>
                      </div>
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block">Transmission</span>
                        <span className="font-black text-gray-900">{selectedVehicleDetails.vehicleDetails?.transmission || 'N/A'}</span>
                      </div>
                      <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                        <span className="text-[10px] text-gray-400 font-bold block">Driven KMs</span>
                        <span className="font-black text-gray-900">{selectedVehicleDetails.vehicleDetails?.kmsDriven ? `${selectedVehicleDetails.vehicleDetails.kmsDriven} km` : 'N/A'}</span>
                      </div>
                    </div>

                    {/* Condition Breakdown Section */}
                    <div className="space-y-2">
                      <h4 className="font-black text-gray-900 border-b border-gray-100 pb-1">Vehicle Condition</h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex justify-between p-2 bg-gray-50/50 rounded-lg">
                          <span className="text-gray-400 font-bold">Accident Type:</span>
                          <span className="font-black text-gray-800">{selectedVehicleDetails.vehicleCondition?.accidentType || 'None'}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50/50 rounded-lg">
                          <span className="text-gray-400 font-bold">Structure:</span>
                          <span className="font-black text-gray-800">{selectedVehicleDetails.vehicleCondition?.structure || 'Intact'}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50/50 rounded-lg">
                          <span className="text-gray-400 font-bold">Airbags Deployed:</span>
                          <span className="font-black text-gray-800">{selectedVehicleDetails.vehicleCondition?.airbagsDeployed ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50/50 rounded-lg">
                          <span className="text-gray-400 font-bold">Engine Condition:</span>
                          <span className="font-black text-gray-800">{selectedVehicleDetails.vehicleCondition?.engineCondition || 'Good'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pickup & Location Section */}
                    {selectedVehicleDetails.pickup && (
                      <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 space-y-2 text-[11px]">
                        <h4 className="font-black text-xs text-gray-900">Pickup Location</h4>
                        <p className="font-bold text-gray-600 flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#0B5B32]" />
                          {selectedVehicleDetails.pickup.formattedAddress || `${selectedVehicleDetails.pickup.city || ''}, ${selectedVehicleDetails.pickup.state || ''}`}
                        </p>
                      </div>
                    )}
                  </>
                ) : null}
              </div>

              {/* Drawer Footer */}
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