'use client'

import React from 'react';

interface AdminDashboardProps {
  onMenuToggle?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const metrics = [
    { title: 'Total Vehicles', value: '128', label: '▲ 18% vs yesterday', trendUp: true, icon: '🚗' },
    { title: 'Bidding Sessions', value: '24', label: 'Active now: 6', trendUp: false, icon: '🔨' },
    { title: 'Total Orders', value: '96', label: '▲ 22% vs yesterday', trendUp: true, icon: '📦' },
    { title: 'Pickups Scheduled', value: '48', label: 'For today', trendUp: false, icon: '📅' },
    { title: 'Revenue (Today)', value: '₹8,42,500', label: '▲ 16% vs yesterday', trendUp: true, icon: '💰' },
    { title: 'Total Revenue (MTD)', value: '₹24,68,340', label: '▲ 14% vs last month', trendUp: true, icon: '📈' },
  ];

  return (
    <main className="p-4 md:p-6 space-y-6 w-full mx-auto">
      
      {/* Responsive Metrics Rows Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-medium truncate">{m.title}</span>
              <span>{m.icon}</span>
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 mb-1">{m.value}</div>
              <div className={`text-[11px] font-semibold ${m.trendUp ? 'text-emerald-600' : 'text-slate-500'}`}>
                {m.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Dashboard Visual Widgets Area Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Bidding Sessions Analytics Chart Card Block */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm xl:col-span-5 min-h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Bidding Sessions Overview</h3>
            <a href="#" className="text-xs text-emerald-600 font-medium hover:underline">View all</a>
          </div>
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs py-10">
            <span>[Bidding Session Chart Space]</span>
          </div>
        </div>

        {/* Live Bidding Snapshot Content List Block */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm xl:col-span-7">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Live Bidding Snapshot</h3>
            <a href="#" className="text-xs text-emerald-600 font-medium hover:underline">View all</a>
          </div>
          
          {/* Responsive Mini Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="pb-2 font-medium">Vehicle</th>
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">Highest Bid</th>
                  <th className="pb-2 font-medium">Time Left</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr>
                  <td className="py-3 font-medium text-slate-800">Maruti Swift Dzire 2014</td>
                  <td className="py-3 text-slate-500">Gurugram, HR</td>
                  <td className="py-3 font-semibold text-slate-900">₹36,500</td>
                  <td className="py-3 text-red-500 font-medium">00:17:32</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-slate-800">Hyundai i20 2016</td>
                  <td className="py-3 text-slate-500">Faridabad, HR</td>
                  <td className="py-3 font-semibold text-slate-900">₹41,200</td>
                  <td className="py-3 text-red-500 font-medium">00:22:45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Secondary Dashboard Section Grid Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Today's Pickup Overview</h3>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex justify-between"><span>Scheduled</span><span className="font-semibold">48</span></div>
            <div className="flex justify-between border-t border-slate-50 pt-2"><span>In Transit</span><span className="font-semibold text-blue-600">32</span></div>
            <div className="flex justify-between border-t border-slate-50 pt-2"><span>Picked Up</span><span className="font-semibold text-emerald-600">28</span></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Pickup Map (Live)</h3>
          <div className="bg-slate-100 rounded-lg h-24 flex items-center justify-center text-slate-400 text-xs">
            [Live Map Visualization Container]
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">System Health</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Server Status</span>
              <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">Operational</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-50 pt-2">
              <span className="text-slate-600">Database Engine</span>
              <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">Operational</span>
            </div>
          </div>
        </div>
      </div>

    </main>
  );
};

export default AdminDashboard;