'use client';

import React from 'react';
import { 
  Truck, Navigation, MapPin, Calendar, User, Search, 
  SlidersHorizontal, RotateCcw, ChevronDown, ChevronLeft, 
  ChevronRight, MoreVertical, Fuel, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function IncomingVehiclesDashboard() {
  // Top Overview Metrics Grid
  const metrics = [
    { title: 'Total Incoming', count: '18', meta: 'Vehicles', icon: Truck, iconColor: 'text-emerald-600 bg-emerald-50' },
    { title: 'On The Way', count: '7', meta: 'Vehicles', icon: Navigation, iconColor: 'text-blue-600 bg-blue-50' },
    { title: 'Reaching Today', count: '5', meta: 'Vehicles', icon: MapPin, iconColor: 'text-amber-600 bg-amber-50' },
    { title: 'Reaching Tomorrow', count: '6', meta: 'Vehicles', icon: Calendar, iconColor: 'text-purple-600 bg-purple-50' },
    { title: 'Picked Up', count: '3', meta: 'Vehicles', icon: CheckCircle2, iconColor: 'text-emerald-600 bg-emerald-50' },
  ];

  // Incoming Vehicles Core Dataset
  const vehiclesData = [
    { id: 1, name: 'Maruti Swift Dzire 2014', engine: 'Petrol • Manual • 1st Owner', registration: 'HR26AX1122', location: 'Gurugram, Haryana', timeSlot: '08 Jul 2025 • 09:00 AM', driver: 'Ravi Kumar', driverPhone: '+91 98765 43210', driverRating: '4.7', status: 'On The Way', statusMeta: 'Picked up at 08:45 AM', statusColor: 'bg-blue-50 text-blue-700 border-blue-100', eta: '35 min', etaTime: '(10:20 AM)', otpStatus: 'verified', photosStatus: 'uploaded' },
    { id: 2, name: 'Hyundai i20 2016', engine: 'Petrol • Manual • 2nd Owner', registration: 'HR26AZ7789', location: 'Gurugram, Haryana', timeSlot: '08 Jul 2025 • 09:15 AM', driver: 'Sandeep', driverPhone: '+91 91234 56789', driverRating: '4.6', status: 'On The Way', statusMeta: 'Picked up at 09:05 AM', statusColor: 'bg-blue-50 text-blue-700 border-blue-100', eta: '1 hr 10 min', etaTime: '(10:25 AM)', otpStatus: 'verified', photosStatus: 'uploaded' },
    { id: 3, name: 'Honda City 2012', engine: 'Petrol • Manual • 2nd Owner', registration: 'DL3CBE5678', location: 'Faridabad, Haryana', timeSlot: '08 Jul 2025 • 10:00 AM', driver: 'Mohit', driverPhone: '+91 99887 66554', driverRating: '4.5', status: 'Picked Up', statusMeta: 'Picked up at 09:50 AM', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', eta: '1 hr 45 min', etaTime: '(11:45 AM)', otpStatus: 'verified', photosStatus: 'uploaded' },
    { id: 4, name: 'Tata Indica Vista 2011', engine: 'Diesel • Manual • 2nd Owner', registration: 'HR51AS7789', location: 'Rewari, Haryana', timeSlot: '08 Jul 2025 • 10:30 AM', driver: 'Aman', driverPhone: '+91 87654 32109', driverRating: '4.6', status: 'Driver Assigned', statusMeta: 'Driver enroute to pickup', statusColor: 'bg-purple-50 text-purple-700 border-purple-100', eta: '2 hr 20 min', etaTime: '(12:50 PM)', otpStatus: 'pending', photosStatus: 'pending' },
    { id: 5, name: 'Mahindra XUV500 2013', engine: 'Diesel • Manual • 2nd Owner', registration: 'HR26DE1122', location: 'Sonipat, Haryana', timeSlot: '08 Jul 2025 • 11:00 AM', driver: 'Vikram', driverPhone: '+91 90909 87654', driverRating: '4.4', status: 'Pickup Scheduled', statusMeta: 'Scheduled for 11:00 AM', statusColor: 'bg-amber-50 text-amber-700 border-amber-100', eta: '3 hr 10 min', etaTime: '(02:10 PM)', otpStatus: 'none', photosStatus: 'none' },
    { id: 6, name: 'Toyota Etios Liva 2015', engine: 'Petrol • Manual • 1st Owner', registration: 'DL8CAM3456', location: 'Delhi, Delhi', timeSlot: '08 Jul 2025 • 12:00 PM', driver: 'Deepak', driverPhone: '+91 77770 12345', driverRating: '4.3', status: 'Scheduled', statusMeta: 'Yet to be assigned', statusColor: 'bg-gray-50 text-gray-600 border-gray-200', eta: '4 hr 30 min', etaTime: '(04:30 PM)', otpStatus: 'none', photosStatus: 'none' },
  ];

  return (
    <div className="space-y-6 w-full text-xs">
      
      {/* HEADER SECTION CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-black text-gray-900 text-sm">Incoming Vehicles</h3>
          <p className="text-[10px] text-gray-400 font-bold">Track all vehicles that are on the way to your facility.</p>
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-3 py-1.5 font-black text-gray-700 flex items-center gap-2 self-start sm:self-auto shadow-3xs cursor-pointer">
          <Calendar size={13} className="text-[#0B5B32]" />
          <span>8 July 2025</span>
          <ChevronDown size={11} className="text-gray-400" />
        </button>
      </div>

      {/* 1. TOP METRICS MATRIX OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex justify-between items-start">
              <div className="space-y-3">
                <span className="text-gray-400 font-bold block leading-tight">{m.title}</span>
                <div>
                  <span className="text-xl font-black text-gray-900 tracking-tight block">{m.count}</span>
                  <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{m.meta}</span>
                </div>
              </div>
              <div className={`p-2 rounded-xl ${m.iconColor}`}><Icon size={14} /></div>
            </div>
          );
        })}
      </div>

      {/* 2. DYNAMIC CONTROLS FILTERS TOOLBAR */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          
          <div className="relative">
            <span className="text-[10px] text-gray-400 font-black block mb-1">Search Vehicle</span>
            <div className="relative">
              <input type="text" placeholder="Search by make, model or year..." className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-700 font-medium placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white" />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {[
            { label: 'Pickup Status', value: 'All Status' },
            { label: 'Driver', value: 'All Drivers' },
            { label: 'Location', value: 'All Locations' }
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
            <span className="text-[10px] text-gray-400 font-black block mb-1">Pickup Date</span>
            <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-400 font-bold flex items-center justify-between hover:bg-gray-100/50 transition-all">
              <span>Select Date Range</span>
              <Calendar size={12} className="text-gray-400" />
            </button>
          </div>

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

      {/* 3. CORE MASTER CANVAS DATA LISTS */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">
        
        {/* DESKTOP MATRIX WORK SHEET */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-black">Vehicle Details</th>
                <th className="py-3 px-2 font-black">Pickup Details</th>
                <th className="py-3 px-2 font-black">Driver Details</th>
                <th className="py-3 px-2 font-black">Pickup Status</th>
                <th className="py-3 px-2 font-black">ETA</th>
                <th className="py-3 px-2 font-black">Documents</th>
                <th className="py-3 px-4 font-black text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {vehiclesData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                  
                  {/* Vehicle Identity Wrapper */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex gap-3">
                      <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200/60 flex items-center justify-center font-bold text-gray-300">IMG</div>
                      <div className="space-y-0.5">
                        <h4 className="font-black text-gray-900 text-[13px] tracking-tight leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold">{item.engine}</p>
                        <p className="text-[10px] font-black text-gray-600 mt-0.5">{item.registration}</p>
                      </div>
                    </div>
                  </td>

                  {/* Operational Logistics Route Maps */}
                  <td className="py-4 px-2">
                    <div className="space-y-1 text-gray-600">
                      <p className="flex items-center gap-1 font-bold text-gray-800"><MapPin size={12} className="text-gray-400" /> <span>{item.location}</span></p>
                      <p className="flex items-center gap-1 text-[10px] text-gray-400 font-bold"><Calendar size={12} className="text-gray-400" /> <span>{item.timeSlot}</span></p>
                    </div>
                  </td>

                  {/* Driver Profile Stack */}
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold shrink-0">
                        <User size={13} />
                      </div>
                      <div className="space-y-px">
                        <p className="font-black text-gray-900 leading-none">{item.driver}</p>
                        <p className="text-[10px] text-gray-400 font-bold">{item.driverPhone}</p>
                        <p className="text-[9px] text-amber-600 font-black">★ {item.driverRating}</p>
                      </div>
                    </div>
                  </td>

                  {/* State Indicators Status Pill Box */}
                  <td className="py-4 px-2">
                    <div className="space-y-1">
                      <span className={`px-2 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider border ${item.statusColor}`}>
                        {item.status}
                      </span>
                      <p className="text-[10px] text-gray-400 font-bold">{item.statusMeta}</p>
                    </div>
                  </td>

                  {/* Route Duration Trackers */}
                  <td className="py-4 px-2">
                    <p className="font-black text-gray-900">{item.eta}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{item.etaTime}</p>
                  </td>

                  {/* Verification Status Anchors */}
                  <td className="py-4 px-2">
                    <div className="space-y-1 text-[10px] font-bold">
                      {item.otpStatus === 'verified' && <p className="flex items-center gap-1 text-emerald-700"><CheckCircle2 size={11} /> <span>OTP Verified</span></p>}
                      {item.otpStatus === 'pending' && <p className="flex items-center gap-1 text-amber-700"><AlertCircle size={11} /> <span>Pending OTP</span></p>}
                      
                      {item.photosStatus === 'uploaded' && <p className="flex items-center gap-1 text-emerald-700"><CheckCircle2 size={11} /> <span>Photos Uploaded</span></p>}
                      {item.photosStatus === 'pending' && <p className="flex items-center gap-1 text-amber-700"><AlertCircle size={11} /> <span>Photos Pending</span></p>}
                      
                      {item.otpStatus === 'none' && <span className="text-gray-300 font-bold">—</span>}
                    </div>
                  </td>

                  {/* Grid System Interaction Callouts */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-3 py-1.5 rounded-xl shadow-3xs transition-all tracking-tight h-8 cursor-pointer">
                        View Details
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer"><MoreVertical size={14} /></button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS COMPACT FEED LAYOUT */}
        <div className="xl:hidden divide-y divide-gray-100">
          {vehiclesData.map((item) => (
            <div key={item.id} className="p-4 space-y-4 hover:bg-gray-50/20 transition-all">
              
              {/* Header Title Information Band */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex gap-2.5 min-w-0">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl border border-gray-200/50 flex items-center justify-center font-bold text-gray-300 shrink-0">IMG</div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-black text-gray-900 text-sm tracking-tight truncate">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold truncate">{item.engine}</p>
                    <p className="text-[10px] font-black text-gray-600">{item.registration}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded-md font-black text-[8px] uppercase tracking-wider border block ${item.statusColor}`}>
                    {item.status}
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold block mt-0.5">{item.statusMeta}</span>
                </div>
              </div>

              {/* Grid Metrics Context Blocks */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50/60 border border-gray-100/40 p-3 rounded-xl">
                <div className="space-y-2">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block mb-0.5">Assigned Driver</span>
                    <p className="font-black text-gray-900">{item.driver}</p>
                    <p className="text-[9px] text-gray-400 font-bold">{item.driverPhone}</p>
                    <span className="text-[9px] text-amber-600 font-black block mt-0.5">★ {item.driverRating}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block mb-0.5">ETA Delivery Timeline</span>
                    <p className="font-black text-gray-900 text-[13px]">{item.eta}</p>
                    <p className="text-[9px] text-gray-400 font-bold">{item.etaTime}</p>
                  </div>
                </div>
              </div>

              {/* Routes & Verification Stamps footer elements */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 text-[10px] font-bold text-gray-500">
                <div className="space-y-0.5">
                  <p className="flex items-center gap-1 text-gray-700"><MapPin size={11} className="text-gray-400" /> <span>{item.location}</span></p>
                  <p className="flex items-center gap-1 text-gray-400"><Calendar size={11} className="text-gray-400" /> <span>{item.timeSlot}</span></p>
                </div>
                
                {item.otpStatus !== 'none' && (
                  <div className="flex flex-wrap gap-x-3 gap-y-1 bg-gray-100/40 p-1.5 px-2.5 rounded-lg border border-gray-200/30 self-start sm:self-auto">
                    {item.otpStatus === 'verified' && <span className="text-emerald-700 flex items-center gap-1">✓ OTP</span>}
                    {item.otpStatus === 'pending' && <span className="text-amber-700 flex items-center gap-1">⚠ OTP</span>}
                    {item.photosStatus === 'uploaded' && <span className="text-emerald-700 flex items-center gap-1">✓ Photos</span>}
                    {item.photosStatus === 'pending' && <span className="text-amber-700 flex items-center gap-1">⚠ Photos</span>}
                  </div>
                )}
              </div>

              {/* Action Trigger Buttons Strip */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-[9px] text-gray-300 font-bold">RescrapX Carrier Tracking</span>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 border border-gray-200/50 cursor-pointer"><MoreVertical size={14} /></button>
                  <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-4 py-2 rounded-xl text-[11px] shadow-3xs transition-all cursor-pointer">
                    View Details
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* 4. COMPACT FOOTER PAGINATION CONTAINER */}
        <div className="bg-white border-t border-gray-100 px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 font-bold text-[11px]">
          <span>Showing <strong className="text-gray-800 font-black">1 to 6</strong> of <strong className="text-gray-800 font-black">18</strong> vehicles</span>
          
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all disabled:opacity-40" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black bg-[#0B5B32] text-white shadow-3xs">1</button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">2</button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">3</button>
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}