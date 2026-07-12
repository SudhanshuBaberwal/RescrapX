'use client'

import React, { useState } from 'react';

export const PickupLogisticsDashboard: React.FC = () => {
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState('Vikram Singh (DL01AB1234)');

  const metrics = [
    { label: 'Pickup Scheduled', value: '48', change: '+16% vs yesterday', isPositive: true },
    { label: 'Driver Assigned', value: '32', change: '+8% vs yesterday', isPositive: true },
    { label: 'In Transit', value: '28', change: '+12% vs yesterday', isPositive: true },
    { label: 'Verification Pending', value: '15', change: '-5% vs yesterday', isPositive: false },
    { label: 'Completed', value: '78', change: '+18% vs yesterday', isPositive: true },
    { label: 'Cancelled', value: '6', change: '-14% vs yesterday', isPositive: false },
  ];

  const pickups = [
    { id: 'PU25060201', reqId: 'RX25060124', vehicle: 'Maruti Swift 2016', vSub: 'DL8CAK1234', customer: 'Rahul Sharma', phone: '9876543210', location: 'Rohini, Delhi', locSub: 'Delhi, DL', dateTime: '02 Jun 2025, 10:00 AM', driver: 'Vikram Singh', dSub: 'DL01AB1234', status: 'Scheduled' },
    { id: 'PU25060202', reqId: 'RX25060125', vehicle: 'Hyundai i20 2015', vSub: 'HR26BB5678', customer: 'Priya Verma', phone: '9811223333', location: 'Sector 45, Gurgaon', locSub: 'Gurgaon, HR', dateTime: '02 Jun 2025, 01:30 PM', driver: 'Amit Kumar', dSub: 'HR55CD5678', status: 'Driver Assigned' },
    { id: 'PU25060203', reqId: 'RX25060126', vehicle: 'Honda City 2014', vSub: 'UP16CD7890', customer: 'Amit Kumar', phone: '9712345678', location: 'Sector 62, Noida', locSub: 'Noida, UP', dateTime: '02 Jun 2025, 03:00 PM', driver: 'Ravi Pal', dSub: 'UP14EF6789', status: 'In Transit' },
    { id: 'PU25060204', reqId: 'RX25060127', vehicle: 'Tata Indica Vista 2012', vSub: 'HR51AS2345', customer: 'Neha Singh', phone: '9890877665', location: 'Faridabad', locSub: 'Faridabad, HR', dateTime: '02 Jun 2025, 11:30 AM', driver: 'Suresh Yadav', dSub: 'HR55GH6789', status: 'Verification Pending' },
    { id: 'PU25060205', reqId: 'RX25060128', vehicle: 'Toyota Innova 2015', vSub: 'RJ14UA3456', customer: 'Suresh Yadav', phone: '9822334455', location: 'Mansarovar, Jaipur', locSub: 'Jaipur, RJ', dateTime: '01 Jun 2025, 05:00 PM', driver: 'Mahesh Meena', dSub: 'RJ14JK9012', status: 'Completed' },
    { id: 'PU25060206', reqId: 'RX25060129', vehicle: 'Mahindra Bolero 2013', vSub: 'MP09CM4567', customer: 'Rakesh Tiwari', phone: '9876543216', location: 'Indore', locSub: 'Indore, MP', dateTime: '01 Jun 2025, 02:00 PM', driver: 'Arjun Verma', dSub: 'MP09LM2345', status: 'Completed' },
    { id: 'PU25060207', reqId: 'RX25060124', vehicle: 'Honda Activa 2017', vSub: 'UP32K28910', customer: 'Pooja Gupta', phone: '9876543217', location: 'Aliganj, Lucknow', locSub: 'Lucknow, UP', dateTime: '01 Jun 2025, 12:15 PM', driver: 'Shivam Dixit', dSub: 'UP32KL0987', status: 'Cancelled' },
  ];

  const availableDrivers = [
    { name: 'Vikram Singh', license: 'DL01AB1234', phone: '9876543210', status: 'Available' },
    { name: 'Amit Kumar', license: 'HR55CD5678', phone: '9812345678', status: 'On Duty' },
    { name: 'Ravi Pal', license: 'UP14EF6789', phone: '9871234567', status: 'Available' },
    { name: 'Suresh Yadav', license: 'HR55GH6789', phone: '9898765432', status: 'On Duty' },
    { name: 'Mahesh Meena', license: 'RJ14JK9012', phone: '9988776655', status: 'Available' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Driver Assigned': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'In Transit': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Verification Pending': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased w-full">
      <div className="p-4 md:p-6 mx-auto max-w-[1750px] space-y-6">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Pickup & Logistics</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage all vehicle pickups, driver assignments and logistics operations.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-600 outline-none">
              <option>01 Jun 2025 - 02 Jun 2025</option>
            </select>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition-colors">
              + Create Pickup
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-lg shadow-xs transition-colors">
              Export ▾
            </button>
            {!isDetailsPanelOpen && (
              <button 
                onClick={() => setIsDetailsPanelOpen(true)}
                className="bg-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-xs"
              >
                👁️ View Details
              </button>
            )}
          </div>
        </div>

        {/* Metrics Counter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {metrics.map((m, i) => (
            <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{m.label}</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-black text-slate-900">{m.value}</span>
                <span className={`text-[10px] font-bold px-1 rounded ${
                  m.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                }`}>{m.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Workspace Container Split */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Block (Main Data, Filtering, Lists) */}
          <div className={`${isDetailsPanelOpen ? 'xl:col-span-8' : 'xl:col-span-12'} space-y-6 transition-all`}>
            
            {/* Filters Box Block */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="flex flex-col gap-1 lg:col-span-2">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Search</label>
                  <input type="text" placeholder="Search by Request ID, Vehicle, RC, Customer..." className="bg-white border border-slate-200 rounded-lg p-2 outline-none w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Status</label>
                  <select className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"><option>All Status</option></select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Pickup Date</label>
                  <input type="text" placeholder="Select Date Range" className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">City</label>
                  <select className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"><option>All Cities</option></select>
                </div>
                <div className="flex items-end gap-1">
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2 rounded-lg transition-colors">More Filters</button>
                  <button className="text-slate-400 hover:text-slate-600 font-bold p-2">Reset</button>
                </div>
              </div>
            </div>

            {/* Main Pickups Data Table Block */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">All Pickups (207)</h3>
              </div>

              <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600 min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="p-3">Pickup ID</th>
                      <th className="p-3">Request ID</th>
                      <th className="p-3">Vehicle</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Pickup Location</th>
                      <th className="p-3">Pickup Date & Time</th>
                      <th className="p-3">Driver</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pickups.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-900">{row.id}</td>
                        <td className="p-3 font-mono text-slate-400">{row.reqId}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{row.vehicle}</div>
                          <div className="text-[10px] font-mono text-slate-400">{row.vSub}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-slate-700">{row.customer}</div>
                          <div className="text-[10px] text-slate-400">{row.phone}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-slate-700">{row.location}</div>
                          <div className="text-[10px] text-slate-400">{row.locSub}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-700">{row.dateTime}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{row.driver}</div>
                          <div className="text-[10px] font-mono text-slate-400">{row.dSub}</div>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(row.status)}`}>
                            {row.status}
                          </span>
                        </td>
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

              {/* Table Pagination */}
              <div className="flex items-center justify-between text-xs pt-2 text-slate-400">
                <span>Showing 1 to 7 of 207 pickups</span>
                <div className="flex items-center gap-1 font-medium">
                  <button className="p-1 px-2 border border-slate-200 bg-white rounded text-slate-600">‹</button>
                  <button className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-600 font-bold">1</button>
                  <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">2</button>
                  <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">3</button>
                  <span className="px-1 text-slate-300">...</span>
                  <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">30</button>
                  <button className="p-1 px-2 border border-slate-200 bg-white rounded text-slate-600">›</button>
                </div>
              </div>
            </div>

            {/* Bottom Assignment Blocks (Driver Allocation & Map Matrix Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Box A: Quick Driver Dropdown Assignment Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Driver Assignment</h4>
                  <p className="text-[11px] text-slate-400">Issue driver from the driver list for this pickup.</p>
                  
                  <div className="flex flex-col gap-1 text-xs pt-1">
                    <label className="font-bold text-slate-500">Select Driver</label>
                    <select 
                      value={selectedDriver}
                      onChange={(e) => setSelectedDriver(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-medium outline-none text-slate-700"
                    >
                      <option>Vikram Singh (DL01AB1234)</option>
                      <option>Amit Kumar (HR55CD5678)</option>
                    </select>
                  </div>
                  <button className="text-emerald-600 hover:underline font-bold text-[11px] block">View Driver List</button>
                  
                  <div className="bg-emerald-50/60 text-emerald-800 text-[11px] p-3 rounded-lg border border-emerald-100/50 leading-relaxed">
                    ℹ️ Driver will receive pickup details and customer contact parameters once finalized.
                  </div>
                </div>
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg mt-4 shadow-xs">
                  Assign Driver
                </button>
              </div>

              {/* Box B: Live Roster Driver State Checklist */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Driver List</h4>
                  <button className="text-emerald-600 hover:underline text-[11px] font-bold">View All Drivers</button>
                </div>
                <div className="divide-y divide-slate-50 max-h-[220px] overflow-y-auto pr-1 space-y-2">
                  {availableDrivers.map((drv, i) => (
                    <div key={i} className="flex items-center justify-between text-xs pt-2 first:pt-0">
                      <div>
                        <p className="font-bold text-slate-800">{drv.name}</p>
                        <span className="text-[10px] font-mono text-slate-400">{drv.license} • {drv.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase px-1 rounded ${
                          drv.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-600'
                        }`}>{drv.status}</span>
                        <button className="text-emerald-600 hover:bg-emerald-50 font-bold border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">Assign</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box C: Live Tracking Vector Simulation Map Interface Component */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Pickup Map</h4>
                
                {/* Visual Route Mock */}
                <div className="bg-slate-100 h-28 rounded-lg relative overflow-hidden flex flex-col justify-between p-3 border border-slate-200">
                  <div className="bg-white/90 backdrop-blur-xs p-1 px-2 rounded shadow-xs text-[9px] max-w-[130px]">
                    <span className="text-slate-400 uppercase font-bold block">Pickup Location</span>
                    <span className="font-bold text-slate-700 truncate block">Rohini, Delhi</span>
                  </div>
                  <div className="absolute right-3 bottom-3 bg-emerald-900 text-white p-1 px-2 rounded text-[9px]">
                    <span className="block font-bold">Green Auto RVSF</span>
                  </div>
                  {/* Faux Route Vector Wire */}
                  <div className="absolute inset-x-10 top-1/2 h-1 border-t-2 border-dashed border-blue-500 transform -rotate-12" />
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Distance</span>
                    <span className="font-black text-slate-900">32.4 km</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">ETA</span>
                    <span className="font-black text-slate-900">1 hr 10 mins</span>
                  </div>
                </div>
                <button className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-1.5 rounded-lg transition-colors text-center block">
                  Open in Maps
                </button>
              </div>

            </div>

          </div>

          {/* Right Block (Collapsible Segment View: Selected Row Audit Details Sidebar) */}
          {isDetailsPanelOpen && (
            <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-5 sticky top-6 relative">
              <button 
                onClick={() => setIsDetailsPanelOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>

              {/* Title Identity Section Header */}
              <div className="border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">Pickup Details</h3>
                  <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-bold px-1.5 py-0.2 rounded">Scheduled</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2.5 text-[10px] font-mono text-slate-400">
                  <div>PICKUP ID <span className="block text-slate-800 font-bold mt-0.5">PU25060201</span></div>
                  <div>REQUEST ID <span className="block text-slate-800 font-bold mt-0.5">RX25060123</span></div>
                </div>
              </div>

              {/* Vehicle / User Context Snippet Block */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Vehicle & Customer</span>
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center text-lg shadow-xs">🚗</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-900 truncate">Maruti Swift 2016</p>
                    <span className="text-[10px] font-mono font-bold text-slate-500 block">DL8CAK1234 • Petrol</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-slate-700 text-[11px]">Rahul Sharma</p>
                    <span className="text-[10px] text-slate-400 block">9876543210</span>
                  </div>
                </div>
              </div>

              {/* Logistics Specific Data Fields Parameter Matrix */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pickup Information</span>
                <div className="space-y-2.5 bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-slate-400">📍 Pickup Location</span>
                    <span className="font-medium text-slate-800 text-right">Rohini, Delhi, Delhi - 110085</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">📅 Pickup Date & Time</span>
                    <span className="font-bold text-slate-800">02 Jun 2025, 10:00 AM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">🔧 Vehicle Condition</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-1 rounded">Drivable</span>
                  </div>
                  <div className="flex justify-between items-start gap-2 border-t border-slate-100 pt-2">
                    <span className="text-slate-400">📝 Instructions</span>
                    <span className="text-slate-600 text-right text-[11px] font-medium">Customer available till 6 PM.</span>
                  </div>
                </div>
              </div>

              {/* Live Assignment Status Indicators Row */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Logistics Assignment</span>
                <div className="space-y-2 border border-slate-200 rounded-lg p-2.5 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Driver</span>
                      <span className="font-bold text-rose-600 text-[11px]">Not Assigned</span>
                    </div>
                    <button className="text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors">Assign Driver</button>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Pickup Vehicle</span>
                      <span className="font-bold text-rose-600 text-[11px]">Not Assigned</span>
                    </div>
                    <button className="text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-bold px-2.5 py-1 rounded-md transition-colors">Assign Vehicle</button>
                  </div>
                </div>
              </div>

              {/* Financial Internal Audit Value Segment Layer */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Charges (Entered by Admin)</span>
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Pickup Charge (₹)</span>
                    <span className="text-sm font-black text-slate-900">2,500</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Documentation Charge (₹)</span>
                    <span className="text-sm font-black text-slate-900">500</span>
                  </div>
                </div>
              </div>

              {/* Process Sequence Vertical Timeline */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Timeline</span>
                <div className="space-y-4 pl-3 relative before:absolute before:left-[3px] before:top-1 before:bottom-1 before:w-0.5 before:bg-slate-100 text-[11px]">
                  <div className="relative">
                    <span className="absolute -left-[15px] top-0.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <p className="font-bold text-slate-800">Pickup Scheduled</p>
                    <span className="text-[10px] font-mono text-slate-400">02 Jun 2025, 09:15 AM</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[15px] top-0.5 w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <p className="font-medium text-slate-400">Pending Driver Assignment</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[15px] top-0.5 w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <p className="font-medium text-slate-400">Pending Pickup</p>
                  </div>
                </div>
              </div>

              {/* Action Button Interface Row Group Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2.5 rounded-lg shadow-xs text-center transition-all">
                  Save Changes
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button className="border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs py-2 rounded-lg text-center transition-colors">
                    Edit Pickup
                  </button>
                  <button className="border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs py-2 rounded-lg text-center transition-colors">
                    Cancel Pickup
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};