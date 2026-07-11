'use client';

import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, RotateCcw, Calendar, ChevronDown, 
  Trophy, Truck, Wrench, CheckCircle, IndianRupee, MoreVertical, 
  MapPin, Clock, Tag, ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function WonVehiclesDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  // Top Metric Cards Setup
  const stats = [
    { title: 'Total Won Vehicles', count: '32', sub: 'All time', icon: Trophy, bg: 'bg-emerald-50 text-emerald-700' },
    { title: 'Awaiting Pickup', count: '8', sub: 'To be picked up', icon: Truck, bg: 'bg-blue-50 text-blue-700' },
    { title: 'In Processing', count: '14', sub: 'At your facility', icon: Wrench, bg: 'bg-amber-50 text-amber-600' },
    { title: 'Completed', count: '10', sub: 'Scrapping completed', icon: CheckCircle, bg: 'bg-purple-50 text-purple-700' },
    { title: 'Total Won Value', count: '₹18,56,000', sub: 'All time', icon: IndianRupee, bg: 'bg-teal-50 text-teal-700', isValue: true },
  ];

  // Table Data Stream Matching Mockup
  const vehicles = [
    {
      name: 'Maruti Swift Dzire 2014',
      specs: 'Petrol • Manual • 1st Owner',
      tags: [{ text: 'RC Available', type: 'success' }],
      img: '🚗',
      auctionId: 'AUC-250708-0012',
      date: '08 Jul 2025 • 10:00 AM',
      location: 'Gurugram, Haryana',
      bid: '₹28,500',
      bidsCount: '5 bids',
      pickupStatus: { text: 'Scheduled', style: 'bg-blue-50 text-blue-700 border-blue-100' },
      pickupDate: '10 Jul 2025',
      processingStatus: { text: 'Awaiting Arrival', style: 'bg-amber-50 text-amber-700' },
      processingSub: 'Not received yet',
      wonOn: '08 Jul 2025',
      wonTime: '10:02 AM'
    },
    {
      name: 'Hyundai i20 2016',
      specs: 'Petrol • Manual • 2nd Owner',
      tags: [{ text: 'RC Available', type: 'success' }, { text: 'Fitness Expired', type: 'danger' }],
      img: '🚗',
      auctionId: 'AUC-250708-0009',
      date: '08 Jul 2025 • 09:30 AM',
      location: 'Gurugram, Haryana',
      bid: '₹31,000',
      bidsCount: '8 bids',
      pickupStatus: { text: 'Picked Up', style: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
      pickupDate: '09 Jul 2025',
      processingStatus: { text: 'In Processing', style: 'bg-blue-50 text-blue-700' },
      processingSub: 'Dismantling in progress',
      wonOn: '08 Jul 2025',
      wonTime: '09:35 AM'
    },
    {
      name: 'Honda City 2012',
      specs: 'Petrol • Manual • 2nd Owner',
      tags: [{ text: 'RC Available', type: 'success' }],
      img: '🚗',
      auctionId: 'AUC-250708-0015',
      date: '08 Jul 2025 • 11:00 AM',
      location: 'Faridabad, Haryana',
      bid: '₹30,000',
      bidsCount: '6 bids',
      pickupStatus: { text: 'Picked Up', style: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
      pickupDate: '09 Jul 2025',
      processingStatus: { text: 'In Processing', style: 'bg-blue-50 text-blue-700' },
      processingSub: 'Inspection completed',
      wonOn: '08 Jul 2025',
      wonTime: '11:05 AM'
    },
    {
      name: 'Tata Indica Vista 2011',
      specs: 'Diesel • Manual • 2nd Owner',
      tags: [{ text: 'RC Available', type: 'success' }, { text: 'Pollution Expired', type: 'danger' }],
      img: '🚗',
      auctionId: 'AUC-250708-0007',
      date: '08 Jul 2025 • 10:15 AM',
      location: 'Rewari, Haryana',
      bid: '₹24,000',
      bidsCount: '4 bids',
      pickupStatus: { text: 'Picked Up', style: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
      pickupDate: '09 Jul 2025',
      processingStatus: { text: 'Scrapping Completed', style: 'bg-purple-50 text-purple-700' },
      processingSub: 'Certificate pending',
      wonOn: '08 Jul 2025',
      wonTime: '10:18 AM'
    },
    {
      name: 'Mahindra XUV500 2013',
      specs: 'Diesel • Manual • 2nd Owner',
      tags: [{ text: 'RC Available', type: 'success' }],
      img: '🚗',
      auctionId: 'AUC-250707-0021',
      date: '07 Jul 2025 • 09:00 AM',
      location: 'Sonipat, Haryana',
      bid: '₹42,000',
      bidsCount: '4 bids',
      pickupStatus: { text: 'Picked Up', style: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
      pickupDate: '08 Jul 2025',
      processingStatus: { text: 'Scrapping Completed', style: 'bg-purple-50 text-purple-700' },
      processingSub: 'CoD uploaded',
      wonOn: '07 Jul 2025',
      wonTime: '09:07 AM'
    },
    {
      name: 'Toyota Etios Liva 2015',
      specs: 'Petrol • Manual • 1st Owner',
      tags: [{ text: 'RC Available', type: 'success' }],
      img: '🚗',
      auctionId: 'AUC-250707-0011',
      date: '07 Jul 2025 • 11:30 AM',
      location: 'Delhi, Delhi',
      bid: '₹24,000',
      bidsCount: '3 bids',
      pickupStatus: { text: 'Picked Up', style: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
      pickupDate: '08 Jul 2025',
      processingStatus: { text: 'Completed', style: 'bg-emerald-50 text-emerald-700' },
      processingSub: 'CoD generated',
      wonOn: '07 Jul 2025',
      wonTime: '11:33 AM'
    }
  ];

  return (
    <div className="space-y-6 w-full text-xs text-gray-700 antialiased">
      
      {/* 1. TOP TITLE HEADER BAR */}
      <div className="border-b border-gray-100 pb-3">
        <h3 className="font-black text-gray-900 text-sm tracking-tight">Won Vehicles</h3>
        <p className="text-[10px] text-gray-400 font-bold">View all vehicles you have won in auctions and track their progress.</p>
      </div>

      {/* 2. ANALYTICS ROW GRID PANEL */}
      <div className="overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex lg:grid lg:grid-cols-5 gap-4 min-w-max lg:min-w-0">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex items-start gap-4 w-52 lg:w-auto shrink-0">
                <div className={`p-2.5 rounded-xl ${item.bg} shrink-0`}>
                  <Icon size={16} />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] text-gray-400 font-bold block truncate leading-none">{item.title}</span>
                  <span className={`text-base font-black block tracking-tight ${item.isValue ? 'text-gray-900' : 'text-gray-900'}`}>{item.count}</span>
                  <span className="text-[9px] text-gray-400 font-medium block leading-none">{item.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MULTI-FILTER WORKSPACE TOOLBAR STRIP */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3 items-end">
          
          {/* Search Term Input */}
          <div className="space-y-1 xl:col-span-2">
            <label className="text-[10px] text-gray-400 font-black block">Search Vehicle</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by make, model or year..." 
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-900 font-bold placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Status Select Elements */}
          {[
            { label: 'Pickup Status', current: 'All Status' },
            { label: 'Processing Status', current: 'All Status' },
            { label: 'Location', current: 'All Locations' }
          ].map((drop, dIdx) => (
            <div key={dIdx} className="space-y-1">
              <label className="text-[10px] text-gray-400 font-black block">{drop.label}</label>
              <div className="relative">
                <select className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-900 font-bold appearance-none focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white cursor-pointer">
                  <option>{drop.current}</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          ))}

          {/* Date Picker Filter Element */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 font-black block">Date Range</label>
            <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-400 font-bold flex items-center justify-between text-left hover:bg-white transition-all cursor-pointer">
              <div className="flex items-center gap-1.5 text-gray-400">
                <Calendar size={13} />
                <span className="text-[10px]">Select Date Range</span>
              </div>
              <ChevronDown size={11} />
            </button>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex gap-2 w-full pt-1 sm:pt-0">
            <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black py-2 px-3 rounded-xl shadow-3xs transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <SlidersHorizontal size={12} />
              <span>Filters</span>
            </button>
            <button className="text-gray-400 hover:text-gray-600 font-black py-2 px-1 flex items-center justify-center gap-1 cursor-pointer">
              <RotateCcw size={12} />
              <span className="text-[10px]">Clear All</span>
            </button>
          </div>

        </div>
      </div>

      {/* 4. CORE VEHICLES DATA SHEET DATA GRID */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-3xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] text-gray-400 font-black uppercase tracking-wider bg-gray-50/40">
                <th className="py-3 px-4 font-black">Vehicle Details</th>
                <th className="py-3 px-4 font-black">Auction Details</th>
                <th className="py-3 px-4 font-black">Winning Bid</th>
                <th className="py-3 px-4 font-black">Pickup Status</th>
                <th className="py-3 px-4 font-black">Processing Status</th>
                <th className="py-3 px-4 font-black">Won On</th>
                <th className="py-3 px-4 text-right font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.map((car, idx) => (
                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                  
                  {/* Column A: Vehicle Specs Details */}
                  <td className="py-3.5 px-4 min-w-[220px]">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-11 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-lg shrink-0 overflow-hidden shadow-3xs">
                        {car.img}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-gray-900 text-[11px] leading-tight tracking-tight">{car.name}</h4>
                        <p className="text-[9px] text-gray-400 font-medium leading-none">{car.specs}</p>
                        <div className="flex gap-1 flex-wrap pt-0.5">
                          {car.tags.map((t, tIdx) => (
                            <span key={tIdx} className={`px-1.5 py-0.5 rounded-sm text-[8px] font-black tracking-tight ${
                              t.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-600'
                            }`}>
                              {t.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column B: Auction Identity Credentials */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1 text-[10px] text-gray-500 font-bold">
                      <div className="flex items-center gap-1 text-gray-700 font-black">
                        <Tag size={10} className="text-gray-400" />
                        <span>Auction ID: {car.auctionId}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium text-gray-400">
                        <Calendar size={10} />
                        <span>{car.date}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium text-gray-400">
                        <MapPin size={10} />
                        <span>{car.location}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column C: Financial Bidding Details */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-black text-emerald-700 text-[11px] block">{car.bid}</span>
                      <span className="text-[9px] text-gray-400 font-medium block leading-none">{car.bidsCount}</span>
                    </div>
                  </td>

                  {/* Column D: Logistical Transport Indicator */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black inline-block border ${car.pickupStatus.style}`}>
                        {car.pickupStatus.text}
                      </span>
                      <span className="text-[9px] text-gray-400 font-medium block pl-0.5">{car.pickupDate}</span>
                    </div>
                  </td>

                  {/* Column E: Operations Processing Status */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className={`font-black text-[10px] block ${car.processingStatus.style}`}>
                        {car.processingStatus.text}
                      </span>
                      <span className="text-[9px] text-gray-400 font-medium block leading-none">{car.processingSub}</span>
                    </div>
                  </td>

                  {/* Column F: Time Payout Timestamp Records */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className="font-black text-gray-800 block">{car.wonOn}</span>
                      <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium leading-none">
                        <Clock size={9} />
                        <span>{car.wonTime}</span>
                      </div>
                    </div>
                  </td>

                  {/* Column G: Options Trigger Utilities */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-2.5 py-1 rounded-xl text-[10px] shadow-3xs transition-all cursor-pointer">
                        View Details
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                        <MoreVertical size={13} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. CONTENT BOTTOM PAGINATION CONTROL LAYER */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/20">
          <span className="text-[10px] text-gray-400 font-bold">Showing 1 to 10 of 32 won vehicles</span>
          
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-white transition-all cursor-pointer disabled:opacity-40" disabled>
              <ChevronLeft size={13} />
            </button>
            
            {[1, 2, 3, 4].map((page) => (
              <button 
                key={page} 
                className={`w-6 h-6 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  page === 1 
                    ? 'bg-[#0B5B32] text-white shadow-3xs' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-gray-700 transition-all cursor-pointer">
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}