'use client'

import React, { useState } from 'react';
import { 
  Search, Calendar, ChevronDown, Download, Headphones, 
  CreditCard, RefreshCw, CheckCircle2, AlertCircle, HelpCircle, 
  Wallet, ChevronLeft, ChevronRight, ShieldCheck, Receipt, Percent
} from 'lucide-react';

export default function PaymentHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: "Total Paid", amount: "₹ 18,500", subText: "All time payments", color: "text-emerald-600", bg: "bg-emerald-50", icon: Wallet },
    { label: "Total Transactions", count: 3, subText: "All payments made", color: "text-blue-600", bg: "bg-blue-50", icon: CreditCard },
    { label: "Total Refunded", amount: "₹ 0", subText: "All time refunds", color: "text-amber-600", bg: "bg-amber-50", icon: RefreshCw },
    { label: "Net Amount Paid", amount: "₹ 18,500", subText: "After refunds", color: "text-purple-600", bg: "bg-purple-50", icon: Receipt },
  ];

  const transactions = [
    { date: "10 July 2024", time: "11:35 AM", bookingId: "RX240015", car: "2014 Maruti Swift Dzire", desc: "Final Payment", subDesc: "Vehicle Scrapping Payment", amount: "₹ 18,500", method: "UPI", methodDetails: "shubham@upi", status: "Success" },
    { date: "05 July 2024", time: "10:15 AM", bookingId: "RX240015", car: "2014 Maruti Swift Dzire", desc: "Advance Payment", subDesc: "Booking Confirmation", amount: "₹ 2,000", method: "UPI", methodDetails: "shubham@upi", status: "Success" },
    { date: "28 June 2024", time: "02:45 PM", bookingId: "RX240009", car: "2011 Hyundai i20", desc: "Final Payment", subDesc: "Vehicle Scrapping Payment", amount: "₹ 16,000", method: "Net Banking", methodDetails: "HDFC Bank ****4567", status: "Success" },
    { date: "20 June 2024", time: "09:20 AM", bookingId: "RX240009", car: "2011 Hyundai i20", desc: "Advance Payment", subDesc: "Booking Confirmation", amount: "₹ 2,000", method: "UPI", methodDetails: "shubham@upi", status: "Success" },
    { date: "18 June 2024", time: "04:10 PM", bookingId: "RX240003", car: "2009 Tata Indica Vista", desc: "Booking Cancellation", subDesc: "Refund Processed", amount: "- ₹ 2,000", method: "Original Payment", methodDetails: "UPI", status: "Refunded" },
    { date: "18 June 2024", time: "03:40 PM", bookingId: "RX240003", car: "2009 Tata Indica Vista", desc: "Advance Payment", subDesc: "Booking Confirmation", amount: "₹ 2,000", method: "UPI", methodDetails: "shubham@upi", status: "Failed" },
    { date: "12 June 2024", time: "01:05 PM", bookingId: "RX240001", car: "2016 Honda City", desc: "Final Payment", subDesc: "Vehicle Scrapping Payment", amount: "₹ 21,500", method: "Debit Card", methodDetails: "**** 4567", status: "Success" },
  ];

  return (
    <div className="w-full space-y-6 text-[#374151]">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Payment History</h1>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">Track all your payments and transactions in one place.</p>
        </div>
        
        {/* Help Banner Box */}
        <div className="flex items-center gap-4 bg-emerald-50/40 border border-emerald-100 rounded-xl px-4 py-3 max-w-sm w-full md:w-auto">
          <div className="text-emerald-700 bg-white p-1.5 rounded-lg border border-emerald-100 shrink-0">
            <Headphones size={16} />
          </div>
          <div className="text-[11px] leading-tight flex-1">
            <p className="font-extrabold text-gray-800">Need help with a payment?</p>
            <p className="text-gray-400 font-medium mt-0.5">Our support team is here to help you.</p>
          </div>
          <button className="text-[11px] font-black text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shrink-0 hover:bg-gray-50 transition shadow-2xs">
            Contact Support
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* METRIC CARDS TRACKER GRID                  */}
      {/* ========================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-3.5 shadow-2xs">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900 leading-none">
                  {stat.amount || stat.count}
                </p>
                <p className="text-[11px] font-black text-gray-800 mt-1.5">{stat.label}</p>
                <p className="text-[10px] font-medium text-gray-400">{stat.subText}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* FILTER CONTROLS TOOLBAR                     */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Engine Field */}
        <div className="sm:col-span-6 relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input 
            type="text" 
            placeholder="Search by Booking ID or Transaction ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#0B5B32] shadow-2xs placeholder:text-gray-400"
          />
        </div>

        {/* Date Filter Dropdown */}
        <div className="sm:col-span-3 relative w-full">
          <button className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-700 flex items-center justify-between shadow-2xs hover:bg-gray-50 transition">
            <span className="flex items-center gap-2 text-gray-600"><Calendar size={14} className="text-gray-400" /> All Bookings</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>

        {/* Transaction Category Dropdown */}
        <div className="sm:col-span-3 relative w-full">
          <button className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-700 flex items-center justify-between shadow-2xs hover:bg-gray-50 transition">
            <span className="text-gray-600">All Transactions</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* DATATABLE DATA TABLE GRID                 */}
      {/* ========================================== */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-2xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-600">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition">
                  {/* Timestamp */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-extrabold text-gray-800">{tx.date}</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{tx.time}</p>
                  </td>

                  {/* ID Scope */}
                  <td className="py-3.5 px-4">
                    <p className="font-mono font-black text-gray-900 leading-tight">{tx.bookingId}</p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">{tx.car}</p>
                  </td>

                  {/* Context Descriptions */}
                  <td className="py-3.5 px-4">
                    <p className={`font-black ${tx.status === 'Refunded' ? 'text-red-600' : 'text-gray-900'} leading-tight`}>{tx.desc}</p>
                    <p className="text-[11px] text-gray-400 font-medium mt-0.5">{tx.subDesc}</p>
                  </td>

                  {/* Pricing Matrix values */}
                  <td className={`py-3.5 px-4 font-black ${tx.status === 'Refunded' ? 'text-red-600' : 'text-gray-900'} text-sm whitespace-nowrap`}>
                    {tx.amount}
                  </td>

                  {/* Process Protocols */}
                  <td className="py-3.5 px-4">
                    <p className="font-extrabold text-gray-800 flex items-center gap-1.5 leading-tight">
                      {tx.method === 'UPI' && <span className="text-[9px] font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-500 font-black">⚡ UPI</span>}
                      {tx.method !== 'UPI' && <span>{tx.method}</span>}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium font-mono mt-0.5">{tx.methodDetails}</p>
                  </td>

                  {/* Status Badges */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md ${
                      tx.status === 'Success' ? 'bg-emerald-50 text-emerald-700' :
                      tx.status === 'Refunded' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        tx.status === 'Success' ? 'bg-emerald-600' :
                        tx.status === 'Refunded' ? 'bg-blue-600' : 'bg-red-600'
                      }`} />
                      {tx.status}
                    </span>
                  </td>

                  {/* Action Sheets download link */}
                  <td className="py-3.5 px-4 text-center">
                    <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Datatable Footer Pagination Component */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400 bg-gray-50/20">
          <span>Showing 1 to 7 of 7 transactions</span>
          <div className="flex items-center gap-1">
            <button className="p-1 border border-gray-200 bg-white rounded-md text-gray-300 cursor-not-allowed"><ChevronLeft size={14} /></button>
            <button className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-[#0B5B32] font-black rounded-md">1</button>
            <button className="p-1 border border-gray-200 bg-white rounded-md text-gray-300 cursor-not-allowed"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* VALUE ASSURANCE ACCREDITATION SECTION      */}
      {/* ========================================== */}
      <div className="bg-emerald-50/30 border border-emerald-100/70 rounded-2xl p-5 flex flex-col lg:flex-row items-center gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 relative bg-white border border-emerald-100 rounded-xl flex items-center justify-center text-2xl shadow-2xs shrink-0">
            👛
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">Secure & Transparent Payments</h4>
            <p className="text-xs text-gray-400 font-medium max-w-sm mt-0.5 leading-relaxed">
              All payments on RescrapX are secure, encrypted and processed through trusted payment gateways.
            </p>
          </div>
        </div>

        {/* Brand Indicators Layout Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 flex-1 w-full text-xs">
          <div className="flex items-start gap-2">
            <ShieldCheck size={14} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-gray-900">100% Secure</p>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5 leading-tight">SSL encrypted transactions</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Percent size={14} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-gray-900">No Hidden Charges</p>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5 leading-tight">What you see is what you pay</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Receipt size={14} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-gray-900">Instant Receipts</p>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5 leading-tight">Receipts generated instantly</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <HelpCircle size={14} className="text-[#0B5B32] shrink-0 mt-0.5" />
            <div>
              <p className="font-black text-gray-900">Refund Support</p>
              <p className="text-[10px] font-medium text-gray-400 mt-0.5 leading-tight">Quick refunds on cancellations</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}