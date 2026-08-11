'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Gavel, Clock, Trophy, Wallet, Search,
  MapPin, Calendar, Fuel, Scale, ChevronDown, RotateCcw,
  ChevronLeft, ChevronRight, LayoutGrid, List, Eye, X
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getPartnerAuctionData } from '@/hooks/getPartnerAuctionData';
import { getVehicle } from '@/services/vehicle.service';
import axios from 'axios';
import { placeBid } from '@/services/auction/auctionPartner.service';

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

interface FormattedAuctionItem {
  id: string;
  auctionId: string;
  name: string;
  engine: string;
  tags: string[];
  year: string;
  fuel: string;
  location: string;
  distance: string;
  weight: string;
  scrapValue: string;
  minimumBid: string;
  reservePrice: string;
  bidIncrement: string;
  timeLeft: string;
  status: string;
  auctionType: string;
  rawStatus: string;
  timerColor: string;
  highestBid: string;
  bidsCount: string;
  yourBid: string;
  yourBidStatus?: string;
  photoUrl?: string;
  totalPhotosCount: number;
  endTimeIso: string;
  startTimeIso: string;
  formattedStartTime: string;
}

interface LiveAuctionsDashboardProps {
  loggedPartnerId?: string;
}

export default function LiveAuctionsDashboard({ loggedPartnerId = "6a7a0b28da19aa120f168dfe" }: LiveAuctionsDashboardProps) {
  getPartnerAuctionData();

  const { PartnerAuctionData } = useSelector((state: RootState) => (state as any).partner || {});

  const [loading, setLoading] = useState(true);
  const [rawAuctions, setRawAuctions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [now, setNow] = useState(Date.now());

  // Drawer states
  const [isMounted, setIsMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState<FullVehicle | null>(null);
  const [loadingVehicleId, setLoadingVehicleId] = useState<string | null>(null);
  const [isFetchingVehicle, setIsFetchingVehicle] = useState(false);
  const [fetchVehicleError, setFetchVehicleError] = useState<string | null>(null);

  const [resolvedPhotos, setResolvedPhotos] = useState<{ label: string; url: string }[]>([]);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Mount setup
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync Redux Data safely
  useEffect(() => {
    if (PartnerAuctionData) {
      const dataArray = Array.isArray(PartnerAuctionData) ? PartnerAuctionData : [PartnerAuctionData];
      setRawAuctions(dataArray);
      setLoading(false);
    }
  }, [PartnerAuctionData]);

  // Live countdown timer ticker
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Resolved signed photo URLs for drawer
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

  /**
   * Bidding submission API helper
   */
  const submitBidApi = async (auctionId: string, vehicleId: string, amount: number) => {
    try {
      const response = placeBid({ auctionId, vehicleId, bidAmount: amount })
      return response
    } catch (error: any) {
      console.error("Bid Placement Error:", error);
      throw error?.response?.data || error;
    }
  };

  /**
   * Primary Place Bid Handler
   */
  const handlePlaceBid = async (auctionId: string, vehicleId: string, minBidOrIncrement: number) => {
    const amountStr = prompt(`Enter your bid amount for vehicle ID (${vehicleId}):`, String(minBidOrIncrement || 1000));
    if (!amountStr) return;

    const bidAmount = Number(amountStr);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    try {
      const result = await submitBidApi(auctionId, vehicleId, bidAmount);
      console.log("Bid Placed Successfully:", result);
      alert(`Bid of ₹${bidAmount.toLocaleString('en-IN')} placed successfully!`);
    } catch (err: any) {
      alert(`Failed to place bid: ${err?.message || 'Something went wrong.'}`);
    }
  };

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

  const partnerAuctionItems = useMemo(() => {
    const formattedList: FormattedAuctionItem[] = [];

    rawAuctions.forEach((auction) => {
      if (!auction) return;

      const parentAuctionId = String(auction.auctionId || auction._id || auction.id);

      const currentPartnerObj = (auction.partners || []).find(
        (p: any) => String(p.partnerId || p._id || p.id) === String(loggedPartnerId)
      );

      const assignedVehicleIds = new Set<string>();
      if (currentPartnerObj?.vehicleIds) {
        currentPartnerObj.vehicleIds.forEach((vObj: any) => {
          const vId = typeof vObj === 'string' ? vObj : vObj.vehicleId || vObj._id || vObj.id;
          if (vId) assignedVehicleIds.add(String(vId));
        });
      }

      const vehiclesList = auction.vehicles || (auction.vehicle ? [auction.vehicle] : []);

      vehiclesList.forEach((v: any) => {
        const vehicleObj = typeof v === 'object' ? v : {};
        const vId = String(vehicleObj._id || vehicleObj.id || vehicleObj.vehicleId || v);

        if (assignedVehicleIds.size === 0 || assignedVehicleIds.has(vId)) {
          const details = vehicleObj.vehicleDetails || vehicleObj.details || {};
          const pickup = vehicleObj.pickup || {};

          const rawPhotos = vehicleObj.photos || details.photos || {};
          let photosArray: string[] = [];
          if (Array.isArray(rawPhotos)) {
            photosArray = rawPhotos.map(getMediaUrl).filter(Boolean) as string[];
          } else if (typeof rawPhotos === 'object') {
            photosArray = Object.values(rawPhotos).map(getMediaUrl).filter(Boolean) as string[];
          }

          const auctionType = auction.type || 'LIVE';
          const auctionStatus = auction.status || 'DRAFT';

          const startDate = auction.startTime ? new Date(auction.startTime) : new Date();
          const endDate = auction.endTime ? new Date(auction.endTime) : new Date();

          const startTimeMs = startDate.getTime();
          const endTimeMs = endDate.getTime();

          const formattedStartTime = startDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });

          let diffMs = 0;
          let statusLabel = auctionStatus;

          if (auctionType === 'LIVE' && auctionStatus === 'DRAFT') {
            diffMs = Math.max(0, startTimeMs - now);
            statusLabel = 'Starts At';
          } else {
            diffMs = Math.max(0, endTimeMs - now);
          }

          const hours = Math.floor(diffMs / (1000 * 60 * 60)).toString().padStart(2, '0');
          const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
          const secs = Math.floor((diffMs % (1000 * 60)) / 1000).toString().padStart(2, '0');
          const timeLeftStr = `${hours}:${mins}:${secs}`;

          let timerColor = 'text-emerald-600 border-emerald-500';
          if (diffMs < 15 * 60 * 1000) timerColor = 'text-red-600 border-red-500';
          else if (diffMs < 30 * 60 * 1000) timerColor = 'text-amber-500 border-amber-500';

          const title = [details.manufacturer || details.make, details.model, details.manufacturingYear].filter(Boolean).join(' ') || `Vehicle #${vId.slice(-6)}`;
          const locationStr = [vehicleObj.district || pickup.city, vehicleObj.state || pickup.state].filter(Boolean).join(', ') || 'N/A';

          const minBidVal = vehicleObj.minimumBid;
          const reserveVal = vehicleObj.reservePrice;
          const incrementVal = vehicleObj.bidIncrement;

          formattedList.push({
            id: vId,
            auctionId: parentAuctionId,
            name: title,
            engine: `${details.fuelType || 'Petrol'} • ${details.transmission || 'Manual'} • ${details.kmsDriven ? `${details.kmsDriven} km` : '1st Owner'}`,
            tags: [details.registrationNumber ? 'RC Available' : 'No RC'],
            year: String(details.manufacturingYear || 'N/A'),
            fuel: details.fuelType || 'N/A',
            location: locationStr,
            distance: pickup.area ? `${pickup.area}` : 'Local',
            weight: details.chassisNumber ? 'Standard' : 'N/A',
            scrapValue: vehicleObj.estimatedScrapValue ? `₹${vehicleObj.estimatedScrapValue.toLocaleString('en-IN')}` : '₹30,000 – ₹40,000',
            minimumBid: minBidVal != null ? `₹${Number(minBidVal).toLocaleString('en-IN')}` : 'N/A',
            reservePrice: reserveVal != null ? `₹${Number(reserveVal).toLocaleString('en-IN')}` : 'N/A',
            bidIncrement: incrementVal != null ? `₹${Number(incrementVal).toLocaleString('en-IN')}` : 'N/A',
            timeLeft: timeLeftStr,
            status: statusLabel,
            auctionType,
            rawStatus: auctionStatus,
            timerColor,
            highestBid: vehicleObj.currentHighestBid ? `₹${vehicleObj.currentHighestBid.toLocaleString('en-IN')}` : '₹0',
            bidsCount: `${vehicleObj.totalBids || auction.totalBids || 0} bids`,
            yourBid: vehicleObj.yourBid ? `₹${vehicleObj.yourBid.toLocaleString('en-IN')}` : '-',
            yourBidStatus: vehicleObj.yourBid ? 'Your bid' : undefined,
            photoUrl: photosArray[0],
            totalPhotosCount: photosArray.length,
            endTimeIso: auction.endTime,
            startTimeIso: auction.startTime,
            formattedStartTime,
          });
        }
      });
    });

    return formattedList;
  }, [rawAuctions, loggedPartnerId, now]);

  const filteredAuctionItems = useMemo(() => {
    return partnerAuctionItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFuel = selectedFuel === 'All' || item.fuel.toLowerCase() === selectedFuel.toLowerCase();
      return matchesSearch && matchesFuel;
    });
  }, [partnerAuctionItems, searchQuery, selectedFuel]);

  const metrics = useMemo(() => {
    const liveCount = partnerAuctionItems.length;
    const endingSoonCount = partnerAuctionItems.filter(i => {
      const diff = new Date(i.endTimeIso).getTime() - now;
      return diff > 0 && diff <= 15 * 60 * 1000;
    }).length;
    const activeBidsCount = partnerAuctionItems.filter(i => i.yourBid !== '-').length;

    return [
      { title: 'Live Auctions', count: String(liveCount), meta: 'Assigned to your profile', dotColor: 'bg-emerald-500', icon: Gavel, iconColor: 'text-emerald-600 bg-emerald-50' },
      { title: 'Ending Soon', count: String(endingSoonCount), meta: 'Within 15 minutes', dotColor: 'bg-amber-500', icon: Clock, iconColor: 'text-purple-600 bg-purple-50' },
      { title: 'My Active Bids', count: String(activeBidsCount), meta: 'On live auctions', dotColor: 'bg-emerald-500', icon: Trophy, iconColor: 'text-amber-600 bg-amber-50' },
      { title: 'Bids Won Today', count: '3', meta: 'Total value ₹1,24,300', dotColor: 'bg-blue-500', icon: Trophy, iconColor: 'text-blue-600 bg-blue-50' },
      { title: 'Total Assigned Value', count: `₹${(liveCount * 35000).toLocaleString('en-IN')}`, meta: 'Across assigned vehicles', dotColor: 'bg-emerald-500', icon: Wallet, iconColor: 'text-emerald-600 bg-emerald-50' },
    ];
  }, [partnerAuctionItems, now]);

  return (
    <div className="relative space-y-6 w-full text-xs">
      {/* 1. TOP STATS OVERVIEW MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex justify-between items-start">
              <div className="space-y-3">
                <span className="text-gray-400 font-bold block">{metric.title}</span>
                <div>
                  <span className="text-xl font-black text-gray-900 tracking-tight block">{metric.count}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${metric.dotColor}`} />
                    <span className="text-[10px] text-gray-400 font-bold">{metric.meta}</span>
                  </div>
                </div>
              </div>
              <div className={`p-2 rounded-xl ${metric.iconColor}`}><Icon size={16} /></div>
            </div>
          );
        })}
      </div>

      {/* 2. DYNAMIC FILTERS TOOLBAR ROW */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <div className="relative xl:col-span-2">
            <span className="text-[10px] text-gray-400 font-black block mb-1">Search Vehicle</span>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by make, model or city..."
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-700 font-medium placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
              />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Fuel Type</span>
            <select
              value={selectedFuel}
              onChange={(e) => setSelectedFuel(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-bold hover:bg-gray-100/50 transition-all outline-none"
            >
              <option value="All">All Fuel Types</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Location</span>
            <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-bold flex items-center justify-between hover:bg-gray-100/50 transition-all">
              <span>All Locations</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Est. Value Range</span>
            <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-bold flex items-center justify-between hover:bg-gray-100/50 transition-all">
              <span>All Ranges</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => { setSearchQuery(''); setSelectedFuel('All'); }}
              className="w-full text-gray-400 hover:text-gray-600 font-bold flex items-center justify-center gap-1 text-[11px] h-[34px] border border-gray-200 rounded-xl bg-white shadow-3xs hover:bg-gray-50 cursor-pointer"
            >
              <RotateCcw size={11} /> <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. CONTROL TABLE HEADER INFO SECTION */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="font-black text-gray-900 text-sm">
          <span className="text-emerald-700 font-black">{filteredAuctionItems.length}</span> Assigned Vehicles Live
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50/50 border border-gray-200 rounded-xl px-2 py-1">
            <span className="text-gray-400 font-bold text-[10px]">Sort by:</span>
            <button className="font-black text-gray-700 flex items-center gap-1 text-[11px]">
              <span>Ending Soon</span> <ChevronDown size={11} className="text-gray-400" />
            </button>
          </div>
          <div className="hidden sm:flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-3xs bg-white">
            <button className="p-1.5 bg-gray-50 text-gray-700 border-r border-gray-200"><List size={13} /></button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600"><LayoutGrid size={13} /></button>
          </div>
        </div>
      </div>

      {/* 4. AUCTIONS MASTER CONTAINER */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-7 h-7 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold">Loading assigned vehicles...</p>
          </div>
        ) : filteredAuctionItems.length === 0 ? (
          <div className="py-20 text-center text-gray-400 font-bold">
            No live auction vehicles found assigned to your partner profile.
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE SHEET */}
            <div className="hidden xl:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4 font-black">Vehicle Details</th>
                    <th className="py-3 px-2 font-black">Location / Area</th>
                    <th className="py-3 px-2 font-black text-right">Min Bid</th>
                    <th className="py-3 px-2 font-black text-right">Reserve Price</th>
                    <th className="py-3 px-2 font-black text-right">Increment</th>
                    <th className="py-3 px-2 font-black text-center">Time Left</th>
                    <th className="py-3 px-2 font-black text-right">Highest Bid</th>
                    <th className="py-3 px-2 font-black text-right">Your Bid</th>
                    <th className="py-3 px-4 font-black text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                  {filteredAuctionItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex gap-3 items-center">
                          <button
                            type="button"
                            onClick={() => handleViewVehicleDetails(item.id)}
                            className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200/60 relative group cursor-pointer text-left"
                          >
                            {item.photoUrl ? (
                              <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            ) : (
                              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center font-bold text-gray-400">IMG</div>
                            )}
                            <span className="absolute bottom-1 right-1 bg-black/60 text-white font-mono font-bold text-[8px] px-1 rounded-sm">📷 {item.totalPhotosCount || 1}</span>
                          </button>
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => handleViewVehicleDetails(item.id)}
                              className="font-black text-gray-900 text-[13px] tracking-tight leading-tight hover:text-emerald-700 text-left cursor-pointer transition-colors"
                            >
                              {item.name}
                            </button>
                            <p className="text-[10px] text-gray-400 font-bold">{item.engine}</p>
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {item.tags.map((tag, i) => (
                                <span key={i} className={`text-[8px] font-black px-1.5 py-0.2 rounded-sm uppercase tracking-wide border ${tag.includes('Expired') || tag.includes('No') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                                  }`}>{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="space-y-0.5">
                          <p className="flex items-center gap-1 font-bold text-gray-800"><MapPin size={12} className="text-gray-400" /> <span>{item.location}</span></p>
                          <p className="text-[10px] text-gray-400 font-bold pl-4">{item.distance}</p>
                        </div>
                      </td>

                      <td className="py-4 px-2 text-right font-black text-gray-800">{item.minimumBid}</td>
                      <td className="py-4 px-2 text-right font-black text-gray-800">{item.reservePrice}</td>
                      <td className="py-4 px-2 text-right font-bold text-gray-600">+{item.bidIncrement}</td>

                      <td className="py-4 px-2 text-center">
                        <div className="inline-flex flex-col items-center">
                          <div className={`flex items-center gap-1 font-mono font-black border px-2 py-0.5 rounded-lg bg-gray-50 text-[10px] ${item.timerColor}`}>
                            <div className="w-2 h-2 rounded-full border border-current border-t-transparent animate-spin shrink-0" />
                            <span>{item.timeLeft}</span>
                          </div>
                          <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider mt-0.5">{item.status}</span>
                          <span className="text-[9px] font-bold text-gray-500 mt-0.5">{item.formattedStartTime}</span>
                        </div>
                      </td>

                      <td className="py-4 px-2 text-right">
                        <p className="font-black text-emerald-700 text-[13px]">{item.highestBid}</p>
                        <p className="text-[9px] text-gray-400 font-bold">{item.bidsCount}</p>
                      </td>

                      <td className="py-4 px-2 text-right">
                        {item.yourBid !== '-' ? (
                          <div>
                            <p className="font-black text-emerald-700 text-[13px]">{item.yourBid}</p>
                            <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-1 py-0.2 rounded-sm">{item.yourBidStatus}</span>
                          </div>
                        ) : (
                          <span className="text-gray-300 font-bold">—</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          {item.auctionType === 'LIVE' && item.rawStatus === 'DRAFT' ? (
                            <div className="w-full py-2 px-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl font-bold text-[11px] text-center">
                              Auction Starts Soon
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handlePlaceBid(item.auctionId, item.id, 1000)}
                              className="w-full bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-4 py-2 rounded-xl shadow-3xs transition-all tracking-tight cursor-pointer"
                            >
                              Place Bid
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={loadingVehicleId === item.id}
                            onClick={() => handleViewVehicleDetails(item.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            <Eye size={11} />
                            <span>{loadingVehicleId === item.id ? 'Loading...' : 'View Details'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE GRID LAYOUT LIST */}
            <div className="xl:hidden divide-y divide-gray-100">
              {filteredAuctionItems.map((item) => (
                <div key={item.id} className="p-4 space-y-4 hover:bg-gray-50/30 transition-all">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleViewVehicleDetails(item.id)}
                      className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200/50 relative cursor-pointer text-left"
                    >
                      {item.photoUrl ? (
                        <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-300 bg-gray-200">IMG</div>
                      )}
                      <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white font-mono font-bold text-[8px] px-1 rounded-xs">📷 {item.totalPhotosCount || 1}</span>
                    </button>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => handleViewVehicleDetails(item.id)}
                        className="font-black text-gray-900 text-sm tracking-tight truncate text-left hover:text-emerald-700 cursor-pointer block w-full"
                      >
                        {item.name}
                      </button>
                      <p className="text-[10px] text-gray-400 font-bold truncate">{item.engine}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.map((tag, i) => (
                          <span key={i} className={`text-[8px] font-black px-1.5 py-0.2 rounded-sm uppercase tracking-wide border ${tag.includes('Expired') || tag.includes('No') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-gray-50/60 border border-gray-100/50 p-2.5 rounded-xl text-gray-600">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1"><Calendar size={11} className="text-gray-400" /> <span>Year: <strong>{item.year}</strong></span></p>
                      <p className="flex items-center gap-1"><Fuel size={11} className="text-gray-400" /> <span>Fuel: <strong>{item.fuel}</strong></span></p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-800 flex items-start gap-1"><MapPin size={11} className="text-gray-400 shrink-0 mt-0.5" /> <span className="truncate">{item.location}</span></p>
                      <p className="text-[10px] text-gray-400 font-bold pl-4">{item.distance}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-gray-50/80 border border-gray-200/60 p-2 rounded-xl text-center">
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block">Min Bid</span>
                      <span className="font-black text-gray-800 text-[11px]">{item.minimumBid}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block">Reserve Price</span>
                      <span className="font-black text-gray-800 text-[11px]">{item.reservePrice}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block">Increment</span>
                      <span className="font-bold text-gray-600 text-[11px]">+{item.bidIncrement}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-left border-b border-gray-50 pb-2">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block">Est. Scrap Value</span>
                      <span className="font-black text-gray-900">{item.scrapValue}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 font-bold block">Highest Bid</span>
                      <span className="font-black text-emerald-700 text-sm">{item.highestBid}</span>
                      <span className="text-[9px] text-gray-400 font-bold block">{item.bidsCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex flex-col items-start">
                      <div className={`flex items-center gap-1 font-mono font-black border px-2 py-1 rounded-xl bg-gray-50 text-[10px] ${item.timerColor}`}>
                        <div className="w-1.5 h-1.5 rounded-full border border-current border-t-transparent animate-spin" />
                        <span>{item.timeLeft}</span>
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 mt-0.5">{item.status} ({item.formattedStartTime})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={loadingVehicleId === item.id}
                        onClick={() => handleViewVehicleDetails(item.id)}
                        className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold px-3 py-2 rounded-xl text-[11px] cursor-pointer transition-colors"
                      >
                        {loadingVehicleId === item.id ? 'Loading...' : 'View Details'}
                      </button>

                      {item.auctionType === 'LIVE' && item.rawStatus === 'DRAFT' ? (
                        <span className="bg-amber-50 border border-amber-200 text-amber-800 font-bold px-3 py-2 rounded-xl text-[11px]">
                          Auction Starts Soon
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePlaceBid(item.auctionId, item.id, 1000)}
                          className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-4 py-2 rounded-xl shadow-3xs transition-all text-[11px] cursor-pointer"
                        >
                          Place Bid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 5. RESPONSIVE COMPACT PAGINATION CONTROL SLAT */}
        <div className="bg-white border-t border-gray-100 px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 font-bold text-[11px]">
          <span>Showing <strong className="text-gray-800 font-black">{filteredAuctionItems.length}</strong> assigned vehicle auctions</span>

          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all disabled:opacity-40" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black bg-[#0B5B32] text-white shadow-3xs">1</button>
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 6. VEHICLE DETAILS SIDEBAR / DRAWER PORTAL */}
      {isMounted && isDrawerOpen && createPortal(
        <div
          onClick={handleCloseDrawer}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end cursor-pointer transition-opacity"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-slate-200 cursor-default overflow-hidden animate-in slide-in-from-right duration-200"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedVehicleDetails
                    ? [selectedVehicleDetails.vehicleDetails?.manufacturer, selectedVehicleDetails.vehicleDetails?.model].filter(Boolean).join(' ') || 'Vehicle Details'
                    : 'Loading Details...'}
                </h3>
                {selectedVehicleDetails && (
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    ID: {selectedVehicleDetails._id}
                  </p>
                )}
              </div>
              <button
                onClick={handleCloseDrawer}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="p-5 space-y-6 overflow-y-auto flex-1 text-xs text-slate-700">

              {isFetchingVehicle && (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                  <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 text-xs font-medium">Fetching vehicle details...</p>
                </div>
              )}

              {fetchVehicleError && !isFetchingVehicle && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
                  {fetchVehicleError}
                </div>
              )}

              {!isFetchingVehicle && selectedVehicleDetails && (
                <>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Basic Info</span>
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                      <div>
                        <div className="text-[10px] text-slate-400">Reg Number</div>
                        <div className="font-mono font-bold text-slate-800">{selectedVehicleDetails.vehicleDetails?.registrationNumber || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Mfg Year</div>
                        <div className="font-bold text-slate-800">{selectedVehicleDetails.vehicleDetails?.manufacturingYear || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Fuel Type</div>
                        <div className="font-bold text-slate-800">{selectedVehicleDetails.vehicleDetails?.fuelType || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Transmission</div>
                        <div className="font-bold text-slate-800">{selectedVehicleDetails.vehicleDetails?.transmission || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vehicle Photos</span>
                    {resolvedPhotos.length > 0 ? (
                      <div className="space-y-3">
                        <div className="bg-slate-900 rounded-lg h-52 overflow-hidden flex items-center justify-center relative border border-slate-200">
                          <img
                            src={activePhoto || resolvedPhotos[0]?.url}
                            alt="Vehicle Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {resolvedPhotos.map((p, idx) => {
                            const isSelected = (activePhoto || resolvedPhotos[0]?.url) === p.url;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActivePhoto(p.url)}
                                className={`relative aspect-square rounded-lg border overflow-hidden transition-all cursor-pointer bg-slate-100 ${isSelected ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-slate-200 hover:border-slate-400'
                                  }`}
                              >
                                <img
                                  src={p.url}
                                  alt={p.label}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-bold py-0.5 px-1 truncate text-center">
                                  {p.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg p-6 text-center text-slate-400 font-bold">
                        No vehicle photos uploaded.
                      </div>
                    )}
                  </div>

                  {selectedVehicleDetails.majorComponents && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Major Components</span>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedVehicleDetails.majorComponents).map(([key, val]) => (
                          <div key={key} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 flex justify-between items-center">
                            <span className="capitalize text-slate-500">{key}</span>
                            <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${val === 'GOOD' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedVehicleDetails.vehicleCondition && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Condition Assessment</span>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Accident History:</span>
                          <span className="font-semibold">{selectedVehicleDetails.vehicleCondition.accidentType || 'NO_ACCIDENT'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Structure Condition:</span>
                          <span className="font-semibold">{selectedVehicleDetails.vehicleCondition.structure || 'NO_DAMAGE'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}