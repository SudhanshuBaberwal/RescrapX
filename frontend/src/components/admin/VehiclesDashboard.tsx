import React, { useState } from 'react';

export default function VehiclesDashboard() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  const summaryMetrics = [
    { title: 'Total Vehicles', count: '1,284', trend: '+18% vs last month', up: true },
    { title: 'Valuation Requests', count: '356', trend: '+22% vs last month', up: true },
    { title: 'Auction Live', count: '48', trend: '+14% vs last month', up: true },
    { title: 'Offer Accepted', count: '246', trend: '+16% vs last month', up: true },
    { title: 'Pickup Scheduled', count: '192', trend: '+7% vs last month', up: true },
    { title: 'Completed', count: '442', trend: '+12% vs last month', up: true },
  ];

  const vehiclesList = [
    { id: 'RXV0001284', name: 'Maruti Swift 2016', details: 'Petrol • Manual', rc: 'DL8CAK1234', owner: 'Rahul Sharma', phone: '9876543210', location: 'Delhi, DL', status: 'Auction Live', stage: 'Bidding', created: '02 Jun 2025 10:30 AM', statusColor: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'RXV0001283', name: 'Hyundai i20 2015', details: 'Diesel • Manual', rc: 'HR26BB5678', owner: 'Amit Verma', phone: '9876543211', location: 'Gurgaon, HR', status: 'Offer Accepted', stage: 'Customer Decision', created: '02 Jun 2025 09:15 AM', statusColor: 'bg-orange-50 text-orange-700 border-orange-200' },
    { id: 'RXV0001282', name: 'Honda City 2014', details: 'Petrol • Automatic', rc: 'UP16CD7890', owner: 'Neha Singh', phone: '9876543212', location: 'Noida, UP', status: 'Pickup Scheduled', stage: 'Pickup Pending', created: '01 Jun 2025 06:45 PM', statusColor: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'RXV0001281', name: 'Tata Indica Vista 2012', details: 'Diesel • Manual', rc: 'HR51AS2345', owner: 'Vikram Mehta', phone: '9876543213', location: 'Faridabad, HR', status: 'In Transit', stage: 'In Transit', created: '01 Jun 2025 04:20 PM', statusColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'RXV0001280', name: 'Toyota Innova 2015', details: 'Diesel • Manual', rc: 'RJ14UA3456', owner: 'Suresh Yadav', phone: '9876543214', location: 'Jaipur, RJ', status: 'Completed', stage: 'Delivered to RVSF', created: '31 May 2025 03:10 PM', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'RXV0001279', name: 'Mahindra Bolero 2013', details: 'Diesel • Manual', rc: 'MP09CM4567', owner: 'Rakesh Tiwari', phone: '9876543215', location: 'Indore, MP', status: 'Completed', stage: 'Certificate Generated', created: '31 May 2025 12:40 PM', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'RXV0001278', name: 'Bajaj Pulsar 2018', details: 'Petrol • Manual', rc: 'DL9SAX6789', owner: 'Manoj Kumar', phone: '9876543216', location: 'Delhi, DL', status: 'Valuation Pending', stage: 'Image Verification', created: '31 May 2025 11:20 AM', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'RXV0001277', name: 'Honda Activa 2017', details: 'Petrol • Automatic', rc: 'UP32KZ8910', owner: 'Pooja Gupta', phone: '9876543217', location: 'Lucknow, UP', status: 'Cancelled', stage: 'Cancelled by Customer', created: '30 May 2025 05:30 PM', statusColor: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased w-full">
      <div className="p-4 md:p-6 mx-auto max-w-[1750px] space-y-6">

        {/* Global Dashboard Navbar Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vehicles</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage and monitor all vehicles across the platform.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-600 outline-none shadow-2xs">
              <option>01 Jun 2025 - 02 Jun 2025</option>
            </select>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors shadow-2xs">
              + Add Vehicle Manually
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3 py-2 rounded-lg transition-colors shadow-2xs">
              Export ▾
            </button>
            {!isDetailsOpen && (
              <button onClick={() => setIsDetailsOpen(true)} className="bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-lg shadow-2xs">
                👁️ Inspector Panel
              </button>
            )}
          </div>
        </div>

        {/* Metric Cards Row Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {summaryMetrics.map((m, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.title}</span>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">{m.count}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded shrink-0">{m.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Core Layout Split Module */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT CONTAINER: Filters + Data Ledger */}
          <div className={`${isDetailsOpen ? 'xl:col-span-8' : 'xl:col-span-12'} space-y-6 transition-all`}>
            
            {/* Context Filter Row Block */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="flex flex-col gap-1 lg:col-span-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Search</label>
                  <input type="text" placeholder="Search by RC, Vehicle, ID..." className="bg-white border border-slate-200 rounded-lg p-2 outline-none w-full text-slate-700" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Status</label>
                  <select className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"><option>All Status</option></select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Vehicle Type</label>
                  <select className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"><option>All Types</option></select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Fuel Type</label>
                  <select className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"><option>All Fuel Types</option></select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">State</label>
                  <select className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"><option>All States</option></select>
                </div>
                <div className="flex items-end gap-1">
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2 rounded-lg transition-colors">More Filters</button>
                </div>
              </div>
            </div>

            {/* Main Vehicles Data Table Component */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">All Vehicles (1,284)</h3>

              <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600 min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="p-3 w-8"><input type="checkbox" className="rounded" /></th>
                      <th className="p-3">Vehicle ID</th>
                      <th className="p-3">Vehicle Details</th>
                      <th className="p-3">RC Number</th>
                      <th className="p-3">Owner Name</th>
                      <th className="p-3">Location</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3">Current Stage</th>
                      <th className="p-3">Created On</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vehiclesList.map((vehicle, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3"><input type="checkbox" className="rounded" /></td>
                        <td className="p-3 font-mono font-bold text-slate-900">{vehicle.id}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{vehicle.name}</div>
                          <div className="text-[10px] text-slate-400">{vehicle.details}</div>
                        </td>
                        <td className="p-3 font-mono font-medium text-slate-700">{vehicle.rc}</td>
                        <td className="p-3">
                          <div className="font-medium text-slate-800">{vehicle.owner}</div>
                          <div className="text-[10px] font-mono text-slate-400">{vehicle.phone}</div>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">{vehicle.location}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${vehicle.statusColor}`}>
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5 font-medium text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {vehicle.stage}
                          </div>
                        </td>
                        <td className="p-3 text-slate-500 font-medium whitespace-nowrap">{vehicle.created}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button className="border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 px-2 py-1 rounded font-medium text-[11px]">View</button>
                            <button className="text-slate-400 text-sm px-1">⋮</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Action Footer Bar & Pagination Panel */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">0 Selected</span>
                  <select className="border border-slate-200 bg-white rounded p-1 text-slate-600"><option>Bulk Actions</option></select>
                  <button className="border border-slate-200 bg-white px-2 py-1 rounded text-slate-600">Export Selected</button>
                </div>
                <div className="flex items-center gap-1 text-slate-400 self-end sm:self-auto">
                  <button className="px-2 py-1 border border-slate-200 bg-white rounded text-slate-600">‹</button>
                  <button className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-600 font-bold">1</button>
                  <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">2</button>
                  <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">3</button>
                  <span className="px-1 text-slate-300">...</span>
                  <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">129</button>
                  <button className="px-2 py-1 border border-slate-200 bg-white rounded text-slate-600">›</button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT CONTAINER: Extended Inspector Panel Side Sheet */}
          {isDetailsOpen && (
            <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-2xs space-y-5 sticky top-6 relative w-full">
              <button onClick={() => setIsDetailsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>

              {/* Inspector Header Block */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Maruti Swift 2016</h3>
                  <span className="bg-purple-50 text-purple-600 border border-purple-100 text-[9px] font-bold px-1.5 py-0.2 rounded">Auction Live</span>
                </div>
                <div className="flex gap-4 mt-2 text-[10px] font-mono text-slate-400">
                  <div>RC <span className="block text-slate-800 font-bold mt-0.5">DL8CAK1234</span></div>
                  <div>ID <span className="block text-slate-800 font-bold mt-0.5">RXV0001284</span></div>
                </div>
              </div>

              {/* Gallery Preview Box Module */}
              <div className="space-y-2">
                <div className="bg-slate-100 h-44 rounded-lg flex items-center justify-center text-slate-400 font-medium relative overflow-hidden border border-slate-200">
                  <span className="text-3xl">🚗</span>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-xs text-slate-700 shadow-xs cursor-pointer">‹</div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-xs text-slate-700 shadow-xs cursor-pointer">›</div>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 aspect-video rounded flex items-center justify-center text-[10px] text-slate-400">Img</div>
                  ))}
                  <div className="bg-slate-900 text-white aspect-video rounded flex items-center justify-center text-[10px] font-bold">+4</div>
                </div>
              </div>

              {/* Technical Specifications Parameter List */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vehicle Information</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-slate-50 p-3 rounded-lg border border-slate-100 font-medium text-slate-700">
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="text-slate-400">Fuel Type</span><span>Petrol</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="text-slate-400">Odometer</span><span>78,500 KM</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="text-slate-400">Transmission</span><span>Manual</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="text-slate-400">Engine No.</span><span className="font-mono">K12M12345678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mfg Year</span><span>2016</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ownership</span><span>First Owner</span>
                  </div>
                </div>
              </div>

              {/* Identity Account Information Block */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Owner Information</span>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 font-medium text-slate-700">
                  <div className="flex justify-between"><span className="text-slate-400">Owner Name</span><span className="text-slate-900 font-bold">Rahul Sharma</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Phone Number</span><span className="font-mono">9876543210</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Email ID</span><span>rahulsharma@gmail.com</span></div>
                </div>
              </div>

              {/* Status Timeline Tracking Block */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Timeline</span>
                <div className="space-y-3 pl-3 relative before:absolute before:left-[3px] before:top-1 before:bottom-1 before:w-0.5 before:bg-slate-100 text-[11px]">
                  <div className="relative">
                    <span className="absolute -left-[15px] top-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="font-bold text-slate-800">Valuation Request Submitted</p>
                    <span className="text-[10px] text-slate-400">02 Jun 2025, 10:30 AM</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[15px] top-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="font-bold text-slate-800">Images Verified by Admin</p>
                    <span className="text-[10px] text-slate-400">02 Jun 2025, 10:45 AM</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[15px] top-0.5 w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <p className="font-medium text-slate-400">Auction Created</p>
                  </div>
                </div>
              </div>

              {/* Footer Interactive Actions Group */}
              <div className="pt-2 border-t border-slate-100">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-2xs text-center transition-colors">
                  View Full Details ↗
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}