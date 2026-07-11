'use client';

import React, { useState } from 'react';
import { 
  Gavel, Clock, Trophy, Ban, AlertCircle, Search, SlidersHorizontal, 
  MapPin, Calendar, Fuel, ChevronDown, ChevronLeft, ChevronRight, 
  LayoutGrid, List, FileText, CheckCircle2, XCircle
} from 'lucide-react';

export default function MyBidsDashboard() {
  const [activeTab, setActiveTab] = useState('All Bids');

  // Top Metrics Data Grid
  const metrics = [
    { title: 'Total Bids', count: '128', meta: 'All time', icon: Gavel, iconColor: 'text-emerald-600 bg-emerald-50' },
    { title: 'Active Bids', count: '15', meta: 'Currently live', icon: FileText, iconColor: 'text-purple-600 bg-purple-50' },
    { title: 'Bids Won', count: '32', meta: '25.0% win rate', icon: Trophy, iconColor: 'text-emerald-600 bg-emerald-50', rate: true },
    { title: 'Bids Lost', count: '81', meta: '63.3%', icon: XCircle, iconColor: 'text-red-600 bg-red-50' },
    { title: 'Outbid', count: '15', meta: '11.7%', icon: Ban, iconColor: 'text-amber-600 bg-amber-50' },
  ];

  // Bid Status Filter Tabs
  const tabs = [
    { name: 'All Bids', count: null },
    { name: 'Active Bids', count: 15 },
    { name: 'Bids Won', count: 32 },
    { name: 'Bids Lost', count: 81 },
    { name: 'Outbid', count: 15 },
  ];

  // Core Bids Dataset
  const bidsItems = [
    { id: 1, name: 'Maruti Swift Dzire 2014', engine: 'Petrol • Manual • 1st Owner', tags: ['RC Available'], date: '08 Jul 2025 • 10:00 AM', location: 'Gurugram, Haryana', yourBid: '₹28,500', bidsCount: '5 bids', highestBid: '₹30,000', highestBidder: 'by RecycleHub', status: 'Active', timer: '00:17:32 Remaining', timerType: 'countdown' },
    { id: 2, name: 'Hyundai i20 2016', engine: 'Petrol • Manual • 2nd Owner', tags: ['RC Available', 'Fitness Expired'], date: '08 Jul 2025 • 09:30 AM', location: 'Gurugram, Haryana', yourBid: '₹31,000', bidsCount: '8 bids', highestBid: '₹31,000', highestBidder: 'by You', status: 'Active', timer: '00:22:45 Remaining', timerType: 'countdown', isHighest: true },
    { id: 3, name: 'Honda City 2012', engine: 'Petrol • Manual • 2nd Owner', tags: ['RC Available'], date: '08 Jul 2025 • 11:00 AM', location: 'Faridabad, Haryana', yourBid: '₹30,000', bidsCount: '6 bids', highestBid: '₹32,500', highestBidder: 'by ScrapMax', status: 'Outbid', timer: '00:28:10 Remaining', timerType: 'countdown' },
    { id: 4, name: 'Tata Indica Vista 2011', engine: 'Diesel • Manual • 2nd Owner', tags: ['RC Available', 'Pollution Expired'], date: '08 Jul 2025 • 10:15 AM', location: 'Rewari, Haryana', yourBid: '₹24,000', bidsCount: '4 bids', highestBid: '₹24,500', highestBidder: 'by AutoRecycle', status: 'Lost', timer: 'Ended • 08 Jul 2025 • 10:35 AM', timerType: 'ended' },
    { id: 5, name: 'Mahindra XUV500 2013', engine: 'Diesel • Manual • 2nd Owner', tags: ['RC Available'], date: '08 Jul 2025 • 09:00 AM', location: 'Sonipat, Haryana', yourBid: '₹42,000', bidsCount: '4 bids', highestBid: '₹45,000', highestBidder: 'by GreenAuto Recyclers', status: 'Lost', timer: 'Ended • 08 Jul 2025 • 09:20 AM', timerType: 'ended' },
    { id: 6, name: 'Toyota Etios Liva 2015', engine: 'Petrol • Manual • 1st Owner', tags: ['RC Available'], date: '08 Jul 2025 • 11:30 AM', location: 'Delhi, Delhi', yourBid: '₹24,000', bidsCount: '3 bids', highestBid: '₹24,000', highestBidder: 'by You', status: 'Won', timer: 'Ended • 08 Jul 2025 • 12:05 PM', timerType: 'ended' },
  ];

  // Dynamic Status Badge Resolver
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Outbid': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Won': return 'bg-emerald-50 text-[#0B5B32] border-emerald-100';
      case 'Lost': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="space-y-6 w-full text-xs">
      
      {/* 1. TOP METRICS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex justify-between items-start">
              <div className="space-y-3">
                <span className="text-gray-400 font-bold block">{metric.title}</span>
                <div>
                  <span className="text-xl font-black text-gray-900 tracking-tight block">{metric.count}</span>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.rate && <span className="text-[10px] text-emerald-600 font-black mr-0.5">▲</span>}
                    <span className={`text-[10px] font-bold ${metric.rate ? 'text-emerald-600' : 'text-gray-400'}`}>{metric.meta}</span>
                  </div>
                </div>
              </div>
              <div className={`p-2 rounded-xl ${metric.iconColor}`}><Icon size={16} /></div>
            </div>
          );
        })}
      </div>

      {/* 2. TABBED FILTER INTERFACE (Horizontal scroll on mobile) */}
      <div className="border-b border-gray-100 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        <div className="flex gap-6 min-w-max pb-px">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-3 font-black transition-all relative cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.name ? 'text-[#0B5B32]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>{tab.name}</span>
              {tab.count !== null && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                  activeTab === tab.name ? 'bg-emerald-50 text-[#0B5B32]' : 'bg-gray-100 text-gray-500'
                }`}>{tab.count}</span>
              )}
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B5B32] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. SEARCH & DYNAMIC FILTER BAR */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
          
          <div className="relative xl:col-span-2">
            <span className="text-[10px] text-gray-400 font-black block mb-1">Search Vehicle</span>
            <div className="relative">
              <input type="text" placeholder="Search by make, model or year..." className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-700 font-medium placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#0B5B32] focus:bg-white" />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {[
            { label: 'Vehicle Type', value: 'All Types' },
            { label: 'Fuel Type', value: 'All Fuel Types' },
            { label: 'Location', value: 'All Locations' },
            { label: 'Bid Status', value: 'All Status' }
          ].map((filter, idx) => (
            <div key={idx}>
              <span className="text-[10px] text-gray-400 font-black block mb-1">{filter.label}</span>
              <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-bold flex items-center justify-between hover:bg-gray-100/50 transition-all">
                <span>{filter.value}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>
            </div>
          ))}

          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Date Range</span>
            <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-400 font-bold flex items-center justify-between hover:bg-gray-100/50 transition-all">
              <span>Select Date Range</span>
              <Calendar size={12} className="text-gray-400" />
            </button>
          </div>

        </div>

        <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-50">
          <button className="bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-4 py-1.5 font-black text-gray-700 flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer h-8">
            <SlidersHorizontal size={12} /> <span>Filters</span>
          </button>
        </div>
      </div>

      {/* 4. DATA COMPONENT CANVAS CONTAINER */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">
        
        {/* DESKTOP VIEWPORT TABLE VIEW */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-black">Vehicle Details</th>
                <th className="py-3 px-2 font-black">Auction Details</th>
                <th className="py-3 px-2 font-black text-right">Your Bid</th>
                <th className="py-3 px-2 font-black text-right">Current Highest Bid</th>
                <th className="py-3 px-2 font-black text-center">Status</th>
                <th className="py-3 px-2 font-black">Time Left</th>
                <th className="py-3 px-4 font-black text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {bidsItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                  
                  {/* Vehicle Context Sheet */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex gap-3">
                      <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200/60 relative">
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center font-bold text-gray-400">IMG</div>
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-black text-gray-900 text-[13px] tracking-tight leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold">{item.engine}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.tags.map((tag, i) => (
                            <span key={i} className={`text-[8px] font-black px-1.5 py-0.2 rounded-sm uppercase tracking-wide border ${
                              tag.includes('Expired') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location & Scheduling Stamp */}
                  <td className="py-4 px-2">
                    <div className="space-y-1 text-gray-600">
                      <p className="flex items-center gap-1 font-bold text-gray-800"><MapPin size={12} className="text-gray-400" /> <span>{item.location}</span></p>
                      <p className="flex items-center gap-1 text-[10px] text-gray-400 font-bold"><Calendar size={12} className="text-gray-400" /> <span>{item.date}</span></p>
                    </div>
                  </td>

                  {/* Firm placement records */}
                  <td className="py-4 px-2 text-right">
                    <p className="font-black text-gray-900 text-[13px]">{item.yourBid}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{item.bidsCount}</p>
                  </td>

                  {/* Variable competitive highest limits status */}
                  <td className="py-4 px-2 text-right">
                    <p className={`font-black text-[13px] ${item.isHighest || item.highestBidder === 'by You' ? 'text-emerald-700' : 'text-gray-900'}`}>{item.highestBid}</p>
                    <p className={`text-[10px] font-bold ${item.isHighest || item.highestBidder === 'by You' ? 'text-emerald-700 font-black' : 'text-gray-400'}`}>{item.highestBidder}</p>
                  </td>

                  {/* Status Badges Row indicator */}
                  <td className="py-4 px-2 text-center">
                    <span className={`px-2.5 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>

                  {/* Expiration Clock Systems */}
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-1.5">
                      {item.timerType === 'countdown' && (
                        <div className="w-2 h-2 rounded-full border border-red-500 border-t-transparent animate-spin shrink-0" />
                      )}
                      <span className={`font-mono font-bold text-[11px] ${item.timerType === 'countdown' ? 'text-red-600' : 'text-gray-400'}`}>
                        {item.timer}
                      </span>
                    </div>
                  </td>

                  {/* Multi Action buttons layout */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <button className={`font-black px-4 py-1.5 rounded-xl shadow-3xs transition-all tracking-tight cursor-pointer ${
                        item.status === 'Active' || item.status === 'Outbid'
                          ? 'bg-[#0B5B32] hover:bg-[#094d2a] text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200/40'
                      }`}>
                        {item.status === 'Active' || item.status === 'Outbid' ? 'View Auction' : 'View Result'}
                      </button>
                      <a href="#" className="text-gray-400 hover:text-gray-600 font-bold text-[10px] mt-0.5">View Details</a>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* COMPACT CARD RESPONSIVE VIEW (Mounts below desktop break limits) */}
        <div className="xl:hidden divide-y divide-gray-100">
          {bidsItems.map((item) => (
            <div key={item.id} className="p-4 space-y-4 hover:bg-gray-50/20 transition-all">
              
              {/* Header Title Section block */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex gap-2.5 min-w-0">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200/50 flex items-center justify-center font-bold text-gray-300">IMG</div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-black text-gray-900 text-sm tracking-tight truncate">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold truncate">{item.engine}</p>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.tags.map((tag, i) => (
                        <span key={i} className={`text-[8px] font-black px-1.5 py-0.2 rounded-sm border uppercase ${
                          tag.includes('Expired') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                        }`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-md font-black text-[8px] uppercase tracking-wider border shrink-0 ${getStatusStyle(item.status)}`}>
                  {item.status}
                </span>
              </div>

              {/* Data parameters Grid values layout row */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50/60 border border-gray-100/40 p-3 rounded-xl">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold block mb-0.5">Your Bid Parameter</span>
                  <span className="font-black text-gray-900 block text-[13px]">{item.yourBid}</span>
                  <span className="text-[9px] text-gray-400 font-bold block mt-0.5">{item.bidsCount}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold block mb-0.5">Current Highest Limit</span>
                  <span className={`font-black text-[13px] block ${item.isHighest || item.highestBidder === 'by You' ? 'text-emerald-700' : 'text-gray-900'}`}>{item.highestBid}</span>
                  <span className={`text-[9px] block ${item.isHighest || item.highestBidder === 'by You' ? 'text-emerald-700 font-black' : 'text-gray-400'}`}>{item.highestBidder}</span>
                </div>
              </div>

              {/* Geo tracking metadata row details */}
              <div className="space-y-1 text-gray-500 text-[10px] font-bold">
                <p className="flex items-center gap-1 text-gray-700"><MapPin size={11} className="text-gray-400" /> <span>{item.location}</span></p>
                <p className="flex items-center gap-1 text-gray-400"><Calendar size={11} className="text-gray-400" /> <span>{item.date}</span></p>
              </div>

              {/* Footer Timers + Interaction Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                <div className="flex items-center gap-1">
                  {item.timerType === 'countdown' && <div className="w-1.5 h-1.5 rounded-full border border-red-500 border-t-transparent animate-spin" />}
                  <span className={`font-mono font-bold text-[10px] ${item.timerType === 'countdown' ? 'text-red-600' : 'text-gray-400'}`}>{item.timer}</span>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <a href="#" className="text-gray-400 hover:text-gray-600 font-bold">Details</a>
                  <button className={`font-black px-3.5 py-2 rounded-xl text-[11px] shadow-3xs transition-all cursor-pointer ${
                    item.status === 'Active' || item.status === 'Outbid'
                      ? 'bg-[#0B5B32] text-white'
                      : 'bg-gray-100 text-gray-700 border border-gray-200/50'
                  }`}>
                    {item.status === 'Active' || item.status === 'Outbid' ? 'View Auction' : 'View Result'}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* 5. RESPONSIVE COMPACT PAGINATION FOOTPRINT FOOTER CONTAINER */}
        <div className="bg-white border-t border-gray-100 px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 font-bold text-[11px]">
          <span>Showing <strong className="text-gray-800 font-black">1 to 10</strong> of <strong className="text-gray-800 font-black">128</strong> bids</span>
          
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all disabled:opacity-40" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black bg-[#0B5B32] text-white shadow-3xs">1</button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">2</button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">3</button>
            <span className="text-gray-300 font-bold px-0.5">...</span>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">13</button>
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}