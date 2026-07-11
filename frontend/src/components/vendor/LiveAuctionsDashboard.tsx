'use client';

import React from 'react';
import { 
  Gavel, Clock, Trophy, Wallet, Search, SlidersHorizontal, 
  MapPin, Calendar, Fuel, Scale, ChevronDown, RotateCcw, 
  ChevronLeft, ChevronRight, LayoutGrid, List
} from 'lucide-react';

export default function LiveAuctionsDashboard() {
  // Metric Cards Dataset
  const metrics = [
    { title: 'Live Auctions', count: '14', meta: 'Join active auctions', dotColor: 'bg-emerald-500', icon: Gavel, iconColor: 'text-emerald-600 bg-emerald-50' },
    { title: 'Ending Soon', count: '5', meta: 'Within 15 minutes', dotColor: 'bg-amber-500', icon: Clock, iconColor: 'text-purple-600 bg-purple-50' },
    { title: 'My Active Bids', count: '7', meta: 'On live auctions', dotColor: 'bg-emerald-500', icon: Trophy, iconColor: 'text-amber-600 bg-amber-50' },
    { title: 'Bids Won Today', count: '3', meta: 'Total value ₹1,24,300', dotColor: 'bg-blue-500', icon: Trophy, iconColor: 'text-blue-600 bg-blue-50' },
    { title: 'Total Auction Value', count: '₹18,56,000', meta: 'Across all live auctions', dotColor: 'bg-emerald-500', icon: Wallet, iconColor: 'text-emerald-600 bg-emerald-50' },
  ];

  // Auction Items Dataset
  const auctionItems = [
    { id: 1, name: 'Maruti Swift Dzire 2014', engine: 'Petrol • Manual • 1st Owner', tags: ['RC Available'], year: '2014', fuel: 'Petrol', location: 'Gurugram, Haryana', distance: '12 km from you', weight: '865 kg', scrapValue: '₹32,000 – ₹38,000', timeLeft: '00:17:32', status: 'Active', timerColor: 'text-red-600 border-red-500', highestBid: '₹28,500', bidsCount: '5 bids', yourBid: '-' },
    { id: 2, name: 'Hyundai i20 2016', engine: 'Petrol • Manual • 2nd Owner', tags: ['RC Available', 'Fitness Expired'], year: '2016', fuel: 'Petrol', location: 'Gurugram, Haryana', distance: '15 km from you', weight: '920 kg', scrapValue: '₹36,000 – ₹42,000', timeLeft: '00:22:45', status: 'Active', timerColor: 'text-red-600 border-red-500', highestBid: '₹32,000', bidsCount: '8 bids', yourBid: '₹31,000', yourBidStatus: 'Your bid' },
    { id: 3, name: 'Honda City 2012', engine: 'Petrol • Manual • 2nd Owner', tags: ['RC Available'], year: '2012', fuel: 'Petrol', location: 'Faridabad, Haryana', distance: '22 km from you', weight: '980 kg', scrapValue: '₹31,000 – ₹37,000', timeLeft: '00:28:10', status: 'Active', timerColor: 'text-red-600 border-red-500', highestBid: '₹30,000', bidsCount: '6 bids', yourBid: '-' },
    { id: 4, name: 'Tata Indica Vista 2011', engine: 'Diesel • Manual • 2nd Owner', tags: ['RC Available', 'Pollution Expired'], year: '2011', fuel: 'Diesel', location: 'Rewari, Haryana', distance: '28 km from you', weight: '875 kg', scrapValue: '₹28,000 – ₹34,000', timeLeft: '00:35:50', status: 'Active', timerColor: 'text-amber-500 border-amber-500', highestBid: '₹25,500', bidsCount: '7 bids', yourBid: '₹24,000', yourBidStatus: 'Your bid' },
    { id: 5, name: 'Mahindra XUV500 2013', engine: 'Diesel • Manual • 2nd Owner', tags: ['RC Available'], year: '2013', fuel: 'Diesel', location: 'Sonipat, Haryana', distance: '35 km from you', weight: '1250 kg', scrapValue: '₹45,000 – ₹55,000', timeLeft: '00:41:20', status: 'Active', timerColor: 'text-amber-500 border-amber-500', highestBid: '₹42,000', bidsCount: '4 bids', yourBid: '-' },
    { id: 6, name: 'Toyota Etios Liva 2015', engine: 'Petrol • Manual • 1st Owner', tags: ['RC Available'], year: '2015', fuel: 'Petrol', location: 'Delhi, Delhi', distance: '18 km from you', weight: '760 kg', scrapValue: '₹26,000 – ₹31,000', timeLeft: '01:05:30', status: 'Active', timerColor: 'text-emerald-600 border-emerald-500', highestBid: '₹24,000', bidsCount: '3 bids', yourBid: '-' },
  ];

  return (
    <div className="space-y-6 w-full text-xs">
      
      {/* 1. TOP STATS OVERVIEW MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex justify-between items-start">
              <div className="space-y-3">
                <span className="text-gray-400 font-bold block">{metric.title}</span>
                <div>
                  <span className="text-xl font-black text-gray-900 tracking-tight block">{metric.count}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${metric.dotColor}`} />
                    <span className="text-[10px] text-gray-400 font-bold">{metric.meta}</span>
                  </div>
                </div>
              </div>
              <div className={`p-2 rounded-xl ${metric.iconColor}`}><Icon size={16} /></div>
            </div>
          );
        })}
      </div>

      {/* 2. DYNAMIC FILTERS TOOLBAR ROW */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          
          {/* Search bar input container */}
          <div className="relative xl:col-span-1">
            <span className="text-[10px] text-gray-400 font-black block mb-1">Search Vehicle</span>
            <div className="relative">
              <input type="text" placeholder="Search by make, model or year..." className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-700 font-medium placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white" />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Select inputs dropdown layouts */}
          {[
            { label: 'Vehicle Type', value: 'All Types' },
            { label: 'Fuel Type', value: 'All Fuel Types' },
            { label: 'Location', value: 'All Locations' },
            { label: 'Est. Value Range', value: 'All Ranges' }
          ].map((filter, idx) => (
            <div key={idx}>
              <span className="text-[10px] text-gray-400 font-black block mb-1">{filter.label}</span>
              <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-bold flex items-center justify-between hover:bg-gray-100/50 transition-all">
                <span>{filter.value}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>
            </div>
          ))}

          {/* Action buttons controls inside inputs stack */}
          <div className="flex items-end gap-2">
            <button className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-3 py-2 font-black text-gray-700 flex items-center justify-center gap-1.5 h-[34px] shadow-3xs cursor-pointer">
              <SlidersHorizontal size={12} /> <span>Filters</span>
            </button>
            <button className="text-gray-400 hover:text-gray-600 font-bold flex items-center justify-center gap-1 text-[11px] h-[34px] px-2 cursor-pointer">
              <RotateCcw size={11} /> <span>Clear All</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. CONTROL TABLE HEADER INFO SECTION */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="font-black text-gray-900 text-sm"><span className="text-emerald-700 font-black">14</span> Live Auctions</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50/50 border border-gray-200 rounded-xl px-2 py-1">
            <span className="text-gray-400 font-bold text-[10px]">Sort by:</span>
            <button className="font-black text-gray-700 flex items-center gap-1 text-[11px]">
              <span>Ending Soon</span> <ChevronDown size={11} className="text-gray-400" />
            </button>
          </div>
          <div className="hidden sm:flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-3xs bg-white">
            <button className="p-1.5 bg-gray-50 text-gray-700 border-r border-gray-200"><List size={13} /></button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600"><LayoutGrid size={13} /></button>
          </div>
        </div>
      </div>

      {/* 4. AUCTIONS MASTER CONTAINER DESKTOP + MOBILE FORMS */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">
        
        {/* DESKTOP TABLE SHEET: Hidden on small layout viewport view brackets */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-black">Vehicle Details</th>
                <th className="py-3 px-2 font-black">Vehicle Info</th>
                <th className="py-3 px-2 font-black">Location / Distance</th>
                <th className="py-3 px-2 font-black">Est. Weight</th>
                <th className="py-3 px-2 font-black">Est. Scrap Value</th>
                <th className="py-3 px-2 font-black text-center">Time Left</th>
                <th className="py-3 px-2 font-black text-right">Highest Bid</th>
                <th className="py-3 px-2 font-black text-right">Your Bid</th>
                <th className="py-3 px-4 font-black text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {auctionItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                  
                  {/* Vehicle details summary info */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex gap-3">
                      <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200/60 relative">
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center font-bold text-gray-400">IMG</div>
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white font-mono font-bold text-[8px] px-1 rounded-sm">📷 12</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black text-gray-900 text-[13px] tracking-tight leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold">{item.engine}</p>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {item.tags.map((tag, i) => (
                            <span key={i} className={`text-[8px] font-black px-1.5 py-0.2 rounded-sm uppercase tracking-wide border ${
                              tag.includes('Expired') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Vehicle base statistics column */}
                  <td className="py-4 px-2 text-gray-600">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1"><Calendar size={12} className="text-gray-400" /> <span>{item.year}</span></p>
                      <p className="flex items-center gap-1"><Fuel size={12} className="text-gray-400" /> <span>{item.fuel}</span></p>
                    </div>
                  </td>

                  {/* Geolocation mapping tracking values */}
                  <td className="py-4 px-2">
                    <div className="space-y-0.5">
                      <p className="flex items-center gap-1 font-bold text-gray-800"><MapPin size={12} className="text-gray-400" /> <span>{item.location}</span></p>
                      <p className="text-[10px] text-gray-400 font-bold pl-4">{item.distance}</p>
                    </div>
                  </td>

                  {/* Mass scale indicators weights column */}
                  <td className="py-4 px-2 font-mono text-gray-600 font-bold">
                    <div className="flex items-center gap-1"><Scale size={12} className="text-gray-400" /> <span>{item.weight}</span></div>
                  </td>

                  {/* Pricing metrics calculations rows */}
                  <td className="py-4 px-2 font-black text-gray-900">{item.scrapValue}</td>

                  {/* Clock timers with color state triggers */}
                  <td className="py-4 px-2 text-center">
                    <div className="inline-flex flex-col items-center">
                      <div className={`flex items-center gap-1 font-mono font-black border px-2 py-0.5 rounded-lg bg-gray-50 text-[10px] ${item.timerColor}`}>
                        <div className="w-2 h-2 rounded-full border border-current border-t-transparent animate-spin shrink-0" />
                        <span>{item.timeLeft}</span>
                      </div>
                      <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider mt-0.5">{item.status}</span>
                    </div>
                  </td>

                  {/* Dynamic auction action variables parameters */}
                  <td className="py-4 px-2 text-right">
                    <p className="font-black text-emerald-700 text-[13px]">{item.highestBid}</p>
                    <p className="text-[9px] text-gray-400 font-bold">{item.bidsCount}</p>
                  </td>

                  <td className="py-4 px-2 text-right">
                    {item.yourBid !== '-' ? (
                      <div>
                        <p className="font-black text-emerald-700 text-[13px]">{item.yourBid}</p>
                        <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-1 py-0.2 rounded-sm">{item.yourBidStatus}</span>
                      </div>
                    ) : (
                      <span className="text-gray-300 font-bold">—</span>
                    )}
                  </td>

                  {/* Grid trigger button executions */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1.5">
                      <button className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-4 py-1.5 rounded-xl shadow-3xs transition-all tracking-tight cursor-pointer">Place Bid</button>
                      <a href="#" className="text-emerald-700 font-black text-[10px] hover:underline">View Details</a>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE GRID LAYOUT LIST: Displays on mobile devices and small tablets */}
        <div className="xl:hidden divide-y divide-gray-100">
          {auctionItems.map((item) => (
            <div key={item.id} className="p-4 space-y-4 hover:bg-gray-50/30 transition-all">
              
              {/* Top Summary Block */}
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200/50 relative">
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-300 bg-gray-200">IMG</div>
                  <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white font-mono font-bold text-[8px] px-1 rounded-xs">📷 12</span>
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h4 className="font-black text-gray-900 text-sm tracking-tight truncate">{item.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold truncate">{item.engine}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((tag, i) => (
                      <span key={i} className={`text-[8px] font-black px-1.5 py-0.2 rounded-sm uppercase tracking-wide border ${
                        tag.includes('Expired') ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Specs & Location Grid Strip */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-gray-50/60 border border-gray-100/50 p-2.5 rounded-xl text-gray-600">
                <div className="space-y-1">
                  <p className="flex items-center gap-1"><Calendar size={11} className="text-gray-400" /> <span>Year: <strong>{item.year}</strong></span></p>
                  <p className="flex items-center gap-1"><Fuel size={11} className="text-gray-400" /> <span>Fuel: <strong>{item.fuel}</strong></span></p>
                  <p className="flex items-center gap-1"><Scale size={11} className="text-gray-400" /> <span>Weight: <strong>{item.weight}</strong></span></p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-800 flex items-start gap-1"><MapPin size={11} className="text-gray-400 shrink-0 mt-0.5" /> <span className="truncate">{item.location}</span></p>
                  <p className="text-[10px] text-gray-400 font-bold pl-4">{item.distance}</p>
                </div>
              </div>

              {/* Value & Bid Status Blocks */}
              <div className="flex items-center justify-between text-left border-b border-gray-50 pb-2">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">Est. Scrap Value</span>
                  <span className="font-black text-gray-900">{item.scrapValue}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 font-bold block">Highest Bid</span>
                  <span className="font-black text-emerald-700 text-sm">{item.highestBid}</span>
                  <span className="text-[9px] text-gray-400 font-bold block">{item.bidsCount}</span>
                </div>
              </div>

              {/* Timers & Interactive Call-to-Actions Bar */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 font-mono font-black border px-2 py-1 rounded-xl bg-gray-50 text-[10px] ${item.timerColor}`}>
                    <div className="w-1.5 h-1.5 rounded-full border border-current border-t-transparent animate-spin" />
                    <span>{item.timeLeft}</span>
                  </div>
                  {item.yourBid !== '-' && (
                    <div className="text-right bg-emerald-50 border border-emerald-100 rounded-xl px-2 py-0.5">
                      <span className="text-[9px] font-black text-emerald-700">Your: {item.yourBid}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <a href="#" className="text-emerald-700 font-black text-[11px] hover:underline">Details</a>
                  <button className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-4 py-2 rounded-xl shadow-3xs transition-all text-[11px] cursor-pointer">Place Bid</button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* 5. RESPONSIVE COMPACT PAGINATION CONTROL SLAT */}
        <div className="bg-white border-t border-gray-100 px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 font-bold text-[11px]">
          <span>Showing <strong className="text-gray-800 font-black">1 to 10</strong> of <strong className="text-gray-800 font-black">14</strong> auctions</span>
          
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all disabled:opacity-40" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black bg-[#0B5B32] text-white shadow-3xs">1</button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">2</button>
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}