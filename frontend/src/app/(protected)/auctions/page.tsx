'use client'

import { getAuctionData } from '@/hooks/getAuctionData';
import { getVehicle } from '@/services/vehicle.service';
import { RootState } from '@/store/store';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

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

interface Partner {
  _id?: string;
  id?: string;
  name?: string;
  companyName?: string;
  type?: string;
  rating?: number;
  location?: string;
  completedAuctions?: number;
  eligibleStatus?: string;
  status?: string;
}

interface AuctionData {
  _id: string;
  auctionId: string;
  type: string;
  status: string;
  visibility: string;
  startTime: string;
  endTime: string;
  autoExtend: boolean;
  autoExtendDuration: number;
  maxExtensions: number;
  extensionCount: number;
  totalBids: number;
  totalParticipants: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  vehicles: Array<FullVehicle | string>;
  partners: Array<Partner | string>;
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

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export default function AuctionsPage() {
  getAuctionData();

  const { auctionData } = useSelector((state: RootState) => state.admin) as { auctionData: AuctionData | AuctionData[] | null };

  const [activeTab, setActiveTab] = useState<'auctionDetails' | 'vehicles' | 'partners'>('auctionDetails');
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [selectedPartnerIds, setSelectedPartnerIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar / Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState<FullVehicle | null>(null);
  const [loadingVehicleId, setLoadingVehicleId] = useState<string | null>(null);
  const [isFetchingVehicle, setIsFetchingVehicle] = useState(false);
  const [fetchVehicleError, setFetchVehicleError] = useState<string | null>(null);

  // Resolved media state for drawer
  const [resolvedPhotos, setResolvedPhotos] = useState<{ label: string; url: string }[]>([]);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentAuction: AuctionData | null = Array.isArray(auctionData) ? auctionData[0] || null : auctionData;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Resolve Signed URLs whenever drawer vehicle changes
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

  // Document Handler
  const handleViewPDF = async (path: string, directUrl: string) => {
    if (!path && !directUrl) return;
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

  const vehiclesList: FullVehicle[] = React.useMemo(() => {
    if (!currentAuction || !Array.isArray(currentAuction.vehicles)) return [];

    return currentAuction.vehicles
      .map((v: any) => {
        if (typeof v === 'string') {
          return { _id: v, status: 'READY_FOR_BIDDING' };
        }
        if (v && typeof v === 'object') {
          const extractedId = v._id || v.id || v.vehicleId;
          return { ...v, _id: extractedId };
        }
        return null;
      })
      .filter((v): v is FullVehicle => Boolean(v && v._id && isValidObjectId(v._id)));
  }, [currentAuction]);

  const partnersList: Partner[] = (currentAuction && Array.isArray(currentAuction.partners) && typeof currentAuction.partners[0] === 'object')
    ? (currentAuction.partners as Partner[])
    : [];

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleIds(prev => prev.includes(id) ? prev.filter(vId => vId !== id) : [...prev, id]);
  };

  const handleSelectPartner = (id: string) => {
    setSelectedPartnerIds(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
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

  const handleOpenApproveModal = () => {
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleApproveAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAuction) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`/api/auction/approve/${currentAuction._id || currentAuction.auctionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'APPROVED',
          scheduledStartTime: currentAuction.startTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve auction.');
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to approve auction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVehicles = vehiclesList.filter(v => {
    const details = v.vehicleDetails || {};
    const name = `${details.manufacturer || ''} ${details.model || ''}`.toLowerCase();
    const reg = (details.registrationNumber || '').toLowerCase();
    const id = (v._id || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || reg.includes(searchQuery.toLowerCase()) || id.includes(searchQuery.toLowerCase());
  });

  const filteredPartners = partnersList.filter(p => {
    const name = (p.name || p.companyName || '').toLowerCase();
    const type = (p.type || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || type.includes(searchQuery.toLowerCase());
  });

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'N/A';
    return new Date(isoStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Process Document List for Drawer
  const rawDocs = (selectedVehicleDetails?.documents || {}) as Record<string, any>;
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
    .filter((d) => d.url || d.rawPath);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 space-y-6">

      {/* Workspace Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Auctions & Partner Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review scheduled auctions and approve them for automatic launch at start time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700">
            Vehicles: <span className="font-bold">{selectedVehicleIds.length}</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700">
            Partners: <span className="font-bold">{selectedPartnerIds.length}</span>
          </div>
          <button
            onClick={handleOpenApproveModal}
            disabled={!currentAuction || currentAuction.status === 'LIVE'}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
          >
            ✓ Approve Auction
          </button>
        </div>
      </div>

      {/* Auction Overview Cards */}
      {currentAuction && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Auction Status</div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${currentAuction.status === 'SCHEDULED' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  currentAuction.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    'bg-slate-100 text-slate-800'
                }`}>
                {currentAuction.status}
              </span>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                {currentAuction.type}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono pt-1 truncate">ID: {currentAuction.auctionId}</div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Schedule Time</div>
            <div className="text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Start:</span> {formatDate(currentAuction.startTime)}
            </div>
            <div className="text-xs text-slate-700">
              <span className="font-semibold text-slate-900">End:</span> {formatDate(currentAuction.endTime)}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bidding Metrics</div>
            <div className="flex items-center gap-4 pt-0.5">
              <div>
                <div className="text-base font-extrabold text-slate-900">{currentAuction.totalBids}</div>
                <div className="text-[10px] text-slate-500 font-medium">Total Bids</div>
              </div>
              <div className="h-6 border-r border-slate-200"></div>
              <div>
                <div className="text-base font-extrabold text-slate-900">{currentAuction.totalParticipants}</div>
                <div className="text-[10px] text-slate-500 font-medium">Participants</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Extension Settings</div>
            <div className="text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Auto Extend:</span> {currentAuction.autoExtend ? `Yes (${currentAuction.autoExtendDuration}s)` : 'No'}
            </div>
            <div className="text-xs text-slate-700">
              <span className="font-semibold text-slate-900">Extensions Used:</span> {currentAuction.extensionCount} / {currentAuction.maxExtensions}
            </div>
          </div>
        </div>
      )}

      {/* Tabs and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('auctionDetails')}
            className={`flex-1 sm:flex-initial text-xs font-bold px-4 py-2 rounded-md transition-all ${activeTab === 'auctionDetails' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Auction Overview
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex-1 sm:flex-initial text-xs font-bold px-4 py-2 rounded-md transition-all ${activeTab === 'vehicles' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Vehicles ({vehiclesList.length})
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`flex-1 sm:flex-initial text-xs font-bold px-4 py-2 rounded-md transition-all ${activeTab === 'partners' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            Partners ({partnersList.length})
          </button>
        </div>

        {activeTab !== 'auctionDetails' && (
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder={activeTab === 'vehicles' ? "Search Vehicles..." : "Search Partners..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>
        )}
      </div>

      {/* AUCTION OVERVIEW TAB */}
      {activeTab === 'auctionDetails' && currentAuction && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Metadata & Schedule Configuration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <div className="text-slate-400 text-[10px] font-semibold uppercase">Scheduled Start Time</div>
              <div className="font-bold text-emerald-700 mt-1">{formatDate(currentAuction.startTime)}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <div className="text-slate-400 text-[10px] font-semibold uppercase">Visibility</div>
              <div className="font-bold text-slate-800 mt-1">{currentAuction.visibility}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
              <div className="text-slate-400 text-[10px] font-semibold uppercase">Created By</div>
              <div className="font-mono text-slate-700 mt-1 truncate">{currentAuction.createdBy}</div>
            </div>
          </div>
        </div>
      )}

      {/* VEHICLES TAB TABLE */}
      {activeTab === 'vehicles' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th className="p-3.5 text-center w-10">Select</th>
                  <th className="p-3.5">Vehicle ID / Model</th>
                  <th className="p-3.5">Registration</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      No valid vehicles found for this auction.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => {
                    const id = vehicle._id;
                    const isSelected = selectedVehicleIds.includes(id);
                    const details = vehicle.vehicleDetails || {};
                    const pickup = vehicle.pickup || {};

                    const vehicleTitle = [details.manufacturer, details.model].filter(Boolean).join(' ') || `Vehicle (${id.slice(0, 8)}...)`;

                    return (
                      <tr key={id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-emerald-50/30' : ''}`}>
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectVehicle(id)}
                            className="h-4 w-4 text-emerald-600 rounded-sm border-slate-300 accent-emerald-600 cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-800">{vehicleTitle}</div>
                          <div className="text-[10px] font-mono text-slate-400">{id}</div>
                        </td>
                        <td className="p-3.5 font-mono font-semibold text-slate-700">
                          {details.registrationNumber || 'N/A'}
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {[pickup.area, pickup.city, pickup.state].filter(Boolean).join(', ') || 'N/A'}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${vehicle.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                            {vehicle.status || 'READY_FOR_BIDDING'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            disabled={loadingVehicleId === id}
                            onClick={() => handleViewVehicleDetails(id)}
                            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-md text-[11px] transition-colors cursor-pointer"
                          >
                            {loadingVehicleId === id ? 'Loading...' : '👁 View'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PARTNERS TAB TABLE */}
      {activeTab === 'partners' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                  <th className="p-3.5 text-center w-10">Select</th>
                  <th className="p-3.5">Partner Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Region</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPartners.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">No partner details available.</td>
                  </tr>
                ) : (
                  filteredPartners.map((partner, idx) => {
                    const id = partner._id || partner.id || `p-${idx}`;
                    const isSelected = selectedPartnerIds.includes(id);
                    return (
                      <tr key={id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectPartner(id)}
                            className="h-4 w-4 text-blue-600 rounded-sm border-slate-300 accent-blue-600 cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 font-bold text-slate-800">{partner.name || partner.companyName || 'Registered Partner'}</td>
                        <td className="p-3.5 text-slate-600">{partner.type || 'Buyer Partner'}</td>
                        <td className="p-3.5 text-slate-600">{partner.location || 'N/A'}</td>
                        <td className="p-3.5 font-bold text-amber-600">★ {partner.rating || 5.0}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {partner.eligibleStatus || partner.status || 'Verified'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VEHICLE DETAILS SIDEBAR / DRAWER */}
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
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                ✕
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
                  {/* Basic Info */}
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

                  {/* Vehicle Photos Gallery */}
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

                  {/* Documents Section */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Uploaded Documents</span>
                    {docList.length > 0 ? (
                      <div className="space-y-2">
                        {docList.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg text-xs font-medium border border-slate-200/70">
                            <span className="font-bold text-slate-800">{doc.label}</span>
                            <button
                              type="button"
                              onClick={() => handleViewPDF(doc.rawPath, doc.url || '')}
                              className="text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 transition-colors cursor-pointer"
                            >
                              👁 View Document
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-lg p-6 text-center text-slate-400 font-bold">
                        No documents uploaded.
                      </div>
                    )}
                  </div>

                  {/* Pickup Address */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pickup Location</span>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 space-y-1">
                      <div className="font-semibold text-slate-800">
                        {selectedVehicleDetails.pickup?.formattedAddress || [selectedVehicleDetails.pickup?.houseNumber, selectedVehicleDetails.pickup?.street].filter(Boolean).join(', ') || 'N/A'}
                      </div>
                      <div className="text-slate-500">
                        {[selectedVehicleDetails.pickup?.area, selectedVehicleDetails.pickup?.landmark].filter(Boolean).join(' • ')}
                      </div>
                      <div className="text-slate-500 font-medium">
                        {[selectedVehicleDetails.pickup?.city, selectedVehicleDetails.pickup?.state, selectedVehicleDetails.pickup?.pincode].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Major Components */}
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

                  {/* Vehicle Condition */}
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

      {/* APPROVE AUCTION MODAL PORTAL */}
      {isMounted && isModalOpen && createPortal(
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden cursor-default"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Approve Auction Schedule</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApproveAuction} className="p-4 space-y-4 text-xs">
              {submitError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
                  {submitError}
                </div>
              )}

              <p className="text-slate-600 leading-relaxed">
                Are you sure you want to approve this auction? It will automatically go LIVE at the designated start time.
              </p>

              {currentAuction && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Auction ID:</span>
                    <span className="font-bold text-slate-800">{currentAuction.auctionId.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scheduled Start:</span>
                    <span className="font-bold text-emerald-700">{formatDate(currentAuction.startTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scheduled End:</span>
                    <span className="font-bold text-slate-700">{formatDate(currentAuction.endTime)}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Approving...' : 'Confirm Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}