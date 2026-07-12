'use client'

import React, { useState } from 'react';

export const DocumentsCompliance: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('CVS');
  const [selectedRequest, setSelectedRequest] = useState<string>('RQ250600125');

  const complianceKPIs = [
    { title: 'Total Documents', value: '1,248', sub: 'All CVS & COD', color: 'text-slate-500 bg-slate-50' },
    { title: 'Uploaded (This Month)', value: '346', sub: '▲ 18% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Approved', value: '912', sub: '73.1% of total', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Pending Review', value: '214', sub: '17.1% of total', color: 'text-amber-600 bg-amber-50' },
    { title: 'Rejected', value: '122', sub: '9.8% of total', color: 'text-rose-600 bg-rose-50' },
  ];

  const documentLedger = [
    { id: 'RQ250600125', date: '02 Jun 2025', time: '10:23 AM', vehicle: 'Maruti Swift 2016', reg: 'DL8CAK1234', partner: 'Green Auto RVSF', code: 'RVSF0012', cvsNo: 'CVS/25-26/GA/1256', status: 'Pending Review', sColor: 'text-amber-700 bg-amber-50 border-amber-100' },
    { id: 'RQ250600124', date: '02 Jun 2025', time: '09:15 AM', vehicle: 'Hyundai i20 2015', reg: 'HR26BB5678', partner: 'MetalPro RVSF', code: 'RVSF0008', cvsNo: 'CVS/25-26/MP/1198', status: 'Approved', sColor: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { id: 'RQ250600123', date: '01 Jun 2025', time: '04:45 PM', vehicle: 'Honda City 2014', reg: 'UP16CD7890', partner: 'EcoScrap Pvt. Ltd.', code: 'RVSF0015', cvsNo: 'CVS/25-26/ES/1156', status: 'Approved', sColor: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { id: 'RQ250600122', date: '01 Jun 2025', time: '03:20 PM', vehicle: 'Tata Indica Vista 2012', reg: 'HR51AS2345', partner: 'Prime Recycling', code: 'RVSF0009', cvsNo: 'CVS/25-26/PR/1123', status: 'Rejected', sColor: 'text-rose-700 bg-rose-50 border-rose-100' },
    { id: 'RQ250600121', date: '31 May 2025', time: '11:30 AM', vehicle: 'Toyota Innova 2015', reg: 'RJ14UA3456', partner: 'RecycleR India', code: 'RVSF0011', cvsNo: 'CVS/25-26/RI/1102', status: 'Pending Review', sColor: 'text-amber-700 bg-amber-50 border-amber-100' },
  ];

  return (
    <div className="bg-slate-50 text-slate-800 antialiased w-full overflow-x-hidden">

      {/* Main Structural View Framework Offset */}
      <div className="flex flex-col min-h-screen transition-all duration-300 w-full">
        

        {/* Modular Dynamic Workspace Grid Layout */}
        <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">
          
          {/* Main Title Feature Action Control Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Documents & Compliance</h2>
              <p className="text-xs text-slate-500 mt-0.5">Review and manage CVS (Certificate of Deposit) and COD (Certificate of Destruction) documents.</p>
            </div>
            <button className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm self-start sm:self-auto shrink-0 flex items-center gap-1.5">
              📤 Export Report
            </button>
          </div>

          {/* Core Analytics Counters Summary Panels */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {complianceKPIs.map((kpi, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
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

          {/* Filtering Context Row Tabs Ribbon Controls */}
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

          {/* Search Inputs Filter Matrix Row Wrap Strip */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative lg:col-span-2">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search by Request ID, Vehicle, Partner, Document No..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-slate-300"
                />
              </div>
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none text-slate-600"><option>All Partners</option></select>
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none text-slate-600"><option>All Status</option></select>
              <button className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-lg py-2 transition-colors">Reset</button>
            </div>
          </div>

          {/* Master Detail Split Workspace Screen Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Ledger Master Query Table Wrapper Frame */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-8 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">CVS Documents <span className="text-slate-400 font-normal">(842)</span></h3>
              </div>

              {/* Data Table Horizontal Scroll Shield Container */}
              <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600 min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3">Request ID</th>
                      <th className="p-3">Vehicle Details</th>
                      <th className="p-3">Partner (RVSF)</th>
                      <th className="p-3">CVS No.</th>
                      <th className="p-3">Upload Date</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documentLedger.map((row, idx) => (
                      <tr 
                        key={idx} 
                        onClick={() => setSelectedRequest(row.id)}
                        className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedRequest === row.id ? 'bg-emerald-50/30' : ''}`}
                      >
                        <td className="p-3">
                          <div className="font-mono font-bold text-slate-900">{row.id}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{row.date}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{row.vehicle}</div>
                          <span className="font-mono text-[10px] text-slate-400 uppercase">{row.reg}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-700">{row.partner}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{row.code}</span>
                        </td>
                        <td className="p-3 font-mono text-[11px] font-semibold text-slate-600">{row.cvsNo}</td>
                        <td className="p-3">
                          <div className="text-slate-700 font-medium">{row.date}</div>
                          <div className="text-[10px] text-slate-400">{row.time}</div>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${row.sColor}`}>
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
                    <h3 className="text-sm font-bold text-slate-900">CVS Document Details</h3>
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Pending Review</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Request ID: {selectedRequest}</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
              </div>

              {/* Grid System Document Spec Details Panel */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Vehicle</span>
                  <span className="font-bold text-slate-800">Maruti Swift 2016</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Partner (RVSF)</span>
                  <span className="font-bold text-slate-800">Green Auto RVSF</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">CVS Number</span>
                  <span className="font-mono font-bold text-slate-900">CVS/25-26/GA/1256</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Valid Till</span>
                  <span className="font-bold text-slate-800">31 May 2026</span>
                </div>
              </div>

              {/* Graphic Wireframe Mock Document Container Component */}
              <div className="space-y-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Document Preview</span>
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-100/50 flex flex-col items-center justify-center min-h-[120px] relative group">
                  <div className="text-center space-y-2">
                    <span className="text-2xl block">📄</span>
                    <span className="text-[11px] font-mono text-slate-500 block">certificate_of_deposit.pdf</span>
                  </div>
                  <div className="mt-3 flex gap-2 w-full">
                    <button className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold text-[11px] py-1.5 rounded hover:bg-slate-50">View Full Size</button>
                    <button className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold text-[11px] py-1.5 rounded hover:bg-slate-50">Download</button>
                  </div>
                </div>
              </div>

              {/* Admin Feedback Commentary Area Box Layout */}
              <div className="space-y-1.5">
                <label className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Admin Review Notes</label>
                <textarea 
                  placeholder="Add evaluation remarks or revision feedback notes..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-slate-300 min-h-[70px] resize-none"
                />
              </div>

              {/* Interactive Module Context Footer Drawer Panel inside Detail Section Container card */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                <button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs py-2 px-3 rounded-lg border border-red-100 transition-colors">
                  ✕ Reject
                </button>
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2 px-3 rounded-lg transition-all shadow-sm">
                  ✓ Approve Document
                </button>
              </div>
            </div>

          </div>

        </main>

        {/* Global Core System Infrastructure Status Footer Bar */}
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
          <p>© 2026 RescrapX. All rights reserved.</p>
          <p className="text-[11px]">Core Node Status: <span className="text-emerald-600 font-bold">Operational</span></p>
        </footer>

      </div>
    </div>
  );
};