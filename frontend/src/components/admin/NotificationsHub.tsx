'use client'

import React, { useState } from 'react';

export const NotificationsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState<string>('NT-01');

  const topTabs = ['All Notifications', 'Scheduled', 'Sent', 'Drafts', 'Failed'];

  const metricCards = [
    { title: 'Total Sent', value: '2,548', sub: '▲ 18.6% vs last 7 days', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Delivered', value: '2,412', sub: '▲ 19.4% vs last 7 days', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Read', value: '1,732', sub: '▲ 17.2% vs last 7 days', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Click-through Rate', value: '23.6%', sub: '▲ 3.8% vs last 7 days', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Failed', value: '136', sub: '▼ 8.7% vs last 7 days', color: 'text-rose-600 bg-rose-50' },
  ];

  const notificationList = [
    { id: 'NT-01', title: 'Pickup Scheduled', desc: 'Your vehicle pickup has been scheduled for Tomorrow between 10:00 AM - 12:00 PM.', type: 'Transaction', tColor: 'text-emerald-700 bg-emerald-50 border-emerald-100', audience: 'Customer', channels: ['💬', '✉️', '📱'], status: 'Delivered', ratio: '2,342 / 2,412', priority: 'High', pColor: 'text-rose-700 bg-rose-50 border-rose-100', time: '02 Jun 2025, 10:23 AM' },
    { id: 'NT-02', title: 'Documents Approved', desc: 'Your documents have been verified and approved successfully.', type: 'Update', tColor: 'text-blue-700 bg-blue-50 border-blue-100', audience: 'RVSF Partner', channels: ['✉️', '📱'], status: 'Delivered', ratio: '156 / 162', priority: 'Medium', pColor: 'text-amber-700 bg-amber-50 border-amber-100', time: '02 Jun 2025, 09:45 AM' },
    { id: 'NT-03', title: 'Payment Completed', desc: 'Payment of ₹58,200 has been transferred to your account.', type: 'Transaction', tColor: 'text-emerald-700 bg-emerald-50 border-emerald-100', audience: 'RVSF Partner', channels: ['💬', '✉️', '🏢'], status: 'Delivered', ratio: '148 / 150', priority: 'High', pColor: 'text-rose-700 bg-rose-50 border-rose-100', time: '02 Jun 2025, 09:15 AM' },
    { id: 'NT-04', title: 'Bidding Update', desc: 'You have received a new bid for Booking ID BK25060123.', type: 'Alert', tColor: 'text-amber-700 bg-amber-50 border-amber-100', audience: 'Customer', channels: ['💬', '✉️', '📱'], status: 'Read', ratio: '945 / 1,024', priority: 'Medium', pColor: 'text-amber-700 bg-amber-50 border-amber-100', time: '02 Jun 2025, 08:30 AM' },
    { id: 'NT-05', title: 'System Maintenance', desc: 'RescrapX platform will be under maintenance on 05 Jun 2025.', type: 'Announcement', tColor: 'text-purple-700 bg-purple-50 border-purple-100', audience: 'All Users', channels: ['✉️', '🏢'], status: 'Scheduled', ratio: '-', priority: 'Low', pColor: 'text-slate-600 bg-slate-50 border-slate-100', time: '05 Jun 2025 Scheduled' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased w-full overflow-x-hidden flex flex-col">
      {/* Core Viewport Workspace Grid Row Section Container */}
      <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">
        
        {/* Section Action Controller Row Layout Container */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Notifications</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage and send notifications to users across the RescrapX platform.</p>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm self-start sm:self-auto shrink-0">
            + Send Notification
          </button>
        </div>

        {/* Metric KPI Counter Blocks Grid Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {metricCards.map((card, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase truncate">{card.title}</span>
              <div className="mt-2">
                <div className="text-xl font-black text-slate-900 tracking-tight">{card.value}</div>
                <div className={`text-[10px] inline-block mt-1 px-1.5 py-0.5 rounded font-bold ${card.color}`}>
                  {card.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtering Sub-Context Segment Header Control Bar */}
        <div className="border-b border-slate-200 overflow-x-auto whitespace-nowrap flex gap-6 scrollbar-none">
          {topTabs.map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 ${activeTab === tab ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Filtering Parameter Option Array Dropdowns Block */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Type</span>
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none text-slate-600"><option>All Types</option></select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Channel</span>
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none text-slate-600"><option>All Channels</option></select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Audience</span>
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none text-slate-600"><option>All Audience</option></select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none text-slate-600"><option>All Status</option></select>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Priority</span>
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none text-slate-600"><option>All Priority</option></select>
            </div>
            <div className="flex flex-col justify-end">
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg h-9 transition-colors">Reset Filters</button>
            </div>
          </div>
        </div>

        {/* Master Detail Grid View Separation Wrapper Panels */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Hand: Primary Master Table Grid System Box Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-8 space-y-4">
            <div className="flex justify-between items-center pb-1 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Notifications List</h3>
            </div>

            {/* Data Table Container - Guarded with Overflow Shielding Layer */}
            <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs text-slate-600 min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3 w-[30%]">Title & Content</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Audience</th>
                    <th className="p-3">Channels</th>
                    <th className="p-3">Status / Delivery Ratio</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Sent On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notificationList.map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => setSelectedNotification(row.id)}
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedNotification === row.id ? 'bg-emerald-50/30' : ''}`}
                    >
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{row.title}</div>
                        <div className="text-[11px] text-slate-440 mt-0.5 line-clamp-1 max-w-[240px]">{row.desc}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.tColor}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{row.audience}</td>
                      <td className="p-3">
                        <div className="flex gap-1.5 text-xs bg-slate-100/60 p-1 rounded w-fit">{row.channels.join(' ')}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{row.status}</div>
                        <div className="text-[10px] font-mono text-slate-400">{row.ratio}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${row.pColor}`}>
                          {row.priority}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-500 text-[11px]">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Hand Sidebar Context Container Card: Item Insight Drawer Segment */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm xl:col-span-4 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Notification Details</h3>
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">Delivered</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Instance Reference: {selectedNotification}</span>
              </div>
              <button className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            {/* Data Field Breakdown Rows Stack Panel */}
            <div className="space-y-2.5 text-xs border-b border-slate-100 pb-4">
              <div className="flex justify-between"><span className="text-slate-400">Title</span><span className="font-bold text-slate-900">Pickup Scheduled</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Type</span><span className="font-medium text-slate-800">Transaction</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Audience Target</span><span className="font-medium text-slate-800">Customers</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Priority Level</span><span className="text-rose-600 font-bold">High</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Dispatched Timestamp</span><span className="font-mono text-slate-500">02 Jun 2025, 10:23 AM</span></div>
            </div>

            {/* Statistical Delivery Sub-Panel Breakdown List block */}
            <div className="space-y-2 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Dispatch Analytics</span>
              <div className="flex justify-between"><span>Total Recipients</span><span className="font-mono font-bold text-slate-800">2,412</span></div>
              <div className="flex justify-between"><span>Delivered Successfully</span><span className="font-mono text-emerald-600 font-bold">2,342 <span className="text-[10px] font-normal text-slate-400">(97.1%)</span></span></div>
              <div className="flex justify-between"><span>Read Confirmed</span><span className="font-mono text-blue-600 font-bold">1,678 <span className="text-[10px] font-normal text-slate-400">(71.6%)</span></span></div>
              <div className="flex justify-between"><span>Action Clicked</span><span className="font-mono text-amber-600 font-bold">452 <span className="text-[10px] font-normal text-slate-400">(19.3%)</span></span></div>
            </div>

            {/* Interactive Layout Render Box: Message Copy Preview Content */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Message Copy Preview</span>
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 text-[11px] text-slate-700 space-y-2 leading-relaxed">
                <p className="font-bold">Hi Rahul Sharma,</p>
                <p>Your vehicle pickup has been scheduled for Tomorrow between 10:00 AM - 12:00 PM.</p>
                <p className="font-medium text-slate-500">📍 Pickup Location: Pune, Maharashtra</p>
                <p className="text-[10px] text-slate-400 italic">Our representative will contact you before arriving.</p>
                <div className="pt-2 border-t border-slate-200 flex justify-end">
                  <button className="text-emerald-600 font-bold hover:underline">View Full Screen Template →</button>
                </div>
              </div>
            </div>

            {/* Dynamic Operations Core Control Button Segment Box Panel */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button className="border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs py-2 px-2 rounded-lg transition-colors">
                🔄 Resend
              </button>
              <button className="border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs py-2 px-2 rounded-lg transition-colors">
                📋 Duplicate
              </button>
              <button className="col-span-2 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 font-bold text-xs py-2 rounded-lg transition-colors">
                🗑️ Delete Entry Instance
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Global Core Infrastructure Structural Sticky Footer Segment Panel Layer */}
      <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400 w-full">
        <p>© 2026 RescrapX. All rights reserved.</p>
        <p className="text-[11px]">System Status: <span className="text-emerald-600 font-bold">All Engines Active</span></p>
      </footer>
    </div>
  );
};