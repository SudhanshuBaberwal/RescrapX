'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, FileText, CheckCircle2, AlertOctagon,
  Eye, X, ExternalLink, Check, Ban, Loader2
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getAdminToPartnerDocuments } from '@/hooks/getAdminToPartnerDocuments';
import axios from 'axios';
import { approvePartnerDocuments, revirePartnerUploadedDocumentByAdmin } from '@/services/vehicle.service';
import { useToast } from '@/lib/ui/toast/ToastContext';

interface PartnerDocItem {
  _id?: string;
  id?: string;
  type: string;
  required?: boolean;
  path?: string;
  url?: string;
  fullPath?: string;
  key?: string;
  status?: 'APPROVED' | 'REJECTED' | 'PENDING';
  rejectionReason?: string;
}

interface RealPartnerDocumentRecord {
  _id?: string;
  vehicleDetails?: {
    registrationNumber?: string;
    model?: string;
    variant?: string;
    carName?: string;
  };
  owner?: string;
  partnerDocumentStatus?: string; // 'SUBMITTED', 'APPROVED', 'REJECTED', 'PENDING'
  partnerDocuments?: PartnerDocItem[];
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
  pickup?: {
    houseNumber?: string;
    street?: string;
    area?: string;
    pickupCharges?: number;
  };
  processingStage?: string;
  status?: string;
}

// Custom Hook to Fetch Signed URL for Private Supabase Partner Vehicle Documents
function useSignedUrl(pathObj: any) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const rawPath = typeof pathObj === 'object'
    ? pathObj?.path || pathObj?.url || pathObj?.fullPath || pathObj?.key
    : pathObj;

  useEffect(() => {
    let isMounted = true;

    if (!rawPath) {
      setSignedUrl(null);
      return;
    }

    if (typeof rawPath === 'string' && (rawPath.startsWith('http://') || rawPath.startsWith('https://'))) {
      setSignedUrl(rawPath);
      return;
    }

    const fetchSignedUrl = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/register/view-document`,
          { path: rawPath },
          { withCredentials: true }
        );

        const url =
          response.data?.data?.url ||
          response.data?.url ||
          response.data?.data ||
          response.data?.message ||
          (typeof response.data === 'string' ? response.data : null);

        if (isMounted) {
          if (url && typeof url === 'string') {
            setSignedUrl(url);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Error fetching signed URL for partner document:", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSignedUrl();

    return () => {
      isMounted = false;
    };
  }, [rawPath]);

  return { signedUrl, loading, error, rawPath };
}

// Document Viewer Card Sub-component
const PartnerDocumentPreviewCard: React.FC<{ docItem: PartnerDocItem }> = ({ docItem }) => {
  const { signedUrl, loading, error, rawPath } = useSignedUrl(docItem);
  const handleOpenDoc = () => {
    if (signedUrl) {
      window.open(signedUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex flex-col items-center justify-center min-h-[130px] space-y-3">
      <FileText size={32} className="text-emerald-700" />
      <div className="text-center">
        <span className="text-xs font-mono font-bold text-slate-800 block">
          {docItem.type}
        </span>
        <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[220px]">
          {rawPath || 'document_file.pdf'}
        </span>
      </div>

      <div className="flex gap-2 w-full pt-1">
        <button
          type="button"
          onClick={handleOpenDoc}
          disabled={loading || !signedUrl || error}
          className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold text-[11px] py-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all shadow-3xs cursor-pointer"
        >
          {loading ? (
            <span>Loading Document...</span>
          ) : error || !signedUrl ? (
            <span className="text-rose-500">Failed to load</span>
          ) : (
            <>
              <Eye size={13} /> View Full Size <ExternalLink size={11} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export const DocumentsCompliance: React.FC = () => {
  getAdminToPartnerDocuments();
  const { showToast } = useToast();

  const { PartnerDocuments } = useSelector((state: RootState) => state.admin);

  const realList: RealPartnerDocumentRecord[] = Array.isArray(PartnerDocuments)
    ? (PartnerDocuments as unknown as RealPartnerDocumentRecord[])
    : [];

  const [activeTab, setActiveTab] = useState<'CVS' | 'COD'>('CVS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Sidebar & Selected Item State
  const [selectedVehicle, setSelectedVehicle] = useState<RealPartnerDocumentRecord | null>(null);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [rejectReasonInput, setRejectReasonInput] = useState<string>('');
  const [showRejectInput, setShowRejectInput] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Track individual document status overrides: vehicleId -> docIndex -> { status, reason }
  const [docStatuses, setDocStatuses] = useState<Record<string, Record<number, { status: 'APPROVED' | 'REJECTED'; reason?: string }>>>({});
  // Overall Vehicle Verification State
  const [statusOverrideMap, setStatusOverrideMap] = useState<Record<string, { status: string; reason?: string }>>({});

  // Dynamic Metrics Aggregation
  const totalDocs = realList.length;
  const approvedCount = realList.filter(d => (statusOverrideMap[d._id || '']?.status || d.partnerDocumentStatus) === 'APPROVED').length;
  const pendingCount = realList.filter(d => (statusOverrideMap[d._id || '']?.status || d.partnerDocumentStatus || 'SUBMITTED') === 'SUBMITTED').length;
  const rejectedCount = realList.filter(d => (statusOverrideMap[d._id || '']?.status || d.partnerDocumentStatus) === 'REJECTED').length;

  const complianceKPIs = [
    { title: 'Total Documents', value: totalDocs.toString(), sub: 'All Submitted Records', color: 'text-slate-500 bg-slate-50' },
    { title: 'Approved', value: approvedCount.toString(), sub: `${totalDocs ? Math.round((approvedCount / totalDocs) * 100) : 0}% of total`, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Pending Review', value: pendingCount.toString(), sub: `${totalDocs ? Math.round((pendingCount / totalDocs) * 100) : 0}% of total`, color: 'text-amber-600 bg-amber-50' },
    { title: 'Rejected', value: rejectedCount.toString(), sub: `${totalDocs ? Math.round((rejectedCount / totalDocs) * 100) : 0}% of total`, color: 'text-rose-600 bg-rose-50' },
  ];

  const filteredList = realList.filter((item) => {
    const vId = item._id || '';
    const carName = item.vehicleDetails?.model || item.vehicleDetails?.carName || '';
    const regNo = item.vehicleDetails?.registrationNumber || '';
    const currentStatus = statusOverrideMap[vId]?.status || item.partnerDocumentStatus || 'SUBMITTED';

    const matchesSearch = vId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      regNo.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedStatus !== 'ALL' && currentStatus !== selectedStatus) return false;

    return true;
  });

  const handleRowClick = (item: RealPartnerDocumentRecord) => {
    setSelectedVehicle(item);
    setSelectedDocIndex(0);
    setShowRejectInput(false);
    setRejectReasonInput('');
  };

  // Individual Document Actions (One by One)
  const handleApproveSingleDoc = async () => {
    if (!selectedVehicle?._id) return;
    const vId = selectedVehicle._id;
    const currentDoc = selectedVehicle.partnerDocuments?.[selectedDocIndex];
    const docId = currentDoc?._id || currentDoc?.id || '';

    try {
      setIsSubmitting(true);
      await revirePartnerUploadedDocumentByAdmin(vId, {
        documentId: docId,
        status: 'APPROVED',
        rejectionReason: '',
      });

      setDocStatuses(prev => ({
        ...prev,
        [vId]: {
          ...(prev[vId] || {}),
          [selectedDocIndex]: { status: 'APPROVED' }
        }
      }));
      showToast("Document Approved", 'success');
      setShowRejectInput(false);
    } catch (error) {
      alert('Failed to approve document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSingleDoc = async () => {
    if (!selectedVehicle?._id) return;
    if (!rejectReasonInput.trim()) {
      alert('Please provide a rejection reason for this document.');
      return;
    }
    const vId = selectedVehicle._id;
    const currentDoc = selectedVehicle.partnerDocuments?.[selectedDocIndex];
    const docId = currentDoc?._id || currentDoc?.id || '';

    try {
      setIsSubmitting(true);
      await revirePartnerUploadedDocumentByAdmin(vId, {
        documentId: docId,
        status: 'REJECTED',
        rejectionReason: rejectReasonInput,
      });
      showToast("Document Rejected", 'warning');
      setDocStatuses(prev => ({
        ...prev,
        [vId]: {
          ...(prev[vId] || {}),
          [selectedDocIndex]: { status: 'REJECTED', reason: rejectReasonInput }
        }
      }));
      setShowRejectInput(false);
      setRejectReasonInput('');
    } catch (error) {
      alert('Failed to reject document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Final Overall Submission: Approve all documents in one action
  const handleApproveAll = async () => {
    if (!selectedVehicle?._id) return;
    const vId = selectedVehicle._id;
    try {
      setIsSubmitting(true);
      await approvePartnerDocuments(vId);

      // Update local state to show overall approved & mark all individual documents as approved
      setStatusOverrideMap((prev) => ({
        ...prev,
        [vId]: { status: 'APPROVED' }
      }));

      if (selectedVehicle.partnerDocuments) {
        const allApprovedDocs: Record<number, { status: 'APPROVED' }> = {};
        selectedVehicle.partnerDocuments.forEach((_, idx) => {
          allApprovedDocs[idx] = { status: 'APPROVED' };
        });
        setDocStatuses(prev => ({
          ...prev,
          [vId]: allApprovedDocs
        }));
      }

      showToast("All Documents Approved Successfully", 'success');
    } catch (error) {
      alert('Failed to complete vehicle document approval. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectOverall = () => {
    if (!selectedVehicle?._id) return;
    setStatusOverrideMap((prev) => ({
      ...prev,
      [selectedVehicle._id!]: { status: 'REJECTED', reason: 'One or more required documents failed compliance check.' }
    }));
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return { label: 'Approved', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'REJECTED':
        return { label: 'Rejected', style: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Pending Review', style: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  // Helpers to inspect status of selected vehicle's docs
  const totalDocCount = selectedVehicle?.partnerDocuments?.length || 0;
  const currentVehicleDocMap = selectedVehicle?._id ? (docStatuses[selectedVehicle._id] || {}) : {};

  // Calculate status considering initial doc status OR current session overrides
  const getDocStatus = (doc: PartnerDocItem, idx: number) => {
    return currentVehicleDocMap[idx]?.status || doc.status;
  };

  const approvedDocsCount = selectedVehicle?.partnerDocuments?.filter(
    (doc, idx) => getDocStatus(doc, idx) === 'APPROVED'
  ).length || 0;

  const rejectedDocsCount = selectedVehicle?.partnerDocuments?.filter(
    (doc, idx) => getDocStatus(doc, idx) === 'REJECTED'
  ).length || 0;

  const currentDoc = selectedVehicle?.partnerDocuments?.[selectedDocIndex];
  const currentDocEffectiveStatus = currentDoc ? getDocStatus(currentDoc, selectedDocIndex) : undefined;

  return (
    <div className="bg-slate-50 text-slate-800 antialiased w-full overflow-x-hidden min-h-screen text-xs">
      <main className="p-4 md:p-6 space-y-6 w-full mx-auto">

        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-3xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Documents & Compliance</h2>
            <p className="text-xs text-slate-500 mt-0.5">Review and manage partner uploaded verification documents.</p>
          </div>
        </div>

        {/* Analytics Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {complianceKPIs.map((kpi, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-3xs flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase truncate">{kpi.title}</span>
              <div className="mt-2">
                <div className="text-xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
                <div className={`text-[10px] inline-block mt-1 px-1.5 py-0.5 rounded font-bold ${kpi.color}`}>
                  {kpi.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 overflow-x-auto whitespace-nowrap flex gap-6 scrollbar-none">
          <button
            onClick={() => setActiveTab('CVS')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 ${activeTab === 'CVS' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            CVS (Certificate of Deposit)
          </button>
          <button
            onClick={() => setActiveTab('COD')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 ${activeTab === 'COD' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            COD (Certificate of Destruction)
          </button>
        </div>

        {/* Search & Filter Row */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Vehicle ID, Reg Number, or Model..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs outline-hidden focus:border-slate-300"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-hidden text-slate-600"
            >
              <option value="ALL">All Status</option>
              <option value="SUBMITTED">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Master Detail Split Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {/* Table View Container */}
          <div className={`bg-white border border-slate-200 rounded-xl p-4 shadow-3xs transition-all ${selectedVehicle ? 'xl:col-span-7' : 'xl:col-span-12'}`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-900">Partner Uploaded Documents <span className="text-slate-400 font-normal">({filteredList.length})</span></h3>
            </div>

            <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs text-slate-600 min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3">Vehicle ID</th>
                    <th className="p-3">Vehicle Details</th>
                    <th className="p-3">Uploaded Docs</th>
                    <th className="p-3">Last Updated</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                        No documents found in store data.
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((row) => {
                      const currentStatus = statusOverrideMap[row._id || '']?.status || row.partnerDocumentStatus || 'SUBMITTED';
                      const badge = getStatusBadge(currentStatus);
                      const isSelected = selectedVehicle?._id === row._id;
                      const updatedDate = row.updatedAt ? new Date(row.updatedAt) : new Date();

                      return (
                        <tr
                          key={row._id}
                          onClick={() => handleRowClick(row)}
                          className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${isSelected ? 'bg-emerald-50/40' : ''}`}
                        >
                          <td className="p-3 font-mono font-bold text-slate-900">{row._id?.slice(-8) || 'N/A'}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-800">{row.vehicleDetails?.model || row.vehicleDetails?.carName || 'Vehicle'}</div>
                            <span className="font-mono text-[10px] text-slate-400 uppercase">Reg: {row.vehicleDetails?.registrationNumber || 'N/A'}</span>
                          </td>
                          <td className="p-3">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                              {row.partnerDocuments?.length || 0} Documents
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">
                            <div>{updatedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badge.style}`}>
                              {badge.label}
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

          {/* Dynamic Interactive Right Sidebar */}
          {selectedVehicle && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs xl:col-span-5 space-y-5 sticky top-4">

              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Partner Documents Review</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(statusOverrideMap[selectedVehicle._id || '']?.status || selectedVehicle.partnerDocumentStatus || 'SUBMITTED').style}`}>
                      {getStatusBadge(statusOverrideMap[selectedVehicle._id || '']?.status || selectedVehicle.partnerDocumentStatus || 'SUBMITTED').label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">ID: {selectedVehicle._id}</span>
                </div>
                <button onClick={() => setSelectedVehicle(null)} className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg hover:bg-slate-50">
                  <X size={16} />
                </button>
              </div>

              {/* Vehicle Meta Summary Panel */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Model / Name</span>
                  <span className="font-bold text-slate-800">{selectedVehicle.vehicleDetails?.model || selectedVehicle.vehicleDetails?.carName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Registration No</span>
                  <span className="font-mono font-bold text-slate-800">{selectedVehicle.vehicleDetails?.registrationNumber || 'N/A'}</span>
                </div>
              </div>

              {/* Individual Document Select Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Uploaded Documents ({totalDocCount})</span>
                  <span className="text-[10px] text-slate-500 font-medium">{approvedDocsCount}/{totalDocCount} Approved</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {(selectedVehicle.partnerDocuments || []).map((doc, idx) => {
                    const singleStatus = getDocStatus(doc, idx);

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedDocIndex(idx);
                          setShowRejectInput(false);
                          setRejectReasonInput(currentVehicleDocMap[idx]?.reason || doc.rejectionReason || '');
                        }}
                        className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${selectedDocIndex === idx
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <FileText size={14} className={selectedDocIndex === idx ? 'text-emerald-700' : 'text-slate-400'} />
                          <span className="text-[11px] font-mono">{doc.type}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {singleStatus === 'APPROVED' && (
                            <span className="flex items-center gap-1 text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              <Check size={10} /> Approved
                            </span>
                          )}
                          {singleStatus === 'REJECTED' && (
                            <span className="flex items-center gap-1 text-[9px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                              <Ban size={10} /> Rejected
                            </span>
                          )}
                          {!singleStatus && (
                            <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                              Pending
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Document Preview Container */}
              {selectedVehicle.partnerDocuments?.[selectedDocIndex] && (
                <div className="space-y-3 border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Document File Preview</span>
                    {currentDocEffectiveStatus === 'APPROVED' && (
                      <span className="text-emerald-600 font-bold text-[10px]">✓ Document Approved</span>
                    )}
                    {currentDocEffectiveStatus === 'REJECTED' && (
                      <span className="text-rose-600 font-bold text-[10px]">✕ Document Rejected</span>
                    )}
                  </div>

                  <PartnerDocumentPreviewCard docItem={selectedVehicle.partnerDocuments[selectedDocIndex]} />

                  {/* Individual Document Verification Controls (One by One) */}
                  {currentDocEffectiveStatus === 'APPROVED' ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-bold text-xs flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      <span>Document Approved</span>
                    </div>
                  ) : showRejectInput ? (
                    <div className="space-y-2 p-3 bg-rose-50/50 border border-rose-100 rounded-xl">
                      <label className="text-rose-800 text-[10px] uppercase font-black block">
                        Rejection Reason for {selectedVehicle.partnerDocuments[selectedDocIndex].type} *
                      </label>
                      <textarea
                        value={rejectReasonInput}
                        onChange={(e) => setRejectReasonInput(e.target.value)}
                        placeholder="State why this specific document is unaccepted..."
                        className="w-full bg-white border border-rose-200 rounded-lg p-2 text-xs outline-hidden focus:ring-1 focus:ring-rose-500 min-h-[50px]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={isSubmitting}
                          onClick={() => setShowRejectInput(false)}
                          className="px-3 py-1 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg text-[10px] disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={isSubmitting}
                          onClick={handleRejectSingleDoc}
                          className="px-3 py-1 bg-rose-600 text-white font-bold rounded-lg text-[10px] disabled:opacity-50 flex items-center gap-1"
                        >
                          {isSubmitting && <Loader2 size={10} className="animate-spin" />} Reject Document
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-1">
                      <button
                        disabled={isSubmitting}
                        onClick={() => setShowRejectInput(true)}
                        className={`flex-1 font-bold text-xs py-2 px-3 rounded-lg border transition-all flex items-center justify-center gap-1 disabled:opacity-50 ${currentDocEffectiveStatus === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-100'
                          }`}
                      >
                        ✕ Reject Document
                      </button>
                      <button
                        disabled={isSubmitting}
                        onClick={handleApproveSingleDoc}
                        className="flex-1 font-bold text-xs py-2 px-3 rounded-lg border transition-all flex items-center justify-center gap-1 disabled:opacity-50 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 cursor-pointer"
                      >
                        {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : '✓ Approve Document'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Complete Set Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Final Approval Action</div>

                {statusOverrideMap[selectedVehicle._id || '']?.status === 'APPROVED' ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Complete Verification Approved</span>
                  </div>
                ) : statusOverrideMap[selectedVehicle._id || '']?.status === 'REJECTED' ? (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertOctagon size={15} /> Set Marked as Rejected
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleRejectOverall}
                      disabled={isSubmitting}
                      className="flex-1 bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 font-bold text-xs py-2 px-3 rounded-lg border border-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Reject Set
                    </button>
                    <button
                      onClick={handleApproveAll}
                      disabled={isSubmitting}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs py-2.5 px-3 rounded-lg transition-all shadow-3xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        `✓ Approve All Documents (${approvedDocsCount}/${totalDocCount})`
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </main>
    </div>
  );
};