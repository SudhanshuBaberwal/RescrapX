'use client'

import React, { useState } from 'react';

export const AnalyticsReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Business Analytics', 'Partner Analytics', 'Operational Analytics', 'Financial Analytics', 'Reports'];

  const summaryKPIs = [
    { title: 'Total Bookings', value: '1,248', change: '▲ 18.6% vs last 7 days', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Vehicles Listed', value: '1,086', change: '▲ 13.4% vs last 7 days', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Bids Received', value: '2,461', change: '▲ 21.7% vs last 7 days', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Deals Confirmed', value: '842', change: '▲ 16.2% vs last 7 days', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Total Revenue', value: '₹2,48,75,000', change: '▲ 17.8% vs last 7 days', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Active Partners (RVSF)', value: '28', change: '▲ 7.7% vs last 7 days', color: 'text-emerald-600 bg-emerald-50' },
  ];

  const topPartners = [
    { name: 'Green Auto RVSF', bookings: 254, deals: 182, revenue: '₹56,200,000', rate: '71.6%', barWidth: 'w-[71.6%]' },
    { name: 'MetalPro RVSF', bookings: 198, deals: 146, revenue: '₹42,800,000', rate: '73.7%', barWidth: 'w-[73.7%]' },
    { name: 'EcoScrap Pvt. Ltd.', bookings: 176, deals: 118, revenue: '₹31,600,000', rate: '67.0%', barWidth: 'w-[67%]' },
    { name: 'Prime Recycling', bookings: 146, deals: 102, revenue: '₹24,700,000', rate: '69.9%', barWidth: 'w-[69.9%]' },
    { name: 'Shakti RVSF', bookings: 124, deals: 94, revenue: '₹18,350,000', rate: '75.8%', barWidth: 'w-[75.8%]' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased w-full overflow-x-hidden flex flex-col">
      {/* Dynamic Analytics Dashboard Main Frame */}
      <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">
        
        {/* Top Control Banner Ribbon */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Analytics & Reports</h2>
            <p className="text-xs text-slate-500">Real-time insights and performance overview across the RescrapX platform.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none font-medium text-slate-600">
              <option>01 Jun 2026 - 02 Jun 2026</option>
            </select>
            <button className="border border-slate-200 bg-white text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              🔧 Customize Dashboard
            </button>
            <button className="bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
              📥 Download Report
            </button>
          </div>
        </div>

        {/* Core Performance KPI Counters Layout Grid Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {summaryKPIs.map((kpi, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase truncate">{kpi.title}</span>
              <div className="mt-2">
                <div className="text-xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
                <div className={`text-[10px] inline-block mt-1 px-1.5 py-0.5 rounded font-medium ${kpi.color}`}>
                  {kpi.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sub Navigation Section Segment Tabs Controller */}
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

        {/* Multi-Column Data & Graphic Blocks Grid Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Primary Analytics Dashboard Columns Grid Area */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* Graphic Charts Grid Stacking Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bookings Performance Trends Mock Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm min-h-[260px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Bookings Trend</h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-1.5 py-0.5 rounded">This Week</span>
                </div>
                <div className="h-40 bg-slate-50 border border-slate-100 rounded-lg border-dashed flex items-center justify-center text-xs text-slate-400">
                  [Line Graph Visualization Area]
                </div>
              </div>

              {/* Revenue Structural Tracking Chart Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm min-h-[260px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Revenue Overview</h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">Monthly</span>
                </div>
                <div className="h-40 bg-slate-50 border border-slate-100 rounded-lg border-dashed flex items-center justify-center text-xs text-slate-400">
                  [Bar Chart Distribution Stack View]
                </div>
              </div>
            </div>

            {/* Top Performing Partners Data Table Block View */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 px-1">Top Performing Partners (RVSF)</h3>
              <div className="overflow-x-auto border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600 min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3">Partner Name</th>
                      <th className="p-3 text-center">Bookings</th>
                      <th className="p-3 text-center">Deals Closed</th>
                      <th className="p-3">Total Revenue</th>
                      <th className="p-3">Conversion Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topPartners.map((partner, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-bold text-slate-800">{partner.name}</td>
                        <td className="p-3 text-center font-semibold text-slate-700">{partner.bookings}</td>
                        <td className="p-3 text-center font-semibold text-slate-700">{partner.deals}</td>
                        <td className="p-3 font-bold text-slate-900">{partner.revenue}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-emerald-600 w-10 text-right">{partner.rate}</span>
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className={`bg-emerald-500 h-full ${partner.barWidth}`} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Context Live Activity Support Monitor Column */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Dynamic Customer Support Performance Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Support Overview</h3>
                <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">View All</a>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-medium">Received</span>
                  <span className="text-base font-black text-slate-900">64</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-medium">Open</span>
                  <span className="text-base font-black text-amber-600">18</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-medium">In Progress</span>
                  <span className="text-base font-black text-blue-600">28</span>
                </div>
              </div>

              {/* Support System Quick Feed Rows */}
              <div className="space-y-3">
                <div className="text-xs p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 font-mono">TKT2506021</span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded font-bold uppercase">Medium</span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-medium">Settlement dispute reported by partner network client node area</p>
                </div>
                <div className="text-xs p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 font-mono">TKT2506020</span>
                    <span className="text-[9px] bg-red-100 text-red-800 px-1 rounded font-bold uppercase">High</span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-medium">API webhook authentication failure timeout on banking gateway routing</p>
                </div>
              </div>
            </div>

            {/* Dynamic Executive Insights Component Box */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-md space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Automated Insights</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bookings velocity expanded by <span className="text-white font-bold">18.6%</span> during matching morning processing slots compared to prior rolling windows.
              </p>
              <div className="text-[11px] bg-white/10 p-2.5 rounded-lg border border-white/5 text-slate-300">
                ⚡ <span className="font-bold text-white">Actionable Target:</span> Recommend allocating supplemental routing channels to clear current backlog.
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* System Global Metrics Footer Area */}
      <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400 w-full">
        <p>© 2026 RescrapX. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="text-[11px] font-medium">All figures rendered in INR (₹)</span>
        </div>
      </footer>
    </div>
  );
};