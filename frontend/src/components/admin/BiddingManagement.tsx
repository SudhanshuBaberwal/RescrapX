'use client'

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createAuction } from '@/services/auction/auction.service';
import {
  getAdminAuctionStats,
  getAdminAuctionActivity,
  getAdminAuctions,
  AdminAuctionStats,
  AdminAuctionActivity,
  AdminAuction
} from "@/services/auction/auction.service" // Adjust import path if needed

// Helper to format currency
const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Helper to calculate time remaining formatted string or status
const getRemainingTime = (endTime: string, status: string) => {
  if (status === 'CANCELLED') return { timeStr: 'Cancelled', dateStr: '' };
  if (status === 'COMPLETED') return { timeStr: 'Ended', dateStr: '' };

  const end = new Date(endTime).getTime();
  const now = new Date().getTime();
  const diff = end - now;

  const dateStr = new Date(endTime).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (diff <= 0) {
    return { timeStr: 'Ended', dateStr };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  return { timeStr: `${hStr}:${mStr}:${sStr}`, dateStr };
};

export const BiddingManagement: React.FC = () => {
  const router = useRouter();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Data States
  const [stats, setStats] = useState<AdminAuctionStats | null>(null);
  const [activities, setActivities] = useState<AdminAuctionActivity[]>([]);
  const [auctions, setAuctions] = useState<AdminAuction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    setIsMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, activityRes, auctionsRes] = await Promise.all([
        getAdminAuctionStats().catch(() => null),
        getAdminAuctionActivity().catch(() => []),
        getAdminAuctions().catch(() => [])
      ]);

      if (statsRes) setStats(statsRes);
      if (Array.isArray(activityRes)) setActivities(activityRes);
      if (Array.isArray(auctionsRes)) setAuctions(auctionsRes);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getExactNowString = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
    autoExtend: true,
  });

  const handleOpenModal = () => {
    setSubmitError(null);
    setFormData(prev => ({
      ...prev,
      startTime: getExactNowString(),
      endTime: '',
    }));
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await createAuction({
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        visibility: formData.visibility,
        autoExtend: formData.autoExtend,
      });

      const newAuctionId = response?._id || response?.id || response?.data?._id || response?.data?.id;

      if (!newAuctionId) {
        throw new Error('Auction ID not found in server response.');
      }

      setIsModalOpen(false);
      router.push(`/auctions/${newAuctionId}`);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create auction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // KPI Metrics Data Mapping
  const auctionKPIs = [
    { title: 'Live Auctions', value: stats?.liveAuctions ?? 0, change: 'Active now', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Upcoming Auctions', value: stats?.upcomingAuctions ?? 0, change: 'Scheduled', color: 'text-blue-600 bg-blue-50' },
    { title: 'Completed Today', value: stats?.completedToday ?? 0, change: 'Finished', color: 'text-purple-600 bg-purple-50' },
    { title: 'Cancelled', value: stats?.cancelled ?? 0, change: 'Total', color: 'text-orange-600 bg-orange-50' },
    { title: 'Average Bid', value: formatCurrency(stats?.averageBid), change: 'Across auctions', color: 'text-cyan-600 bg-cyan-50' },
    { title: 'Highest Bid Today', value: formatCurrency(stats?.highestBidToday), change: stats?.highestBidVehicle || 'Top Auction', color: 'text-rose-600 bg-rose-50' },
  ];

  // Filtering Logic for Auctions Table
  const filteredAuctions = auctions.filter(auction => {
    const firstVehicle = auction.vehicles?.[0]?.vehicle?.vehicleDetails;
    const vehicleName = `${firstVehicle?.manufacturer || ''} ${firstVehicle?.model || ''}`.toLowerCase();
    const auctionCode = (auction.auctionId || auction._id || '').toLowerCase();
    const regNo = (firstVehicle?.registrationNumber || '').toLowerCase();

    const matchesSearch =
      vehicleName.includes(searchTerm.toLowerCase()) ||
      auctionCode.includes(searchTerm.toLowerCase()) ||
      regNo.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || auction.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || auction.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'LIVE':
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-700';
      case 'UPCOMING':
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-700';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="w-full flex flex-col justify-between">

      {/* Dashboard Content Container */}
      <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">

        {/* Action Header Title Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Bidding Management</h2>
            <p className="text-xs text-slate-500">Monitor, create and manage all vehicle auctions across the platform.</p>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-emerald-700 shadow-xs self-start sm:self-auto shrink-0 transition-colors cursor-pointer"
          >
            + Create Auction
          </button>
        </div>

        {/* Quick Metrics KPI Counters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {auctionKPIs.map((kpi, index) => (
            <div key={index} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
              <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase truncate">{kpi.title}</span>
              <div className="mt-2">
                <div className="text-xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
                <div className={`text-[10px] inline-block mt-0.5 px-1.5 py-0.5 rounded font-medium truncate max-w-full ${kpi.color}`}>
                  {kpi.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Row */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Vehicle, Request ID, Registration No..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs outline-hidden focus:border-slate-300"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-hidden cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="LIVE">Live</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-hidden cursor-pointer"
              >
                <option value="ALL">All Types</option>
                <option value="PUBLIC">PUBLIC</option>
                <option value="PRIVATE">PRIVATE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {/* Auctions Table Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs xl:col-span-9 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                All Auctions <span className="text-slate-400 font-normal">({filteredAuctions.length})</span>
              </h3>
            </div>

            <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs text-slate-600 min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                    <th className="p-3">Vehicle Details</th>
                    <th className="p-3">Request ID</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Remaining Time</th>
                    <th className="p-3">Highest Bid</th>
                    <th className="p-3">Winning Bidder</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                        Loading auctions data...
                      </td>
                    </tr>
                  ) : filteredAuctions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                        No auctions found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredAuctions.map((auction) => {
                      const mainVehicle = auction.vehicles?.[0];
                      const details = mainVehicle?.vehicle?.vehicleDetails;
                      const pickup = mainVehicle?.vehicle?.pickup;

                      const vehicleTitle = details
                        ? `${details.manufacturer || ''} ${details.model || ''} ${details.manufacturingYear || ''}`.trim()
                        : 'Multiple Vehicles';

                      const specString = details
                        ? `${details.fuelType || 'N/A'} • ${details.transmission || 'N/A'}`
                        : `${auction.vehicles?.length || 0} Vehicle(s)`;

                      const locationStr = pickup?.city ? `${pickup.city}, ${pickup.state || ''}` : 'N/A';
                      const { timeStr, dateStr } = getRemainingTime(auction.endTime, auction.status);

                      const highestBid = mainVehicle?.currentHighestBid || mainVehicle?.winnerBid || 0;
                      const winner = mainVehicle?.assignedPartnerId || mainVehicle?.highestBidder || '—';

                      return (
                        <tr key={auction._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3">
                            <div className="font-semibold text-slate-800">{vehicleTitle || 'N/A'}</div>
                            <span className="text-[10px] text-slate-400">{specString}</span>
                          </td>
                          <td className="p-3 font-mono font-medium text-emerald-600">
                            {auction.auctionId || auction._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="p-3 text-slate-500">{locationStr}</td>
                          <td className="p-3">
                            <div className="text-red-500 font-bold">{timeStr}</div>
                            {dateStr && <span className="text-[10px] text-slate-400">{dateStr}</span>}
                          </td>
                          <td className="p-3 font-bold text-slate-900">{formatCurrency(highestBid)}</td>
                          <td className="p-3 font-medium text-slate-700 truncate max-w-[120px]">{winner}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadge(auction.status)}`}>
                              {auction.status}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => router.push(`/auctions/${auction._id}`)}
                              className="border border-slate-200 rounded-sm px-2.5 py-1 text-[11px] font-semibold hover:bg-slate-50 cursor-pointer"
                            >
                              View
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

          {/* Activity Feed Sidebar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs xl:col-span-3 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Live Activity Feed</h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">● Live</span>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No recent bidding activity.</p>
              ) : (
                activities.map((act, idx) => {
                  const partner = act.partnerName || act.companyName || 'Partner';
                  const amount = act.bidAmount || act.amount;
                  const time = new Date(act.createdAt || act.timestamp || Date.now()).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div key={act._id || idx} className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>{time}</span>
                        {amount && <span className="text-emerald-600 font-bold">{formatCurrency(amount)}</span>}
                      </div>
                      <p className="text-slate-700">
                        <span className="font-semibold text-slate-900">{partner}</span>{' '}
                        {act.message || `placed a bid on ${act.vehicleName || 'vehicle'}`}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </main>

      {/* FULL-VIEWPORT PORTAL MODAL DIALOG */}
      {isMounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">

            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Create New Auction</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAuction} className="p-4 space-y-4 text-xs">

              {submitError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
                  {submitError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  required
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  required
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Visibility
                </label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                >
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="PRIVATE">PRIVATE</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2 pb-1 border-t border-slate-100">
                <div>
                  <label htmlFor="autoExtend" className="font-semibold text-slate-700 block cursor-pointer">
                    Auto Extend
                  </label>
                  <span className="text-[10px] text-slate-400">Extends duration if bids occur near closing</span>
                </div>
                <input
                  type="checkbox"
                  id="autoExtend"
                  name="autoExtend"
                  checked={formData.autoExtend}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded-sm text-emerald-600 focus:ring-emerald-500 border-slate-300 accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? 'Creating...' : 'Create Auction'}
                </button>
              </div>

            </form>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};