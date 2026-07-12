'use client'

import React from 'react';

export const BiddingManagement: React.FC = () => {
  const auctionKPIs = [
    { title: 'Live Auctions', value: '28', change: '+4 today', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Upcoming Auctions', value: '15', change: '+3 today', color: 'text-blue-600 bg-blue-50' },
    { title: 'Completed Today', value: '43', change: '+12 today', color: 'text-purple-600 bg-purple-50' },
    { title: 'Cancelled', value: '2', change: '+1 today', color: 'text-orange-600 bg-orange-50' },
    { title: 'Average Bid', value: '₹41,250', change: '+6% vs yesterday', color: 'text-cyan-600 bg-cyan-50' },
    { title: 'Highest Bid Today', value: '₹6,82,000', change: 'Maruti Swift 2016', color: 'text-rose-600 bg-rose-50' },
  ];

  const auctionRows = [
    {
      vehicle: 'Maruti Swift 2016',
      spec: 'Petrol • Manual',
      id: 'RX250602001',
      loc: 'Delhi, DL',
      time: '10:00 AM',
      ends: '00:21:12',
      endsDate: '02 Jun, 11:30 AM',
      bid: '₹58,200',
      bidder: 'Green Auto RVSF',
      totalBids: 12,
      status: 'Live',
      statusColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      vehicle: 'Hyundai i20 2015',
      spec: 'Diesel • Manual',
      id: 'RX250602002',
      loc: 'Gurgaon, HR',
      time: '11:30 AM',
      ends: '01:12:45',
      endsDate: '02 Jun, 12:45 PM',
      bid: '₹72,400',
      bidder: 'EcoScrap Pvt. Ltd.',
      totalBids: 18,
      status: 'Live',
      statusColor: 'bg-emerald-100 text-emerald-700'
    },
  ];

  return (
    // Outer min-h-screen and absolute layout spaces removed 
    <div className="w-full flex flex-col justify-between">
      
      {/* Dashboard Dynamic Route Canvas Area */}
      <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">
        
        {/* Action Header Title Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Bidding Management</h2>
            <p className="text-xs text-slate-500">Monitor, create and manage all vehicle auctions across the platform.</p>
          </div>
          <button className="bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-emerald-700 shadow-sm self-start sm:self-auto shrink-0">
            + Create Auction
          </button>
        </div>

        {/* Quick Metrics KPI Counters Layout Grid Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {auctionKPIs.map((kpi, index) => (
            <div key={index} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between">
              <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase truncate">{kpi.title}</span>
              <div className="mt-2">
                <div className="text-xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
                <div className={`text-[10px] inline-block mt-0.5 px-1.5 py-0.5 rounded font-medium ${kpi.color}`}>
                  {kpi.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Controls / Filters Row Panel */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
              <input 
                type="text" 
                placeholder="Search by Vehicle, RC Number, Request ID..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:border-slate-300" 
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-wrap">
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"><option>All Status</option></select>
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"><option>All Types</option></select>
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"><option>All States</option></select>
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"><option>All Durations</option></select>
            </div>
          </div>
        </div>

        {/* Main Content Splitting Structure */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Primary Auctions Table Section Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-9 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">All Auctions <span className="text-slate-400 font-normal">(86)</span></h3>
            </div>
            
            {/* Responsive Scrollable Container Shield */}
            <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs text-slate-600 min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                    <th className="p-3">Vehicle Details</th>
                    <th className="p-3">Request ID</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Remaining Time</th>
                    <th className="p-3">Highest Bid</th>
                    <th className="p-3">Winning Bidder</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auctionRows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{row.vehicle}</div>
                        <span className="text-[10px] text-slate-400">{row.spec}</span>
                      </td>
                      <td className="p-3 font-mono font-medium text-emerald-600">{row.id}</td>
                      <td className="p-3 text-slate-500">{row.loc}</td>
                      <td className="p-3">
                        <div className="text-red-500 font-bold">{row.ends}</div>
                        <span className="text-[10px] text-slate-400">{row.endsDate}</span>
                      </td>
                      <td className="p-3 font-bold text-slate-900">{row.bid}</td>
                      <td className="p-3 font-medium text-slate-700">{row.bidder}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button className="border border-slate-200 rounded px-2.5 py-1 text-[11px] font-semibold hover:bg-slate-50">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Live Activity Feed Block Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-3 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Live Activity Feed</h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">● Live</span>
            </div>
            
            {/* Activities Stack list */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              <div className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>11:32 AM</span>
                  <span className="text-emerald-600 font-bold">₹58,200</span>
                </div>
                <p className="text-slate-700"><span className="font-semibold text-slate-900">Green Auto RVSF</span> increased bid on Maruti Swift 2016</p>
              </div>
              <div className="text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>11:31 AM</span>
                  <span className="text-emerald-600 font-bold">₹57,800</span>
                </div>
                <p className="text-slate-700"><span className="font-semibold text-slate-900">EcoScrap Pvt. Ltd.</span> placed bid on Maruti Swift 2016</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Panel Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* Vehicle Analytics Metadata Block */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Auction Details & Vehicle Info</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Registration No</span>
                <span className="font-semibold text-slate-800">DL8CAK1234</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Fuel Type</span>
                <span className="font-semibold text-slate-800">Petrol</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Manufacturing Year</span>
                <span className="font-semibold text-slate-800">2016</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Transmission</span>
                <span className="font-semibold text-slate-800">Manual</span>
              </div>
            </div>
          </div>

          {/* Live Bidding History Ledger Component */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Active Live Auction Progress</h4>
            <div className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-lg">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Current Highest Bid</span>
                <span className="text-xl font-black text-emerald-600">₹82,400</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Ends In</span>
                <span className="text-sm font-bold text-red-500 font-mono">00:17:31</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full w-[78%]"></div>
            </div>
          </div>

          {/* Financial Ledger Summary Panel Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm md:col-span-2 xl:col-span-1 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Financial Summary</h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between"><span>Highest Bid Recieved</span><span className="font-semibold text-slate-900">₹82,400</span></div>
              <div className="flex justify-between"><span>Pickup Charge (Admin)</span><span className="text-red-500 font-medium">- ₹2,500</span></div>
              <div className="flex justify-between"><span>Documentation Fee</span><span className="text-red-500 font-medium">- ₹500</span></div>
              <div className="flex justify-between pt-2.5 border-t border-slate-100 text-sm font-bold text-slate-900">
                <span>Customer Receives (Est.)</span>
                <span className="text-emerald-600 font-black text-base">₹79,400</span>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Control Action Bar Footer Drawer */}
      <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 flex flex-wrap gap-2 items-center justify-end w-full shrink-0">
        <button className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 font-bold text-xs px-4 py-2 rounded-lg transition-colors">
          Cancel Auction
        </button>
        <button className="bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-bold text-xs px-4 py-2 rounded-lg transition-colors">
          Pause Auction
        </button>
        <button className="bg-emerald-600 text-white hover:bg-emerald-700 font-black text-xs px-5 py-2 rounded-lg transition-all shadow-sm shadow-emerald-600/10">
          Declare Winner
          </button>
      </footer>

    </div>
  );
};