'use client'

import React, { useState } from 'react';

export const PaymentsAndSettlements: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Payments');
  const [activeSubTab, setActiveSubTab] = useState('Client Payments');
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(true);

  const mainTabs = ['Overview', 'Payments', 'Settlements', 'Payouts to RVSF', 'Invoices', 'Transactions', 'Refunds & Deductions'];
  const subTabs = ['All Payments', 'Client Payments', 'RescrapX Payments'];

  const overviewKPIs = [
    { title: 'Total Payments Collected', value: '₹2,48,75,000', change: '+18.6% vs last month', isPositive: true },
    { title: 'Total Payments to Clients', value: '₹1,98,40,000', change: '+17.2% vs last month', isPositive: true },
    { title: 'Total Payments to RescrapX', value: '₹25,60,000', change: '+14.3% vs last month', isPositive: true },
    { title: 'Pending Verifications', value: '₹32,10,000', change: '18 Payments', isPositive: null },
    { title: 'Verified Payments', value: '1,356', change: '+16.8% vs last month', isPositive: true },
    { title: 'Failed / Rejected', value: '24', change: '▲ 3.2% vs last month', isPositive: false },
  ];

  const clientPayments = [
    { payId: 'CLI25060071', bId: 'BK25060123', partner: 'Green Auto RVSF', pId: 'RVSF0012', customer: 'Rahul Sharma', phone: '9876543210', amount: '₹58,200', date: '02 Jun 2025', time: '10:23 AM', utr: 'SBIN325153987612', status: 'Pending', verification: 'Pending' },
    { payId: 'CLI25060070', bId: 'BK25060122', partner: 'MetalPro RVSF', pId: 'RVSF0008', customer: 'Priya Verma', phone: '9811223344', amount: '₹72,400', date: '02 Jun 2025', time: '09:45 AM', utr: 'HDFC325150887654', status: 'Verified', verification: 'Verified by Admin' },
    { payId: 'CLI25060069', bId: 'BK25060121', partner: 'EcoScrap Pvt. Ltd.', pId: 'RVSF0015', customer: 'Amit Kumar', phone: '9712345678', amount: '₹1,08,000', date: '02 Jun 2025', time: '09:15 AM', utr: 'ICIC325150776543', status: 'Pending', verification: 'Pending' },
    { payId: 'CLI25060068', bId: 'BK25060120', partner: 'Prime Recycling', pId: 'RVSF0009', customer: 'Neha Singh', phone: '9890877665', amount: '₹45,800', date: '01 Jun 2025', time: '08:34 AM', utr: 'KKBK325148887612', status: 'Verified', verification: 'Verified by Admin' },
    { payId: 'CLI25060067', bId: 'BK25060119', partner: 'Shakti RVSF', pId: 'RVSF0016', customer: 'Turesh Yadav', phone: '9876548832', amount: '₹93,600', date: '01 Jun 2025', time: '07:18 PM', utr: 'SBIN325148776543', status: 'Failed', verification: 'Rejected by Admin' },
  ];

  const rescrapXPayments = [
    { payId: 'RES25060031', partner: 'Green Auto RVSF', pId: 'RVSF0012', invId: 'INV25060031', amount: '₹5,820', date: '02 Jun 2025', time: '10:30 AM', utr: 'SBIN325154112233', status: 'Pending', verification: 'Pending' },
    { payId: 'RES25060030', partner: 'MetalPro RVSF', pId: 'RVSF0008', invId: 'INV25060030', amount: '₹7,240', date: '02 Jun 2025', time: '09:50 AM', utr: 'HDFC325151223344', status: 'Verified', verification: 'Verified by Admin' },
    { payId: 'RES25060029', partner: 'EcoScrap Pvt. Ltd.', pId: 'RVSF0015', invId: 'INV25060029', amount: '₹10,800', date: '01 Jun 2025', time: '04:50 PM', utr: 'ICIC325150334455', status: 'Pending', verification: 'Pending' },
    { payId: 'RES25060028', partner: 'Prime Recycling', pId: 'RVSF0009', invId: 'INV25060028', amount: '₹4,580', date: '01 Jun 2025', time: '03:40 PM', utr: 'KKBK325149556677', status: 'Verified', verification: 'Verified by Admin' },
    { payId: 'RES25060027', partner: 'Shakti RVSF', pId: 'RVSF0016', invId: 'INV25060027', amount: '₹9,360', date: '01 Jun 2025', time: '02:20 PM', utr: 'SBIN325149778899', status: 'Verified', verification: 'Verified by Admin' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased w-full overflow-x-hidden">
      <div className="flex flex-col min-h-screen transition-all duration-300 w-full">
        
        {/* Dynamic Inner Workspace Viewport */}
        <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto max-w-[1700px]">
          
          {/* Main Module Layout Top Bar Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Payments & Settlements</h2>
              <p className="text-xs text-slate-500 mt-0.5">Track and verify payments between RVSF, RescrapX and customers.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-600 shadow-sm outline-none">
                <option>01 Jun 2025 - 02 Jun 2025</option>
              </select>
              <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-1.5">
                📤 Export Report
              </button>
            </div>
          </div>

          {/* Overview Aggregations Numeric KPI Matrix Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {overviewKPIs.map((kpi, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <span className="text-[10px] font-bold tracking-tight text-slate-400 uppercase truncate">{kpi.title}</span>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900 tracking-tight">{kpi.value}</div>
                  <div className={`text-[10px] inline-block mt-1 font-bold ${
                    kpi.isPositive === true ? 'text-emerald-600' : kpi.isPositive === false ? 'text-rose-600' : 'text-amber-600'
                  }`}>
                    {kpi.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Module Navigation Structural Context Tabs */}
          <div className="border-b border-slate-200 overflow-x-auto whitespace-nowrap flex gap-6 scrollbar-none">
            {mainTabs.map((tab) => (
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

          {/* Dual Main Content Grid split frame view workspace layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Frame: Controls, Filters Matrix and Core Activity Ledger Tables */}
            <div className={`${isDetailPanelOpen ? 'xl:col-span-8' : 'xl:col-span-12'} space-y-6 transition-all duration-300`}>
              
              {/* Internal Filtering Layer Container */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg w-fit">
                    {subTabs.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setActiveSubTab(sub)}
                        className={`text-xs px-3 py-1.5 rounded-md font-bold transition-all ${
                          activeSubTab === sub ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                  {!isDetailPanelOpen && (
                    <button 
                      onClick={() => setIsDetailPanelOpen(true)}
                      className="text-emerald-600 hover:text-emerald-700 font-bold text-xs"
                    >
                      👁️ Show Review Panel
                    </button>
                  )}
                </div>

                {/* Advanced Select Dropdowns Drop parameters matrix box */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 text-[10px] uppercase">RVSF Partner</label>
                    <select className="bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-600 outline-none"><option>All Partners</option></select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 text-[10px] uppercase">Payment Type</label>
                    <select className="bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-600 outline-none"><option>All Types</option></select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 text-[10px] uppercase">Status</label>
                    <select className="bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-600 outline-none"><option>All Status</option></select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-slate-400 text-[10px] uppercase">Date Range</label>
                    <input type="text" placeholder="Select Date Range" className="bg-white border border-slate-200 rounded-lg p-2 font-medium text-slate-600 outline-none text-xs"/>
                  </div>
                  <div className="flex items-end gap-2">
                    <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2 rounded-lg transition-colors text-xs">More Filters</button>
                    <button className="text-slate-400 hover:text-slate-600 font-bold text-xs p-2">Reset</button>
                  </div>
                </div>
              </div>

              {/* Table Stream Block 1: Payments from RVSF to Clients */}
              {(activeSubTab === 'All Payments' || activeSubTab === 'Client Payments') && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Payments from RVSF to Clients</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">View and verify payments made by RVSF partners to customers.</p>
                  </div>

                  <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                    <table className="w-full text-left text-xs text-slate-600 min-w-[950px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                          <th className="p-3">Payment ID</th>
                          <th className="p-3">Booking ID</th>
                          <th className="p-3">RVSF Partner</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Payment Date</th>
                          <th className="p-3">UTR / Txn ID</th>
                          <th className="p-3 text-center">Payment Proof</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3">Verification</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {clientPayments.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-900">{row.payId}</td>
                            <td className="p-3 font-mono text-slate-500">{row.bId}</td>
                            <td className="p-3">
                              <div className="font-bold text-slate-800">{row.partner}</div>
                              <div className="text-[10px] font-mono text-slate-400">{row.pId}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-slate-700">{row.customer}</div>
                              <div className="text-[10px] font-mono text-slate-400">{row.phone}</div>
                            </td>
                            <td className="p-3 font-mono font-black text-slate-900">{row.amount}</td>
                            <td className="p-3">
                              <div className="font-medium">{row.date}</div>
                              <div className="text-[10px] font-mono text-slate-400">{row.time}</div>
                            </td>
                            <td className="p-3 font-mono text-slate-500 text-[11px]">{row.utr}</td>
                            <td className="p-3 text-center"><button className="text-emerald-600 hover:underline font-bold text-[11px]">📄 View</button></td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                row.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : row.status === 'Failed' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                              }`}>{row.status}</span>
                            </td>
                            <td className="p-3 font-medium text-slate-500">{row.verification}</td>
                            <td className="p-3 text-center">
                              <button className="text-slate-400 hover:text-slate-600 font-bold px-1 text-base">⋮</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Standardized Pagination Footer Block row list control */}
                  <div className="flex items-center justify-between text-xs pt-2 text-slate-400 font-medium">
                    <span>Showing 1 to 5 of 264 payments</span>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-white border border-slate-200 rounded shadow-sm text-slate-600 hover:bg-slate-50">‹</button>
                      <button className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-600 font-bold">1</button>
                      <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">2</button>
                      <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">3</button>
                      <button className="px-2 py-1 bg-white border border-slate-200 rounded shadow-sm text-slate-600 hover:bg-slate-50">›</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Table Stream Block 2: Payments from RVSF to RescrapX */}
              {(activeSubTab === 'All Payments' || activeSubTab === 'RescrapX Payments') && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Payments from RVSF to RescrapX</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">View and verify commission/fees paid by RVSF partners to RescrapX.</p>
                  </div>

                  <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                    <table className="w-full text-left text-xs text-slate-600 min-w-[950px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                          <th className="p-3">Payment ID</th>
                          <th className="p-3">RVSF Partner</th>
                          <th className="p-3">Invoice ID</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Payment Date</th>
                          <th className="p-3">UTR / Txn ID</th>
                          <th className="p-3 text-center">Payment Proof</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3">Verification</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rescrapXPayments.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-900">{row.payId}</td>
                            <td className="p-3">
                              <div className="font-bold text-slate-800">{row.partner}</div>
                              <div className="text-[10px] font-mono text-slate-400">{row.pId}</div>
                            </td>
                            <td className="p-3 font-mono text-slate-500">{row.invId}</td>
                            <td className="p-3 font-mono font-black text-slate-900">{row.amount}</td>
                            <td className="p-3">
                              <div className="font-medium">{row.date}</div>
                              <div className="text-[10px] font-mono text-slate-400">{row.time}</div>
                            </td>
                            <td className="p-3 font-mono text-slate-500 text-[11px]">{row.utr}</td>
                            <td className="p-3 text-center"><button className="text-emerald-600 hover:underline font-bold text-[11px]">📄 View</button></td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                row.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                              }`}>{row.status}</span>
                            </td>
                            <td className="p-3 font-medium text-slate-500">{row.verification}</td>
                            <td className="p-3 text-center">
                              <button className="text-slate-400 hover:text-slate-600 font-bold px-1 text-base">⋮</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 text-slate-400 font-medium">
                    <span>Showing 1 to 5 of 126 payments</span>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-white border border-slate-200 rounded shadow-sm text-slate-600 hover:bg-slate-50">‹</button>
                      <button className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-600 font-bold">1</button>
                      <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">2</button>
                      <button className="px-2 py-1 bg-white border border-slate-200 rounded shadow-sm text-slate-600 hover:bg-slate-50">›</button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right Frame: Collapsible Admin Settlement Audit Review Drawer Panel */}
            {isDetailPanelOpen && (
              <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 sticky top-6 relative transition-all duration-300">
                <button 
                  onClick={() => setIsDetailPanelOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>

                <div className="pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Payment Details</h3>
                    <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-200">Pending</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] font-mono text-slate-400">
                    <div>PAYMENT ID<span className="block text-slate-800 font-bold mt-0.5">CLI25060071</span></div>
                    <div>BOOKING ID<span className="block text-slate-800 font-bold mt-0.5">BK25060123</span></div>
                  </div>
                </div>

                {/* Info Block Profile Mapping list items */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Payment Information</span>
                  <div className="space-y-2 bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between"><span className="text-slate-400">RVSF Partner</span><span className="font-bold text-slate-800 text-right">Green Auto RVSF (RVSF0012)</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Customer</span><span className="font-medium text-slate-700 text-right">Rahul Sharma (9876543210)</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Vehicle</span><span className="font-medium text-slate-800 text-right">Maruti Swift 2016 (DL8CAK1234)</span></div>
                    <div className="flex justify-between border-t border-slate-100/70 pt-2"><span className="text-slate-400 font-bold">Amount Paid</span><span className="font-mono font-black text-slate-900">₹58,200</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Payment Date</span><span className="font-medium text-slate-700 text-right">02 Jun 2025, 10:23 AM</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">UTR / Transaction ID</span><span className="font-mono font-bold text-slate-900 truncate max-w-[150px]">SBIN325153987612</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Payment Method</span><span className="text-slate-700 font-medium">NEFT</span></div>
                  </div>
                </div>

                {/* Interactive Proof File Attachment Section Preview Box Component */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Payment Proof</span>
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex items-start gap-3">
                    <div className="w-12 h-14 bg-white border border-slate-200 rounded shadow-xs flex items-center justify-center text-xl shrink-0">📄</div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-bold text-slate-700 truncate text-[11px]">payment_rahul_sharma.pdf</p>
                      <span className="text-[10px] text-slate-400 block">Uploaded: 02 Jun 2025, 10:25 AM</span>
                      <span className="text-[10px] text-slate-400 block">By: greenauto.rvsf@gmail.com</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold p-2 rounded-lg text-center transition-colors">View Full Size ↗</button>
                    <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold p-2 rounded-lg transition-colors">📥</button>
                  </div>
                </div>

                {/* Verification Decision Control Segment Interactivity Area text area */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-400 text-[10px] uppercase">Verification Admin Remarks (Optional)</label>
                    <textarea 
                      placeholder="Add system audit feedback log parameters..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:border-slate-300 min-h-[65px] resize-none text-xs"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 rounded-lg shadow-sm transition-all text-center">
                      ✓ Approve Payment
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs py-2 rounded-lg transition-colors text-center">
                        ✕ Reject Payment
                      </button>
                      <button className="border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs py-2 rounded-lg transition-colors text-center">
                        ⚠️ Request Clarification
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 text-slate-400 text-[10px] rounded-lg border border-slate-200/60 leading-relaxed">
                    ℹ️ Once approved, this transaction ledger element will flag as verified and line items settle down for chronological matching routines.
                  </div>
                </div>

              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
};