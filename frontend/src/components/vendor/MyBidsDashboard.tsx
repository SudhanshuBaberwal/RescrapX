'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Gavel, Clock, Trophy, Ban, AlertCircle, Search, SlidersHorizontal,
  MapPin, Calendar, Fuel, ChevronDown, ChevronLeft, ChevronRight,
  LayoutGrid, List, FileText, CheckCircle2, XCircle, X, Loader2, Info, Eye, AlertTriangle, ArrowUpDown
} from 'lucide-react';
import { getPartnerBidsData } from '@/hooks/getPartnerBids';
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

// Date Formatter Helper
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
  majorComponents?: {
    engine?: string;
    radiator?: string;
    fuelSystem?: string;
    gearbox?: string;
  };
  photos?: any;
  documents?: Record<string, any>;
  [key: string]: any;
}

export default function MyBidsDashboard() {
  const [activeTab, setActiveTab] = useState('All Bids');

  // Search, Filter & Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fuelFilter, setFuelFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'BID_DESC' | 'BID_ASC'>('BID_DESC');

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

  getPartnerBidsData();

  const { PartnerBidsData } = useSelector((state: RootState) => (state as any).partner) || { PartnerBidsData: [] };
  const bidsList = Array.isArray(PartnerBidsData) ? PartnerBidsData : [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect to resolve signed photo URLs
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

  // Mapped Bids Data from API Response
  const mappedBids = useMemo(() => {
    return bidsList.map((bid: any) => {
      const vehicle = typeof bid.vehicleId === 'object' ? bid.vehicleId : {};
      const vehicleIdStr = typeof bid.vehicleId === 'string' ? bid.vehicleId : vehicle._id || '';
      const vehicleDetails = vehicle.vehicleDetails || {};
      const pickup = vehicle.pickup || {};
      const auction = bid.auctionId || {};

      const make = vehicleDetails.make || vehicleDetails.manufacturer || '';
      const model = vehicleDetails.model || '';
      const year = vehicleDetails.manufacturingYear || vehicleDetails.year || '';
      const fullName = `${make} ${model} ${year}`.trim() || 'Vehicle Information N/A';

      const fuel = vehicleDetails.fuelType || 'N/A';
      const trans = vehicleDetails.transmission || 'Manual';
      const owner = vehicleDetails.ownership || '1st Owner';
      const engineInfo = `${fuel} • ${trans} • ${owner}`;

      const tags: string[] = [];
      if (vehicle.documents?.rcbook) tags.push('RC AVAILABLE');
      if (vehicleDetails.fitnessExpired) tags.push('FITNESS EXPIRED');
      if (vehicleDetails.pollutionExpired) tags.push('POLLUTION EXPIRED');
      if (tags.length === 0) tags.push('RC AVAILABLE');

      const location = pickup.city && pickup.state ? `${pickup.city}, ${pickup.state}` : pickup.state || pickup.city || 'N/A';

      // Status Normalization
      let normalizedStatus = 'Active';
      const rawStatus = (bid.status || 'ACTIVE').toUpperCase();
      if (rawStatus === 'ACTIVE') normalizedStatus = 'Active';
      else if (rawStatus === 'OUTBID') normalizedStatus = 'Outbid';
      else if (rawStatus === 'WON') normalizedStatus = 'Won';
      else if (rawStatus === 'LOST' || rawStatus === 'REJECTED') normalizedStatus = 'Lost';
      else if (rawStatus === 'UNKNOWN') normalizedStatus = 'Active';

      const numericYourBid = Number(bid.amount) || 0;
      const numericHighestBid = Number(auction.highestBid) || numericYourBid;

      const formattedAmount = `₹${numericYourBid.toLocaleString('en-IN')}`;
      const highestBid = `₹${numericHighestBid.toLocaleString('en-IN')}`;

      return {
        id: bid._id,
        vehicleId: vehicleIdStr,
        name: fullName,
        engine: engineInfo,
        fuelType: fuel,
        tags,
        date: formatDate(bid.createdAt || auction.startTime),
        location,
        yourBid: formattedAmount,
        numericYourBid,
        bidsCount: `${auction.totalBids || 1} bids`,
        highestBid,
        numericHighestBid,
        highestBidder: auction.highestBidder ? `by ${auction.highestBidder}` : 'by You',
        status: normalizedStatus,
        timer: auction.endTime ? `${formatDate(auction.endTime)}` : '00:20:00 Remaining',
        timerType: rawStatus === 'WON' || rawStatus === 'LOST' ? 'ended' : 'countdown',
        isHighest: auction.highestBidder === 'You' || rawStatus === 'WON',
        raw: bid,
        vehicleData: vehicle,
      };
    });
  }, [bidsList]);

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

  // Dynamic counts & metrics computation
  const counts = useMemo(() => {
    return {
      active: mappedBids.filter((b) => b.status === 'Active').length,
      won: mappedBids.filter((b) => b.status === 'Won').length,
      lost: mappedBids.filter((b) => b.status === 'Lost').length,
      outbid: mappedBids.filter((b) => b.status === 'Outbid').length,
    };
  }, [mappedBids]);

  const totalBidsCount = mappedBids.length;
  const winRate = totalBidsCount > 0 ? ((counts.won / totalBidsCount) * 100).toFixed(1) : '0.0';
  const lostRate = totalBidsCount > 0 ? ((counts.lost / totalBidsCount) * 100).toFixed(1) : '0.0';
  const outbidRate = totalBidsCount > 0 ? ((counts.outbid / totalBidsCount) * 100).toFixed(1) : '0.0';

  const metrics = [
    { title: 'Total Bids', count: totalBidsCount, meta: 'All time', icon: Gavel, iconColor: 'text-emerald-600 bg-emerald-50' },
    { title: 'Active Bids', count: counts.active, meta: 'Currently live', icon: FileText, iconColor: 'text-purple-600 bg-purple-50' },
    { title: 'Bids Won', count: counts.won, meta: `${winRate}% win rate`, icon: Trophy, iconColor: 'text-emerald-600 bg-emerald-50', rate: true },
    { title: 'Bids Lost', count: counts.lost, meta: `${lostRate}%`, icon: XCircle, iconColor: 'text-red-600 bg-red-50' },
    { title: 'Outbid', count: counts.outbid, meta: `${outbidRate}%`, icon: Ban, iconColor: 'text-amber-600 bg-amber-50' },
  ];

  const tabs = [
    { name: 'All Bids', count: totalBidsCount },
    { name: 'Active Bids', count: counts.active },
    { name: 'Bids Won', count: counts.won },
    { name: 'Bids Lost', count: counts.lost },
    { name: 'Outbid', count: counts.outbid },
  ];

  const filteredBids = useMemo(() => {
    let result = mappedBids.filter((item) => {
      if (activeTab === 'Active Bids' && item.status !== 'Active') return false;
      if (activeTab === 'Bids Won' && item.status !== 'Won') return false;
      if (activeTab === 'Bids Lost' && item.status !== 'Lost') return false;
      if (activeTab === 'Outbid' && item.status !== 'Outbid') return false;

      if (statusFilter !== 'ALL' && item.status.toUpperCase() !== statusFilter.toUpperCase()) return false;
      if (fuelFilter !== 'ALL' && item.fuelType.toUpperCase() !== fuelFilter.toUpperCase()) return false;

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesLocation = item.location.toLowerCase().includes(query);
        return matchesName || matchesLocation;
      }

      return true;
    });

    // Sort Order by Current Highest Bid
    return result.sort((a, b) => {
      if (sortBy === 'BID_DESC') {
        return b.numericHighestBid - a.numericHighestBid;
      } else {
        return a.numericHighestBid - b.numericHighestBid;
      }
    });
  }, [mappedBids, activeTab, searchQuery, statusFilter, fuelFilter, sortBy]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Outbid': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Won': return 'bg-emerald-50 text-[#0B5B32] border-emerald-100';
      case 'Lost': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-6 w-full text-xs relative">

      {/* 1. TOP METRICS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex justify-between items-start">
              <div className="space-y-3">
                <span className="text-gray-400 font-bold block">{metric.title}</span>
                <div>
                  <span className="text-xl font-black text-gray-900 tracking-tight block">{metric.count}</span>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.rate && <span className="text-[10px] text-emerald-600 font-black mr-0.5">▲</span>}
                    <span className={`text-[10px] font-bold ${metric.rate ? 'text-emerald-600' : 'text-gray-400'}`}>{metric.meta}</span>
                  </div>
                </div>
              </div>
              <div className={`p-2 rounded-xl ${metric.iconColor}`}><Icon size={16} /></div>
            </div>
          );
        })}
      </div>

      {/* 2. TABBED FILTER INTERFACE */}
      <div className="border-b border-gray-100 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        <div className="flex gap-6 min-w-max pb-px">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-3 font-black transition-all relative cursor-pointer flex items-center gap-1.5 ${activeTab === tab.name ? 'text-[#0B5B32]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span>{tab.name}</span>
              {tab.count !== null && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${activeTab === tab.name ? 'bg-emerald-50 text-[#0B5B32]' : 'bg-gray-100 text-gray-500'}`}>{tab.count}</span>
              )}
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B5B32] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. SEARCH, SORT & DYNAMIC FILTER BAR */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">

          <div className="relative xl:col-span-2">
            <span className="text-[10px] text-gray-400 font-black block mb-1">Search Vehicle</span>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by make, model or location..."
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-700 font-medium placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#0B5B32] focus:bg-white"
              />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Fuel Type</span>
            <select
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-bold outline-none cursor-pointer"
            >
              <option value="ALL">All Fuel Types</option>
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="ELECTRIC">Electric</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Bid Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-bold outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="OUTBID">Outbid</option>
              <option value="WON">Won</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'BID_DESC' | 'BID_ASC')}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-bold outline-none cursor-pointer"
            >
              <option value="BID_DESC">Highest Bid (High to Low)</option>
              <option value="BID_ASC">Highest Bid (Low to High)</option>
            </select>
          </div>

          <div className="flex items-end col-span-1 sm:col-span-2 lg:col-span-1">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setFuelFilter('ALL');
                setSortBy('BID_DESC');
              }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-xl transition-all cursor-pointer h-9"
            >
              Reset Filters
            </button>
          </div>

        </div>
      </div>

      {/* 4. DATA TABLE CONTAINER */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">

        {/* DESKTOP VIEWPORT TABLE VIEW */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-black">Vehicle Details</th>
                <th className="py-3 px-2 font-black">Auction Details</th>
                <th className="py-3 px-2 font-black text-right">Your Bid</th>
                <th className="py-3 px-2 font-black text-right">
                  <div className="inline-flex items-center gap-1">
                    <span>Current Highest Bid</span>
                    <ArrowUpDown size={11} className="text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-2 font-black text-center">Status</th>
                <th className="py-3 px-2 font-black">Time Left</th>
                <th className="py-3 px-4 font-black text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {filteredBids.length > 0 ? (
                filteredBids.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">

                    {/* Vehicle Context Sheet */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex gap-3">
                        <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200/60 relative flex items-center justify-center font-bold text-gray-400 text-[10px]">
                          IMG
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-black text-gray-900 text-[13px] tracking-tight leading-tight">{item.name}</h4>
                          <p className="text-[10px] text-gray-400 font-bold">{item.engine}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.tags.map((tag, i) => (
                              <span key={i} className={`text-[8px] font-black px-1.5 py-0.2 rounded-sm uppercase tracking-wide border ${tag.includes('EXPIRED') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location & Scheduling Stamp */}
                    <td className="py-4 px-2">
                      <div className="space-y-1 text-gray-600">
                        <p className="flex items-center gap-1 font-bold text-gray-800"><MapPin size={12} className="text-gray-400" /> <span>{item.location}</span></p>
                        <p className="flex items-center gap-1 text-[10px] text-gray-400 font-bold"><Calendar size={12} className="text-gray-400" /> <span>{item.date}</span></p>
                      </div>
                    </td>

                    {/* Your Bid */}
                    <td className="py-4 px-2 text-right">
                      <p className="font-black text-gray-900 text-[13px]">{item.yourBid}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{item.bidsCount}</p>
                    </td>

                    {/* Current Highest Bid */}
                    <td className="py-4 px-2 text-right">
                      <p className={`font-black text-[13px] ${item.isHighest ? 'text-emerald-700' : 'text-gray-900'}`}>{item.highestBid}</p>
                      <p className={`text-[10px] font-bold ${item.isHighest ? 'text-emerald-700 font-black' : 'text-gray-400'}`}>{item.highestBidder}</p>
                    </td>

                    {/* Status Badges Row */}
                    <td className="py-4 px-2 text-center">
                      <span className={`px-2.5 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider border ${getStatusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Expiration Clock */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-1.5">
                        {item.timerType === 'countdown' && (
                          <div className="w-2 h-2 rounded-full border border-red-500 border-t-transparent animate-spin shrink-0" />
                        )}
                        <span className={`font-mono font-bold text-[11px] ${item.timerType === 'countdown' ? 'text-red-600' : 'text-gray-400'}`}>
                          {item.timer}
                        </span>
                      </div>
                    </td>

                    {/* Actions -> View Details Button */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleViewVehicleDetails(item.vehicleId)}
                        disabled={loadingVehicleId === item.vehicleId}
                        className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-4 py-2 rounded-xl shadow-3xs transition-all tracking-tight cursor-pointer inline-flex items-center gap-1.5"
                      >
                        {loadingVehicleId === item.vehicleId ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <span>View Details</span>
                        )}
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-semibold">
                    No bids found matching the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* COMPACT CARD RESPONSIVE VIEW */}
        <div className="xl:hidden divide-y divide-gray-100">
          {filteredBids.length > 0 ? (
            filteredBids.map((item) => (
              <div key={item.id} className="p-4 space-y-4 hover:bg-gray-50/20 transition-all">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex gap-2.5 min-w-0">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200/50 flex items-center justify-center font-bold text-gray-300 text-[10px]">
                      IMG
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-black text-gray-900 text-sm tracking-tight truncate">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold truncate">{item.engine}</p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {item.tags.map((tag, i) => (
                          <span key={i} className={`text-[8px] font-black px-1.5 py-0.2 rounded-sm border uppercase ${tag.includes('EXPIRED') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md font-black text-[8px] uppercase tracking-wider border shrink-0 ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-gray-50/60 border border-gray-100/40 p-3 rounded-xl">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block mb-0.5">Your Bid</span>
                    <span className="font-black text-gray-900 block text-[13px]">{item.yourBid}</span>
                    <span className="text-[9px] text-gray-400 font-bold block mt-0.5">{item.bidsCount}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block mb-0.5">Highest Bid</span>
                    <span className={`font-black text-[13px] block ${item.isHighest ? 'text-emerald-700' : 'text-gray-900'}`}>{item.highestBid}</span>
                    <span className={`text-[9px] block ${item.isHighest ? 'text-emerald-700 font-black' : 'text-gray-400'}`}>{item.highestBidder}</span>
                  </div>
                </div>

                <div className="space-y-1 text-gray-500 text-[10px] font-bold">
                  <p className="flex items-center gap-1 text-gray-700"><MapPin size={11} className="text-gray-400" /> <span>{item.location}</span></p>
                  <p className="flex items-center gap-1 text-gray-400"><Calendar size={11} className="text-gray-400" /> <span>{item.date}</span></p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                  <div className="flex items-center gap-1">
                    {item.timerType === 'countdown' && <div className="w-1.5 h-1.5 rounded-full border border-red-500 border-t-transparent animate-spin" />}
                    <span className={`font-mono font-bold text-[10px] ${item.timerType === 'countdown' ? 'text-red-600' : 'text-gray-400'}`}>{item.timer}</span>
                  </div>

                  <button
                    onClick={() => handleViewVehicleDetails(item.vehicleId)}
                    className="bg-[#0B5B32] text-white font-black px-3.5 py-2 rounded-xl text-[11px] shadow-3xs cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-400 font-semibold">
              No bids found matching the selected criteria.
            </div>
          )}
        </div>

      </div>

      {/* 5. SLIDE-OVER VEHICLE DETAILS SIDEBAR DRAWER (PORTAL MATCHING LIVE AUCTION FILE) */}
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