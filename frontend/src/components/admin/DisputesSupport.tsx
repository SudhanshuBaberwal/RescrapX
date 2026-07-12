'use client'

import React, { useState } from 'react';

export const DisputesSupport: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All Disputes');
  const [selectedDispute, setSelectedDispute] = useState<string>('DIS25060078');

  const tabs = ['All Disputes', 'Open', 'In Review', 'Resolved', 'Escalated', 'Closed'];

  const supportKPIs = [
    { title: 'Total Disputes', value: '128', sub: '▲ 12.6%', subColor: 'text-emerald-600 bg-emerald-50' },
    { title: 'Open Disputes', value: '42', sub: '32.8% of total', subColor: 'text-amber-600 bg-amber-50' },
    { title: 'In Review', value: '28', sub: '21.9% of total', subColor: 'text-purple-600 bg-purple-50' },
    { title: 'Resolved', value: '52', sub: '40.6% of total', subColor: 'text-emerald-600 bg-emerald-50' },
    { title: 'Escalated', value: '6', sub: '4.7% of total', subColor: 'text-rose-600 bg-rose-50' },
  ];

  const disputesList = [
    { id: 'DIS25060078', type: 'Payment to Client', raisedBy: 'RVSF Partner', partner: 'Green Auto RVSF', extra: '(RVSF0012)', related: 'Booking ID BK25060123', amount: '₹58,200', priority: 'High', pColor: 'text-rose-600 bg-rose-50 border-rose-100', status: 'Open', sColor: 'text-amber-700 bg-amber-50 border-amber-100', date: '02 Jun 2025', time: '10:23 AM' },
    { id: 'DIS25060077', type: 'Payment to RescrapX', raisedBy: 'RVSF Partner', partner: 'MetalPro RVSF', extra: '(RVSF0008)', related: 'Invoice ID INV25060031', amount: '₹5,820', priority: 'Medium', pColor: 'text-amber-600 bg-amber-50 border-amber-100', status: 'In Review', sColor: 'text-purple-700 bg-purple-50 border-purple-100', date: '02 Jun 2025', time: '09:45 AM' },
    { id: 'DIS25060076', type: 'Pickup Charges', raisedBy: 'Customer', partner: 'Amit Kumar', extra: '(9876543210)', related: 'Booking ID BK25060115', amount: '₹1,500', priority: 'Low', pColor: 'text-emerald-600 bg-emerald-50 border-emerald-100', status: 'Open', sColor: 'text-amber-700 bg-amber-50 border-amber-100', date: '01 Jun 2025', time: '08:30 PM' },
    { id: 'DIS25060075', type: 'Payment to Client', raisedBy: 'RVSF Partner', partner: 'EcoScrap Pvt. Ltd.', extra: '(RVSF0015)', related: 'Booking ID BK25060105', amount: '₹72,400', priority: 'High', pColor: 'text-rose-600 bg-rose-50 border-rose-100', status: 'In Review', sColor: 'text-purple-700 bg-purple-50 border-purple-100', date: '01 Jun 2025', time: '06:15 PM' },
  ];

  return (
    <div className="bg-slate-50 text-slate-800 antialiased w-full overflow-x-hidden">
      {/* 1. Sidebar Component Layout Wrapper */}

      {/* Main Structural Column View Canvas Frame */}
      <div className="flex flex-col min-h-screen transition-all duration-300 w-full">
        
        {/* 2. Platform Upper Context Navbar Header */}

        {/* Dashboard Workspace Context Body Routing Block */}
        <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">
          
          {/* Main Module Action Title Ribbon Bar Container */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Disputes & Support</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage disputes, queries and support requests raised by RVSF partners and customers.</p>
            </div>
            <button className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm self-start sm:self-auto shrink-0 flex items-center gap-1.5">
              📤 Export Report
            </button>
          </div>

          {/* Metrics Quick Analytics Row Blocks Panel */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {supportKPIs.map((kpi, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase truncate">{kpi.title}</span>
                <div className="mt-2">
                  <div className="text-xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
                  <div className={`text-[10px] inline-block mt-1 px-1.5 py-0.5 rounded font-bold ${kpi.subColor}`}>
                    {kpi.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filtering Context Row Tabs Ribbon Controls */}
          <div className="border-b border-slate-200 overflow-x-auto whitespace-nowrap flex gap-6 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 ${
                  activeTab === tab ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Master Detail Grid Split Workplace Screen Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Ledger Master Query Table Wrapper Frame */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Disputes List <span className="text-slate-400 font-normal">(128)</span></h3>
                <div className="flex flex-wrap gap-2">
                  <select className="border border-slate-200 rounded-lg p-1.5 text-[11px] outline-none font-medium bg-slate-50"><option>Dispute Type</option></select>
                  <select className="border border-slate-200 rounded-lg p-1.5 text-[11px] outline-none font-medium bg-slate-50"><option>Priority</option></select>
                </div>
              </div>

              {/* Data Table Horizontal Scroll Shield Container */}
              <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600 min-w-[850px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3">Dispute ID</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Raised By</th>
                      <th className="p-3">Partner / Customer</th>
                      <th className="p-3">Related To</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3 text-center">Priority</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {disputesList.map((row, i) => (
                      <tr 
                        key={i} 
                        onClick={() => setSelectedDispute(row.id)}
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedDispute === row.id ? 'bg-emerald-50/20' : ''}`}
                      >
                        <td className="p-3 font-mono font-bold text-slate-900">{row.id}</td>
                        <td className="p-3 font-medium text-slate-700">{row.type}</td>
                        <td className="p-3 text-slate-500">{row.raisedBy}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{row.partner}</div>
                          <span className="text-[10px] text-slate-400">{row.extra}</span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">{row.related}</td>
                        <td className="p-3 font-bold text-slate-900">{row.amount}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.pColor}`}>
                            {row.priority}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${row.sColor}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Interactive Sidebar Context Context Detail View Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm xl:col-span-4 space-y-5">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Dispute Details</h3>
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Open</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Dispute ID: {selectedDispute}</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
              </div>

              {/* Data Overview Grid Module block */}
              <div className="grid grid-cols-2 gap-4 text-xs border-b border-slate-100 pb-4">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Dispute Type</span>
                  <span className="font-bold text-slate-800">Payment to Client</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Related To</span>
                  <span className="font-mono font-bold text-slate-800">BK25060123</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Raised By</span>
                  <span className="font-semibold text-slate-800">RVSF Partner</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Amount Involved</span>
                  <span className="font-black text-slate-900 text-sm">₹58,200</span>
                </div>
              </div>

              {/* Description Core Text Paragraph block */}
              <div className="space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Issue Description</span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  Payment of ₹58,200 made to customer Rahul Sharma for vehicle Maruti Swift 2016, but customer is claiming payment not received.
                </p>
              </div>

              {/* Action History Dispute Timeline Workflow Area */}
              <div className="space-y-3">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Dispute Timeline</span>
                <div className="relative border-l border-slate-200 pl-4 ml-1 space-y-4 text-xs">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0.5 bg-emerald-500 w-2.5 h-2.5 rounded-full ring-4 ring-white" />
                    <div className="font-bold text-slate-800">Dispute Raised</div>
                    <p className="text-[11px] text-slate-400">By Green Auto RVSF • 02 Jun, 10:23 AM</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0.5 bg-purple-500 w-2.5 h-2.5 rounded-full ring-4 ring-white" />
                    <div className="font-bold text-slate-800">Under Review</div>
                    <p className="text-[11px] text-slate-500">Requested additional payment proof from partner node layer.</p>
                  </div>
                </div>
              </div>

              {/* Interactive Module Context Footer Drawer Panel inside Detail Section Container card */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                <button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs py-2 px-3 rounded-lg border border-red-100 transition-colors">
                  ✕ Reject
                </button>
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2 px-3 rounded-lg transition-all shadow-sm shadow-emerald-600/10">
                  ✓ Approve Payment
                </button>
              </div>
            </div>

          </div>

        </main>

        {/* Global Structural Route Footer Navigation Segment */}
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
          <p>© 2026 RescrapX. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Support documentation manual</a>
          </div>
        </footer>

      </div>
    </div>
  );
};