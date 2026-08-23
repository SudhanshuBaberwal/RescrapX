'use client';

import React, { useState } from 'react';
import {
  FileText, ArrowDownRight, Calendar, Hourglass, CheckCircle2,
  XCircle, Eye, Copy, X, Filter, ChevronRight, Info, Upload, Check, ChevronLeft
} from 'lucide-react';
import { getPartnerPaymentsData } from '@/hooks/getPartnerPaymentData';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addPaymentProof } from '@/services/vehicle.service';

interface PaymentProof {
  id?: string;
  fileUrl?: string;
  fileName?: string;
  uploadedAt?: string;
}

interface PartnerPaymentItem {
  _id?: string;
  vehicleId?: string;
  auction?: {
    auctionId?: string;
  };
  partnerDocumentStatus?: string;
  paymentProofs?: PaymentProof[];
  processingStage?: string;
  status?: string;
  updatedAt?: string;
  vehicleDetails?: {
    _id?: string;
    id?: string;
    carName?: string | null;
    manufacturingYear?: number;
    model?: string;
    registrationNumber?: string;
    variant?: string;
    vehicleId?: string;
  };
}

export default function PaymentsSettlementsDashboard() {
  getPartnerPaymentsData();
  const { PartnerPaymentData } = useSelector((state: RootState) => state.partner);

  const transactions: PartnerPaymentItem[] = Array.isArray(PartnerPaymentData) ? PartnerPaymentData : [];

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const selectedTxn = transactions[selectedIndex] || null;

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const totalTransactions = transactions.length;
  const paidCount = transactions.filter(t => t.status?.toUpperCase() === 'ARRIVED' || t.status?.toUpperCase() === 'PAID').length;
  const unpaidCount = totalTransactions - paidCount;

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a payment proof file");
      return;
    }

    if (!selectedTxn) {
      alert("Please select a vehicle");
      return;
    }

    const vehicleId =
      selectedTxn.vehicleId ||
      selectedTxn.vehicleDetails?.vehicleId ||
      selectedTxn._id;

    if (!vehicleId) {
      alert("Vehicle ID not found");
      return;
    }

    setIsUploading(true);

    try {
      await addPaymentProof({
        vehicleId,
        paymentProof: selectedFile,
      });

      alert("Payment proof uploaded successfully!");
      setIsUploadModalOpen(false);
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Failed to upload payment proof:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to upload payment proof";
      alert(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-5 text-gray-900 font-sans">

      {/* TOP METRICS STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-bold text-xs">Total Transactions</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalTransactions}</h3>
            <span className="text-[10px] text-gray-400 font-bold">All time</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100/50">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-bold text-xs">Completed Payments</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{paidCount}</h3>
            <span className="text-[10px] text-gray-400 font-bold">Verified & Arrived</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100/50">
            <ArrowDownRight size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-bold text-xs">Processing Stage</p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">
              {transactions.filter(t => t.processingStage).length}
            </h3>
            <span className="text-[10px] text-gray-400 font-bold">Active Records</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100/50">
            <Calendar size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-bold text-xs">Pending Proofs</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{unpaidCount}</h3>
            <span className="text-[10px] text-gray-400 font-bold">Awaiting Uploads</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100/50">
            <Hourglass size={20} />
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

        {/* LEFT SECTION: TRANSACTIONS TABLE */}
        <div className={`${isSidebarOpen ? 'xl:col-span-8' : 'xl:col-span-12'} bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4 transition-all duration-300`}>

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-50 pb-4">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                <Calendar size={14} className="text-gray-400" />
                <span>All History</span>
              </button>
              <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                <Filter size={14} className="text-gray-400" />
                <span>Status: All</span>
              </button>
            </div>

            {selectedTxn && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                {isSidebarOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                <span>{isSidebarOpen ? 'Hide Sidebar' : 'Show Details'}</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                  <th className="pb-3 font-extrabold">Auction / Vehicle ID</th>
                  <th className="pb-3 font-extrabold">Vehicle Details</th>
                  <th className="pb-3 font-extrabold">Stage</th>
                  <th className="pb-3 font-extrabold">Last Updated</th>
                  <th className="pb-3 font-extrabold">Status</th>
                  <th className="pb-3 font-extrabold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400 font-bold">
                      No payment or settlement records found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((row, idx) => {
                    const isSelected = selectedIndex === idx;
                    const isArrived = row.status?.toUpperCase() === 'ARRIVED';
                    const vehicleName = row.vehicleDetails?.carName || row.vehicleDetails?.model || 'Vehicle';
                    const hasProofUploaded = row.paymentProofs && row.paymentProofs.length > 0;

                    return (
                      <tr
                        key={row.vehicleId || row.vehicleDetails?.vehicleId || row._id || idx}
                        onClick={() => {
                          setSelectedIndex(idx);
                          setIsSidebarOpen(true);
                        }}
                        className={`group cursor-pointer transition-colors ${isSelected ? 'bg-gray-50/80' : 'hover:bg-gray-50/50'}`}
                      >
                        <td className="py-3.5 pr-2">
                          <p className="font-extrabold text-gray-900 group-hover:text-[#0B5B32] transition-colors truncate max-w-[120px]">
                            {row.auction?.auctionId || 'N/A'}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold">
                            Doc Status: {row.partnerDocumentStatus || 'PENDING'}
                          </p>
                        </td>

                        <td className="py-3.5 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500 uppercase shrink-0">
                              {row.vehicleDetails?.model?.slice(0, 3) || 'CAR'}
                            </div>
                            <div>
                              <p className="font-extrabold text-gray-900 text-xs">
                                {row.vehicleDetails?.registrationNumber || 'No Reg Num'}
                              </p>
                              <p className="text-[11px] text-gray-500 font-medium leading-tight">
                                {vehicleName} ({row.vehicleDetails?.variant || ''})
                              </p>
                              <p className="text-[9px] text-gray-400 font-bold">
                                {row.vehicleDetails?.manufacturingYear || ''}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 pr-2">
                          <span className="font-extrabold text-gray-800 text-[11px] bg-gray-100 px-2 py-0.5 rounded">
                            {row.processingStage || 'N/A'}
                          </span>
                        </td>

                        <td className="py-3.5 pr-2">
                          <p className="font-extrabold text-gray-800 text-[11px]">
                            {formatDate(row.updatedAt)}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold">
                            {formatTime(row.updatedAt)}
                          </p>
                        </td>

                        <td className="py-3.5 pr-2">
                          {isArrived ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={11} /> {row.status}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                              <Hourglass size={11} /> {row.status || 'PENDING'}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 text-center">
                          {hasProofUploaded ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check size={12} />
                              <span>Proof Uploaded</span>
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(idx);
                                setIsUploadModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black border bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition-all cursor-pointer"
                            >
                              <Upload size={12} />
                              <span>Add Proof</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SECTION: TRANSACTION DETAILS SIDEBAR */}
        {selectedTxn && isSidebarOpen && (
          <div className="xl:col-span-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs space-y-5 sticky top-4">

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-gray-900 tracking-tight">
                Transaction Details
              </h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl flex items-center gap-2.5 text-emerald-800">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-black">Status: {selectedTxn.status || 'ARRIVED'}</p>
                <p className="text-[10px] text-emerald-600 font-semibold">
                  Stage: {selectedTxn.processingStage || 'PROCESSING'}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <p className="text-[10px] text-gray-400 font-extrabold uppercase">Auction ID</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-extrabold text-gray-900 truncate max-w-[200px]">
                    {selectedTxn.auction?.auctionId || 'N/A'}
                  </span>
                  {selectedTxn.auction?.auctionId && (
                    <button
                      onClick={() => handleCopy(selectedTxn.auction?.auctionId || '')}
                      className="text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      <Copy size={13} />
                    </button>
                  )}
                  {copied && <span className="text-[9px] text-emerald-600 font-bold">Copied!</span>}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-extrabold uppercase">Vehicle Reg Number</p>
                <p className="font-black text-gray-900 mt-0.5 text-sm">
                  {selectedTxn.vehicleDetails?.registrationNumber || 'N/A'}
                </p>
              </div>

              <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 space-y-1">
                <p className="font-extrabold text-gray-900 text-xs">
                  {selectedTxn.vehicleDetails?.model || 'Car Name N/A'}
                </p>
                <p className="text-[10px] text-gray-500 font-bold">
                  Variant: {selectedTxn.vehicleDetails?.variant || 'N/A'}
                </p>
                <p className="text-[10px] text-gray-400 font-bold">
                  Manufacturing Year: {selectedTxn.vehicleDetails?.manufacturingYear || 'N/A'}
                </p>
              </div>
            </div>

            {/* UPLOADED PROOFS SECTION */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-900">Payment Proofs</h4>
                {(!selectedTxn.paymentProofs || selectedTxn.paymentProofs.length === 0) && (
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-extrabold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <Upload size={12} />
                    <span>Upload Proof</span>
                  </button>
                )}
              </div>

              {selectedTxn.paymentProofs && selectedTxn.paymentProofs.length > 0 ? (
                selectedTxn.paymentProofs.map((proof, pIdx) => (
                  <div key={proof.id || pIdx} className="border border-gray-100 bg-gray-50/50 p-2.5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText size={16} className="text-gray-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-extrabold text-gray-800 text-[11px] truncate">
                          {proof.fileName || `Proof_${pIdx + 1}`}
                        </p>
                      </div>
                    </div>
                    {proof.fileUrl && (
                      <a
                        href={proof.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-extrabold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-gray-400 italic">No payment proof uploaded yet.</p>
              )}
            </div>

            <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-xl flex items-start gap-2 text-blue-800">
              <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] font-semibold text-blue-700 leading-snug">
                Upload payment receipts for this vehicle to verify payouts with RescrapX admin.
              </p>
            </div>

          </div>
        )}

      </div>

      {/* PAYMENT PROOF UPLOAD MODAL */}
      {isUploadModalOpen && selectedTxn && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-gray-900">Upload Payment Proof</h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <p className="font-bold text-gray-700">
                Vehicle: {selectedTxn.vehicleDetails?.registrationNumber || 'N/A'}
              </p>
              <p className="text-gray-500">
                Model: {selectedTxn.vehicleDetails?.model || 'N/A'}
              </p>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors">
                <input
                  type="file"
                  id="proof-upload"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="proof-upload" className="cursor-pointer space-y-2 block">
                  <Upload size={24} className="mx-auto text-gray-400" />
                  <p className="text-xs font-bold text-gray-700">
                    {selectedFile ? selectedFile.name : 'Click to select payment proof (JPG, PNG, PDF)'}
                  </p>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B5B32] text-white hover:bg-[#094d2a] disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isUploading ? 'Uploading...' : 'Submit Payment Proof'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}