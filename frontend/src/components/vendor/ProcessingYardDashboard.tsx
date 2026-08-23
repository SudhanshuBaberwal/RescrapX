'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Building2, Wrench, Ban, RefreshCw, CheckCircle2,
  Search, SlidersHorizontal, RotateCcw, ChevronDown,
  ChevronLeft, ChevronRight, MoreVertical, Calendar,
  Car, ArrowRight, Check
} from 'lucide-react';
import { getProcessingYardData } from '@/hooks/getPartnerProcessingYardData';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { changeProcessingStage, processingVehicleStates } from '@/services/vehicle.service';
import { ProcessingStage } from '@/context/vehicleProvider';
import { useToast } from '@/lib/ui/toast/ToastContext';

interface VehicleRecord {
  vehicleId: string;
  status: string;
  processingStage: string;
  createdAt: string;
  updatedAt: string;
  vehicleDetails?: {
    carName?: string;
    model?: string;
    variant?: string;
    fuelType?: string;
    ownership?: string;
  };
  pickup?: {
    city?: string;
    state?: string;
    formattedAddress?: string;
  };
}

// Strictly ordered stage transition mapping
const STAGE_ORDER: ProcessingStage[] = [
  'WAITING_FOR_ARRIVAL' as ProcessingStage,
  'VEHICLE_RECEIVED' as ProcessingStage,
  'INSPECTION_COMPLETED' as ProcessingStage,
  'DISMANTLING' as ProcessingStage,
  'RECYCLING' as ProcessingStage,
  'CERTIFICATE_PENDING' as ProcessingStage,
  'COMPLETED' as ProcessingStage,
];

export default function ProcessingYardDashboard() {
  getProcessingYardData();

  const { showToast } = useToast()

  const [statsData, setStatsData] = useState({
    waitingForArrival: 0,
    vehicleReceived: 0,
    inspectionCompleted: 0,
    dismantling: 0,
    recycling: 0,
    certificatePending: 0,
    completed: 0,
  });

  const [updatingVehicleId, setUpdatingVehicleId] = useState<string | null>(null);

  const { PartnerProcessingYardVehiclesData } = useSelector(
    (state: RootState) => state.partner
  );

  const [searchQuery, setSearchQuery] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      const res = await processingVehicleStates();
      if (res?.success && res?.data) {
        setStatsData(res.data);
      } else if (res) {
        setStatsData(res);
      }
    } catch (err) {
      console.error('Failed to fetch processing stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const totalInProcessing = useMemo(() => {
    return Object.values(statsData).reduce((sum, val) => sum + (val || 0), 0);
  }, [statsData]);

  const summaryCards = [
    { title: 'Total in Processing', value: totalInProcessing, unit: 'Vehicles', icon: Building2, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { title: 'Inspection Completed', value: statsData.inspectionCompleted || 0, unit: 'Vehicles', icon: Wrench, color: 'text-blue-700 bg-blue-50 border-blue-100' },
    { title: 'Dismantling in Progress', value: statsData.dismantling || 0, unit: 'Vehicles', icon: Ban, color: 'text-purple-700 bg-purple-50 border-purple-100' },
    { title: 'Recycling in Progress', value: statsData.recycling || 0, unit: 'Vehicles', icon: RefreshCw, color: 'text-amber-700 bg-amber-50 border-amber-100' },
    { title: 'Completed Today', value: statsData.completed || 0, unit: 'Vehicles', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' }
  ];

  const processingStages = [
    { step: 1, label: 'Waiting for Arrival', count: statsData.waitingForArrival || 0, color: 'border-emerald-600 bg-emerald-50 text-emerald-700' },
    { step: 2, label: 'Vehicle Received', count: statsData.vehicleReceived || 0, color: 'border-blue-600 bg-blue-50 text-blue-700' },
    { step: 3, label: 'Inspection Completed', count: statsData.inspectionCompleted || 0, color: 'border-amber-500 bg-amber-50 text-amber-700' },
    { step: 4, label: 'Dismantling', count: statsData.dismantling || 0, color: 'border-purple-600 bg-purple-50 text-purple-700' },
    { step: 5, label: 'Recycling', count: statsData.recycling || 0, color: 'border-teal-600 bg-teal-50 text-teal-700' },
    { step: 6, label: 'Certificate Pending', count: statsData.certificatePending || 0, color: 'border-gray-400 bg-gray-50 text-gray-700' },
    { step: 7, label: 'Completed', count: statsData.completed || 0, color: 'border-emerald-600 bg-emerald-50 text-emerald-700' }
  ];

  const getStageBadgeStyle = (stageKey?: string) => {
    switch (stageKey) {
      case 'WAITING_FOR_ARRIVAL':
        return { tag: 'Waiting for Arrival', sub: 'In transit', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      case 'VEHICLE_RECEIVED':
        return { tag: 'Vehicle Received', sub: 'At facility', color: 'bg-blue-50 text-blue-700 border-blue-100' };
      case 'INSPECTION_COMPLETED':
        return { tag: 'Inspection Completed', sub: 'Ready for dismantling', color: 'bg-amber-50 text-amber-700 border-amber-100' };
      case 'DISMANTLING':
        return { tag: 'Dismantling', sub: 'In progress', color: 'bg-purple-50 text-purple-700 border-purple-100' };
      case 'RECYCLING':
        return { tag: 'Recycling', sub: 'In progress', color: 'bg-teal-50 text-teal-700 border-teal-100' };
      case 'CERTIFICATE_PENDING':
        return { tag: 'Certificate Pending', sub: 'CoD pending', color: 'bg-amber-50 text-amber-700 border-amber-100' };
      case 'COMPLETED':
        return { tag: 'Completed', sub: 'Scrapping completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      default:
        return { tag: stageKey?.replace(/_/g, ' ') || 'Active', sub: 'In progress', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    }
  };

  const getNextStepInfo = (stageKey?: string) => {
    switch (stageKey) {
      case 'WAITING_FOR_ARRIVAL':
        return { actionLabel: 'Mark Received', title: 'Receive Vehicle', desc: 'Confirm gate arrival', nextStage: STAGE_ORDER[1] };
      case 'VEHICLE_RECEIVED':
        return { actionLabel: 'Complete Inspection', title: 'Inspection', desc: 'Schedule technical inspection', nextStage: STAGE_ORDER[2] };
      case 'INSPECTION_COMPLETED':
        return { actionLabel: 'Start Dismantling', title: 'Dismantling', desc: 'Start dismantling process', nextStage: STAGE_ORDER[3] };
      case 'DISMANTLING':
        return { actionLabel: 'Start Recycling', title: 'Recycling', desc: 'Proceed to recycling', nextStage: STAGE_ORDER[4] };
      case 'RECYCLING':
        return { actionLabel: 'Request CoD', title: 'CoD Generation', desc: 'Generate CoD Certificate', nextStage: STAGE_ORDER[5] };
      case 'CERTIFICATE_PENDING':
        return { actionLabel: 'Upload CoD & Complete', title: 'Upload CoD', desc: 'Upload certificate document', nextStage: STAGE_ORDER[6] };
      case 'COMPLETED':
        return { actionLabel: 'Completed', title: 'Finished', desc: 'Process Completed', nextStage: null };
      default:
        return { actionLabel: 'Advance Step', title: 'Update Stage', desc: 'Move to next stage', nextStage: STAGE_ORDER[1] };
    }
  };

  const handleAdvanceStep = async (vehicleId: string, currentStage?: string) => {
    const nextStepInfo = getNextStepInfo(currentStage);
    if (!nextStepInfo.nextStage) return;

    try {
      setUpdatingVehicleId(vehicleId);
      const res = await changeProcessingStage(vehicleId, nextStepInfo.nextStage);

      if (res?.success) {
        await fetchStats();
        showToast("Status Update Successfully",'success')

      } else {
        console.error('Failed to advance step:', res?.message);
        showToast("Cannot Update status",'error')

      }
    } catch (err) {
      console.error('Error advancing vehicle step:', err);
    } finally {
      setUpdatingVehicleId(null);
    }
  };

  const rawList: VehicleRecord[] = Array.isArray(PartnerProcessingYardVehiclesData)
    ? (PartnerProcessingYardVehiclesData as unknown as VehicleRecord[])
    : [];

  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return rawList;
    const q = searchQuery.toLowerCase();
    return rawList.filter((item) => {
      const carName = item.vehicleDetails?.carName || item.vehicleDetails?.model || '';
      const vehicleId = item.vehicleId || '';
      const city = item.pickup?.city || '';
      return (
        carName.toLowerCase().includes(q) ||
        vehicleId.toLowerCase().includes(q) ||
        city.toLowerCase().includes(q)
      );
    });
  }, [rawList, searchQuery]);

  return (
    <div className="space-y-6 w-full text-xs antialiased text-gray-700">

      {/* 1. TOP HEADER SECTION PANEL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-black text-gray-900 text-sm tracking-tight">Processing Yard</h3>
          <p className="text-[10px] text-gray-400 font-bold">Track and manage all vehicles in your processing yard.</p>
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-3 py-1.5 font-black text-gray-700 flex items-center gap-2 self-start sm:self-auto shadow-3xs cursor-pointer">
          <Calendar size={13} className="text-[#0B5B32]" />
          <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <ChevronDown size={11} className="text-gray-400" />
        </button>
      </div>

      {/* 2. OVERVIEW METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {summaryCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex justify-between items-start">
              <div className="space-y-2">
                <span className="text-gray-400 font-bold block leading-tight">{card.title}</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black text-gray-900 tracking-tight">{card.value}</span>
                  <span className="text-[9px] text-gray-400 font-bold">{card.unit}</span>
                </div>
              </div>
              <div className={`p-2 rounded-xl shrink-0 border ${card.color}`}>
                <IconComponent size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. PIPELINE STAGES STEP PROGRESSION TRACKER BAR */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3 overflow-hidden">
        <h4 className="font-black text-gray-900 text-[11px] tracking-tight">Processing Stages</h4>
        <div className="overflow-x-auto scrollbar-none -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:pb-0">
          <div className="flex items-center justify-between min-w-[960px] gap-2 relative">
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-100 z-0" />
            {processingStages.map((stage, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-1.5 relative z-10 flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-[11px] shadow-3xs ${stage.color}`}>
                    {stage.step}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="font-black text-gray-800 text-[10px] whitespace-nowrap">{stage.label}</p>
                  <div className="flex justify-center items-center gap-1">
                    <span className="text-xs font-black text-gray-900">{stage.count}</span>
                    <span className="text-[8px] text-gray-400 font-bold uppercase">Vehicles</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. MULTI-CONTROL TOOLBAR FILTER BLOCK */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Search Vehicle</span>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by vehicle ID, name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-700 font-medium placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
              />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {['Processing Status', 'Stage'].map((label, i) => (
            <div key={i}>
              <span className="text-[10px] text-gray-400 font-black block mb-1">{label}</span>
              <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-bold flex items-center justify-between hover:bg-gray-100/50 transition-all cursor-pointer">
                <span>All {i === 0 ? 'Status' : 'Stages'}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>
            </div>
          ))}

          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Date Range</span>
            <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-400 font-bold flex items-center justify-between hover:bg-gray-100/50 transition-all cursor-pointer">
              <span className="flex items-center gap-1.5"><Calendar size={12} /> Select Date Range</span>
              <ChevronDown size={12} className="text-gray-400" />
            </button>
          </div>

          <div className="flex items-end gap-2">
            <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-3 py-2 font-black text-gray-700 flex items-center justify-center gap-1.5 h-[34px] shadow-3xs cursor-pointer">
              <SlidersHorizontal size={12} /> <span>Filters</span>
            </button>
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600 font-bold flex items-center justify-center gap-1 text-[11px] h-[34px] px-2 cursor-pointer"
            >
              <RotateCcw size={11} /> <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. DATA TABLE SECTION */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">

        {/* DESKTOP TABLE */}
        <div className="hidden lg:block overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-black">Vehicle Details</th>
                <th className="py-3.5 px-3 font-black">Received On</th>
                <th className="py-3.5 px-3 font-black">Stage / Status</th>
                <th className="py-3.5 px-3 font-black">Last Updated</th>
                <th className="py-3.5 px-3 font-black">Next Step</th>
                <th className="py-3.5 px-4 font-black text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-bold">
                    No processing yard vehicles found.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((row) => {
                  const carName = row.vehicleDetails?.carName || row.vehicleDetails?.model || 'Vehicle';
                  const variant = row.vehicleDetails?.variant || 'Standard';
                  const fuelType = row.vehicleDetails?.fuelType || 'Petrol';
                  const city = row.pickup?.city || 'Location N/A';
                  const state = row.pickup?.state || '';

                  const createdDate = row.createdAt ? new Date(row.createdAt) : new Date();
                  const updatedDate = row.updatedAt ? new Date(row.updatedAt) : new Date();

                  const stageMeta = getStageBadgeStyle(row.processingStage);
                  const nextStep = getNextStepInfo(row.processingStage);
                  const isCompleted = row.processingStage === 'COMPLETED';
                  const isUpdating = updatingVehicleId === row.vehicleId;

                  return (
                    <tr key={row.vehicleId || Math.random()} className="hover:bg-gray-50/35 transition-colors">

                      {/* Vehicle Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 shrink-0 mt-0.5">
                            <Car size={15} />
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-black text-gray-900 block text-xs tracking-tight">{carName}</span>
                            <p className="text-[10px] text-gray-400 font-bold block">{fuelType} • {variant} • {city}{state ? `, ${state}` : ''}</p>
                            <span className="inline-block text-[9px] bg-gray-100 text-gray-500 rounded-sm px-1 font-mono font-bold mt-1">
                              ID: {row.vehicleId?.slice(-8) || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Received Date */}
                      <td className="py-3.5 px-3 font-bold text-[10px]">
                        <div className="space-y-0.5 text-gray-700">
                          <p className="flex items-center gap-1">
                            <Calendar size={11} className="text-gray-300" />
                            {createdDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-gray-400 font-normal pl-3.5">
                            {createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </td>

                      {/* Stage / Status */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 border rounded-md font-black text-[9px] uppercase tracking-wider inline-block ${stageMeta.color}`}>
                            {stageMeta.tag}
                          </span>
                          <p className="text-[10px] text-gray-400 font-medium pl-0.5">{stageMeta.sub}</p>
                        </div>
                      </td>

                      {/* Last Updated */}
                      <td className="py-3.5 px-3 font-bold text-[10px]">
                        <div className="space-y-0.5 text-gray-700">
                          <p>{updatedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          <p className="text-gray-400 font-normal">
                            {updatedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </td>

                      {/* Target Next Step */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <p className="font-black text-gray-800 text-[11px]">{nextStep.title}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{nextStep.desc}</p>
                        </div>
                      </td>

                      {/* Actions - Direct Step Advancement Button */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {isCompleted ? (
                            <button
                              disabled
                              className="bg-gray-100 text-gray-400 font-black px-3 py-1.5 rounded-xl text-[10px] flex items-center gap-1.5 cursor-not-allowed whitespace-nowrap"
                            >
                              <Check size={12} />
                              <span>Completed</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAdvanceStep(row.vehicleId, row.processingStage)}
                              disabled={isUpdating}
                              className="bg-[#0B5B32] hover:bg-[#094827] active:scale-95 text-white font-black px-3 py-1.5 rounded-xl shadow-3xs transition-all text-[10px] flex items-center gap-1.5 cursor-pointer whitespace-nowrap disabled:opacity-50"
                            >
                              <span>{isUpdating ? 'Updating...' : nextStep.actionLabel}</span>
                              <ArrowRight size={11} />
                            </button>
                          )}

                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer">
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

        {/* MOBILE RESPONSIVE CARDS */}
        <div className="block lg:hidden divide-y divide-gray-100">
          {filteredVehicles.length === 0 ? (
            <div className="p-6 text-center text-gray-400 font-bold">
              No processing yard vehicles found.
            </div>
          ) : (
            filteredVehicles.map((row) => {
              const carName = row.vehicleDetails?.carName || row.vehicleDetails?.model || 'Vehicle';
              const variant = row.vehicleDetails?.variant || 'Standard';
              const fuelType = row.vehicleDetails?.fuelType || 'Petrol';

              const createdDate = row.createdAt ? new Date(row.createdAt) : new Date();
              const updatedDate = row.updatedAt ? new Date(row.updatedAt) : new Date();

              const stageMeta = getStageBadgeStyle(row.processingStage);
              const nextStep = getNextStepInfo(row.processingStage);
              const isCompleted = row.processingStage === 'COMPLETED';
              const isUpdating = updatingVehicleId === row.vehicleId;

              return (
                <div key={row.vehicleId || Math.random()} className="p-4 space-y-3">

                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-0.5">
                      <h4 className="font-black text-gray-900 text-xs tracking-tight">{carName}</h4>
                      <p className="text-[10px] text-gray-400 font-bold">
                        {fuelType} • {variant} • <span className="font-mono text-gray-500">ID: {row.vehicleId?.slice(-8) || 'N/A'}</span>
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 border rounded-md font-black text-[8px] uppercase tracking-wider shrink-0 ${stageMeta.color}`}>
                      {stageMeta.tag}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50 text-[10px]">
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block">Arrival Timestamp</span>
                      <p className="font-bold text-gray-700 mt-0.5">
                        {createdDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block">Last Synchronized</span>
                      <p className="font-bold text-gray-700 mt-0.5">
                        {updatedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {updatedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {nextStep.title !== 'Finished' && (
                      <div className="col-span-2">
                        <span className="text-[9px] text-gray-400 font-bold block">Target Next Step</span>
                        <p className="font-black text-gray-800 mt-0.5">{nextStep.title}</p>
                        <p className="text-[9px] text-gray-400">{nextStep.desc}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[9px] text-gray-400 font-medium italic">{stageMeta.sub}</span>
                    <div className="flex items-center gap-1">
                      {isCompleted ? (
                        <button
                          disabled
                          className="bg-gray-100 text-gray-400 font-black px-3 py-1 rounded-lg text-[10px] flex items-center gap-1 cursor-not-allowed whitespace-nowrap"
                        >
                          <Check size={11} />
                          <span>Completed</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAdvanceStep(row.vehicleId, row.processingStage)}
                          disabled={isUpdating}
                          className="bg-[#0B5B32] text-white px-3 py-1 rounded-lg font-black text-[10px] flex items-center gap-1 shadow-3xs cursor-pointer whitespace-nowrap disabled:opacity-50"
                        >
                          <span>{isUpdating ? 'Updating...' : nextStep.actionLabel}</span>
                          <ArrowRight size={10} />
                        </button>
                      )}

                      <button className="p-1 text-gray-400 hover:bg-gray-50 rounded-lg">
                        <MoreVertical size={13} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* FOOTER PAGINATION */}
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 font-bold text-[11px]">
          <span>
            Showing <strong className="text-gray-800 font-black">1 to {filteredVehicles.length}</strong> of{' '}
            <strong className="text-gray-800 font-black">{rawList.length}</strong> vehicles
          </span>

          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black bg-[#0B5B32] text-white shadow-3xs">1</button>
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40" disabled>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}