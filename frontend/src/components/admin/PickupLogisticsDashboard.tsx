'use client'

import { getPickupDetailsData } from '@/hooks/getPickupDetailsData';
import { RootState } from '@/store/store';
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

// Type definitions based on MongoDB model structure
interface VehicleDetails {
  registrationNumber?: string;
  manufacturer?: string;
  model?: string;
  variant?: string;
  fuelType?: string;
  manufacturingYear?: number;
}

interface PickupLocation {
  contactName?: string;
  mobileNumber?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  scheduledAt?: string | null;
  formattedAddress?: string;
}

interface VehiclePickupItem {
  _id: string;
  owner?: string | { name?: string; phone?: string; email?: string };
  status: string;
  createdAt: string;
  vehicleDetails?: VehicleDetails;
  pickup?: PickupLocation;
  driver?: { name: string; license: string };
}

interface Driver {
  id: string;
  name: string;
  license: string;
  phone: string;
  status: 'Available' | 'On Duty';
}

const AVAILABLE_DRIVERS: Driver[] = [
  { id: '1', name: 'Vikram Singh', license: 'DL01AB1234', phone: '9876543210', status: 'Available' },
  { id: '2', name: 'Amit Kumar', license: 'HR55CD5678', phone: '9812345678', status: 'On Duty' },
  { id: '3', name: 'Ravi Pal', license: 'UP14EF6789', phone: '9871234567', status: 'Available' },
  { id: '4', name: 'Suresh Yadav', license: 'HR55GH6789', phone: '9898765432', status: 'On Duty' },
  { id: '5', name: 'Mahesh Meena', license: 'RJ14JK9012', phone: '9988776655', status: 'Available' },
];

export const PickupLogisticsDashboard: React.FC = () => {
  getPickupDetailsData();

  const { pickupDetails } = useSelector((state: RootState) => state.admin);
  const rawPickups: VehiclePickupItem[] = useMemo(
    () => (Array.isArray(pickupDetails) ? pickupDetails : []),
    [pickupDetails]
  );

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cityFilter, setCityFilter] = useState('ALL');

  // UI Selection State
  const [selectedPickup, setSelectedPickup] = useState<VehiclePickupItem | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true);
  const [assignedDriver, setAssignedDriver] = useState<string>(AVAILABLE_DRIVERS[0].name);

  // Extract unique cities dynamically from database records
  const availableCities = useMemo(() => {
    const cities = rawPickups.map((item) => item.pickup?.city).filter(Boolean);
    return Array.from(new Set(cities)) as string[];
  }, [rawPickups]);

  // Filter pickups list by search input, status, and city dropdowns
  const filteredPickups = useMemo(() => {
    return rawPickups.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicleDetails?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicleDetails?.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pickup?.contactName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchCity = cityFilter === 'ALL' || item.pickup?.city === cityFilter;

      return matchSearch && matchStatus && matchCity;
    });
  }, [rawPickups, searchTerm, statusFilter, cityFilter]);

  // Dynamic counter metrics derived from database records
  const metrics = useMemo(
    () => [
      {
        label: 'Pickup Scheduled',
        value: rawPickups.filter((i) => i.status === 'READY_FOR_PICKUP' || i.status === 'SCHEDULED').length,
        change: '+16% vs yesterday',
        isPositive: true,
      },
      {
        label: 'Driver Assigned',
        value: rawPickups.filter((i) => i.status === 'DRIVER_ASSIGNED').length,
        change: '+8% vs yesterday',
        isPositive: true,
      },
      {
        label: 'In Transit',
        value: rawPickups.filter((i) => i.status === 'IN_TRANSIT').length,
        change: '+12% vs yesterday',
        isPositive: true,
      },
      {
        label: 'Verification Pending',
        value: rawPickups.filter((i) => i.status === 'UNDER_VERIFICATION').length,
        change: '-5% vs yesterday',
        isPositive: false,
      },
      {
        label: 'Completed',
        value: rawPickups.filter((i) => i.status === 'COMPLETED' || i.status === 'SOLD').length,
        change: '+18% vs yesterday',
        isPositive: true,
      },
      {
        label: 'Cancelled',
        value: rawPickups.filter((i) => i.status === 'CANCELLED' || i.status === 'REJECTED').length,
        change: '-14% vs yesterday',
        isPositive: false,
      },
    ],
    [rawPickups]
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'READY_FOR_PICKUP':
      case 'SCHEDULED':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'DRIVER_ASSIGNED':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'IN_TRANSIT':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'UNDER_VERIFICATION':
        return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'SOLD':
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const activeItem = selectedPickup || filteredPickups[0] || rawPickups[0];

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setCityFilter('ALL');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased w-full">
      <div className="p-4 md:p-6 mx-auto max-w-[1750px] space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pickup & Logistics</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage all vehicle pickups, driver assignments and logistics operations.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-600 outline-none">
              <option>01 Jun 2025 - 02 Jun 2025</option>
            </select>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition-colors">
              + Create Pickup
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-lg shadow-xs transition-colors">
              Export ▾
            </button>
            {!isDetailsPanelOpen && activeItem && (
              <button
                onClick={() => setIsDetailsPanelOpen(true)}
                className="bg-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-xs"
              >
                👁️ View Details
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {metrics.map((m, i) => (
            <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{m.label}</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900">{m.value}</span>
                <span className={`text-[10px] font-bold px-1 rounded ${m.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                  {m.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {/* Left Container */}
          <div className={`${isDetailsPanelOpen ? 'xl:col-span-8' : 'xl:col-span-12'} space-y-6 transition-all`}>

            {/* Filter Controls Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="flex flex-col gap-1 lg:col-span-2">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Request ID, Vehicle, Customer..."
                    className="bg-white border border-slate-200 rounded-lg p-2 outline-none w-full"
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
                    <option value="READY_FOR_PICKUP">Ready For Pickup</option>
                    <option value="DRIVER_ASSIGNED">Driver Assigned</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">City</label>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"
                  >
                    <option value="ALL">All Cities</option>
                    {availableCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-1 col-span-2 sm:col-span-1 lg:col-span-2">
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2 rounded-lg transition-colors">
                    More Filters
                  </button>
                  <button onClick={handleResetFilters} className="text-slate-400 hover:text-slate-600 font-bold p-2">
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Pickups Table */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  All Pickups ({filteredPickups.length})
                </h3>
              </div>

              <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600 min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="p-3">Pickup ID</th>
                      <th className="p-3">Request ID</th>
                      <th className="p-3">Vehicle</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Pickup Location</th>
                      <th className="p-3">Pickup Date & Time</th>
                      <th className="p-3">Driver</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPickups.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400 font-medium">
                          No pickups match the selected criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredPickups.map((row) => {
                        const pickupId = `PU${row._id.slice(-6).toUpperCase()}`;
                        const reqId = `RX${row._id.slice(0, 8).toUpperCase()}`;
                        const customerName = row.pickup?.contactName || (typeof row.owner === 'object' ? row.owner?.name : 'Customer');
                        const phone = row.pickup?.mobileNumber || (typeof row.owner === 'object' ? row.owner?.phone : 'N/A');
                        const dateFormatted = row.pickup?.scheduledAt
                          ? new Date(row.pickup.scheduledAt).toLocaleString()
                          : new Date(row.createdAt).toLocaleString();

                        return (
                          <tr key={row._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-900">{pickupId}</td>
                            <td className="p-3 font-mono text-slate-400">{reqId}</td>
                            <td className="p-3">
                              <div className="font-bold text-slate-800">
                                {row.vehicleDetails?.manufacturer || ''} {row.vehicleDetails?.model || 'Vehicle'} {row.vehicleDetails?.manufacturingYear || ''}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">{row.vehicleDetails?.registrationNumber || 'N/A'}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-slate-700">{customerName}</div>
                              <div className="text-[10px] text-slate-400">{phone}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-slate-700">{row.pickup?.area || 'N/A'}</div>
                              <div className="text-[10px] text-slate-400">{row.pickup?.city || ''}{row.pickup?.state ? `, ${row.pickup.state}` : ''}</div>
                            </td>
                            <td className="p-3 font-medium text-slate-700">{dateFormatted}</td>
                            <td className="p-3">
                              <div className="font-bold text-slate-800">{assignedDriver}</div>
                              <div className="text-[10px] font-mono text-slate-400">DL01AB1234</div>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(row.status)}`}>
                                {row.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => {
                                    setSelectedPickup(row);
                                    setIsDetailsPanelOpen(true);
                                  }}
                                  className="border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 px-2 py-1 rounded font-medium text-[11px]"
                                >
                                  View
                                </button>
                                <button className="text-slate-400 text-sm px-1">⋮</button>
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

            {/* Bottom Logistics Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Box A: Quick Driver Assignment */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Driver Assignment</h4>
                  <p className="text-[11px] text-slate-400">Issue driver from the driver list for this pickup.</p>

                  <div className="flex flex-col gap-1 text-xs pt-1">
                    <label className="font-bold text-slate-500">Select Driver</label>
                    <select
                      value={assignedDriver}
                      onChange={(e) => setAssignedDriver(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium outline-none text-slate-700"
                    >
                      {AVAILABLE_DRIVERS.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} ({d.license})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button className="text-emerald-600 hover:underline font-bold text-[11px] block">View Driver List</button>

                  <div className="bg-emerald-50/60 text-emerald-800 text-[11px] p-3 rounded-lg border border-emerald-100/50 leading-relaxed">
                    ℹ️ Driver will receive pickup details and customer contact parameters once finalized.
                  </div>
                </div>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg shadow-xs transition-colors">
                  Assign Driver
                </button>
              </div>

              {/* Box B: Driver Roster List */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Driver List</h4>
                  <button className="text-emerald-600 hover:underline text-[11px] font-bold">View All Drivers</button>
                </div>
                <div className="divide-y divide-slate-50 max-h-[220px] overflow-y-auto pr-1 space-y-2">
                  {AVAILABLE_DRIVERS.map((drv) => (
                    <div key={drv.id} className="flex items-center justify-between text-xs pt-2 first:pt-0">
                      <div>
                        <p className="font-bold text-slate-800">{drv.name}</p>
                        <span className="text-[10px] font-mono text-slate-400">{drv.license} • {drv.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase px-1 rounded ${drv.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-600'}`}>
                          {drv.status}
                        </span>
                        <button
                          onClick={() => setAssignedDriver(drv.name)}
                          className="text-emerald-600 hover:bg-emerald-50 font-bold border border-slate-200 px-1.5 py-0.5 rounded text-[10px]"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box C: Live Map Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pickup Map</h4>

                <div className="bg-slate-100 h-28 rounded-lg relative overflow-hidden flex flex-col justify-between p-3 border border-slate-200">
                  <div className="bg-white/90 backdrop-blur-xs p-1 px-2 rounded shadow-xs text-[9px] max-w-[130px]">
                    <span className="text-slate-400 uppercase font-bold block">Pickup Location</span>
                    <span className="font-bold text-slate-700 truncate block">
                      {activeItem?.pickup?.area || 'Rohini, Delhi'}
                    </span>
                  </div>
                  <div className="absolute right-3 bottom-3 bg-emerald-900 text-white p-1 px-2 rounded text-[9px]">
                    <span className="block font-bold">Green Auto RVSF</span>
                  </div>
                  <div className="absolute inset-x-10 top-1/2 h-1 border-t-2 border-dashed border-blue-500 transform -rotate-12" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Distance</span>
                    <span className="font-black text-slate-900">32.4 km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">ETA</span>
                    <span className="font-black text-slate-900">1 hr 10 mins</span>
                  </div>
                </div>
                <button className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-1.5 rounded-lg transition-colors text-center block">
                  Open in Maps
                </button>
              </div>

            </div>

          </div>

          {/* Right Details Drawer Sidebar */}
          {isDetailsPanelOpen && activeItem && (
            <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-5 sticky top-6 relative">
              <button
                onClick={() => setIsDetailsPanelOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>

              {/* Sidebar Header */}
              <div className="border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Pickup Details</h3>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getStatusStyle(activeItem.status)}`}>
                    {activeItem.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2.5 text-[10px] font-mono text-slate-400">
                  <div>PICKUP ID <span className="block text-slate-800 font-bold mt-0.5">PU{activeItem._id.slice(-6).toUpperCase()}</span></div>
                  <div>REQUEST ID <span className="block text-slate-800 font-bold mt-0.5">RX{activeItem._id.slice(0, 8).toUpperCase()}</span></div>
                </div>
              </div>

              {/* Vehicle & Customer Snippet */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vehicle & Customer</span>
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center text-lg shadow-xs">🚗</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-900 truncate">
                      {activeItem.vehicleDetails?.manufacturer || ''} {activeItem.vehicleDetails?.model || 'Vehicle'} {activeItem.vehicleDetails?.manufacturingYear || ''}
                    </p>
                    <span className="text-[10px] font-mono font-bold text-slate-500 block">
                      {activeItem.vehicleDetails?.registrationNumber || 'N/A'} • Petrol
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-slate-700 text-[11px]">
                      {activeItem.pickup?.contactName || (typeof activeItem.owner === 'object' ? activeItem.owner?.name : 'Customer')}
                    </p>
                    <span className="text-[10px] text-slate-400 block">
                      {activeItem.pickup?.mobileNumber || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pickup Information */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pickup Information</span>
                <div className="space-y-2.5 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-slate-400">📍 Pickup Location</span>
                    <span className="font-medium text-slate-800 text-right">
                      {[activeItem.pickup?.area, activeItem.pickup?.city, activeItem.pickup?.state].filter(Boolean).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">📅 Pickup Date & Time</span>
                    <span className="font-bold text-slate-800">
                      {activeItem.pickup?.scheduledAt
                        ? new Date(activeItem.pickup.scheduledAt).toLocaleString()
                        : new Date(activeItem.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">🔧 Vehicle Condition</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-1 rounded">Drivable</span>
                  </div>
                  <div className="flex justify-between items-start gap-2 border-t border-slate-100 pt-2">
                    <span className="text-slate-400">📝 Instructions</span>
                    <span className="text-slate-600 text-right text-[11px] font-medium">Customer available till 6 PM.</span>
                  </div>
                </div>
              </div>

              {/* Logistics Assignment Status */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Logistics Assignment</span>
                <div className="space-y-2 border border-slate-200 rounded-lg p-2.5 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Driver</span>
                      <span className="font-bold text-slate-800 text-[11px]">{assignedDriver}</span>
                    </div>
                    <button className="text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors">
                      Assign Driver
                    </button>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Pickup Vehicle</span>
                      <span className="font-bold text-rose-600 text-[11px]">Not Assigned</span>
                    </div>
                    <button className="text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors">
                      Assign Vehicle
                    </button>
                  </div>
                </div>
              </div>

              {/* Financial Charges */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Charges (Entered by Admin)</span>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Pickup Charge (₹)</span>
                    <span className="text-sm font-black text-slate-900">2,500</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Documentation Charge (₹)</span>
                    <span className="text-sm font-black text-slate-900">500</span>
                  </div>
                </div>
              </div>

              {/* Process Timeline */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Timeline</span>
                <div className="space-y-4 pl-3 relative before:absolute before:left-[3px] before:top-1 before:bottom-1 before:w-0.5 before:bg-slate-100 text-[11px]">
                  <div className="relative">
                    <span className="absolute -left-[15px] top-0.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <p className="font-bold text-slate-800">Pickup Scheduled</p>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(activeItem.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[15px] top-0.5 w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <p className="font-medium text-slate-400">Pending Driver Assignment</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[15px] top-0.5 w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <p className="font-medium text-slate-400">Pending Pickup</p>
                  </div>
                </div>
              </div>

              {/* Sidebar Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 rounded-lg shadow-xs text-center transition-all">
                  Save Changes
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs py-2 rounded-lg text-center transition-colors">
                    Edit Pickup
                  </button>
                  <button className="border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs py-2 rounded-lg text-center transition-colors">
                    Cancel Pickup
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};