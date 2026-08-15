'use client'

import { getPickupDetailsData } from '@/hooks/getPickupDetailsData';
import { RootState } from '@/store/store';
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { drivers } from '../drivers/drivers';
import { assignDriver, schedulePickup } from '@/services/vehicle.service';

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
  assignedDriver?: string;
}

export const PickupLogisticsDashboard: React.FC = () => {
  getPickupDetailsData();

  const { pickupDetails } = useSelector((state: RootState) => state.admin);

  // Map exported drivers dictionary to an array for UI loops
  const driverEntries = useMemo(() => {
    return Object.entries(drivers).map(([name, phone], index) => ({
      id: String(index + 1),
      name,
      phone,
      status: index % 2 === 0 ? ('Available' as const) : ('On Duty' as const),
    }));
  }, []);

  // Filter ONLY vehicles in active logistics statuses
  const readyForPickupList: VehiclePickupItem[] = useMemo(() => {
    if (!Array.isArray(pickupDetails)) return [];
    return pickupDetails.filter(
      (item) =>
        item.status === 'READY_FOR_PICKUP' ||
        item.status === 'SCHEDULED' ||
        item.status === 'DRIVER_ASSIGNED'
    );
  }, [pickupDetails]);

  // Track driver assignments individually per pickup ID
  const [assignedDrivers, setAssignedDrivers] = useState<Record<string, string>>({});

  // UI state management
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [selectedPickup, setSelectedPickup] = useState<VehiclePickupItem | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true);

  // Form state for active pickup sidebar
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [scheduledDateTime, setScheduledDateTime] = useState<string>('');
  const [pickupCharge, setPickupCharge] = useState<number>(2500);
  const [docCharge, setDocCharge] = useState<number>(500);
  const [isScheduling, setIsScheduling] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const activeItem = selectedPickup || readyForPickupList[0];

  // Synchronize driver selections and scheduled time for active item
  useEffect(() => {
    if (activeItem) {
      const currentDriver =
        assignedDrivers[activeItem._id] ||
        activeItem.assignedDriver ||
        driverEntries[0]?.name ||
        'Unassigned';

      setSelectedDriver(currentDriver);

      if (activeItem.pickup?.scheduledAt) {
        const dateObj = new Date(activeItem.pickup.scheduledAt);
        setScheduledDateTime(dateObj.toISOString().slice(0, 16));
      } else {
        const defaultDate = new Date(activeItem.createdAt);
        setScheduledDateTime(defaultDate.toISOString().slice(0, 16));
      }
    }
  }, [activeItem, assignedDrivers, driverEntries]);

  const filteredPickups = useMemo(() => {
    return readyForPickupList.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicleDetails?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicleDetails?.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pickup?.contactName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCity = cityFilter === 'ALL' || item.pickup?.city === cityFilter;
      return matchSearch && matchCity;
    });
  }, [readyForPickupList, searchTerm, cityFilter]);

  const availableCities = useMemo(() => {
    const cities = readyForPickupList.map((item) => item.pickup?.city).filter(Boolean);
    return Array.from(new Set(cities)) as string[];
  }, [readyForPickupList]);

  // Handlers for distinct API actions
  const handleSchedulePickup = async () => {
    if (!activeItem?._id || !scheduledDateTime) return;
    setIsScheduling(true);
    try {
      await schedulePickup(activeItem._id, scheduledDateTime, pickupCharge, docCharge);
      alert('Pickup scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule pickup:', error);
      alert('Failed to schedule pickup.');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleAssignDriver = async () => {
    if (!activeItem?._id || !selectedDriver) return;
    setIsAssigning(true);
    try {
      await assignDriver(activeItem._id, selectedDriver);
      setAssignedDrivers((prev) => ({
        ...prev,
        [activeItem._id]: selectedDriver,
      }));
      alert(`Driver ${selectedDriver} assigned successfully!`);
    } catch (error) {
      console.error('Failed to assign driver:', error);
      alert('Failed to assign driver.');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased w-full">
      <div className="p-4 md:p-6 mx-auto max-w-[1750px] space-y-6">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pickup & Logistics</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage ready vehicles, schedule pickup dates, and assign drivers.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Ready For Pickup</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900">{readyForPickupList.length}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">+10% vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {/* Left Table & Roster */}
          <div className={`${isDetailsPanelOpen ? 'xl:col-span-8' : 'xl:col-span-12'} space-y-6 transition-all`}>

            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="flex flex-col gap-1 sm:col-span-2">
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
                  <select disabled className="bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-600 outline-none cursor-not-allowed">
                    <option>Ready / Scheduled / Assigned</option>
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
                    {availableCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pickups Table */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                ALL PICKUPS ({filteredPickups.length})
              </h3>

              <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600 min-w-250">
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
                          No matching vehicles found.
                        </td>
                      </tr>
                    ) : (
                      filteredPickups.map((row) => {
                        const isSelected = activeItem?._id === row._id;
                        const pickupId = `PU${row._id.slice(-6).toUpperCase()}`;
                        const reqId = `RX${row._id.slice(0, 8).toUpperCase()}`;
                        const customerName = row.pickup?.contactName || (typeof row.owner === 'object' ? row.owner?.name : 'Customer');
                        const rowDriver = assignedDrivers[row._id] || row.assignedDriver || 'Unassigned';

                        return (
                          <tr
                            key={row._id}
                            className={`transition-colors ${isSelected ? 'bg-blue-100/50' : 'hover:bg-slate-50/50'}`}
                          >
                            <td className="p-3 font-mono font-bold text-slate-900">{pickupId}</td>
                            <td className="p-3 font-mono text-slate-400">{reqId}</td>
                            <td className="p-3">
                              <div className="font-bold text-slate-800">
                                {row.vehicleDetails?.model || 'Vehicle'} {row.vehicleDetails?.manufacturingYear || ''}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">{row.vehicleDetails?.registrationNumber || 'N/A'}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-slate-700">{customerName}</div>
                              <div className="text-[10px] text-slate-400">{row.pickup?.mobileNumber || 'N/A'}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-slate-700">{row.pickup?.area || 'IITDWD'}</div>
                              <div className="text-[10px] text-slate-400">{row.pickup?.city || 'Dharwad'}, {row.pickup?.state || 'Karnataka'}</div>
                            </td>
                            <td className="p-3 font-medium text-slate-700">
                              {row.pickup?.scheduledAt
                                ? new Date(row.pickup.scheduledAt).toLocaleString()
                                : new Date(row.createdAt).toLocaleString()}
                            </td>
                            <td className="p-3 font-bold text-slate-800">
                              {rowDriver}
                            </td>
                            <td className="p-3 text-center">
                              {(() => {
                                switch (row.status) {
                                  case 'READY_FOR_PICKUP':
                                    return (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200/80 inline-flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        READY FOR PICKUP
                                      </span>
                                    );
                                  case 'SCHEDULED':
                                    return (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-sky-50 text-sky-700 border-sky-200/80 inline-flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                        SCHEDULED
                                      </span>
                                    );
                                  case 'DRIVER_ASSIGNED':
                                    return (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200/80 inline-flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        DRIVER ASSIGNED
                                      </span>
                                    );
                                  default:
                                    return (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-slate-50 text-slate-600 border-slate-200 inline-flex items-center gap-1">
                                        {row.status?.replace(/_/g, ' ') || 'UNKNOWN'}
                                      </span>
                                    );
                                }
                              })()}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  setSelectedPickup(row);
                                  setIsDetailsPanelOpen(true);
                                }}
                                className="border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 px-2.5 py-1 rounded font-medium text-[11px]"
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

            {/* Bottom Driver Roster Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Assignment Form */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Driver Assignment</h4>
                  <p className="text-[11px] text-slate-400">Select a driver from the roster for this pickup.</p>

                  <div className="flex flex-col gap-1 text-xs">
                    <label className="font-bold text-slate-500">Select Driver</label>
                    <select
                      value={selectedDriver}
                      onChange={(e) => setSelectedDriver(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium outline-none text-slate-700"
                    >
                      {driverEntries.map((drv) => (
                        <option key={drv.id} value={drv.name}>
                          {drv.name} ({drv.phone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-emerald-50/60 text-emerald-800 text-[11px] p-3 rounded-lg border border-emerald-100/50">
                    ℹ️ Selected driver will receive complete pickup location parameters upon saving.
                  </div>
                </div>
                <button
                  onClick={handleAssignDriver}
                  disabled={isAssigning || activeItem?.status === 'DRIVER_ASSIGNED'}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {isAssigning ? 'Assigning...' : 'Assign Driver'}
                </button>
              </div>

              {/* Roster List */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Driver List</h4>
                  <button className="text-emerald-600 text-[11px] font-bold">View All</button>
                </div>
                <div className="divide-y divide-slate-50 max-h-[220px] overflow-y-auto pr-1 space-y-2">
                  {driverEntries.map((drv) => (
                    <div key={drv.id} className="flex items-center justify-between text-xs pt-2 first:pt-0">
                      <div>
                        <p className="font-bold text-slate-800">{drv.name}</p>
                        <span className="text-[10px] font-mono text-slate-400">{drv.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase px-1 rounded ${drv.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-600'}`}>
                          {drv.status}
                        </span>
                        <button
                          onClick={() => setSelectedDriver(drv.name)}
                          className="text-emerald-600 border border-slate-200 hover:bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pickup Map Placeholder */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pickup Map</h4>
                <div className="bg-slate-100 h-28 rounded-lg relative flex flex-col justify-between p-3 border border-slate-200">
                  <div className="bg-white/90 p-1 px-2 rounded text-[9px] max-w-[140px]">
                    <span className="text-slate-400 font-bold block">LOCATION</span>
                    <span className="font-bold text-slate-700 truncate block">{activeItem?.pickup?.area || 'IITDWD'}</span>
                  </div>
                  <div className="absolute right-3 bottom-3 bg-emerald-900 text-white p-1 px-2 rounded text-[9px] font-bold">
                    Green Auto RVSF
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Distance</span>
                    <span className="font-black text-slate-900">32.4 km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">ETA</span>
                    <span className="font-black text-slate-900">1 hr 10 mins</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Panel - Dynamic Details & Action Sidebar */}
          {isDetailsPanelOpen && activeItem && (
            <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-5 sticky top-6 relative">
              <button
                onClick={() => setIsDetailsPanelOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>

              <div className="border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Pickup Details</h3>
                  {(() => {
                    switch (activeItem.status) {
                      case 'READY_FOR_PICKUP':
                        return (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-200">
                            READY FOR PICKUP
                          </span>
                        );
                      case 'SCHEDULED':
                        return (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-sky-50 text-sky-700 border-sky-200">
                            SCHEDULED
                          </span>
                        );
                      case 'DRIVER_ASSIGNED':
                        return (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">
                            DRIVER ASSIGNED
                          </span>
                        );
                      default:
                        return null;
                    }
                  })()}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2.5 text-[10px] font-mono text-slate-400">
                  <div>PICKUP ID <span className="block text-slate-800 font-bold">PU{activeItem._id.slice(-6).toUpperCase()}</span></div>
                  <div>REQUEST ID <span className="block text-slate-800 font-bold">RX{activeItem._id.slice(0, 8).toUpperCase()}</span></div>
                </div>
              </div>

              {/* Vehicle & Customer Info */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vehicle & Customer</span>
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center text-lg">🚗</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-900 truncate">
                      {activeItem.vehicleDetails?.model || 'Swift'} {activeItem.vehicleDetails?.manufacturingYear || '2018'}
                    </p>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      {activeItem.vehicleDetails?.registrationNumber || 'N/A'} • Petrol
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-slate-700 text-[11px]">
                      {activeItem.pickup?.contactName || 'Sudhan'}
                    </p>
                    <span className="text-[10px] text-slate-400 block">{activeItem.pickup?.mobileNumber || '7568248007'}</span>
                  </div>
                </div>
              </div>

              {/* Pickup Information */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pickup Information</span>
                <div className="space-y-3 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-slate-400">📍 Location</span>
                    <span className="font-medium text-slate-800 text-right">
                      {activeItem.pickup?.area || 'IITDWD'}, {activeItem.pickup?.city || 'Dharwad'}, {activeItem.pickup?.state || 'Karnataka'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 border-t border-slate-100 pt-2">
                    <label className="text-slate-400 font-bold text-[10px] uppercase">📅 Pickup Date & Time</label>
                    <input
                      type="datetime-local"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      className="bg-white border border-slate-200 rounded p-1.5 font-bold text-slate-800 outline-none text-xs"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">🔧 Condition</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-1 rounded">Drivable</span>
                  </div>
                </div>
              </div>

              {/* Logistics Assignment */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Logistics Assignment</span>
                <div className="space-y-2 border border-slate-200 rounded-lg p-2.5 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Assigned Driver</span>
                      <span className="font-bold text-slate-800 text-xs block">{selectedDriver}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {drivers[selectedDriver as keyof typeof drivers] || ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charges */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Charges (Entered by Admin)</span>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <label className="text-slate-400 text-[10px] block">Pickup Charge (₹)</label>
                    <input
                      type="number"
                      value={pickupCharge}
                      onChange={(e) => setPickupCharge(Number(e.target.value))}
                      className="text-sm font-black text-slate-900 bg-white border border-slate-200 rounded p-1 w-full mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[10px] block">Doc Charge (₹)</label>
                    <input
                      type="number"
                      value={docCharge}
                      onChange={(e) => setDocCharge(Number(e.target.value))}
                      className="text-sm font-black text-slate-900 bg-white border border-slate-200 rounded p-1 w-full mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Action Buttons based on Status */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {activeItem.status === 'READY_FOR_PICKUP' && (
                  <button
                    onClick={handleSchedulePickup}
                    disabled={isScheduling}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-2.5 rounded-lg shadow-xs text-center transition-all disabled:opacity-50"
                  >
                    {isScheduling ? 'Scheduling...' : 'Schedule Pickup'}
                  </button>
                )}

                {activeItem.status === 'SCHEDULED' && (
                  <button
                    onClick={handleAssignDriver}
                    disabled={isAssigning}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 rounded-lg shadow-xs text-center transition-all disabled:opacity-50"
                  >
                    {isAssigning ? 'Assigning...' : 'Assign Driver'}
                  </button>
                )}

                {activeItem.status === 'DRIVER_ASSIGNED' && (
                  <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-center py-2.5 rounded-lg text-xs font-bold">
                    ✓ Pickup Scheduled & Driver Assigned
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button className="border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs py-2 rounded-lg text-center">
                    Edit Pickup
                  </button>
                  <button className="border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs py-2 rounded-lg text-center">
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