'use client'

import React, { useState } from 'react';
import Sidebar  from './AdminSidebar';
import { Navbar } from '../navbar/AdminNavbar';

export const OperationsOverview: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const statsKPIs = [
    { title: 'Total Requests', value: '356', change: '+18% vs yesterday', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Auctions Live', value: '48', change: '+14% vs yesterday', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Pickups Scheduled', value: '48', change: '+16% vs yesterday', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Verification Pending', value: '15', change: '-5% vs yesterday', color: 'text-rose-600 bg-rose-50' },
    { title: 'Completed (Today)', value: '78', change: '+18% vs yesterday', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Cancelled (Today)', value: '6', change: '-14% vs yesterday', color: 'text-rose-600 bg-rose-50' },
  ];

  const pipelineStages = [
    { stage: 'Valuation Requests', count: '356', pct: '100%', icon: '🚗' },
    { stage: 'Auctions Live', count: '48', pct: '35%', icon: '🔨' },
    { stage: 'Offer Accepted', count: '32', pct: '22%', icon: '🤝' },
    { stage: 'Pickup Scheduled', count: '48', pct: '22%', icon: '📅' },
    { stage: 'Verification Pending', count: '15', pct: '7%', icon: '🔍' },
    { stage: 'Delivered to RVSF', count: '28', pct: '13%', icon: '🏢' },
    { stage: 'Certificate Generated', count: '26', pct: '12%', icon: '📄' },
    { stage: 'RC Deregistered', count: '21', pct: '10%', icon: '🛡️' },
  ];

  const snapshotRows = [
    { label: 'Pickups Scheduled Today', val: '48', color: 'text-emerald-600' },
    { label: 'Pickups Completed Today', val: '28', color: 'text-emerald-600' },
    { label: 'Vehicles In Transit', val: '18', color: 'text-blue-600' },
    { label: 'Verification Pending', val: '15', color: 'text-amber-500' },
    { label: 'Pending Delivery to RVSF', val: '10', color: 'text-purple-600' },
    { label: 'Certificates Generated', val: '26', color: 'text-emerald-600' },
    { label: 'RC Deregistration Pending', val: '21', color: 'text-teal-600' },
  ];

  const operationsActivities = [
    { activity: 'Pickup Scheduled', id: 'RX25060201', vehicle: 'Maruti Swift 2016', loc: 'Rohini, Delhi', time: '02 Jun 2025, 10:00 AM', status: 'Scheduled', sColor: 'text-blue-700 bg-blue-50 border-blue-100', user: 'Vikram Singh' },
    { activity: 'Driver Assigned', id: 'RX25060202', vehicle: 'Hyundai i20 2015', loc: 'Gurgaon, HR', time: '02 Jun 2025, 09:30 AM', status: 'Assigned', sColor: 'text-purple-700 bg-purple-50 border-purple-100', user: 'Amit Kumar' },
    { activity: 'Pickup Completed', id: 'RX25060203', vehicle: 'Honda City 2014', loc: 'Noida, UP', time: '02 Jun 2025, 03:15 PM', status: 'Completed', sColor: 'text-emerald-700 bg-emerald-50 border-emerald-100', user: 'Ravi Pal' },
    { activity: 'Verification Submitted', id: 'RX25060204', vehicle: 'Tata Indica Vista 2012', loc: 'Faridabad, HR', time: '02 Jun 2025, 12:40 PM', status: 'Pending Review', sColor: 'text-amber-700 bg-amber-50 border-amber-100', user: 'Suresh Yadav' },
    { activity: 'Delivered to RVSF', id: 'RX25060205', vehicle: 'Toyota Innova 2015', loc: 'Jaipur, RJ', time: '01 Jun 2025, 05:20 PM', status: 'Delivered', sColor: 'text-indigo-700 bg-indigo-50 border-indigo-100', user: 'Mahesh Meena' },
  ];

  const exceptionAlerts = [
    { label: 'Pickups pending more than 24 hrs', count: '12', color: 'text-red-600' },
    { label: 'Verification pending more than 24 hrs', count: '8', color: 'text-amber-600' },
    { label: 'Deliveries pending more than 48 hrs', count: '5', color: 'text-amber-600' },
    { label: 'Documents expiring in 7 days', count: '7', color: 'text-slate-600' },
    { label: 'RC deregistration pending', count: '10', color: 'text-blue-600' },
  ];

  return (
    // Outer global wrapper adjustments
    <div className="bg-slate-50 text-slate-800 antialiased w-full overflow-x-hidden">
      
      {/* Main Responsive Canvas View Frame */}
      <div className="flex flex-col min-h-screen transition-all duration-300 w-full">
        
        {/* Dynamic Workspace Container Viewport */}
        <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">
          
          {/* Header Title Metadata Block Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Operations Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">End-to-end overview of all operational activities across RescrapX.</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none font-medium text-slate-600 shadow-sm">
                <option>01 Jun 2025 - 02 Jun 2025</option>
              </select>
            </div>
          </div>

          {/* KPI Analytics Cards Strip Summary */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {statsKPIs.map((kpi, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase truncate">{kpi.title}</span>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900 tracking-tight">{kpi.value}</div>
                  <div className={`text-[9px] inline-block mt-1 px-1.5 py-0.5 rounded font-bold ${kpi.color}`}>
                    {kpi.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section Row Split: Operations Pipeline & Snapshots */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Module: Visual Linear Pipeline Track Process */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-8 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Operations Pipeline</h3>
                <button className="text-emerald-600 hover:text-emerald-700 font-bold text-xs">View full pipeline</button>
              </div>
              
              {/* Process Stream Row - Guarded with Overflow Scroll Container */}
              <div className="overflow-x-auto pb-3 pt-1 scrollbar-none">
                <div className="flex items-center justify-between min-w-[760px] relative px-2">
                  <div className="absolute top-5 left-4 right-4 h-0.5 bg-slate-100 -z-10" />
                  {pipelineStages.map((stage, i) => (
                    <div key={i} className="flex flex-col items-center text-center px-1 group relative flex-1">
                      <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center text-sm group-hover:scale-105 transition-transform bg-white z-10">
                        {stage.icon}
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold mt-2 max-w-[85px] line-clamp-2 h-6 leading-tight">{stage.stage}</span>
                      <span className="text-xs font-black text-slate-900 mt-1">{stage.count}</span>
                      <span className="text-[9px] bg-slate-100 font-mono font-bold rounded px-1 text-slate-400 mt-0.5">{stage.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Module: Quick Today Operations Snapshots List Block */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-4 space-y-3">
              <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Today's Operations Snapshot</h3>
                <button className="text-slate-400 hover:text-slate-600 font-bold text-xs">View all</button>
              </div>
              <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
                {snapshotRows.map((row, i) => (
                  <div key={i} className="flex justify-between items-center text-xs p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                    <span className="text-slate-600 font-medium">{row.label}</span>
                    <span className={`font-mono font-bold ${row.color}`}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Section Row Split: Recent Operational Activity Ledger vs Status Pie Area */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Operational Continuous Streams Activity Log Data Grid Table */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-8 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Recent Operational Activities</h3>
                <button className="text-emerald-600 hover:text-emerald-700 font-bold text-xs">View all</button>
              </div>

              <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600 min-w-[750px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3">Activity</th>
                      <th className="p-3">Request ID</th>
                      <th className="p-3">Vehicle</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Assigned To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {operationsActivities.map((act, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-bold text-slate-800">{act.activity}</td>
                        <td className="p-3 font-mono text-[11px] font-semibold text-slate-500">{act.id}</td>
                        <td className="p-3 text-slate-700 font-medium">{act.vehicle}</td>
                        <td className="p-3 text-slate-500">{act.loc}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-400">{act.time}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${act.sColor}`}>
                            {act.status}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-slate-700">{act.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Operations Status Metric Composition Box Component */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-4 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Operations by Status</h3>
                <select className="bg-transparent border border-slate-200 rounded p-1 text-[10px] outline-none text-slate-500"><option>This Month</option></select>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                {/* Visual Mock Donut Graph Frame Layout Component */}
                <div className="w-28 h-28 rounded-full border-[12px] border-slate-100 border-t-emerald-600 border-r-blue-600 border-b-amber-400 flex items-center justify-center shrink-0 relative">
                  <div className="text-center">
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Total</span>
                    <span className="text-sm font-black text-slate-900 tracking-tight">1,284</span>
                  </div>
                </div>
                {/* Meta Labels Breakdown Legend Grid lists component */}
                <div className="space-y-1.5 text-xs w-full max-w-[160px]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"/>Completed</span>
                    <span className="font-mono font-bold text-slate-800">442 <span className="text-[10px] font-normal text-slate-400">(34%)</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block"/>In Progress</span>
                    <span className="font-mono font-bold text-slate-800">512 <span className="text-[10px] font-normal text-slate-400">(40%)</span></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>Pending</span>
                    <span className="font-mono font-bold text-slate-800">238 <span className="text-[10px] font-normal text-slate-400">(18%)</span></span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section Row Grid Frame Panels: Performance, Delivery Overview & Exceptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 items-start">
            
            {/* Pickup Performance Graphic Analytics Module Box Frame Layout */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-4 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Pickup Performance</h3>
                <select className="bg-transparent border border-slate-200 rounded p-1 text-[10px] outline-none text-slate-500"><option>This Month</option></select>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                <div><span className="text-slate-400 text-[10px] block font-medium">Avg. Pickup Time</span><span className="font-black text-slate-900 text-sm">1.8 <span className="text-[10px] text-slate-400 font-normal">Days</span></span></div>
                <div><span className="text-slate-400 text-[10px] block font-medium">On-time Pickup Rate</span><span className="font-black text-emerald-600 text-sm">92%</span></div>
              </div>
              {/* Graphic Plot Trend Curve Representation Area Frame Layout */}
              <div className="h-28 bg-slate-50 rounded-lg border border-slate-100 relative p-2 flex flex-col justify-between">
                <div className="w-full flex justify-between text-[9px] text-slate-300 font-mono"><span>80</span><span>40</span><span>0</span></div>
                <div className="w-full h-12 bg-gradient-to-t from-emerald-50 to-white border-b-2 border-emerald-500 rounded-sm self-end opacity-70" />
                <div className="w-full flex justify-between text-[9px] text-slate-400 font-medium px-1"><span>5 May</span><span>19 May</span><span>2 Jun</span></div>
              </div>
            </div>

            {/* RVSF Partner Logistics Status Summary Section Box Framework Component */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-4 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">RVSF Delivery Overview</h3>
                <select className="bg-transparent border border-slate-200 rounded p-1 text-[10px] outline-none text-slate-500"><option>This Month</option></select>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs border-b border-slate-100 pb-3">
                <div className="bg-slate-50 p-1.5 rounded"><span className="text-slate-400 text-[9px] block">Delivered</span><span className="font-bold text-slate-800">28</span></div>
                <div className="bg-slate-50 p-1.5 rounded"><span className="text-slate-400 text-[9px] block">In Transit</span><span className="font-bold text-blue-600">12</span></div>
                <div className="bg-slate-50 p-1.5 rounded"><span className="text-slate-400 text-[9px] block">Pending</span><span className="font-bold text-amber-500">10</span></div>
                <div className="bg-slate-50 p-1.5 rounded"><span className="text-slate-400 text-[9px] block">Delayed</span><span className="font-bold text-rose-600">3</span></div>
              </div>
              {/* Partner Ranking Quick Small Row Table List Mapping block */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block uppercase">Top RVSF Partners by Deliveries</span>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] hover:bg-slate-50/60 p-1 rounded transition-colors">
                    <span className="font-medium text-slate-700 truncate max-w-[140px]">Green Auto RVSF</span>
                    <span className="font-mono text-slate-500 font-semibold">12 items <span className="text-emerald-600 text-[10px] ml-1">96%</span></span>
                  </div>
                  <div className="flex justify-between text-[11px] hover:bg-slate-50/60 p-1 rounded transition-colors">
                    <span className="font-medium text-slate-700 truncate max-w-[140px]">EcoScrap Pvt. Ltd.</span>
                    <span className="font-mono text-slate-500 font-semibold">8 items <span className="text-emerald-600 text-[10px] ml-1">94%</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Operational Exceptions Warnings List Tracker Panel Block Component */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-4 space-y-3 md:col-span-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Alerts & Exceptions</h3>
                <button className="text-rose-600 hover:text-rose-700 font-bold text-xs">View all</button>
              </div>
              <div className="space-y-2">
                {exceptionAlerts.map((alert, i) => (
                  <div key={i} className="flex justify-between items-center text-xs p-2 bg-rose-50/40 hover:bg-rose-50/80 border border-rose-100/50 rounded-lg transition-colors">
                    <span className="text-slate-700 font-medium truncate max-w-[240px]">⚠️ {alert.label}</span>
                    <span className={`font-mono font-black text-sm ${alert.color}`}>{alert.count}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>

        {/* Dynamic Static Framework Workspace Bottom Sticky Row Layer strip */}
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
          <p>© 2026 RescrapX. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-[11px] text-emerald-600 font-bold">Node Sync Complete</span>
          </div>
        </footer>

      </div>
    </div>
  );
};