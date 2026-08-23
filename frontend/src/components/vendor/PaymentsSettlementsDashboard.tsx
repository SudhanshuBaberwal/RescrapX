'use client';

import React, { useState } from 'react';
import {
  FileText, ArrowDownRight, Calendar, Hourglass, CheckCircle2,
  XCircle, Eye, Copy, X, Filter, ChevronRight, Info
} from 'lucide-react';

interface Transaction {
  id: string;
  bookingId: string;
  regNumber: string;
  vehicleName: string;
  vehicleYear: string;
  vehicleImage: string;
  amount: number;
  serviceFee?: number;
  date: string;
  time: string;
  status: 'Paid' | 'Unpaid';
  ownerProofName?: string;
  ownerProofSize?: string;
  rescrapProofName?: string;
  rescrapProofSize?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN250822001',
    bookingId: 'BK250822041',
    regNumber: 'KA 03 AB 1234',
    vehicleName: 'Maruti Swift VDI',
    vehicleYear: '2012',
    vehicleImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=150&auto=format&fit=crop&q=80',
    amount: 18500,
    serviceFee: 2775,
    date: '22 Aug 2025',
    time: '10:35 AM',
    status: 'Paid',
    ownerProofName: 'Owner_Payment_Proof.jpg',
    ownerProofSize: '245 KB • JPG',
    rescrapProofName: 'RescrapX_Payment_Proof.jpg',
    rescrapProofSize: '312 KB • JPG',
  },
  {
    id: 'TXN250822002',
    bookingId: 'BK250822007',
    regNumber: 'KA 07 MD 7700',
    vehicleName: 'Toyota Innova 2.5 G',
    vehicleYear: '2011',
    vehicleImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=150&auto=format&fit=crop&q=80',
    amount: 27000,
    serviceFee: 4050,
    date: '22 Aug 2025',
    time: '09:15 AM',
    status: 'Paid',
    ownerProofName: 'Owner_Proof_Innova.pdf',
    ownerProofSize: '1.2 MB • PDF',
    rescrapProofName: 'Rescrap_Innova_Receipt.pdf',
    rescrapProofSize: '890 KB • PDF',
  },
  {
    id: 'TXN250821017',
    bookingId: 'BK250821012',
    regNumber: 'KA 05 CD 5678',
    vehicleName: 'Hyundai i10 Era',
    vehicleYear: '2011',
    vehicleImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150&auto=format&fit=crop&q=80',
    amount: 22000,
    serviceFee: 3300,
    date: '21 Aug 2025',
    time: '04:15 PM',
    status: 'Paid',
  },
  {
    id: 'TXN250820011',
    bookingId: 'BK250820029',
    regNumber: 'KA 02 EF 9101',
    vehicleName: 'Honda City ZX',
    vehicleYear: '2010',
    vehicleImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=150&auto=format&fit=crop&q=80',
    amount: 31000,
    serviceFee: 4650,
    date: '20 Aug 2025',
    time: '11:20 AM',
    status: 'Paid',
  },
  {
    id: 'TXN250819003',
    bookingId: 'BK250819008',
    regNumber: 'KA 04 GH 2245',
    vehicleName: 'Tata Indica Vista',
    vehicleYear: '2009',
    vehicleImage: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=150&auto=format&fit=crop&q=80',
    amount: 12800,
    serviceFee: 1920,
    date: '19 Aug 2025',
    time: '02:45 PM',
    status: 'Paid',
  },
  {
    id: 'TXN250822008',
    bookingId: 'BK250822010',
    regNumber: 'KA 09 XY 4455',
    vehicleName: 'Mahindra Bolero SLX',
    vehicleYear: '2013',
    vehicleImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150&auto=format&fit=crop&q=80',
    amount: 35000,
    date: '22 Aug 2025',
    time: '01:48 PM',
    status: 'Unpaid',
  },
  {
    id: 'TXN250821020',
    bookingId: 'BK250821071',
    regNumber: 'KA 04 MN 3344',
    vehicleName: 'Skoda Rapid Elegance',
    vehicleYear: '2012',
    vehicleImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=150&auto=format&fit=crop&q=80',
    amount: 28600,
    date: '21 Aug 2025',
    time: '06:20 PM',
    status: 'Unpaid',
  },
];

export default function PaymentsSettlementsDashboard() {
  const [selectedTxn, setSelectedTxn] = useState<Transaction>(mockTransactions[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (val: number) => {
    return '₹' + val.toLocaleString('en-IN');
  };

  return (
    <div className="w-full space-y-5 text-gray-900 font-sans">

      {/* TOP METRICS STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Transactions */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-bold text-xs">Total Transactions</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">56</h3>
            <span className="text-[10px] text-gray-400 font-bold">All time</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100/50">
            <FileText size={20} />
          </div>
        </div>

        {/* Total Received */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-bold text-xs">Total Received</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">₹8,72,450</h3>
            <span className="text-[10px] text-gray-400 font-bold">All time</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100/50">
            <ArrowDownRight size={20} />
          </div>
        </div>

        {/* This Month Received */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-bold text-xs">This Month Received</p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">₹1,25,300</h3>
            <span className="text-[10px] text-gray-400 font-bold">Aug 2025</span>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100/50">
            <Calendar size={20} />
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-gray-400 font-bold text-xs">Pending Payouts</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">₹68,200</h3>
            <span className="text-[10px] text-gray-400 font-bold">5 Transactions</span>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100/50">
            <Hourglass size={20} />
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER: TABLE (LEFT) + DETAILS DRAWER (RIGHT) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

        {/* LEFT SECTION: TRANSACTIONS TABLE */}
        <div className="xl:col-span-8 bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-50 pb-4">
            <div className="relative">
              <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Calendar size={14} className="text-gray-400" />
                <span>01 Aug 2025 - 22 Aug 2025</span>
              </button>
            </div>

            <div className="relative">
              <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Filter size={14} className="text-gray-400" />
                <span>All Status</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                  <th className="pb-3 font-extrabold">Transaction ID</th>
                  <th className="pb-3 font-extrabold">Vehicle Details</th>
                  <th className="pb-3 font-extrabold">Amount</th>
                  <th className="pb-3 font-extrabold">Date & Time</th>
                  <th className="pb-3 font-extrabold">Status</th>
                  <th className="pb-3 font-extrabold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {mockTransactions.map((row) => {
                  const isSelected = selectedTxn.id === row.id;
                  const isPaid = row.status === 'Paid';

                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedTxn(row)}
                      className={`group cursor-pointer transition-colors ${
                        isSelected ? 'bg-gray-50/80' : 'hover:bg-gray-50/50'
                      }`}
                    >
                      {/* Transaction & Booking ID */}
                      <td className="py-3.5 pr-2">
                        <p className="font-extrabold text-gray-900 group-hover:text-[#0B5B32] transition-colors">
                          {row.id}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold">
                          Booking ID: {row.bookingId}
                        </p>
                      </td>

                      {/* Vehicle Details */}
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={row.vehicleImage}
                            alt={row.vehicleName}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                          />
                          <div>
                            <p className="font-extrabold text-gray-900 text-xs">
                              {row.regNumber}
                            </p>
                            <p className="text-[11px] text-gray-500 font-medium leading-tight">
                              {row.vehicleName}
                            </p>
                            <p className="text-[9px] text-gray-400 font-bold">
                              {row.vehicleYear}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 pr-2">
                        <p
                          className={`font-black text-xs ${
                            isPaid ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {formatCurrency(row.amount)}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold">
                          {isPaid ? 'Received' : 'Pending'}
                        </p>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 pr-2">
                        <p className="font-extrabold text-gray-800 text-[11px]">
                          {row.date}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold">
                          {row.time}
                        </p>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 pr-2">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={11} /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black bg-red-50 text-red-600 border border-red-200">
                            <XCircle size={11} /> Unpaid
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 text-center">
                        <button
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${
                            isPaid
                              ? 'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                              : 'bg-white border-red-200 text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <Eye size={12} />
                          <span>{isPaid ? 'View Proof' : 'View Details'}</span>
                          <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SECTION: TRANSACTION DETAILS SIDEBAR */}
        <div className="xl:col-span-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs space-y-5 sticky top-4">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-black text-gray-900 tracking-tight">
              Transaction Details
            </h3>
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Status Banner */}
          {selectedTxn.status === 'Paid' ? (
            <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl flex items-center gap-2.5 text-emerald-800">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-black">Paid Transaction</p>
                <p className="text-[10px] text-emerald-600 font-semibold">
                  Payment has been completed for this booking.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-red-50/60 border border-red-100 p-3 rounded-xl flex items-center gap-2.5 text-red-800">
              <XCircle size={18} className="text-red-500 shrink-0" />
              <div>
                <p className="text-xs font-black">Pending Settlement</p>
                <p className="text-[10px] text-red-500 font-semibold">
                  Payment proof is pending upload or verification.
                </p>
              </div>
            </div>
          )}

          {/* Key Value Details Block */}
          <div className="space-y-3.5 text-xs">
            {/* Transaction ID */}
            <div>
              <p className="text-[10px] text-gray-400 font-extrabold uppercase">
                Transaction ID
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-extrabold text-gray-900">
                  {selectedTxn.id}
                </span>
                <button
                  onClick={() => handleCopy(selectedTxn.id)}
                  className="text-gray-400 hover:text-gray-700"
                  title="Copy ID"
                >
                  <Copy size={13} />
                </button>
                {copied && (
                  <span className="text-[9px] text-emerald-600 font-bold">
                    Copied!
                  </span>
                )}
              </div>
            </div>

            {/* Booking ID */}
            <div>
              <p className="text-[10px] text-gray-400 font-extrabold uppercase">
                Booking ID
              </p>
              <p className="font-extrabold text-gray-700 mt-0.5">
                {selectedTxn.bookingId}
              </p>
            </div>

            {/* Vehicle Number */}
            <div>
              <p className="text-[10px] text-gray-400 font-extrabold uppercase">
                Vehicle Number
              </p>
              <p className="font-black text-gray-900 mt-0.5 text-sm">
                {selectedTxn.regNumber}
              </p>
            </div>

            {/* Vehicle Card Mini */}
            <div className="flex items-center gap-3 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
              <img
                src={selectedTxn.vehicleImage}
                alt={selectedTxn.vehicleName}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
              />
              <div>
                <p className="font-extrabold text-gray-900 text-xs">
                  {selectedTxn.vehicleName}
                </p>
                <p className="text-[10px] text-gray-400 font-bold">
                  {selectedTxn.vehicleYear}
                </p>
              </div>
            </div>

            {/* Price Calculations Breakdown */}
            <div className="border-t border-b border-gray-100 py-3 space-y-2">
              <div className="flex justify-between text-gray-600 font-bold">
                <span>Final Agreed Price</span>
                <span className="text-gray-900">
                  {formatCurrency(selectedTxn.amount)}
                </span>
              </div>
              {selectedTxn.serviceFee && (
                <div className="flex justify-between text-gray-500 font-bold">
                  <span>RescrapX Service Fee</span>
                  <span className="text-red-500">
                    -{formatCurrency(selectedTxn.serviceFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gray-900 font-black text-sm pt-1 border-t border-gray-50">
                <span>Total Amount</span>
                <span className="text-emerald-600">
                  {formatCurrency(selectedTxn.amount)}
                </span>
              </div>
            </div>

            {/* Payment Status & Timestamp */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-extrabold text-[10px] uppercase">
                  Payment Status
                </span>
                {selectedTxn.status === 'Paid' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Paid
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-50 text-red-600 border border-red-200">
                    Unpaid
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-extrabold text-[10px] uppercase">
                  Date & Time
                </span>
                <span className="font-extrabold text-gray-800 text-[11px]">
                  {selectedTxn.date}, {selectedTxn.time}
                </span>
              </div>
            </div>
          </div>

          {/* Uploaded Payment Proofs Section */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h4 className="text-xs font-black text-gray-900">
              Uploaded Payment Proofs
            </h4>

            {/* Owner Proof */}
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 font-extrabold">
                Payment Proof of Car Owner
              </p>
              <p className="text-[9px] text-gray-400 font-medium">
                Uploaded on {selectedTxn.date}, 10:32 AM
              </p>
              <div className="border border-gray-100 bg-gray-50/50 p-2.5 rounded-xl flex items-center justify-between mt-1">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={16} className="text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-extrabold text-gray-800 text-[11px] truncate">
                      {selectedTxn.ownerProofName || 'Owner_Payment_Proof.jpg'}
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold">
                      {selectedTxn.ownerProofSize || '245 KB • JPG'}
                    </p>
                  </div>
                </div>
                <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-extrabold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 shrink-0 shadow-2xs">
                  <Eye size={12} />
                  <span>View</span>
                </button>
              </div>
            </div>

            {/* RescrapX Proof */}
            <div className="space-y-1 pt-1">
              <p className="text-[10px] text-gray-400 font-extrabold">
                Payment Proof of ReScrapX
              </p>
              <p className="text-[9px] text-gray-400 font-medium">
                Uploaded on {selectedTxn.date}, 10:33 AM
              </p>
              <div className="border border-gray-100 bg-gray-50/50 p-2.5 rounded-xl flex items-center justify-between mt-1">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={16} className="text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-extrabold text-gray-800 text-[11px] truncate">
                      {selectedTxn.rescrapProofName || 'RescrapX_Payment_Proof.jpg'}
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold">
                      {selectedTxn.rescrapProofSize || '312 KB • JPG'}
                    </p>
                  </div>
                </div>
                <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-extrabold px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 shrink-0 shadow-2xs">
                  <Eye size={12} />
                  <span>View</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Info Notice */}
          <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-xl flex items-start gap-2 text-blue-800">
            <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[10px] font-semibold text-blue-700 leading-snug">
              You can view the uploaded payment proofs for this completed transaction.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}