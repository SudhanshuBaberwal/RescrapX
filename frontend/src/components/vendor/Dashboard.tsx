'use client';

import React from 'react';
import { 
  Gavel, Award, Truck, Warehouse, FileText, Wallet, ArrowUpRight, 
  MapPin, Clock, Upload, ArrowRight, Calendar, AlertCircle
} from 'lucide-react';

export default function PartnerDashboard() {
  const stats = [
    { title: 'Live Bidding Opportunities', count: '14', meta: 'Join active sessions', icon: Gavel, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { title: 'Orders Won Today', count: '3', meta: 'Total value ₹1,24,300', icon: Award, color: 'text-amber-700 bg-amber-50 border-amber-100' },
    { title: 'Vehicles Awaiting Arrival', count: '5', meta: 'Picked up by RescrapX', icon: Truck, color: 'text-blue-700 bg-blue-50 border-blue-100' },
    { title: 'Vehicles in Processing', count: '8', meta: 'At your facility', icon: Warehouse, color: 'text-purple-700 bg-purple-50 border-purple-100' },
    { title: 'Pending Documents', count: '6', meta: 'Action required', icon: FileText, color: 'text-red-700 bg-red-50 border-red-100' },
  ];

  return (
    <div className="space-y-6 w-full">
      
      {/* SECTION 1: TOP STATS ROWS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-gray-400 font-bold leading-tight line-clamp-2">{stat.title}</span>
                <div className={`p-1.5 rounded-lg border shrink-0 ${stat.color}`}><Icon size={14} /></div>
              </div>
              <div>
                <span className="text-xl font-black text-gray-900 block tracking-tight">{stat.count}</span>
                <span className="text-[9px] text-gray-400 font-bold block truncate">{stat.meta}</span>
              </div>
            </div>
          );
        })}
        
        {/* REVENUE CARD COMPONENT */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-3xs flex flex-col justify-between space-y-2 bg-gradient-to-br from-emerald-50/10 to-white col-span-1 sm:col-span-2 md:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-gray-400 font-bold">Monthly Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[#0B5B32]"><Wallet size={14} /></div>
          </div>
          <div>
            <span className="text-xl font-black text-gray-900 block tracking-tight">₹12,45,000</span>
            <span className="text-[9px] text-emerald-600 font-black flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight size={10} /> +18% vs last month
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVE GRID + TRACKING COLUMN SPLITS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LIVE TABLES BIDDING DATA CONTAINER */}
        <div className="xl:col-span-7 bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-3">
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Live Bidding Opportunities</h3>
              <p className="text-[10px] text-gray-400 font-semibold">Join active bidding sessions and win more business.</p>
            </div>
            <a href="#" className="text-[#0B5B32] font-black text-[11px] hover:underline shrink-0">View all sessions →</a>
          </div>

          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-left border-collapse min-w-[540px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold text-[10px]">
                  <th className="pb-2 font-black">Vehicle Details</th>
                  <th className="pb-2 font-black">Location</th>
                  <th className="pb-2 font-black text-center">Time Left</th>
                  <th className="pb-2 font-black text-right">Highest Bid</th>
                  <th className="pb-2 font-black text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[11px]">
                {[
                  { name: 'Maruti Swift Dzire 2014', sub: 'DL8CAX1122 • Petrol', loc: 'Gurugram, Haryana', dist: '12 km away', time: '00:17:32', bid: '₹28,500' },
                  { name: 'Hyundai i20 2016', sub: 'HR26AZ7789 • Petrol', loc: 'Gurugram, Haryana', dist: '15 km away', time: '00:22:45', bid: '₹32,000' }
                ].map((row, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50/50">
                    <td className="py-3 pr-2">
                      <p className="font-black text-gray-800 group-hover:text-[#0B5B32] transition-colors">{row.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold">{row.sub}</p>
                    </td>
                    <td className="py-3 pr-2 text-gray-600 font-medium">
                      <div className="flex items-center gap-1"><MapPin size={11} className="text-gray-400" /> <span>{row.loc}</span></div>
                      <span className="text-[9px] text-gray-400 font-bold pl-4">{row.dist}</span>
                    </td>
                    <td className="py-3 px-1.5"><span className="font-mono font-bold text-red-600 bg-red-50 text-[10px] px-2 py-1 rounded-md block text-center">{row.time}</span></td>
                    <td className="py-3 text-right font-black text-gray-900">{row.bid}</td>
                    <td className="py-3 text-center pl-3">
                      <button className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-2.5 py-1.5 rounded-lg transition-all shadow-3xs cursor-pointer">Place Bid</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INCOMING LOGISTICS VEHICLES PROGRESS RAMP */}
        <div className="xl:col-span-5 bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <h3 className="text-sm font-black text-gray-900 tracking-tight">Incoming Vehicles <span className="text-gray-400 font-medium">(RescrapX Picked)</span></h3>
            <a href="#" className="text-[#0B5B32] font-black text-[11px] hover:underline">View all →</a>
          </div>

          <div className="space-y-3.5">
            {[
              { model: 'Maruti Alto 800 2013', id: 'DL8CAM3456', status: 'On The Way', color: 'bg-blue-50 border-blue-200 text-blue-700', driver: 'Ravi Kumar', eta: '35 min' },
              { model: 'Toyota Etios Liva 2015', id: 'HR55AD9101', status: 'Picked Up', color: 'bg-emerald-50 border-emerald-200 text-[#0B5B32]', driver: 'Mohit Singh', eta: '1 hr 45 min' }
            ].map((item, idx) => (
              <div key={idx} className="border border-gray-100 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white hover:border-gray-200 transition-all">
                <div className="space-y-1 min-w-0">
                  <h4 className="font-black text-gray-800 truncate">{item.model}</h4>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-400 font-bold">
                    <span>ID: {item.id}</span>
                    <span>Driver: <strong className="text-gray-600 font-black">{item.driver}</strong></span>
                  </div>
                </div>
                <div className="flex sm:flex-col justify-between sm:items-end gap-2 shrink-0">
                  <span className={`px-2 py-0.5 font-black text-[9px] border rounded-md uppercase tracking-wider text-center ${item.color}`}>{item.status}</span>
                  <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1"><Clock size={10} /> {item.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 3: BOTTOM GRID OPERATIONAL PILLARS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* YARD TRACKING MODULE */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs space-y-3">
          <h4 className="font-black text-gray-900 text-xs border-b border-gray-50 pb-2">Processing Yard Overview</h4>
          <div className="space-y-2 text-[11px]">
            {[
              { label: 'Waiting for Arrival', count: 5 },
              { label: 'Vehicle Received', count: 4 },
              { label: 'Inspection Completed', count: 3 },
              { label: 'ELV Dismantling', count: 8 },
              { label: 'Completed (This Month)', count: 145, highlight: true }
            ].map((yard, idx) => (
              <div key={idx} className="flex justify-between items-center py-0.5 font-bold border-b border-gray-50/40 last:border-0">
                <span className={yard.highlight ? 'text-emerald-900 font-black' : 'text-gray-500'}>{yard.label}</span>
                <span className={`px-2 py-0.2 rounded-md font-black ${yard.highlight ? 'bg-emerald-50 text-[#0B5B32]' : 'bg-gray-50 text-gray-700'}`}>{yard.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* EARNING DETAILS MATRIX MODULE */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs space-y-4">
          <h4 className="font-black text-gray-900 text-xs border-b border-gray-50 pb-2">Earnings Overview (This Month)</h4>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-gray-50/60 p-2.5 rounded-xl space-y-0.5">
              <span className="text-gray-400 font-bold block text-[9px]">Total Revenue</span>
              <span className="font-black text-gray-900 text-[13px] tracking-tight">₹12,45,000</span>
            </div>
            <div className="bg-emerald-50/40 border border-emerald-100/60 p-2.5 rounded-xl space-y-0.5">
              <span className="text-emerald-700 font-bold block text-[9px]">Net Settlement</span>
              <span className="font-black text-[#0B5B32] text-[13px] tracking-tight">₹9,63,000</span>
            </div>
          </div>
          <div className="space-y-1.5 pt-1 text-[10px] border-t border-gray-50">
            <div className="flex justify-between text-gray-400 font-bold"><span>Pending Settlements</span> <span className="text-amber-700 font-black">₹2,15,000</span></div>
            <div className="flex justify-between text-gray-400 font-bold"><span>Completed Settlements</span> <span className="text-gray-800 font-black">₹7,48,000</span></div>
          </div>
        </div>

        {/* ATTENTION REQUIRED DOCUMENTS */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs space-y-3">
          <h4 className="font-black text-gray-900 text-xs border-b border-gray-50 pb-2 flex items-center gap-1.5"><AlertCircle size={13} className="text-red-500" /> <span>Documents Required</span></h4>
          <div className="space-y-2">
            {[
              { doc: 'Certificate of Deposit (CoD)', car: 'Maruti Dzire • DL8C' },
              { doc: 'Chassis Cut Photo', car: 'Toyota Liva • HR55' }
            ].map((d, i) => (
              <div key={i} className="border border-red-100 bg-red-50/10 p-2.5 rounded-xl flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-black text-gray-800 truncate leading-tight">{d.doc}</p>
                  <p className="text-[9px] text-gray-400 font-bold truncate">{d.car}</p>
                </div>
                <button className="bg-white border border-red-200 hover:bg-red-50 text-red-600 font-black px-2 py-1 rounded-lg text-[9px] transition-all flex items-center gap-1 shrink-0 shadow-3xs cursor-pointer">
                  <Upload size={10} /> <span>Upload</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACCESS ACTION STRIPS MATRIX */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-3xs space-y-3">
          <h4 className="font-black text-gray-900 text-xs border-b border-gray-50 pb-2">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Place Bid', icon: Gavel },
              { name: 'Upload Docs', icon: Upload },
              { name: 'View Incoming', icon: Truck },
              { name: 'Reports Summary', icon: Wallet }
            ].map((act, idx) => {
              const ActIcon = act.icon;
              return (
                <button key={idx} className="border border-gray-100 hover:border-emerald-200 bg-white hover:bg-emerald-50/10 p-2.5 rounded-xl flex flex-col items-center text-center justify-center space-y-1 font-black text-gray-700 transition-all shadow-3xs group cursor-pointer">
                  <ActIcon size={14} className="text-gray-400 group-hover:text-[#0B5B32] transition-colors" />
                  <span className="text-[10px] leading-tight group-hover:text-gray-900">{act.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}