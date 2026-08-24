'use client'

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getPartnerPaymentsData } from '@/hooks/getPartnerPaymentsDataForAdmin';
import { approvePayment, rejectPayment } from '@/services/vehicle.service';
export const PaymentsAndSettlements: React.FC = () => {
  // SSR Hydration safeguard
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch real payment data into Redux
  getPartnerPaymentsData();
  const { PartnerPaymentsData } = useSelector((state: RootState) => state.admin);

  // Layout UI state
  const [activeTab, setActiveTab] = useState('Payments');
  const [activeSubTab, setActiveSubTab] = useState('Client Payments');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  // API interaction states
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const mainTabs = ['Overview', 'Payments', 'Settlements', 'Payouts to RVSF', 'Invoices', 'Transactions', 'Refunds & Deductions'];
  const subTabs = ['All Payments', 'Client Payments', 'RescrapX Payments'];

  // Handle Approve Action
  const handleApprove = async (vehicleId: string) => {
    if (!vehicleId) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await approvePayment(vehicleId);

      // Update local state directly instead of window.location.reload()
      if (selectedPayment && selectedPayment._id === vehicleId) {
        setSelectedPayment((prev: any) => ({ ...prev, paymentStatus: 'APPROVED' }));
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to approve payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Reject Action
  const handleReject = async (vehicleId: string) => {
    if (!vehicleId) return;
    if (!rejectionReason.trim()) {
      setErrorMsg('Please enter a rejection reason.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await rejectPayment(vehicleId, rejectionReason);
      if (selectedPayment && selectedPayment._id === vehicleId) {
        setSelectedPayment((prev: any) => ({
          ...prev,
          paymentStatus: 'REJECTED',
          rejectionReason,
        }));
      }
      setShowRejectInput(false);
      setRejectionReason('');
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to reject payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe Data Extraction
  const rawData = PartnerPaymentsData as any;
  const paymentsList: any[] = Array.isArray(rawData)
    ? rawData
    : rawData?.data || [];

  // Prevent Hydration mismatch by delaying dynamic render until client mount
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="animate-pulse text-slate-400 font-bold text-xs">Loading Payments & Settlements...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased w-full overflow-x-hidden">
      <div className="flex flex-col min-h-screen transition-all duration-300 w-full">
        <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto max-w-[1700px]">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Payments & Settlements</h2>
              <p className="text-xs text-slate-500 mt-0.5">Track and verify live vehicle payments across partners and clients.</p>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <div className="border-b border-slate-200 overflow-x-auto whitespace-nowrap flex gap-6 scrollbar-none">
            {mainTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 ${activeTab === tab ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Layout Split View */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

            {/* Table Area */}
            <div className={`${selectedPayment ? 'xl:col-span-8' : 'xl:col-span-12'} space-y-6 transition-all duration-300`}>

              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg w-fit">
                  {subTabs.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setActiveSubTab(sub)}
                      className={`text-xs px-3 py-1.5 rounded-md font-bold transition-all ${activeSubTab === sub ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                  <table className="w-full text-left text-xs text-slate-600 min-w-[950px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                        <th className="p-3">Vehicle / ID</th>
                        <th className="p-3">Owner / Customer</th>
                        <th className="p-3">Partner ID</th>
                        <th className="p-3">Pickup Charges</th>
                        <th className="p-3">Winning Bid</th>
                        <th className="p-3">Created Date</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentsList.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center p-6 text-slate-400 font-medium">
                            No payment records found.
                          </td>
                        </tr>
                      ) : (
                        paymentsList.map((row: any, idx: number) => {
                          const status = (row.paymentStatus || row.status || 'PENDING').toUpperCase();
                          const vehicleId = row._id || row.vehicleId;

                          return (
                            <tr
                              key={row._id || idx}
                              onClick={() => {
                                setSelectedPayment(row);
                                setShowRejectInput(false);
                                setErrorMsg('');
                              }}
                              className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${selectedPayment?._id === row._id ? 'bg-emerald-50/40' : ''
                                }`}
                            >
                              <td className="p-3 font-mono font-bold text-slate-900">
                                {vehicleId?.slice(-8) || 'N/A'}
                              </td>
                              <td className="p-3 font-mono text-slate-600">
                                {row.owner || 'N/A'}
                              </td>
                              <td className="p-3 font-mono text-slate-500">
                                {row.auctionResult?.partnerId || 'N/A'}
                              </td>
                              <td className="p-3 font-mono font-black text-slate-900">
                                ₹{row.pickupCharges ?? 0}
                              </td>
                              <td className="p-3 font-mono font-black text-emerald-700">
                                ₹{row.auctionResult?.winningBid ?? 0}
                              </td>
                              <td className="p-3 text-slate-500">
                                {row.createdAt ? new Date(row.createdAt).toISOString().split('T')[0] : 'N/A'}
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${status === 'APPROVED' || status === 'VERIFIED'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : status === 'REJECTED' || status === 'FAILED'
                                      ? 'bg-rose-50 text-rose-700 border-rose-100'
                                      : 'bg-amber-50 text-amber-700 border-amber-100'
                                  }`}>
                                  {status}
                                </span>
                              </td>
                              <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                {status === 'APPROVED' || status === 'VERIFIED' ? (
                                  <span className="text-emerald-600 font-bold text-[11px]">✓ Approved</span>
                                ) : status === 'REJECTED' || status === 'FAILED' ? (
                                  <span className="text-rose-600 font-bold text-[11px]">✕ Rejected</span>
                                ) : (
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => handleApprove(vehicleId)}
                                      disabled={isSubmitting}
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded font-bold text-[10px] transition-colors"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedPayment(row);
                                        setShowRejectInput(true);
                                      }}
                                      disabled={isSubmitting}
                                      className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 px-2.5 py-1 rounded font-bold text-[10px] transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </div>
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
            </div>

            {/* Right Drawer: Active Verification Panel */}
            {selectedPayment && (
              <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 sticky top-6 relative transition-all">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>

                <div className="pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Payment Details</h3>
                    <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded border">
                      {(selectedPayment.paymentStatus || selectedPayment.status || 'PENDING').toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] font-mono text-slate-400">
                    <div>VEHICLE ID<span className="block text-slate-800 font-bold mt-0.5 truncate">{selectedPayment._id}</span></div>
                    <div>OWNER ID<span className="block text-slate-800 font-bold mt-0.5 truncate">{selectedPayment.owner}</span></div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Financial Breakdown</span>
                  <div className="space-y-2 bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pickup Charges</span>
                      <span className="font-mono font-bold text-slate-800">₹{selectedPayment.pickupCharges ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Auction Winning Bid</span>
                      <span className="font-mono font-bold text-slate-800">₹{selectedPayment.auctionResult?.winningBid ?? 0}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100/70 pt-2">
                      <span className="text-slate-400 font-bold">Partner ID</span>
                      <span className="font-mono font-bold text-slate-900">{selectedPayment.auctionResult?.partnerId || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200 font-medium">
                    {errorMsg}
                  </div>
                )}

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {((selectedPayment.paymentStatus || selectedPayment.status || '').toUpperCase() === 'APPROVED' ||
                    (selectedPayment.paymentStatus || selectedPayment.status || '').toUpperCase() === 'VERIFIED') ? (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-center font-bold text-xs">
                      ✓ Payment Approved
                    </div>
                  ) : ((selectedPayment.paymentStatus || selectedPayment.status || '').toUpperCase() === 'REJECTED' ||
                    (selectedPayment.paymentStatus || selectedPayment.status || '').toUpperCase() === 'FAILED') ? (
                    <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg space-y-1">
                      <div className="font-bold text-xs text-center">✕ Payment Rejected</div>
                      {(selectedPayment.rejectionReason || rejectionReason) && (
                        <p className="text-[11px] text-rose-600 font-medium text-center">
                          Reason: {selectedPayment.rejectionReason || rejectionReason}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      {showRejectInput ? (
                        <div className="space-y-2">
                          <label className="font-bold text-slate-500 text-[10px] uppercase block">Reason for Rejection</label>
                          <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter detailed reason for rejecting this payment..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-rose-400 min-h-[70px] resize-none text-xs"
                          />
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => handleReject(selectedPayment._id)}
                              disabled={isSubmitting}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 rounded-lg transition-colors"
                            >
                              Confirm Reject
                            </button>
                            <button
                              onClick={() => setShowRejectInput(false)}
                              className="border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs py-2 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleApprove(selectedPayment._id)}
                            disabled={isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 rounded-lg shadow-sm transition-all text-center"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => setShowRejectInput(true)}
                            disabled={isSubmitting}
                            className="border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs py-2.5 rounded-lg transition-colors text-center"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
};