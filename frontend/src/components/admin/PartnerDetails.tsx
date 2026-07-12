'use client'

import React, { useState } from 'react';
import  Sidebar  from './AdminSidebar';
import { Navbar } from '../navbar/AdminNavbar';

export const PartnerDetails: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  const mainTabs = ['Overview', 'Documents', 'Performance', 'Transactions', 'Activity Log'];

  const partnerInfoLeft = [
    { label: 'Registered Company Name', value: 'Green Auto Private Limited' },
    { label: 'Trade / Brand Name', value: 'Green Auto RVSF' },
    { label: 'RVSF Authorization Number', value: 'RVSF/2024/DEL/0897' },
    { label: 'Type of Entity', value: 'Private Limited' },
    { label: 'Year of Establishment', value: '2018' },
    { label: 'GST Number', value: '07AABCG1234E1Z5' },
  ];

  const partnerInfoRight = [
    { label: 'Authorized Person', value: 'Rakesh Verma' },
    { label: 'Designation', value: 'Managing Director' },
    { label: 'Email', value: 'rakesh.verma@greenauto.in' },
    { label: 'Mobile Number', value: '98765 43210' },
    { label: 'Registered Address', value: 'Plot No. 45, Udyog Vihar, Phase-2 Gurugram, Haryana - 122016' },
    { label: 'Operational States', value: 'Delhi, Haryana, Rajasthan' },
  ];

  const submittedDocs = [
    { name: 'RVSF Authorization Certificate', status: 'Verified' },
    { name: 'GST Certificate', status: 'Verified' },
    { name: 'PAN Card', status: 'Verified' },
    { name: 'Company Registration Certificate', status: 'Verified' },
    { name: 'Bank Account Details', status: 'Verified' },
    { name: 'Authorized Signatory ID Proof', status: 'Verified' },
    { name: 'Pollution Control Board Certificate', status: 'Verified' },
    { name: 'Factory License', status: 'Verified' },
    { name: 'Fire NOC Certificate', status: 'Verified' },
    { name: 'Insurance Certificate', status: 'Verified' },
  ];

  const performanceKPIs = [
    { title: 'Total Completed Jobs', value: '248', sub: '+18% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Total Earned', value: '₹18,75,000', sub: '+22% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Average Rating', value: '4.6 / 5', sub: 'Based on 128 reviews', color: 'text-amber-600 bg-amber-50' },
    { title: 'Success Rate', value: '96%', sub: 'Excellent', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Average Settlement Time', value: '2.4 Days', sub: 'Excellent', color: 'text-purple-600 bg-purple-50' },
  ];

  const recentTransactions = [
    { id: 'RXJOB2506001', vehicle: 'Maruti Swift 2016', customer: 'Rahul Sharma', amount: '₹58,200', date: '01 Jun 2025', status: 'Completed' },
    { id: 'RXJOB2506002', vehicle: 'Hyundai i20 2015', customer: 'Priya Verma', amount: '₹72,400', date: '31 May 2025', status: 'Completed' },
    { id: 'RXJOB2506003', vehicle: 'Honda City 2014', customer: 'Amit Kumar', amount: '₹1,08,000', date: '30 May 2025', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased w-full overflow-x-hidden">
      {/* 1. Global Core Structural App Sidebar Layout */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Layout View Wrapper Frame */}
      <div className="flex flex-col lg:pl-[376px] min-h-screen transition-all duration-300 w-full">
        
        {/* 2. Platform Upper Header Strip Navigation */}
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />

        {/* Modular Profile Dynamic Viewport Area */}
        <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">
          
          {/* Breadcrumbs & Dynamic Meta Header Area panel row block */}
          <div className="flex flex-col gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div className="text-[11px] font-bold text-slate-400 tracking-wide flex items-center gap-1">
              <span>RVSF Partners</span> <span className="text-slate-300">/</span> <span className="text-slate-600">Partner Details</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Green Auto RVSF</h2>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black tracking-wide uppercase px-2 py-0.5 rounded border border-emerald-100">
                    Application Pending
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-1">
                  RVSF Application ID: APP-RVSF-2025-000123 <span className="mx-1">•</span> Applied on: 28 May 2025, 11:32 AM
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition-colors">
                  📥 Download Application
                </button>
                <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition-colors">
                  More Actions ▾
                </button>
              </div>
            </div>
          </div>

          {/* Context Segment Navigation Tab Strip */}
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

          {/* Split Screen Container Workspace Framework: Master Information Rows */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Hand Context Column: Core Business Identification Profiles */}
            <div className="xl:col-span-8 space-y-6">
              
              {/* Partner Information parameters panel module box */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Partner Information</h3>
                
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Brand Visual Logo Slot Placeholder */}
                  <div className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-2 shrink-0 self-center sm:self-start">
                    <span className="text-2xl">♻️</span>
                    <span className="text-[9px] font-black text-emerald-700 mt-1 uppercase text-center tracking-tight">Green Auto</span>
                  </div>

                  {/* Dual Grid Fields Meta Alignment layout block mapping columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 flex-1 text-xs">
                    <div className="space-y-3">
                      {partnerInfoLeft.map((item, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-50">
                          <span className="text-slate-400 font-medium col-span-1">{item.label}</span>
                          <span className="text-slate-800 font-bold col-span-2 text-right sm:text-left truncate">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {partnerInfoRight.map((item, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 py-0.5 border-b border-slate-50">
                          <span className="text-slate-400 font-medium col-span-1">{item.label}</span>
                          <span className="text-slate-800 font-bold col-span-2 text-right sm:text-left line-clamp-2">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submitted Documentation Audit Status Grid Matrix block list */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Submitted Documents</h3>
                  <span className="bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded">10/10 Submitted</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {submittedDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/60 rounded-lg text-xs transition-colors group">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-slate-400">📄</span>
                        <span className="font-medium text-slate-700 truncate">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                          ✓ {doc.status}
                        </span>
                        <button className="text-slate-400 hover:text-slate-600 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">👁️</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-center">
                  <button className="text-emerald-600 hover:text-emerald-700 font-bold text-xs flex items-center gap-1">
                    View All Documents <span className="text-[10px]">➔</span>
                  </button>
                </div>
              </div>

              {/* Performance Summary Metrics Blocks Frame Layout Grid Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">Performance Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                  {performanceKPIs.map((kpi, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-sm flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight line-clamp-1">{kpi.title}</span>
                      <div className="mt-2">
                        <div className="text-base font-black text-slate-900 tracking-tight">{kpi.value}</div>
                        <span className={`text-[9px] block font-bold mt-0.5 ${kpi.color} px-1 rounded w-fit`}>{kpi.sub}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Internal Operation Financial Transaction Data Ledger Tables */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Transactions</h3>
                  <button className="text-emerald-600 hover:text-emerald-700 font-bold text-xs">View All Transactions</button>
                </div>
                
                <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                  <table className="w-full text-left text-xs text-slate-600 min-w-[550px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                        <th className="p-2.5">Job ID</th>
                        <th className="p-2.5">Vehicle</th>
                        <th className="p-2.5">Customer</th>
                        <th className="p-2.5">Amount</th>
                        <th className="p-2.5">Job Date</th>
                        <th className="p-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentTransactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-2.5 font-mono font-bold text-slate-900">{tx.id}</td>
                          <td className="p-2.5 font-medium text-slate-700">{tx.vehicle}</td>
                          <td className="p-2.5 text-slate-600">{tx.customer}</td>
                          <td className="p-2.5 font-mono font-bold text-slate-900">{tx.amount}</td>
                          <td className="p-2.5 font-mono text-slate-400 text-[11px]">{tx.date}</td>
                          <td className="p-2.5 text-center">
                            <span className="bg-emerald-50 text-emerald-700 font-bold text-[9px] px-2 py-0.5 rounded border border-emerald-100">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Hand Context Sidebar Card: System Operations State Analytics Drawer Panel */}
            <div className="xl:col-span-4 space-y-6">
              
              {/* Score Validation Evaluation Block Panel layout segment */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Application Status</span>
                  <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">Pending Review</span>
                </div>

                <div className="flex items-center gap-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {/* Radial Performance Core Node Indicator Map */}
                  <div className="w-16 h-16 rounded-full border-8 border-slate-100 border-t-emerald-600 flex items-center justify-center shrink-0 relative">
                    <span className="text-xs font-black text-slate-900">85%</span>
                  </div>
                  <div className="text-xs space-y-1 w-full">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Verification Score</span>
                    <div className="flex justify-between text-[11px]"><span>Documents Checklist</span><span className="font-bold text-emerald-600">90%</span></div>
                    <div className="flex justify-between text-[11px]"><span>Business Compliance</span><span className="font-bold text-emerald-600">85%</span></div>
                  </div>
                </div>
                
                <div className="p-2.5 bg-blue-50/50 text-blue-700 text-[11px] rounded-lg border border-blue-100/60 leading-relaxed">
                  ℹ️ All mandatory business licensing assets are filed. Please review information accuracy before updating authorization parameters.
                </div>
              </div>

              {/* Bank Settlement Node Ledger Configuration Block Section layout view */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bank Details</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 rounded font-bold">✓ Verified</span>
                </div>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-slate-400">Bank Name</span><span className="font-bold text-slate-800">HDFC Bank Limited</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Account Number</span><span className="font-mono font-bold text-slate-900">50200012345678</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">IFSC Code</span><span className="font-mono text-slate-600 font-semibold">HDFC0001234</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Account Type</span><span className="text-slate-700">Current Account</span></div>
                </div>
              </div>

              {/* Operational Log Segment Sequence Trail list trackers mapping block */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-2">Recent Activity Log</span>
                
                <div className="space-y-4 relative pl-3.5 text-xs before:absolute before:left-[3px] before:top-1 before:bottom-1 before:w-0.5 before:bg-slate-100">
                  <div className="relative space-y-0.5">
                    <span className="absolute -left-[17px] top-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <p className="font-bold text-slate-800">Application submitted successfully</p>
                    <span className="text-[10px] font-mono text-slate-400">28 May 2025 • 11:32 AM</span>
                  </div>
                  <div className="relative space-y-0.5">
                    <span className="absolute -left-[17px] top-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white" />
                    <p className="font-bold text-slate-800">Document bundle verification completed</p>
                    <span className="text-[10px] font-mono text-slate-400">29 May 2025 • 10:15 AM</span>
                  </div>
                  <div className="relative space-y-0.5">
                    <span className="absolute -left-[17px] top-0.5 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-white" />
                    <p className="font-medium text-slate-600">Pending for operational admin approval</p>
                    <span className="text-[10px] font-mono text-slate-400">29 May 2025 • 04:35 PM</span>
                  </div>
                </div>
              </div>

              {/* Action Commentary Feedback Interactive Control Segment Box Panel area */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Admin Valuation Evaluation Notes</label>
                <textarea 
                  placeholder="Append profile registration observation log feedback parameters..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-slate-300 min-h-[75px] resize-none"
                />
                
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
                  <button className="flex-1 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs py-2 px-3 rounded-lg transition-colors shadow-sm">
                    ⚠️ Request Changes
                  </button>
                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2 px-3 rounded-lg shadow-sm transition-all text-center">
                    ✓ Approve Partner
                  </button>
                </div>
              </div>

            </div>

          </div>

        </main>

        {/* Dynamic Static App Core Node Navigation Footer Anchor Component */}
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
          <p>© 2026 RescrapX. All rights reserved.</p>
          <p className="text-[11px]">Core Partner Node: <span className="text-emerald-600 font-bold">Synchronized</span></p>
        </footer>

      </div>
    </div>
  );
};