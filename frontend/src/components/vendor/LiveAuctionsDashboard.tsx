'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Gavel, Clock, Trophy, Wallet, Search,
  MapPin, Calendar, Fuel, Scale, ChevronDown, RotateCcw,
  LayoutGrid, List, Eye, X, AlertTriangle, AlertOctagon
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getPartnerAuctionData } from '@/hooks/getPartnerAuctionData';
import { getVehicle } from '@/services/vehicle.service';
import axios from 'axios';
import { placeBid } from '@/services/auction/auctionPartner.service';
import { AuctionStartedPayload, BidUpdatedPayload } from '@/socket/auction.event';
import {
  useAuctionSocket,
  useAuctionStartedSocket,
  useAuctionEndedSocket,
} from "@/socket/useAuctionSocket";

const SUPABASE_PROJECT_URL = "https://guqagldnqzyrljirupya.supabase.co";

interface AuctionEndedVehicle {
  vehicleId: string;
  finalPrice: number;
  highestBidder: string | null;
  assignedPartnerId: string | null;
  assignmentStatus: string;
}

interface AuctionEndedPayload {
  auctionId: string;
  vehicles: AuctionEndedVehicle[];
}

export const useEndAuctionSocket = (
  auctionId: string,
  onAuctionEndedCallback: (data: AuctionEndedPayload) => void,
  socketInstance?: any
) => {
  useEffect(() => {
    if (!auctionId || !socketInstance) return;

    const handleAuctionEnded = (data: AuctionEndedPayload) => {
      if (String(data?.auctionId) !== String(auctionId)) {
        return;
      }

      console.log("🏁 Auction ended:", data);
      onAuctionEndedCallback(data);
    };

    socketInstance.on("auction:ended", handleAuctionEnded);

    return () => {
      socketInstance.off("auction:ended", handleAuctionEnded);
    };
  }, [auctionId, socketInstance, onAuctionEndedCallback]);
};

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
  highestBidNum: number;
  highestBid: string;
  bidsCount: string;
  yourBid: string;
  yourBidStatus?: string;
  photoUrl?: string;
  totalPhotosCount: number;
  endTimeIso: string;
  startTimeIso: string;
  formattedStartTime: string;
  diffMs: number;
  hasStarted: boolean;
  isLive: boolean;
}

interface LiveAuctionsDashboardProps {
  loggedPartnerId?: string;
}

export default function LiveAuctionsDashboard({ loggedPartnerId }: LiveAuctionsDashboardProps) {
  getPartnerAuctionData();

  const { PartnerAuctionData } = useSelector((state: RootState) => (state as any).partner || {});
  const [loading, setLoading] = useState(true);
  const [rawAuctions, setRawAuctions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [sortBy, setSortBy] = useState<'ending_soon' | 'highest_bid_desc' | 'highest_bid_asc'>('highest_bid_desc');
  const [now, setNow] = useState(Date.now());

  const [highestBids, setHighestBids] = useState<Record<string, number>>({});

  // Drawer states
  const [isMounted, setIsMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState<FullVehicle | null>(null);
  const [loadingVehicleId, setLoadingVehicleId] = useState<string | null>(null);
  const [isFetchingVehicle, setIsFetchingVehicle] = useState(false);
  const [fetchVehicleError, setFetchVehicleError] = useState<string | null>(null);

  const [resolvedPhotos, setResolvedPhotos] = useState<{ label: string; url: string }[]>([]);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const [endedVehicles, setEndedVehicles] = useState<
    Record<string, {
      winnerId: string | null;
      finalPrice: number;
    }>
  >({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (PartnerAuctionData !== undefined && PartnerAuctionData !== null) {
      if (Array.isArray(PartnerAuctionData)) {
        setRawAuctions(PartnerAuctionData);
      } else if (typeof PartnerAuctionData === 'object' && !PartnerAuctionData.error) {
        setRawAuctions([PartnerAuctionData]);
      } else {
        setRawAuctions([]);
      }
      setLoading(false);
    }
  }, [PartnerAuctionData]);

  const handleBidUpdated = useCallback((data: BidUpdatedPayload) => {
    if (!data?.vehicleId) return;

    setHighestBids((previous) => ({
      ...previous,
      [data.vehicleId]: Number(data.currentHighestBid),
    }));
  }, []);

  const handleAuctionStarted = useCallback(
    (data: AuctionStartedPayload) => {
      if (!data?.auctionId) return;

      setRawAuctions((prev) => {
        const auctionId = String(data.auctionId);

        const existingIndex = prev.findIndex(
          (auction) =>
            String(
              auction.auctionId ||
              auction._id ||
              auction.id
            ) === auctionId
        );

        if (existingIndex !== -1) {
          return prev.map((auction, index) => {
            if (index !== existingIndex) {
              return auction;
            }

            return {
              ...auction,
              status: "LIVE",
              startTime: data.startTime,
              endTime: data.endTime,
              vehicles: data.vehicles ?? auction.vehicles,
            };
          });
        }

        return [
          ...prev,
          {
            auctionId: data.auctionId,
            status: "LIVE",
            startTime: data.startTime,
            endTime: data.endTime,
            vehicles: data.vehicles ?? [],
          },
        ];
      });
    },
    [],
  );

  const handleAuctionEnded = useCallback((data: AuctionEndedPayload) => {
    if (!data?.auctionId) return;

    console.log("🏁 Auction ended:", data);

    setRawAuctions((prev) =>
      prev.filter(
        (auction) =>
          String(
            auction.auctionId ||
            auction._id ||
            auction.id
          ) !== String(data.auctionId)
      )
    );
  }, []);

  const activeAuctionId =
    rawAuctions.find(
      (auction) => auction.status === "LIVE",
    )?.auctionId ||
    rawAuctions.find(
      (auction) => auction.status === "LIVE",
    )?._id ||
    "";

  useAuctionSocket(
    activeAuctionId,
    handleBidUpdated,
  );

  useAuctionStartedSocket(
    handleAuctionStarted,
  );

  useAuctionEndedSocket(
    handleAuctionEnded,
  );

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const submitBidApi = async (auctionId: string, vehicleId: string, amount: number) => {
    try {
      const response = await placeBid({ auctionId, vehicleId, bidAmount: amount });
      return response;
    } catch (error: any) {
      console.error("Bid Placement Error:", error);
      throw error?.response?.data || error;
    }
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
          const vId = String(vObj.vehicleId);
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
          let auctionStatus = auction.status || 'DRAFT';

          if (endedVehicles[vId]) {
            auctionStatus = 'ENDED';
          }

          const startDate = auction.startTime ? new Date(auction.startTime) : new Date();
          const endDate = auction.endTime ? new Date(auction.endTime) : new Date();

          const startTimeMs = startDate.getTime();
          const endTimeMs = endDate.getTime();

          const hasStarted = now >= startTimeMs;
          const hasEnded = now >= endTimeMs || auctionStatus === 'ENDED';

          const formattedStartTime = startDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });

          let diffMs = 0;
          let statusLabel = auctionStatus;

          if (!hasStarted) {
            diffMs = Math.max(0, startTimeMs - now);
            statusLabel = 'Starts At';
          } else {
            diffMs = Math.max(0, endTimeMs - now);
            if (auctionStatus !== 'ENDED') {
              statusLabel = 'LIVE';
            }
          }

          const hours = Math.floor(diffMs / (1000 * 60 * 60)).toString().padStart(2, '0');
          const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
          const secs = Math.floor((diffMs % (1000 * 60)) / 1000).toString().padStart(2, '0');
          const timeLeftStr = `${hours}:${mins}:${secs}`;

          let timerColor = 'text-emerald-600 border-emerald-500';
          if (!hasStarted) {
            timerColor = 'text-amber-600 border-amber-500';
          } else if (diffMs < 15 * 60 * 1000) {
            timerColor = 'text-red-600 border-red-500';
          } else if (diffMs < 30 * 60 * 1000) {
            timerColor = 'text-amber-500 border-amber-500';
          }

          const isLive = (auctionStatus === 'LIVE' || auctionStatus === 'IN_PROGRESS') && hasStarted && !hasEnded;

          const title = [details.manufacturer || details.make, details.model, details.manufacturingYear].filter(Boolean).join(' ') || `Vehicle #${vId.slice(-6)}`;
          const locationStr = [vehicleObj.district || pickup.city, vehicleObj.state || pickup.state].filter(Boolean).join(', ') || 'N/A';

          const minBidVal = vehicleObj.minimumBid;
          const reserveVal = vehicleObj.reservePrice;
          const incrementVal = vehicleObj.bidIncrement;

          const liveBidNum = endedVehicles[vId]?.finalPrice ?? (highestBids[vId] ?? Number(vehicleObj.currentHighestBid || 0));

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
            timeLeft: hasEnded ? '00:00:00' : timeLeftStr,
            status: statusLabel,
            auctionType,
            rawStatus: auctionStatus,
            timerColor,
            highestBidNum: liveBidNum,
            highestBid: liveBidNum > 0 ? `₹${liveBidNum.toLocaleString('en-IN')}` : '₹0',
            bidsCount: `${vehicleObj.totalBids || auction.totalBids || 0} bids`,
            yourBid: vehicleObj.yourBid ? `₹${vehicleObj.yourBid.toLocaleString('en-IN')}` : '-',
            yourBidStatus: vehicleObj.yourBid ? 'Your bid' : undefined,
            photoUrl: photosArray[0],
            totalPhotosCount: photosArray.length,
            endTimeIso: auction.endTime,
            startTimeIso: auction.startTime,
            formattedStartTime,
            diffMs,
            hasStarted,
            isLive,
          });
        }
      });
    });

    return formattedList;
  }, [rawAuctions, loggedPartnerId, now, highestBids, endedVehicles]);

  // RED WARNING POPUP DETECTION (5 Sec Warning)
  const active5SecAuction = useMemo(() => {
    return partnerAuctionItems.find((item) => {
      return item.hasStarted && item.diffMs > 0 && item.diffMs <= 5000;
    });
  }, [partnerAuctionItems]);

  const handlePlaceBid = async (
    auctionId: string,
    vehicleId: string,
    bidIncrement: number
  ) => {
    const targetItem = partnerAuctionItems.find(
      (item) => item.id === vehicleId
    );

    if (!targetItem) {
      alert("Vehicle not found.");
      return;
    }

    if (!targetItem.hasStarted) {
      alert(`Auction has not started yet. It starts at ${targetItem.formattedStartTime}`);
      return;
    }

    if (!targetItem.isLive) {
      alert("Auction is not live.");
      return;
    }

    if (targetItem.diffMs <= 0) {
      alert("Auction has ended.");
      return;
    }

    const amountStr = prompt(
      `Enter your bid amount for vehicle (${vehicleId}):`,
      String(bidIncrement || 1000)
    );

    if (!amountStr) return;

    const bidAmount = Number(amountStr);

    if (!Number.isFinite(bidAmount) || bidAmount <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    try {
      const response = await submitBidApi(
        auctionId,
        vehicleId,
        bidAmount
      );

      const result = response.data;
      const updatedHighestBid = result.currentVehiclePrice;

      if (updatedHighestBid == null) {
        throw new Error(
          "Server did not return updated vehicle price."
        );
      }

      setHighestBids((prev) => ({
        ...prev,
        [vehicleId]: Number(updatedHighestBid),
      }));

      alert(
        `Vehicle price is now ₹${Number(
          updatedHighestBid
        ).toLocaleString("en-IN")}`
      );
    } catch (err: any) {
      console.error("Bid failed:", err);

      alert(
        err?.message ||
        err?.response?.data?.message ||
        "Failed to place bid."
      );
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

  // FILTER & HIDE ENDED VEHICLES
  const filteredAuctionItems = useMemo(() => {
    const list = partnerAuctionItems.filter((item) => {
      // Vehicle is active only if diffMs > 0 AND status is not 'ENDED'
      const isNotEnded = item.diffMs > 0 && item.rawStatus !== 'ENDED' && item.status !== 'ENDED';
      
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFuel = selectedFuel === 'All' || item.fuel.toLowerCase() === selectedFuel.toLowerCase();
      
      return isNotEnded && matchesSearch && matchesFuel;
    });

    return list.sort((a, b) => {
      if (sortBy === 'highest_bid_desc') {
        return b.highestBidNum - a.highestBidNum;
      }
      if (sortBy === 'highest_bid_asc') {
        return a.highestBidNum - b.highestBidNum;
      }
      if (sortBy === 'ending_soon') {
        return new Date(a.endTimeIso).getTime() - new Date(b.endTimeIso).getTime();
      }
      return 0;
    });
  }, [partnerAuctionItems, searchQuery, selectedFuel, sortBy]);

  const metrics = useMemo(() => {
    const liveCount = partnerAuctionItems.filter(i => i.isLive && i.diffMs > 0).length;
    const endingSoonCount = partnerAuctionItems.filter(i => {
      const diff = new Date(i.endTimeIso).getTime() - now;
      return i.isLive && diff > 0 && diff <= 15 * 60 * 1000;
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
      {/* 5-SECOND RED ALERT POP-UP */}
      {active5SecAuction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border-2 border-red-600 rounded-2xl p-6 shadow-2xl text-center max-w-md w-full space-y-4 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-red-600 animate-pulse" />

            <div className="flex justify-center text-red-600 animate-bounce pt-2">
              <AlertOctagon size={56} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-red-600 tracking-tight uppercase">
                AUCTION ENDING SOON!
              </h2>
              <p className="text-xs font-bold text-gray-500">
                AUCTION ENDED ALERT
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 p-3 rounded-xl">
              <p className="text-sm font-black text-gray-900">
                {active5SecAuction.name}
              </p>
              <p className="text-xs text-red-700 font-semibold mt-0.5">
                Highest Bid: {active5SecAuction.highestBid}
              </p>
            </div>

            <div className="py-2">
              <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider mb-1">
                Time Remaining
              </span>
              <div className="text-6xl font-black text-red-600 font-mono tracking-widest animate-pulse">
                00:0{Math.ceil(active5SecAuction.diffMs / 1000)}
              </div>
            </div>

            <div className="bg-red-600 text-white py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wide">
              ⛔ Bidding Freezing & Auction Closing
            </div>
          </div>
        </div>
      )}

      {/* STATS OVERVIEW */}
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

      {/* FILTERS */}
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
              onClick={() => { setSearchQuery(''); setSelectedFuel('All'); setSortBy('highest_bid_desc'); }}
              className="w-full text-gray-400 hover:text-gray-600 font-bold flex items-center justify-center gap-1 text-[11px] h-[34px] border border-gray-200 rounded-xl bg-white shadow-3xs hover:bg-gray-50 cursor-pointer"
            >
              <RotateCcw size={11} /> <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="font-black text-gray-900 text-sm">
          <span className="text-emerald-700 font-black">{filteredAuctionItems.length}</span> Active Live Vehicles
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50/50 border border-gray-200 rounded-xl px-2 py-1">
            <span className="text-gray-400 font-bold text-[10px]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="font-black text-gray-700 bg-transparent text-[11px] outline-none cursor-pointer"
            >
              <option value="highest_bid_desc">Highest Bid (High to Low)</option>
              <option value="highest_bid_asc">Highest Bid (Low to High)</option>
              <option value="ending_soon">Ending Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* AUCTIONS DISPLAY SECTION */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400 font-bold text-base">
            Loading auctions...
          </div>
        ) : filteredAuctionItems.length === 0 ? (
          <div className="py-16 text-center text-gray-400 font-bold">
            No live/active vehicles available.
          </div>
        ) : (
          <>
            {/* 1. MOBILE & TABLET CARD VIEW (Visible on screens smaller than md) */}
            <div className="block md:hidden divide-y divide-gray-100 p-3 space-y-4">
              {filteredAuctionItems.map((item) => {
                const isFrozen = item.isLive && item.diffMs > 0 && item.diffMs <= 5000;
                return (
                  <div key={item.id} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-3">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleViewVehicleDetails(item.id)}
                        className="w-24 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200/60 relative group cursor-pointer text-left"
                      >
                        {item.photoUrl ? (
                          <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center font-bold text-gray-400">IMG</div>
                        )}
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white font-mono font-bold text-[8px] px-1 rounded-sm">📷 {item.totalPhotosCount || 1}</span>
                      </button>

                      <div className="space-y-1 flex-1">
                        <button
                          type="button"
                          onClick={() => handleViewVehicleDetails(item.id)}
                          className="font-black text-gray-900 text-sm hover:text-emerald-700 text-left cursor-pointer transition-colors block"
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

                    <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-lg border border-gray-100 text-[11px]">
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold block uppercase">Location</span>
                        <span className="font-bold text-gray-800">{item.location}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold block uppercase">Min / Reserve</span>
                        <span className="font-bold text-gray-800">{item.minimumBid} / {item.reservePrice}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold block uppercase">Vehicle Bid</span>
                        <span className="font-black text-emerald-700">{item.highestBid}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-bold block uppercase">Your Bid</span>
                        <span className="font-black text-emerald-700">{item.yourBid}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Timer</span>
                        <span className="text-[10px] font-bold text-gray-500">Starts: {item.formattedStartTime}</span>
                      </div>
                      <div className={`flex items-center gap-1 font-mono font-black border px-2 py-0.5 rounded-lg bg-gray-50 text-[10px] ${item.timerColor}`}>
                        <span>{item.timeLeft}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {isFrozen ? (
                        <button
                          type="button"
                          disabled
                          className="flex-1 py-2 px-3 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold text-[11px] text-center cursor-not-allowed animate-pulse"
                        >
                          Frozen (Ending)
                        </button>
                      ) : !item.hasStarted ? (
                        <button
                          type="button"
                          disabled
                          className="flex-1 py-2 px-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl font-bold text-[11px] text-center cursor-not-allowed opacity-90"
                        >
                          Scheduled
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handlePlaceBid(item.auctionId, item.id, 1000)}
                          className="flex-1 bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-4 py-2 rounded-xl shadow-3xs transition-all tracking-tight cursor-pointer"
                        >
                          Place Bid
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={loadingVehicleId === item.id}
                        onClick={() => handleViewVehicleDetails(item.id)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 font-bold text-[11px] flex items-center gap-1"
                      >
                        <Eye size={12} /> View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. DESKTOP & TABLET TABLE VIEW (Visible on screens md and larger with horizontal scroll support) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                    <th className="py-3 px-4 font-black">Vehicle Details</th>
                    <th className="py-3 px-2 font-black">Location / Area</th>
                    <th className="py-3 px-2 font-black text-right">Min Bid</th>
                    <th className="py-3 px-2 font-black text-right">Reserve Price</th>
                    <th className="py-3 px-2 font-black text-right">Increment</th>
                    <th className="py-3 px-2 font-black text-center">Time Left / Start</th>
                    <th className="py-3 px-2 font-black text-right">Vehicle Bid</th>
                    <th className="py-3 px-2 font-black text-right">Your Bid</th>
                    <th className="py-3 px-4 font-black text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                  {filteredAuctionItems.map((item) => {
                    const isFrozen = item.isLive && item.diffMs > 0 && item.diffMs <= 5000;

                    return (
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
                            <span className="text-[9px] font-bold text-gray-500 mt-0.5">Start: {item.formattedStartTime}</span>
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
                            {isFrozen ? (
                              <button
                                type="button"
                                disabled
                                className="w-full py-2 px-3 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold text-[11px] text-center cursor-not-allowed animate-pulse"
                              >
                                Frozen (Ending)
                              </button>
                            ) : !item.hasStarted ? (
                              <button
                                type="button"
                                disabled
                                className="w-full py-2 px-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl font-bold text-[11px] text-center cursor-not-allowed opacity-90"
                              >
                                Scheduled
                              </button>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="bg-white border-t border-gray-100 px-4 py-3.5 flex items-center justify-between text-gray-400 font-bold text-[11px]">
          <span>Showing <strong className="text-gray-800 font-black">{filteredAuctionItems.length}</strong> active vehicle auctions</span>
        </div>
      </div>

      {/* VEHICLE DETAILS DRAWER (PORTAL) */}
      {isMounted && isDrawerOpen && createPortal(
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={handleCloseDrawer} />
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl"><Eye size={18} /></span>
                  <div>
                    <h2 className="text-sm font-black text-gray-900">Vehicle Inspection Details</h2>
                    <p className="text-[10px] text-gray-400 font-bold">Complete condition & document breakdown</p>
                  </div>
                </div>
                <button onClick={handleCloseDrawer} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                {isFetchingVehicle ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
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
                              className={`w-16 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${activePhoto === photo.url ? 'border-emerald-600 scale-95' : 'border-transparent opacity-70'}`}
                            >
                              <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Overview Cards */}
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

                    {/* Condition Breakdown */}
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
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}