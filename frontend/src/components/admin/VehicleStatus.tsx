'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Calendar,
  MoreVertical,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  SlidersHorizontal
} from 'lucide-react';
import { getAllVehicles } from '@/hooks/getAllVehiclesData';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export interface IVehicleDocument {
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

export interface IPartnerDocument {
  _id?: string;
  type: VehicleDocumentType;
  required: boolean;
  path: string;
  fullPath: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
  status: PartnerDocumentStatus;
  rejectionReason?: string | null;
  reviewedAt?: Date | null;
  reviewedBy?: string | null;
}

export interface IUploadedPhoto {
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: Date;
}

export enum PartnerDocumentSubmissionStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ProcessingStage {
  WAITING_FOR_ARRIVAL = "WAITING_FOR_ARRIVAL",
  VEHICLE_RECEIVED = "VEHICLE_RECEIVED",
  INSPECTION_COMPLETED = "INSPECTION_COMPLETED",
  DISMANTLING = "DISMANTLING",
  RECYCLING = "RECYCLING",
  CERTIFICATE_PENDING = "CERTIFICATE_PENDING",
  COMPLETED = "COMPLETED",
}

export enum PartnerDocumentType {
  CERTIFICATE_OF_DEPOSIT = "CERTIFICATE_OF_DEPOSIT",
  CERTIFICATE_OF_SCRAPPING = "CERTIFICATE_OF_SCRAPPING",
  CHASSIS_PROOF = "CHASSIS_PROOF",
  OTHER = "OTHER",
}

export enum PartnerDocumentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum VehicleStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_VERIFICATION = "UNDER_VERIFICATION",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  READY_FOR_BIDDING = "READY_FOR_BIDDING",
  SOLD = "SOLD",
  UNSOLD = "UNSOLD",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  SCHEDULED = "SCHEDULED",
  DRIVER_ASSIGNED = "DRIVER_ASSIGNED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  ARRIVED = "ARRIVED",
  CANCELLED = "CANCELLED",
}

export enum VehicleDocumentType {
  RC_BOOK = "RC_BOOK",
  INSURANCE = "INSURANCE",
  PUC = "PUC",
  LOAN_CLOSURE = "LOAN_CLOSURE",
  OTHER = "OTHER",
}

export enum RegistrationStep {
  VEHICLE_DETAILS = 1,
  VEHICLE_CONDITION,
  MAJOR_COMPONENTS,
  DOCUMENTS,
  PHOTOS,
  PICKUP,
  REVIEW,
  SUBMITTED,
}

export enum TransmissionType {
  MANUAL = "MANUAL",
  AUTOMATIC = "AUTOMATIC",
  CVT = "CVT",
  DCT = "DCT",
  AMT = "AMT",
}

export enum EngineCondition {
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
  NOT_WORKING = "NOT_WORKING",
}

export enum ComponentCondition {
  GOOD = "GOOD",
  NOT_WORKING = "NOT_WORKING",
  MISSING = "MISSING",
}

export enum accidentType {
  NO_ACCIDENT = "NO_ACCIDENT",
  ACCIDENTAL_DAMAGE = "ACCIDENTAL_DAMAGE",
  BURNT = "BURNT",
  FLOODED = "FLOODED",
  OTHER = "OTHER",
}

export enum structuralDamage {
  NO_DAMAGE = "NO_DAMAGE",
  MINOR_DAMAGE = "MINOR_DAMAGE",
  MAJOR_DAMAGE = "MAJOR_DAMAGE",
}

export interface IVehicle {
  _id: string;
  owner: string;
  pickupCharges?: number;
  documentCharges?: number;
  auctionResult?: {
    auctionId: string;
    partnerId: string | null;
    winningBid: number | null;
    wonAt: Date | null;
  };

  status: VehicleStatus;
  processingStage?: ProcessingStage;
  isRegistered?: boolean;
  currentStep: RegistrationStep;
  vehicleDetails: {
    carName: string;
    registrationNumber: string;
    model: string;
    variant: string;
    fuelType: string;
    transmission: TransmissionType;
    manufacturingYear: number;
    ownership: number;
    kmsDriven: number;
  };

  vehicleCondition: {
    accidentType: accidentType;
    structure: structuralDamage;
    airbagsDeployed: boolean;
    description: string;
  };

  majorComponents: {
    engine: ComponentCondition;
    radiator: ComponentCondition;
    fuelSystem: ComponentCondition;
    gearbox: ComponentCondition;
    suspension: ComponentCondition;
    steering: ComponentCondition;
    electrical: ComponentCondition;
    exhaust: ComponentCondition;
    tyres: ComponentCondition;
    ac: ComponentCondition;
    bodyPanels: ComponentCondition;
    glass: ComponentCondition;
    lights: ComponentCondition;
    interior: ComponentCondition;
  };

  documents: {
    rcbook?: IVehicleDocument;
    insurance?: IVehicleDocument;
    puc?: IVehicleDocument;
    loanClosure?: IVehicleDocument;
    other?: IVehicleDocument;
  };
  partnerDocumentStatus?: PartnerDocumentSubmissionStatus;
  partnerDocuments?: IPartnerDocument[];
  photos: {
    front?: IUploadedPhoto;
    rear?: IUploadedPhoto;
    left?: IUploadedPhoto;
    right?: IUploadedPhoto;
    dashboard?: IUploadedPhoto;
    interior?: IUploadedPhoto;
    engine?: IUploadedPhoto;
    odometer?: IUploadedPhoto;
    chassisNumber?: IUploadedPhoto;
  };

  pickup: {
    houseNumber: string;
    street: string;
    area: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    formattedAddress?: string;
    contactName: string;
    mobileNumber: string;
    alternateNumber?: string;
    vehicleLocation: "HOME" | "OFFICE" | "PARKING" | "WORKSHOP" | "OTHER";
    towAccessibility: "YES" | "NO" | "NOT_SURE";
    currentVehiclePosition:
      | "ON_ROAD"
      | "BASEMENT"
      | "SOCIETY"
      | "ROADSIDE"
      | "GARAGE";
    scheduledAt?: Date;
    confirmedAt?: Date;
    confirmedBy?: string;
    assignedDriver?: string;

    pickupOtpHash?: string | null;
    pickupOtpExpiresAt?: Date | null;
    pickupOtpAttempts?: number;
    pickupOtpVerifiedAt?: Date | null;
  };
  timeline: {
    title: string;
    completed: boolean;
    completedAt?: Date;
  }[];
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function RequestStatusPage() {
  // Trigger custom hook to fetch data
  getAllVehicles();

  // Extract real backend data from Redux Store
  const allVehicles: IVehicle[] = useSelector(
    (state: RootState) => state.admin.allVehicles || []
  );

  const [selectedRequest, setSelectedRequest] = useState<IVehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Auto-select the first vehicle item when Redux data loads
  useEffect(() => {
    if (allVehicles.length > 0 && !selectedRequest) {
      setSelectedRequest(allVehicles[0]);
    }
  }, [allVehicles, selectedRequest]);

  // Dynamic status badges mapping backend values
  const getStatusBadge = (status?: string) => {
    const formattedStatus = status?.toUpperCase();
    switch (formattedStatus) {
      case 'PICKED_UP':
      case 'IN_TRANSIT':
      case 'ARRIVED':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'SOLD':
      case 'VERIFIED':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'SCHEDULED':
      case 'SUBMITTED':
      case 'UNDER_VERIFICATION':
      case 'READY_FOR_BIDDING':
      case 'READY_FOR_PICKUP':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      case 'REJECTED':
      case 'CANCELLED':
      case 'UNSOLD':
        return 'bg-red-50 text-red-600 border border-red-100';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  const formatDate = (dateValue?: Date | string) => {
    if (!dateValue) return 'N/A';
    const dateObj = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(dateObj.getTime())) return 'N/A';
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateValue?: Date | string) => {
    if (!dateValue) return '';
    const dateObj = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filter functionality
  const filteredVehicles = allVehicles.filter((v) => {
    const query = searchQuery.toLowerCase();
    const regNum = v.vehicleDetails?.registrationNumber?.toLowerCase() || '';
    const model = v.vehicleDetails?.model?.toLowerCase() || '';
    const vehicleId = v._id?.toLowerCase() || '';
    const ownerName = v.owner?.toLowerCase() || '';

    const matchesSearch =
      regNum.includes(query) ||
      model.includes(query) ||
      vehicleId.includes(query) ||
      ownerName.includes(query);

    const matchesStatus =
      statusFilter === 'ALL' ||
      v.status?.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-full w-full bg-[#F8FAFC] overflow-hidden relative">
      {/* MAIN TABLE CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 space-y-4 overflow-hidden">
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900">All Request Status</h1>
          <p className="text-xs text-gray-400">Track and monitor the progress of all vehicle scrapping requests</p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Vehicle ID, Reg No, Model, Owner..."
              className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <select
              className="bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-gray-600 appearance-none focus:outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PICKED_UP">Picked Up</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="SOLD">Sold</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button className="hidden md:flex bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 items-center gap-2 hover:bg-gray-50">
            <Calendar size={14} className="text-gray-400" />
            <span>Select Date Range</span>
          </button>

          <button className="bg-white border border-gray-200 rounded-lg p-2 text-gray-500 hover:bg-gray-50">
            <SlidersHorizontal size={15} />
          </button>
        </div>

        {/* TABLE OR EMPTY STATE */}
        <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden flex flex-col">
          {filteredVehicles.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <p className="text-sm font-semibold text-gray-500">No vehicle requests found</p>
              <p className="text-xs text-gray-400 mt-1">Data from Redux will populate here automatically.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] text-gray-400 font-bold uppercase bg-gray-50/50">
                    <th className="py-3 px-4">Request ID / Vehicle</th>
                    <th className="py-3 px-4">Owner Info</th>
                    <th className="py-3 px-4">Current Stage</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Requested On</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {filteredVehicles.map((req, idx) => {
                    const isSelected = selectedRequest?._id === req._id;
                    const displayReg = req.vehicleDetails?.registrationNumber || 'N/A';
                    const displayModel = req.vehicleDetails?.model || req.vehicleDetails?.carName || 'Unknown Model';

                    return (
                      <tr
                        key={req._id || idx}
                        className={`hover:bg-gray-50/60 transition-colors cursor-pointer ${
                          isSelected ? 'bg-emerald-50/20' : ''
                        }`}
                        onClick={() => setSelectedRequest(req)}
                      >
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900 text-[11px] block truncate max-w-[120px]">
                            {req._id}
                          </span>
                          <span className="font-bold text-gray-800 text-[11px]">{displayReg}</span>
                          <span className="text-[10px] text-gray-400 block">{displayModel}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-800 block text-[11px]">
                            {req.pickup?.contactName || req.owner || 'N/A'}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {req.pickup?.mobileNumber || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-2">
                            <span className="w-4 h-4 rounded-full border border-emerald-500 text-emerald-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {req.currentStep || 1}
                            </span>
                            <div>
                              <span className="font-semibold text-gray-900 block text-[11px]">
                                {req.processingStage || req.status}
                              </span>
                              <span className="text-[9px] text-gray-400">{formatDate(req.updatedAt)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold inline-block ${getStatusBadge(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-800 block text-[11px]">{formatDate(req.createdAt)}</span>
                          <span className="text-[10px] text-gray-400">{formatTime(req.createdAt)}</span>
                        </td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedRequest(req)}
                              className="px-2 py-1 text-[10px] font-semibold text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50"
                            >
                              View Details
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 p-1">
                              <MoreVertical size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          <div className="p-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
            <span>Showing {filteredVehicles.length} of {allVehicles.length} requests</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded text-gray-400 hover:bg-gray-100"><ChevronLeft size={16} /></button>
              <button className="w-6 h-6 rounded text-xs font-semibold bg-emerald-600 text-white flex items-center justify-center">1</button>
              <button className="p-1 rounded text-gray-400 hover:bg-gray-100"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </main>

      {/* RESPONSIVE RIGHT SIDE DRAWER */}
      {selectedRequest && (
        <aside className="fixed inset-y-0 right-0 z-50 lg:static w-full max-w-[360px] border-l border-gray-100 bg-white flex flex-col shrink-0 overflow-hidden shadow-2xl lg:shadow-none">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-gray-900 truncate">ID: {selectedRequest._id}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getStatusBadge(selectedRequest.status)}`}>
                {selectedRequest.status}
              </span>
            </div>
            <button
              onClick={() => setSelectedRequest(null)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* VEHICLE INFO */}
            <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              {selectedRequest.photos?.front?.path && (
                <img
                  src={selectedRequest.photos.front.path}
                  alt="Vehicle Front"
                  className="w-16 h-12 rounded object-cover border shrink-0"
                />
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-xs">
                  {selectedRequest.vehicleDetails?.registrationNumber || 'No Reg Number'}
                </h3>
                <p className="text-[10px] text-gray-500 font-medium truncate">
                  {selectedRequest.vehicleDetails?.carName || selectedRequest.vehicleDetails?.model} • {selectedRequest.vehicleDetails?.variant || 'Standard'}
                </p>
                {selectedRequest.pickup && (
                  <p className="text-[10px] text-gray-400 mt-0.5 truncate">
                    Pickup: {selectedRequest.pickup.houseNumber}, {selectedRequest.pickup.street}, {selectedRequest.pickup.area}, {selectedRequest.pickup.city}
                  </p>
                )}
              </div>
            </div>

            {/* OWNER & PARTNER */}
            <div className="grid grid-cols-2 gap-3 text-[11px] pb-3 border-b border-gray-100">
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block text-[10px]">Owner / Contact</span>
                <span className="font-bold text-gray-800 block truncate">
                  {selectedRequest.pickup?.contactName || selectedRequest.owner}
                </span>
                {selectedRequest.pickup?.mobileNumber && (
                  <span className="text-gray-500 text-[10px] flex items-center gap-1">
                    <Phone size={10} /> {selectedRequest.pickup.mobileNumber}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 font-medium block text-[10px]">Partner & Bid</span>
                <span className="font-bold text-gray-800 block truncate">
                  {selectedRequest.auctionResult?.partnerId || 'Unassigned'}
                </span>
                {selectedRequest.auctionResult?.winningBid && (
                  <span className="text-emerald-600 font-semibold text-[10px] block">
                    Winning Bid: ₹{selectedRequest.auctionResult.winningBid.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* TIMELINE */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-xs">Scrapping Process Status</h4>
              {selectedRequest.timeline && selectedRequest.timeline.length > 0 ? (
                <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                  {selectedRequest.timeline.map((step, idx) => {
                    const isDone = step.completed;
                    return (
                      <div key={idx} className="relative">
                        <div
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white ${
                            isDone ? 'border-emerald-500 text-emerald-600' : 'border-gray-300 text-gray-300'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 size={12} className="fill-emerald-50 text-emerald-600" />
                          ) : (
                            <span className="text-[9px] font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-bold text-gray-900 text-[11px] leading-tight">{step.title}</h5>
                            {step.completedAt && (
                              <p className="text-[9px] text-gray-400 mt-0.5">{formatDate(step.completedAt)}</p>
                            )}
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              isDone ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {isDone ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No detailed timeline available for this request.</p>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs transition-colors">
              View Full Details
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}