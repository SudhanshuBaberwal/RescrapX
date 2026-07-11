'use client';

import React from 'react';
import { 
  Car, Wallet, TrendingUp, Calendar, RefreshCw, BarChart3, 
  ChevronDown, CheckCircle2, DollarSign, Clock, FileText, 
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';

export default function AnalyticsDashboard() {
  // Top Overview Metrics Grid
  const topMetrics = [
    { title: 'Total Vehicles Won', count: '24', trend: '↑ 26.3%', label: 'vs 8 May - 7 Jun', icon: Car, color: 'text-emerald-700 bg-emerald-50' },
    { title: 'Total Spend', count: '₹28,56,000', trend: '↑ 18.7%', label: 'vs 8 May - 7 Jun', icon: Wallet, color: 'text-blue-700 bg-blue-50' },
    { title: 'Total Earnings', count: '₹28,56,000', trend: '↑ 24.5%', label: 'vs 8 May - 7 Jun', icon: TrendingUp, color: 'text-purple-700 bg-purple-50' },
    { title: 'Avg. Winning Margin', count: '12.6%', trend: '↑ 2.3%', label: 'vs 8 May - 7 Jun', icon: Activity, color: 'text-amber-700 bg-amber-50' },
    { title: 'Total Pickups', count: '20', trend: '↑ 25.0%', label: 'vs 8 May - 7 Jun', icon: Calendar, color: 'text-teal-700 bg-teal-50' },
    { title: 'Total Recycled', count: '12', trend: '↑ 33.3%', label: 'vs 8 May - 7 Jun', icon: RefreshCw, color: 'text-cyan-700 bg-cyan-50' },
  ];

  // Bottom Analytics Metric Row
  const footerMetrics = [
    { label: 'Total Orders', value: '58', trend: '↑ 20.8%', positive: true },
    { label: 'Winning Ratio', value: '38.1%', trend: '↑ 5.7%', positive: true },
    { label: 'Avg. Winning Price', value: '₹1,19,000', trend: '↑ 12.4%', positive: true },
    { label: 'Avg. Vehicle Age', value: '8.2 Years', trend: '↓ 0.6 Yrs', positive: false },
    { label: 'Recycling Rate', value: '85.7%', trend: '↑ 6.3%', positive: true },
    { label: 'CoD Generated', value: '8', trend: '↑ 33.3%', positive: true },
  ];

  return (
    <div className="space-y-6 w-full text-xs">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-black text-gray-900 text-sm">Analytics</h3>
          <p className="text-[10px] text-gray-400 font-bold">Track your business performance and key insights.</p>
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-3 py-1.5 font-black text-gray-700 flex items-center gap-2 self-start sm:self-auto shadow-3xs cursor-pointer">
          <Calendar size={13} className="text-[#0B5B32]" />
          <span>8 Jun 2025 - 8 Jul 2025</span>
          <ChevronDown size={11} className="text-gray-400" />
        </button>
      </div>

      {/* 1. TOP OVERVIEW CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {topMetrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-start gap-2">
                <span className="text-gray-400 font-bold leading-tight">{m.title}</span>
                <div className={`p-1.5 rounded-lg ${m.color} shrink-0`}><Icon size={14} /></div>
              </div>
              <div>
                <span className="text-xl font-black text-gray-900 tracking-tight block">{m.count}</span>
                <p className="text-[9px] font-bold mt-0.5 whitespace-nowrap">
                  <span className="text-emerald-600 font-black mr-1">{m.trend}</span>
                  <span className="text-gray-400">{m.label}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. CORE VISUAL CHARTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* CHARTS CONTAINER A: Performance Overview Line Chart Placeholder */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-gray-900">Performance Overview</h4>
            <button className="border border-gray-200 rounded-lg px-2 py-0.5 bg-gray-50 text-[10px] font-black flex items-center gap-1">Daily <ChevronDown size={10} /></button>
          </div>
          <div className="flex gap-4 text-[10px] font-black">
            <span className="flex items-center gap-1.5 text-emerald-700"><span className="w-2 h-2 rounded-full bg-emerald-600" /> Earnings (₹)</span>
            <span className="flex items-center gap-1.5 text-blue-700"><span className="w-2 h-2 rounded-full bg-blue-500" /> Spend (₹)</span>
          </div>
          {/* Dynamic Graphic Placeholder Box simulating complex SVG lines */}
          <div className="h-44 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 font-mono text-[10px]">
            [ Line Graph: 8 Jun – 8 Jul ]
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 font-bold px-1">
            <span>8 Jun</span><span>13 Jun</span><span>18 Jun</span><span>23 Jun</span><span>28 Jun</span><span>3 Jul</span><span>8 Jul</span>
          </div>
        </div>

        {/* CHARTS CONTAINER B: Vehicles by Status Circular Matrix */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs space-y-4">
          <h4 className="font-black text-gray-900">Vehicles by Status</h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            {/* Visual Segment ring simulation */}
            <div className="relative w-28 h-28 rounded-full border-[10px] border-emerald-600 flex flex-col items-center justify-center bg-white shadow-3xs shrink-0">
              <span className="text-[10px] text-gray-400 font-bold">Total</span>
              <span className="text-lg font-black text-gray-900 -mt-1">58</span>
              <span className="text-[9px] text-gray-400 font-bold -mt-0.5">Vehicles</span>
            </div>
            {/* Legend Mapping list */}
            <div className="flex-1 space-y-1.5 w-full">
              {[
                { name: 'Won Vehicles', count: '24 (41.4%)', color: 'bg-emerald-600' },
                { name: 'Processing', count: '14 (24.1%)', color: 'bg-blue-500' },
                { name: 'Incoming', count: '10 (17.2%)', color: 'bg-amber-500' },
                { name: 'Recycled', count: '8 (13.8%)', color: 'bg-cyan-500' },
                { name: 'Others', count: '2 (3.4%)', color: 'bg-indigo-500' },
              ].map((status, i) => (
                <div key={i} className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-2 text-gray-500 font-bold">
                    <span className={`w-2 h-2 rounded-full ${status.color}`} /> {status.name}
                  </span>
                  <span className="font-black text-gray-900">{status.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHARTS CONTAINER C: Earnings Trend Bar Graph */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-gray-900">Earnings Trend</h4>
            <button className="border border-gray-200 rounded-lg px-2 py-0.5 bg-gray-50 text-[10px] font-black flex items-center gap-1">Weekly <ChevronDown size={10} /></button>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-black text-[#0B5B32]"><span className="w-2 h-2 rounded-full bg-[#0B5B32]" /> Earnings (₹)</span>
          {/* Custom flex mock layout representing structural bars exactly */}
          <div className="h-40 flex items-end justify-between gap-4 px-2 pt-4 bg-gray-50/30 rounded-xl border border-gray-100">
            {[
              { label: '8-14 Jun', height: 'h-2/3' },
              { label: '15-21 Jun', height: 'h-3/4' },
              { label: '22-28 Jun', height: 'h-full' },
              { label: '29 Jun - 5 Jul', height: 'h-4/5' },
              { label: '6-8 Jul', height: 'h-1/2' }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className={`w-full ${bar.height} bg-[#0B5B32] rounded-t-md hover:opacity-90 transition-all`} />
                <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap tracking-tighter">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. MULTI INSIGHTS SPLIT ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* SEGMENT A: Top Vehicle Categories Donut Map */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs space-y-4">
          <h4 className="font-black text-gray-900">Top Vehicle Categories (By Earnings)</h4>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-28 rounded-full border-[10px] border-emerald-700 flex flex-col items-center justify-center shrink-0">
              <span className="text-[9px] text-gray-400 font-bold uppercase">Earnings</span>
              <span className="text-[11px] font-black text-gray-900">₹28,56,000</span>
            </div>
            <div className="flex-1 w-full space-y-2 font-bold text-gray-600 text-[11px]">
              {[
                { name: 'Hatchback', value: '₹8,45,000', pct: '29.6%', color: 'bg-emerald-700' },
                { name: 'Sedan', value: '₹7,20,000', pct: '25.2%', color: 'bg-blue-600' },
                { name: 'SUV', value: '₹6,15,000', pct: '21.5%', color: 'bg-amber-500' },
                { name: 'MUV', value: '₹3,10,000', pct: '10.8%', color: 'bg-purple-500' },
                { name: 'Others', value: '₹1,66,000', pct: '5.8%', color: 'bg-cyan-500' },
                { name: 'Commercial', value: '₹0', pct: '—', color: 'bg-gray-300' },
              ].map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full ${cat.color}`} /> {cat.name}</span>
                  <div className="space-x-4 font-black text-gray-900">
                    <span>{cat.value}</span>
                    <span className="text-gray-400 font-bold inline-block w-8 text-right">{cat.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEGMENT B: Key Insights Checklist Feed */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <h4 className="font-black text-gray-900">Key Insights</h4>
            {[
              { desc: 'Your earnings are up by 24.5% compared to the previous 31 days.', icon: TrendingUp, color: 'text-emerald-700 bg-emerald-50' },
              { desc: 'Your winning ratio is 38.1% which is higher than last month (32.4%).', icon: Activity, color: 'text-amber-700 bg-amber-50' },
              { desc: 'Pickups completed on time: 95%. Keep up the good performance!', icon: CheckCircle2, color: 'text-purple-700 bg-purple-50' },
              { desc: '2 documents are pending verification. Please check the Documents section.', icon: FileText, color: 'text-blue-700 bg-blue-50' },
            ].map((insight, idx) => {
              const InsIcon = insight.icon;
              return (
                <div key={idx} className="flex gap-3 items-start border-b border-gray-50/60 pb-3 last:border-0 last:pb-0">
                  <div className={`p-1.5 rounded-lg border ${insight.color} shrink-0`}><InsIcon size={13} /></div>
                  <p className="text-gray-600 font-bold leading-normal pt-0.5">{insight.desc}</p>
                </div>
              );
            })}
          </div>
          <button className="text-[#0B5B32] font-black text-left hover:underline pt-2 mt-auto block cursor-pointer">View Detailed Insights →</button>
        </div>

        {/* SEGMENT C: Recent Activity Tracking Timeline */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-black text-gray-900">Recent Activity</h4>
            <a href="#" className="text-[#0B5B32] font-black hover:underline">View All</a>
          </div>
          <div className="space-y-3.5">
            {[
              { desc: 'Pickup completed for Hyundai i20 2016', sub: 'Order ID: WO-250708-0009', time: 'Today, 09:30 AM', color: 'text-emerald-700 bg-emerald-50 border-emerald-100', icon: CheckCircle2 },
              { desc: 'Payment received for Order WO-250708-0009', sub: 'Amount: ₹31,000', time: 'Yesterday, 04:15 PM', color: 'text-amber-700 bg-amber-50 border-amber-100', icon: DollarSign },
              { desc: 'New vehicle won: Tata Indica Vista 2011', sub: 'Order ID: WO-250708-0012', time: 'Yesterday, 11:20 AM', color: 'text-purple-700 bg-purple-50 border-purple-100', icon: Car },
              { desc: 'Document uploaded for Order WO-250708-0015', sub: 'Vehicle: Honda City 2012', time: '06 Jul 2025, 03:45 PM', color: 'text-blue-700 bg-blue-50 border-blue-100', icon: FileText },
              { desc: 'Vehicle recycled: Maruti Swift Dzire 2014', sub: 'CoD generated', time: '06 Jul 2025, 01:30 PM', color: 'text-cyan-700 bg-cyan-50 border-cyan-100', icon: RefreshCw },
            ].map((act, i) => {
              const ActIcon = act.icon;
              return (
                <div key={i} className="flex gap-3 items-start border-b border-gray-50/50 pb-3 last:border-0 last:pb-0">
                  <div className={`p-1.5 rounded-lg border ${act.color} shrink-0`}><ActIcon size={13} /></div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="font-black text-gray-800 truncate leading-tight">{act.desc}</p>
                    <p className="text-[10px] text-gray-400 font-bold truncate">{act.sub}</p>
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap shrink-0 pt-0.5">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. BOTTOM ANALYTICS SLAT MATRIX RUNNERS */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-4 gap-x-2 divide-x divide-gray-100">
          {footerMetrics.map((fm, idx) => (
            <div key={idx} className="space-y-1 px-3 first:pl-0">
              <span className="text-gray-400 font-bold block whitespace-nowrap">{fm.label}</span>
              <div className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="text-base font-black text-gray-900 tracking-tight">{fm.value}</span>
                <span className={`text-[9px] font-black whitespace-nowrap ${fm.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {fm.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-gray-400 font-bold text-[10px] tracking-wide pt-2">* All data is based on the selected date range.</p>

    </div>
  );
}