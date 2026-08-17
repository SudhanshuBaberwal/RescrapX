'use client';

import React, { useState } from 'react';
import {
  FileText, Clock, UploadCloud, CheckCircle2, AlertOctagon,
  Calendar, Search, SlidersHorizontal, RotateCcw,
  ChevronLeft, ChevronRight,
  X, FileCheck, Loader2, ShieldAlert
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import api from '@/utils/api';
import { getPartnerDocumentUploadData } from '@/hooks/getPartnerDocumentUploadData';

interface DocumentRecord {
  vehicleId: string;
  processingStage?: string;
  status?: string;
  updatedAt?: string;
  auction?: {
    auctionId?: string;
  };
  documents?: {
    submissionStatus?: string;
    rcbook?: string | null;
    insurance?: string | null;
    puc?: string | null;
    depositCertificate?: string | null;
    scrappingCertificate?: string | null;
    chassisProof?: string | null;
  };
  vehicleDetails?: {
    carName?: string | null;
    model?: string | null;
    variant?: string | null;
    fuelType?: string | null;
  };
}

// Config mapping state keys to Multer field names and Backend Enum values
const DOC_TYPE_MAP = {
  depositCertificate: {
    multerField: 'cod',
    enumValue: 'CERTIFICATE_OF_DEPOSIT',
    label: '1. Certificate of Deposit (CoD)'
  },
  scrappingCertificate: {
    multerField: 'cos',
    enumValue: 'CERTIFICATE_OF_SCRAPPING',
    label: '2. Certificate of Scrapping'
  },
  chassisProof: {
    multerField: 'chassis',
    enumValue: 'CHASSIS_PROOF',
    label: '3. Chassis Proof'
  }
} as const;

type DocStateKey = keyof typeof DOC_TYPE_MAP;

export default function DocumentsDashboard() {
  getPartnerDocumentUploadData();

  const { PartnerDocumentUploadData } = useSelector((state: RootState) => state.partner);

  const rawData: DocumentRecord[] = Array.isArray(PartnerDocumentUploadData)
    ? PartnerDocumentUploadData
    : [];

  const [activeTab, setActiveTab] = useState('All Documents');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Control & File Upload States
  const [selectedVehicle, setSelectedVehicle] = useState<DocumentRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<Record<DocStateKey, File | null>>({
    depositCertificate: null,
    scrappingCertificate: null,
    chassisProof: null,
  });

  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Metrics Aggregation
  const totalDocs = rawData.length;
  const pendingCount = rawData.filter(d => d.documents?.submissionStatus === 'NOT_SUBMITTED' || !d.documents?.submissionStatus).length;
  const uploadedCount = rawData.filter(d => d.documents?.submissionStatus === 'PENDING_VERIFICATION' || d.documents?.submissionStatus === 'SUBMITTED').length;
  const verifiedCount = rawData.filter(d => d.documents?.submissionStatus === 'VERIFIED').length;
  const rejectedCount = rawData.filter(d => d.documents?.submissionStatus === 'REJECTED').length;

  const metrics = [
    { title: 'Total Documents', count: totalDocs, meta: 'All time', icon: FileText, iconColor: 'text-emerald-600 bg-emerald-50' },
    { title: 'Pending Action', count: pendingCount, meta: 'Require upload', icon: Clock, iconColor: 'text-amber-600 bg-amber-50' },
    { title: 'Uploaded', count: uploadedCount, meta: 'Under review', icon: UploadCloud, iconColor: 'text-purple-600 bg-purple-50' },
    { title: 'Verified', count: verifiedCount, meta: 'Verified by admin', icon: CheckCircle2, iconColor: 'text-blue-600 bg-blue-50' },
    { title: 'Rejected', count: rejectedCount, meta: 'Needs re-upload', icon: AlertOctagon, iconColor: 'text-red-600 bg-red-50' },
    { title: 'Expiring Soon', count: 0, meta: 'Next 30 days', icon: ShieldAlert, iconColor: 'text-teal-600 bg-teal-50' },
  ];

  const tabs = [
    { name: 'All Documents', count: totalDocs, color: 'bg-emerald-50 text-emerald-700' },
    { name: 'Pending', count: pendingCount, color: 'bg-amber-50 text-amber-700' },
    { name: 'Uploaded', count: uploadedCount, color: 'bg-purple-50 text-purple-700' },
    { name: 'Verified', count: verifiedCount, color: 'bg-blue-50 text-blue-700' },
    { name: 'Rejected', count: rejectedCount, color: 'bg-red-50 text-red-700' },
  ];

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'VERIFIED':
        return { label: 'Verified', style: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      case 'SUBMITTED':
      case 'PENDING_VERIFICATION':
        return { label: 'Uploaded', style: 'bg-blue-50 text-blue-700 border-blue-100' };
      case 'REJECTED':
        return { label: 'Rejected', style: 'bg-red-50 text-red-700 border-red-100' };
      default:
        return { label: 'Pending', style: 'bg-amber-50 text-amber-700 border-amber-100' };
    }
  };

  const filteredData = rawData.filter((item) => {
    const status = item.documents?.submissionStatus || 'NOT_SUBMITTED';
    const carName = item.vehicleDetails?.carName || item.vehicleDetails?.model || '';
    const vehicleId = item.vehicleId || '';

    const matchesSearch = carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicleId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'Pending') return status === 'NOT_SUBMITTED';
    if (activeTab === 'Uploaded') return status === 'PENDING_VERIFICATION' || status === 'SUBMITTED';
    if (activeTab === 'Verified') return status === 'VERIFIED';
    if (activeTab === 'Rejected') return status === 'REJECTED';
    return true;
  });

  const handleOpenUploadModal = (vehicle: DocumentRecord) => {
    setSelectedVehicle(vehicle);
    setFiles({ depositCertificate: null, scrappingCertificate: null, chassisProof: null });
    setIsModalOpen(true);
  };

  // Fixed File Upload API Handler to match Multer & Backend Controller Expectations
  const handleFileUpload = async (docKey: DocStateKey, file: File) => {
    if (!selectedVehicle) return;
    setUploadingField(docKey);

    const config = DOC_TYPE_MAP[docKey];

    try {
      const formData = new FormData();
      formData.append('vehicleId', selectedVehicle.vehicleId);
      formData.append('documentType', config.enumValue);
      formData.append('required', 'true');
      // Append file using the exact name expected by multer.fields()[cite: 9]
      formData.append(config.multerField, file);

      const result = await api.post("/api/vehicle/register/partner/documents/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (result.status === 200 || result.status === 201 || result.data?.success) {
        setFiles((prev) => ({ ...prev, [docKey]: file }));
      } else {
        alert(`Failed to upload ${config.label}`);
      }
    } catch (err) {
      console.error('Upload Error:', err);
      alert(`Failed to upload ${config.label}`);
    } finally {
      setUploadingField(null);
    }
  };

  // Fixed Batch Submit API Handler pointing to correct /submit endpoint
  const handleSubmitAllDocuments = async () => {
    if (!selectedVehicle) return;
    setIsSubmitting(true);

    try {
      const result = await api.post("/api/vehicle/register/partner/documents/submit", {
        vehicleId: selectedVehicle.vehicleId,
      });

      if (result.status === 200 || result.data?.success) {
        alert('All documents submitted successfully!');
        setIsModalOpen(false);
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Submission Error:', err);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full text-xs text-gray-700">

      {/* HEADER */}
      <div>
        <h3 className="font-black text-gray-900 text-sm">Documents</h3>
        <p className="text-[10px] text-gray-400 font-bold">Upload, manage and track required vehicle documents.</p>
      </div>

      {/* 1. TOP METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex justify-between items-start">
              <div className="space-y-2">
                <span className="text-gray-400 font-bold block leading-tight">{metric.title}</span>
                <div>
                  <span className="text-xl font-black text-gray-900 tracking-tight block">{metric.count}</span>
                  <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{metric.meta}</span>
                </div>
              </div>
              <div className={`p-2 rounded-xl ${metric.iconColor}`}><Icon size={14} /></div>
            </div>
          );
        })}
      </div>

      {/* 2. SEARCH & CONTROLS */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          <div className="relative col-span-2">
            <span className="text-[10px] text-gray-400 font-black block mb-1">Search Vehicle / ID</span>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by vehicle name or ID..."
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-700 font-medium placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
              />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Date Range</span>
            <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-400 font-bold flex items-center justify-between hover:bg-gray-100/50">
              <span>Select Date Range</span>
              <Calendar size={12} className="text-gray-400" />
            </button>
          </div>

          <div className="flex items-end gap-2 col-span-2">
            <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-3 py-2 font-black text-gray-700 flex items-center justify-center gap-1.5 h-[34px] shadow-3xs">
              <SlidersHorizontal size={12} /> <span>Filters</span>
            </button>
            <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 font-bold flex items-center justify-center gap-1 text-[11px] h-[34px] px-2">
              <RotateCcw size={11} /> <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. TABS */}
      <div className="border-b border-gray-100 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        <div className="flex gap-6 min-w-max pb-px">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-3 font-black transition-all relative flex items-center gap-2 ${
                activeTab === tab.name ? 'text-emerald-800' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>{tab.name}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === tab.name ? tab.color : 'bg-gray-100 text-gray-500'
              }`}>{tab.count}</span>
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B5B32] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN DATA TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-black">Vehicle Details</th>
                <th className="py-3 px-3 font-black">Vehicle ID</th>
                <th className="py-3 px-3 font-black">Processing Stage</th>
                <th className="py-3 px-3 font-black">Last Updated</th>
                <th className="py-3 px-3 font-black text-center">Submission Status</th>
                <th className="py-3 px-4 font-black text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-bold">
                    No matching documents found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const carName = item.vehicleDetails?.carName || item.vehicleDetails?.model || 'Vehicle Document';
                  const variant = item.vehicleDetails?.variant || 'Standard';
                  const fuelType = item.vehicleDetails?.fuelType || 'N/A';
                  const updatedDate = item.updatedAt ? new Date(item.updatedAt) : new Date();
                  const badge = getStatusBadge(item.documents?.submissionStatus);

                  return (
                    <tr key={item.vehicleId} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <h4 className="font-black text-gray-900 text-[13px] tracking-tight">{carName}</h4>
                          <p className="text-[10px] text-gray-400 font-bold">{fuelType} • {variant}</p>
                        </div>
                      </td>

                      <td className="py-4 px-3 font-mono text-[10px] font-bold text-gray-600">
                        {item.vehicleId}
                      </td>

                      <td className="py-4 px-3 font-bold text-gray-600">
                        {item.processingStage || 'VEHICLE_RECEIVED'}
                      </td>

                      <td className="py-4 px-3">
                        <p className="font-bold text-gray-800">
                          {updatedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {updatedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>

                      <td className="py-4 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider border inline-block ${badge.style}`}>
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenUploadModal(item)}
                            className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-3 py-1.5 rounded-xl shadow-3xs transition-all flex items-center gap-1 h-8 cursor-pointer"
                          >
                            <UploadCloud size={12} /> <span>Upload Documents</span>
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

        {/* PAGINATION FOOTER */}
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between text-gray-400 font-bold text-[11px]">
          <span>Showing <strong className="text-gray-800 font-black">{filteredData.length}</strong> of <strong className="text-gray-800 font-black">{rawData.length}</strong> documents</span>
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black bg-[#0B5B32] text-white">1</button>
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50" disabled>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. UPLOAD DOCUMENTS MODAL */}
      {isModalOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-gray-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-black text-gray-900 text-sm">Upload Vehicle Documents</h4>
                <p className="text-[10px] text-gray-400 font-bold">Vehicle ID: {selectedVehicle.vehicleId}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {(Object.keys(DOC_TYPE_MAP) as DocStateKey[]).map((docKey) => {
                const config = DOC_TYPE_MAP[docKey];
                return (
                  <div key={docKey} className="space-y-1">
                    <label className="font-black text-gray-800 text-[11px] block">{config.label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(docKey, e.target.files[0])}
                        className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 border border-gray-200 rounded-xl p-1"
                      />
                      {uploadingField === docKey ? (
                        <Loader2 size={16} className="animate-spin text-emerald-700" />
                      ) : files[docKey] ? (
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTION FOOTER */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl font-black text-gray-600 text-[11px]"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmitAllDocuments}
                disabled={isSubmitting || (!files.depositCertificate && !files.scrappingCertificate && !files.chassisProof)}
                className="px-4 py-2 bg-[#0B5B32] hover:bg-[#094d2a] disabled:opacity-50 text-white rounded-xl font-black text-[11px] flex items-center gap-1.5 shadow-3xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FileCheck size={13} />
                    <span>Submit All Documents</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}