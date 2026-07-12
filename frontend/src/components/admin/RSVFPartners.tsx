'use client'

import React, { useState } from 'react';
import Sidebar  from './AdminSidebar';
import { Navbar } from '../navbar/AdminNavbar';

export const RVSFPartners: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string>('Green Auto RVSF');

  const partnerKPIs = [
    { title: 'Total Partners', value: '86', trend: '+10% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Active Partners', value: '68', trend: '+12% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'On Hold', value: '7', trend: '-7% vs last month', color: 'text-red-600 bg-red-50' },
    { title: 'Pending Applications', value: '11', trend: '+22% vs last month', color: 'text-purple-600 bg-purple-50' },
    { title: 'Total Completed Jobs', value: '1,248', trend: '+18% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Total Payouts (MTD)', value: '₹2,46,85,340', trend: '+16% vs last month', color: 'text-emerald-600 bg-emerald-50' },
  ];

  const partnersList = [
    { name: 'Green Auto RVSF', manager: 'Rakesh Verma', phone: '9876543210', gst: '07ABCG1234E1Z5', state: 'Delhi', city: 'Delhi, DL', status: 'Active', verification: 'Verified', jobs: 248, rating: '4.6', success: '96%', payout: '₹18,75,000', date: '01 Jun 2025' },
    { name: 'EcoScrap Pvt. Ltd.', manager: 'Amit Singh', phone: '9811122334', gst: '06AAHCE2345F1Z8', state: 'Haryana', city: 'Gurgaon, HR', status: 'Active', verification: 'Verified', jobs: 186, rating: '4.3', success: '94%', payout: '₹14,20,000', date: '31 May 2025' },
    { name: 'MetalPro RVSF', manager: 'Neha Malhotra', phone: '9712345678', gst: '09AAKFM3456G1Z2', state: 'Uttar Pradesh', city: 'Noida, UP', status: 'Active', verification: 'Verified', jobs: 157, rating: '4.5', success: '92%', payout: '₹11,80,000', date: '31 May 2025' },
    { name: 'Prime Recycling', manager: 'Vikram Patel', phone: '9822334455', gst: '27AAICP4567H1Z9', state: 'Maharashtra', city: 'Mumbai, MH', status: 'On Hold', verification: 'Verified', jobs: 98, rating: '4.2', success: '90%', payout: '₹8,45,000', date: '28 May 2025' },
    { name: 'Shakti RVSF', manager: 'Suresh Yadav', phone: '9670011223', gst: '24AALFSS6781L24', state: 'Rajasthan', city: 'Jaipur, RJ', status: 'Active', verification: 'Pending', jobs: 72, rating: '4.0', success: '88%', payout: '₹6,25,000', date: '27 May 2025' },
  ];

  return (
    // Outer responsive layout offsets removed
    <div className="w-full flex flex-col justify-between">

      {/* Dynamic Canvas Container View area */}
      <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">
        
        {/* Action Ribbon Area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900">RVSF Partners</h2>
            <p className="text-xs text-slate-500">Manage and monitor all RVSF partners registered on RescrapX.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button className="border border-slate-200 bg-white text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
              📤 Export <span className="text-[10px] text-slate-400">▼</span>
            </button>
            <button className="bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm">
              + Add Partner
            </button>
          </div>
        </div>

        {/* Core Portal Micro Metrics Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {partnerKPIs.map((kpi, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase truncate">{kpi.title}</span>
              <div className="mt-2">
                <div className="text-xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
                <div className={`text-[10px] inline-block mt-1 px-1.5 py-0.5 rounded font-medium ${kpi.color}`}>
                  {kpi.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Multi-Query Context Search Filter Matrix */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            <div className="relative lg:col-span-2">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              <input 
                type="text" 
                placeholder="Search by name, GST, city, state..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-slate-300"
              />
            </div>
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"><option>All Status</option></select>
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"><option>Verification (All)</option></select>
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"><option>All States</option></select>
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"><option>All Cities</option></select>
            <button className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-xs rounded-lg py-2 transition-colors">
              Reset
            </button>
          </div>
        </div>

        {/* Split Screen Master-Detail Workspace Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Ledger Master View Grid Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-8 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">All Partners <span className="text-slate-400 font-normal">(86)</span></h3>
            </div>

            {/* Data Table Scroll View Enclosure Mask */}
            <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs text-slate-600 min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="p-3 w-10"><input type="checkbox" className="rounded" /></th>
                    <th className="p-3">Partner Details</th>
                    <th className="p-3">GST Number</th>
                    <th className="p-3">State / City</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Verification</th>
                    <th className="p-3 text-center">Jobs</th>
                    <th className="p-3 text-center">Rating</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {partnersList.map((partner, index) => (
                    <tr 
                      key={index} 
                      onClick={() => setSelectedPartner(partner.name)}
                      className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${selectedPartner === partner.name ? 'bg-emerald-50/30' : ''}`}
                    >
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{partner.name}</div>
                        <div className="text-[10px] text-slate-400">{partner.manager} • {partner.phone}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-500">{partner.gst}</td>
                      <td className="p-3">
                        <div className="font-medium text-slate-700">{partner.state}</div>
                        <span className="text-[10px] text-slate-400">{partner.city}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${partner.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {partner.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${partner.verification === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {partner.verification === 'Verified' ? '✓ Verified' : '◷ Pending'}
                        </span>
                      </td>
                      <td className="p-3 text-center font-semibold text-slate-700">{partner.jobs}</td>
                      <td className="p-3 text-center font-bold text-slate-900">⭐ {partner.rating}</td>
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button className="border border-slate-200 bg-white rounded px-2.5 py-1 text-[11px] font-semibold hover:bg-slate-50">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Detailed Panel View Context Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm xl:col-span-4 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{selectedPartner}</h3>
                  <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">Active</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">RVSF0012 • Partner since Jan 2024</span>
              </div>
              <button className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            {/* Dynamic Metrics Panel Rows */}
            <div className="grid grid-cols-2 gap-3.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Completed Jobs</span>
                <span className="font-bold text-slate-900 text-sm">26</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Success Rate</span>
                <span className="font-bold text-slate-900 text-sm">96%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Total Payout</span>
                <span className="font-bold text-emerald-600 text-sm">₹72,115</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Avg Rating</span>
                <span className="font-bold text-slate-900 text-sm">⭐ 4.6</span>
              </div>
            </div>

            {/* Compliance & Authorization Checklist Status Module */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Compliance Checklist</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-600">RVSF Authorization Certificate</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Verified</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-600">GST Registration Status</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Verified</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-600">Pollution Clearance License</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Verified</span>
                </div>
              </div>
            </div>

            {/* Ledger Action Ribbon Panel */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 rounded-lg transition-colors">
                Edit Partner
              </button>
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-sm shadow-emerald-600/10">
                More Actions
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Global Batch Update Footer System Row bar component context layer */}
      <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 w-full shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">0 Selected</span>
          <select className="bg-slate-50 border border-slate-200 rounded p-1 text-xs outline-none text-slate-600"><option>Bulk Actions</option></select>
          <button className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-[11px] px-3 py-1.5 rounded transition-colors">Apply</button>
        </div>
        <p className="text-[11px] text-slate-400">© 2025 RescrapX. All rights reserved.</p>
      </footer>

    </div>
  );
};