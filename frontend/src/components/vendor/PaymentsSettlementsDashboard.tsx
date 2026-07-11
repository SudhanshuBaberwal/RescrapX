'use client';

import React, { useState } from 'react';
import { 
  Wallet, ArrowDownCircle, FileText, Clock, CheckCircle2, 
  TrendingUp, Calendar, Search, SlidersHorizontal, RotateCcw, 
  ChevronDown, ChevronLeft, ChevronRight, MoreVertical, 
  Download, FileCheck, Landmark, ArrowUpRight
} from 'lucide-react';

export default function PaymentsSettlementsDashboard() {
  const [activeTab, setActiveTab] = useState('All Transactions');

  const overviewMetrics = [
    { title: 'Total Earnings', value: '₹28,56,000', label: 'All time', icon: Wallet, style: 'text-emerald-600 bg-emerald-50' },
    { title: 'Total Deductions', value: '₹1,86,500', label: 'All time', icon: ArrowDownCircle, style: 'text-blue-600 bg-blue-50' },
    { title: 'Settlements', value: '₹26,69,500', label: 'All time', icon: FileText, style: 'text-purple-600 bg-purple-50' },
    { title: 'Pending Settlements', value: '₹3,25,000', label: '2 Settlements', icon: Clock, style: 'text-amber-600 bg-amber-50' },
    { title: 'Paid Settlements', value: '₹23,44,500', label: '12 Settlements', icon: CheckCircle2, style: 'text-emerald-600 bg-emerald-50' },
    { title: 'This Month Earnings', value: '₹4,85,000', label: '8 Jun - 8 Jul 2025', icon: TrendingUp, style: 'text-amber-600 bg-amber-50' },
  ];

  const transactions = [
    { id: 'WO-250708-0012', vehicle: 'Maruti Swift Dzire 2014', subText: 'Won Order', type: 'Earning', typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', description: 'Final Offer Amount', subDesc: 'Winning Bid', amount: '+ ₹28,500', amountColor: 'text-emerald-600 font-black', status: 'Pending Settlement', statusColor: 'bg-amber-50 text-amber-700 border-amber-100', date: '08 Jul 2025', time: '10:15 AM' },
    { id: 'WO-250708-0012-D1', idDisplay: 'WO-250708-0012', vehicle: 'Maruti Swift Dzire 2014', type: 'Deduction', typeColor: 'bg-red-50 text-red-700 border-red-100', description: 'Pickup Charges', subDesc: 'Flat charge', amount: '- ₹1,200', amountColor: 'text-red-600 font-bold', status: 'Deducted', statusColor: 'bg-red-50 text-red-700 border-red-100', date: '08 Jul 2025', time: '10:15 AM' },
    { id: 'WO-250708-0012-D2', idDisplay: 'WO-250708-0012', vehicle: 'Maruti Swift Dzire 2014', type: 'Deduction', typeColor: 'bg-red-50 text-red-700 border-red-100', description: 'Documentation Charges', subDesc: 'RC & Legal Processing', amount: '- ₹850', amountColor: 'text-red-600 font-bold', status: 'Deducted', statusColor: 'bg-red-50 text-red-700 border-red-100', date: '08 Jul 2025', time: '10:15 AM' },
    { id: 'WO-250708-0009', vehicle: 'Hyundai i20 2016', subText: 'Won Order', type: 'Earning', typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', description: 'Final Offer Amount', subDesc: 'Winning Bid', amount: '+ ₹31,000', amountColor: 'text-emerald-600 font-black', status: 'Paid', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', date: '07 Jul 2025', time: '09:30 AM' },
    { id: 'WO-250708-0009-D1', idDisplay: 'WO-250708-0009', vehicle: 'Hyundai i20 2016', type: 'Deduction', typeColor: 'bg-red-50 text-red-700 border-red-100', description: 'Pickup Charges', subDesc: 'Flat charge', amount: '- ₹1,200', amountColor: 'text-red-600 font-bold', status: 'Paid', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', date: '07 Jul 2025', time: '09:30 AM' },
    { id: 'WO-250708-0009-D2', idDisplay: 'WO-250708-0009', vehicle: 'Hyundai i20 2016', type: 'Deduction', typeColor: 'bg-red-50 text-red-700 border-red-100', description: 'Documentation Charges', subDesc: 'RC & Legal Processing', amount: '- ₹850', amountColor: 'text-red-600 font-bold', status: 'Paid', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', date: '07 Jul 2025', time: '09:30 AM' },
    { id: 'WO-250708-0015', vehicle: 'Honda City 2012', subText: 'Won Order', type: 'Earning', typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', description: 'Final Offer Amount', subDesc: 'Winning Bid', amount: '+ ₹30,000', amountColor: 'text-emerald-600 font-black', status: 'Pending Settlement', statusColor: 'bg-amber-50 text-amber-700 border-amber-100', date: '07 Jul 2025', time: '11:05 AM' },
    { id: 'WO-250708-0007', vehicle: 'Tata Indica Vista 2011', subText: 'Won Order', type: 'Earning', typeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', description: 'Final Offer Amount', subDesc: 'Winning Bid', amount: '+ ₹24,000', amountColor: 'text-emerald-600 font-black', status: 'Paid', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', date: '07 Jul 2025', time: '10:20 AM' },
  ];

  return (
    <div className="space-y-6 w-full text-xs">
      
      {/* 1. TOP HEADER BRAND CONTROL ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-black text-gray-900 text-sm">Payments & Settlements</h3>
          <p className="text-[10px] text-gray-400 font-bold">Track payments, deductions and settlement history.</p>
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-3 py-1.5 font-black text-gray-700 flex items-center gap-2 self-start sm:self-auto shadow-3xs cursor-pointer">
          <Calendar size={13} className="text-[#0B5B32]" />
          <span>8 Jun 2025 - 8 Jul 2025</span>
          <ChevronDown size={11} className="text-gray-400" />
        </button>
      </div>

      {/* 2. SUMMARY METRICS HORIZONTAL BANNER GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {overviewMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex justify-between items-start">
              <div className="space-y-3">
                <span className="text-gray-400 font-bold block leading-tight">{m.title}</span>
                <div>
                  <span className="text-base font-black text-gray-900 tracking-tight block">{m.value}</span>
                  <span className="text-[9px] text-gray-400 font-bold block mt-0.5">{m.label}</span>
                </div>
              </div>
              <div className={`p-2 rounded-xl shrink-0 ${m.style}`}><Icon size={14} /></div>
            </div>
          );
        })}
      </div>

      {/* 3. MULTI-VARIABLE INPUT FILTER BLOCK */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="text-[10px] text-gray-400 font-black block mb-1">Search</span>
            <div className="relative">
              <input type="text" placeholder="Search by Order ID, Vehicle, etc." className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-700 font-medium placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white" />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {['Type', 'Status', 'Settlement Status'].map((fLabel, i) => (
            <div key={i}>
              <span className="text-[10px] text-gray-400 font-black block mb-1">{fLabel}</span>
              <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-bold flex items-center justify-between hover:bg-gray-100/50 transition-all">
                <span>All{i === 0 ? ' Types' : i === 1 ? ' Statuses' : ''}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>
            </div>
          ))}

          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Date Range</span>
            <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-600 font-bold flex items-center justify-between hover:bg-gray-100/50 transition-all">
              <span className="truncate">8 Jun 2025 - 8 Jul 2025</span>
              <Calendar size={12} className="text-gray-400 shrink-0 ml-1" />
            </button>
          </div>

          <div className="flex items-end gap-2">
            <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-3 py-2 font-black text-gray-700 flex items-center justify-center gap-1.5 h-[34px] shadow-3xs cursor-pointer">
              <SlidersHorizontal size={12} /> <span>Filters</span>
            </button>
            <button className="text-gray-400 hover:text-gray-600 font-bold flex items-center justify-center gap-1 text-[11px] h-[34px] px-2 cursor-pointer">
              <RotateCcw size={11} /> <span className="whitespace-nowrap">Clear All</span>
            </button>
          </div>

        </div>
      </div>

      {/* 4. SPLIT DATA CANVAS VIEW: SPREADSHEET LEDGER + SIDEBAR INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        
        {/* MAIN LEDGER SHEET BLOCK */}
        <div className="lg:col-span-2 xl:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">
          
          {/* Internal Navigation Anchor Tabs */}
          <div className="border-b border-gray-100 px-4 pt-2">
            <div className="flex gap-6 overflow-x-auto scrollbar-none">
              {['All Transactions', 'Earnings', 'Deductions', 'Settlements'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 font-black text-[11px] transition-all relative cursor-pointer whitespace-nowrap ${
                    activeTab === tab ? 'text-[#0B5B32]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B5B32] rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* DESKTOP RESPONSIVE GRID MATRIX TABULAR ENGINE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-black">Order ID / Vehicle</th>
                  <th className="py-3 px-2 font-black">Type</th>
                  <th className="py-3 px-2 font-black">Description</th>
                  <th className="py-3 px-2 font-black">Amount</th>
                  <th className="py-3 px-2 font-black">Status</th>
                  <th className="py-3 px-2 font-black">Date & Time</th>
                  <th className="py-3 px-4 font-black text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                {transactions.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/40 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="space-y-0.5">
                        <span className="font-black text-gray-900 block tracking-tight">{item.idDisplay || item.id}</span>
                        <p className="text-[10px] text-gray-500 font-bold block">{item.vehicle}</p>
                        {item.subText && <span className="inline-block text-[8px] px-1 bg-gray-100 text-gray-500 rounded font-black mt-0.5 uppercase tracking-wide">{item.subText}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider border ${item.typeColor}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-gray-800">{item.description}</p>
                      <p className="text-[9px] text-gray-400 font-medium">{item.subDesc}</p>
                    </td>
                    <td className={`py-3.5 px-2 text-[13px] ${item.amountColor}`}>{item.amount}</td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider border ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-gray-500 font-bold text-[10px]">
                      <p className="text-gray-700">{item.date}</p>
                      <p className="text-gray-400 font-normal">{item.time}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-2.5 py-1 rounded-xl shadow-3xs transition-all h-7 cursor-pointer">
                          View Details
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer"><MoreVertical size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE FEED LIST CARD WRAPPER */}
          <div className="md:hidden divide-y divide-gray-100">
            {transactions.map((item, idx) => (
              <div key={idx} className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-black text-gray-900 text-xs">{item.idDisplay || item.id}</span>
                    <p className="text-[10px] text-gray-500 font-bold">{item.vehicle}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md font-black text-[8px] uppercase tracking-wider border ${item.typeColor}`}>
                    {item.type}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block">Description</span>
                    <p className="font-bold text-gray-800 leading-tight">{item.description}</p>
                    <p className="text-[9px] text-gray-400">{item.subDesc}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 font-bold block">Valuation</span>
                    <p className={`text-sm ${item.amountColor}`}>{item.amount}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex gap-2">
                    <span className={`px-1.5 py-0.2 rounded font-black text-[8px] uppercase tracking-wider border self-center ${item.statusColor}`}>
                      {item.status}
                    </span>
                    <span className="text-gray-400 font-medium">{item.date} • {item.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="border border-gray-200 px-2.5 py-1 rounded-lg font-black text-gray-700 text-[10px] bg-white cursor-pointer">
                      Details
                    </button>
                    <button className="p-1 text-gray-400"><MoreVertical size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SHEET COUNTER PAGINATION FOOTER */}
          <div className="bg-white border-t border-gray-100 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 font-bold text-[11px]">
            <span>Showing <strong className="text-gray-800 font-black">1 to 8</strong> of <strong className="text-gray-800 font-black">24</strong> transactions</span>
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 disabled:opacity-40" disabled><ChevronLeft size={13} /></button>
              <button className="w-6 h-6 rounded-lg flex items-center justify-center font-black bg-[#0B5B32] text-white">1</button>
              <button className="w-6 h-6 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50">2</button>
              <button className="w-6 h-6 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50">3</button>
              <button className="w-6 h-6 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400"><ChevronRight size={13} /></button>
            </div>
          </div>

        </div>

        {/* STICKY STACKED SIDEBAR DETAILS PANEL INSPECTOR */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-4 lg:sticky lg:top-4">
          
          <div className="flex items-center gap-2 pb-2.5 border-b border-gray-50">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-[#0B5B32] shrink-0">
              <FileCheck size={14} />
            </div>
            <div>
              <h4 className="font-black text-gray-900 text-[12px] tracking-tight">Transaction Details</h4>
            </div>
          </div>

          {/* Core Fields Content Parameters Matrix */}
          <div className="space-y-2.5 text-[11px]">
            {[
              { label: 'Order ID', value: 'WO-250708-0012', emphasis: 'font-black text-gray-900' },
              { label: 'Vehicle', value: 'Maruti Swift Dzire 2014', emphasis: 'font-bold text-gray-800' },
              { label: 'Transaction Type', valBadge: true, valBadgeMarkup: <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-black px-2 py-0.2 rounded text-[9px] uppercase tracking-wider">Earning</span> },
              { label: 'Description', value: 'Final Offer Amount (Winning Bid)', emphasis: 'text-gray-600 font-medium' },
              { label: 'Amount', valBadge: true, valBadgeMarkup: <span className="text-emerald-600 font-black text-xs flex items-center gap-1"><span>+</span> <span>₹28,500</span></span> },
              { label: 'Status', valBadge: true, valBadgeMarkup: <span className="bg-amber-50 border border-amber-100 text-amber-700 font-black px-2 py-0.2 rounded text-[9px] uppercase tracking-wider">Pending Settlement</span> },
              { label: 'Date & Time', value: '08 Jul 2025, 10:15 AM', emphasis: 'text-gray-600 font-medium' },
            ].map((row, rIdx) => (
              <div key={rIdx} className="flex justify-between items-start gap-4">
                <span className="text-gray-400 font-bold shrink-0">{row.label}</span>
                {row.valBadge ? (
                  <div className="text-right">{row.valBadgeMarkup}</div>
                ) : (
                  <span className={`text-right ${row.emphasis}`}>{row.value}</span>
                )}
              </div>
            ))}
          </div>

          {/* Secondary Settlement Accounting Meta Block */}
          <div className="pt-3 border-t border-dashed border-gray-100 space-y-3">
            <h5 className="font-black text-gray-900 text-[10px] uppercase tracking-wider flex items-center gap-1 text-gray-400">
              <Landmark size={11} /> <span>Settlement Info</span>
            </h5>
            
            <div className="space-y-2.5 text-[11px]">
              {[
                { label: 'Settlement ID', value: 'STL-250708-0004' },
                { label: 'Expected Settlement Date', value: '10 Jul 2025', emphasis: 'font-black text-gray-800' },
                { label: 'Settlement Method', value: 'Bank Transfer' },
                { label: 'Bank Details', value: 'HDFC Bank\nA/c No. **** **** 4567', pre: true },
              ].map((subRow, sIdx) => (
                <div key={sIdx} className="flex justify-between items-start gap-4">
                  <span className="text-gray-400 font-bold shrink-0">{subRow.label}</span>
                  {subRow.pre ? (
                    <pre className="text-right font-bold text-gray-800 font-sans leading-tight whitespace-pre-line">{subRow.value}</pre>
                  ) : (
                    <span className={`text-right font-bold text-gray-700 ${subRow.emphasis || ''}`}>{subRow.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Invoice Document Download Button Wrapper */}
          <div className="pt-2">
            <button className="w-full bg-white border border-emerald-800/20 hover:bg-emerald-50 text-[#0B5B32] font-black py-2 rounded-xl text-center shadow-3xs transition-all flex items-center justify-center gap-1.5 h-8 border-dashed cursor-pointer">
              <Download size={13} /> <span>Download Invoice</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}