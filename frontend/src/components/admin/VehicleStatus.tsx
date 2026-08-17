'use client';

import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Calendar,
  MoreVertical,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Mail,
  SlidersHorizontal
} from 'lucide-react';

export interface ScrappingRequest {
  id: string;
  vehicleImage: string;
  regNumber: string;
  model: string;
  fuelType: string;
  transmission: string;
  expectedWeight: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  partnerName: string;
  partnerLocation: string;
  currentStageStep: number;
  currentStageName: string;
  currentStageDate: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  requestedDate: string;
  requestedTime: string;
  timeline: {
    step: number;
    title: string;
    date: string;
    description: string;
    status: 'Completed' | 'In Progress' | 'Pending';
  }[];
}

const requestsData: ScrappingRequest[] = [
  {
    id: 'RX2505160001',
    vehicleImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=200&q=80',
    regNumber: 'DL01AB1234',
    model: 'Honda City 2017',
    fuelType: 'Petrol',
    transmission: 'Manual',
    expectedWeight: '980 KG',
    ownerName: 'Amit Sharma',
    ownerPhone: '+91 98765 43210',
    ownerEmail: 'amit@gmail.com',
    partnerName: 'GreenWay RVSF',
    partnerLocation: 'Gurugram, Haryana',
    currentStageStep: 4,
    currentStageName: 'Car Picked Up',
    currentStageDate: '17 May 2025, 09:45 AM',
    status: 'In Progress',
    requestedDate: '16 May 2025',
    requestedTime: '10:30 AM',
    timeline: [
      { step: 1, title: '1. Request Received', date: '16 May 2025, 10:30 AM', description: 'Customer submitted the scrap request', status: 'Completed' },
      { step: 2, title: '2. Verification Completed', date: '16 May 2025, 11:15 AM', description: 'Documents and vehicle details verified', status: 'Completed' },
      { step: 3, title: '3. Driver Assigned', date: '16 May 2025, 01:20 PM', description: 'Driver Rakesh Kumar assigned for pickup', status: 'Completed' },
      { step: 4, title: '4. Car Picked Up', date: '17 May 2025, 09:45 AM', description: 'Vehicle picked up from Sector 45, Gurugram', status: 'Completed' },
      { step: 5, title: '5. Car Dropped at RVSF', date: '17 May 2025, 11:20 AM', description: 'Vehicle reached GreenWay RVSF facility', status: 'Completed' },
      { step: 6, title: '6. Vehicle Scrapped', date: '18 May 2025, 02:30 PM', description: 'Vehicle dismantled and scrapping completed', status: 'Completed' },
      { step: 7, title: '7. Documentation Done', date: '19 May 2025, 04:10 PM', description: 'RC cancelled and all documents processed', status: 'Completed' },
      { step: 8, title: '8. Completed', date: 'Pending', description: 'Request closed and process completed', status: 'Pending' },
    ]
  },
  {
    id: 'RX2505150008',
    vehicleImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=200&q=80',
    regNumber: 'HR26CD5678',
    model: 'Maruti Swift 2016',
    fuelType: 'Diesel',
    transmission: 'Manual',
    expectedWeight: '890 KG',
    ownerName: 'Neha Verma',
    ownerPhone: '+91 98123 45678',
    ownerEmail: 'neha@gmail.com',
    partnerName: 'GreenWay RVSF',
    partnerLocation: 'Gurugram, Haryana',
    currentStageStep: 5,
    currentStageName: 'Car Dropped at RVSF',
    currentStageDate: '17 May 2025, 11:20 AM',
    status: 'In Progress',
    requestedDate: '15 May 2025',
    requestedTime: '02:15 PM',
    timeline: []
  },
  {
    id: 'RX2505150003',
    vehicleImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=80',
    regNumber: 'UP14EF7890',
    model: 'Hyundai i20 2015',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    expectedWeight: '940 KG',
    ownerName: 'Rohan Mehta',
    ownerPhone: '+91 98711 22334',
    ownerEmail: 'rohan@gmail.com',
    partnerName: 'CleanAuto RVSF',
    partnerLocation: 'Noida, UP',
    currentStageStep: 6,
    currentStageName: 'Vehicle Scrapped',
    currentStageDate: '18 May 2025, 02:30 PM',
    status: 'In Progress',
    requestedDate: '15 May 2025',
    requestedTime: '11:45 AM',
    timeline: []
  },
  {
    id: 'RX2505140006',
    vehicleImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80',
    regNumber: 'DL12XY3456',
    model: 'Tata Indigo 2012',
    fuelType: 'Diesel',
    transmission: 'Manual',
    expectedWeight: '1050 KG',
    ownerName: 'Vikas Kumar',
    ownerPhone: '+91 93122 33445',
    ownerEmail: 'vikas@gmail.com',
    partnerName: 'Apex Recyclers',
    partnerLocation: 'Delhi, India',
    currentStageStep: 7,
    currentStageName: 'Documentation Done',
    currentStageDate: '19 May 2025, 04:10 PM',
    status: 'Completed',
    requestedDate: '14 May 2025',
    requestedTime: '09:20 AM',
    timeline: []
  },
  {
    id: 'RX2505130002',
    vehicleImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=200&q=80',
    regNumber: 'RJ14KL6789',
    model: 'Mahindra XUV500 2014',
    fuelType: 'Diesel',
    transmission: 'Manual',
    expectedWeight: '1780 KG',
    ownerName: 'Pooja Singh',
    ownerPhone: '+91 98222 11223',
    ownerEmail: 'pooja@gmail.com',
    partnerName: 'Jaipur Metals',
    partnerLocation: 'Jaipur, Rajasthan',
    currentStageStep: 2,
    currentStageName: 'Verification',
    currentStageDate: '16 May 2025, 11:15 AM',
    status: 'Pending',
    requestedDate: '13 May 2025',
    requestedTime: '04:10 PM',
    timeline: []
  }
];

export default function RequestStatusPage() {
  const [selectedRequest, setSelectedRequest] = useState<ScrappingRequest | null>(requestsData[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-100';
    }
  };

  return (
    <div className="flex h-full w-full bg-[#F8FAFC] overflow-hidden">
      
      {/* MAIN TABLE CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 p-6 space-y-4 overflow-hidden">
        
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-lg font-bold text-gray-900">All Request Status</h1>
          <p className="text-xs text-gray-400">Track and monitor the progress of all vehicle scrapping requests</p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Request ID, Vehicle No., Owner Name, Phone..."
              className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <select className="bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-gray-600 appearance-none focus:outline-none">
              <option>All Status</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Pending</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-gray-600 appearance-none focus:outline-none">
              <option>All Partners</option>
              <option>GreenWay RVSF</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 flex items-center gap-2 hover:bg-gray-50">
            <Calendar size={14} className="text-gray-400" />
            <span>Select Date Range</span>
          </button>

          <button className="bg-white border border-gray-200 rounded-lg p-2 text-gray-500 hover:bg-gray-50">
            <SlidersHorizontal size={15} />
          </button>
        </div>

        {/* TABLE */}
        <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] text-gray-400 font-bold uppercase bg-gray-50/50">
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Vehicle Details</th>
                  <th className="py-3 px-4">Owner / Partner</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Requested On</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {requestsData.map((req) => (
                  <tr 
                    key={req.id} 
                    className={`hover:bg-gray-50/60 transition-colors cursor-pointer ${selectedRequest?.id === req.id ? 'bg-emerald-50/20' : ''}`}
                    onClick={() => setSelectedRequest(req)}
                  >
                    <td className="py-3 px-4 font-semibold text-gray-900 text-[11px]">{req.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={req.vehicleImage} alt={req.model} className="w-10 h-7 rounded object-cover border shrink-0" />
                        <div>
                          <span className="font-bold text-gray-900 block text-[11px]">{req.regNumber}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{req.model}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-800 block text-[11px]">{req.ownerName}</span>
                      <span className="text-[10px] text-gray-400">{req.ownerPhone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full border border-emerald-500 text-emerald-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {req.currentStageStep}
                        </span>
                        <div>
                          <span className="font-semibold text-gray-900 block text-[11px]">{req.currentStageName}</span>
                          <span className="text-[9px] text-gray-400">{req.currentStageDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold inline-block ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-800 block text-[11px]">{req.requestedDate}</span>
                      <span className="text-[10px] text-gray-400">{req.requestedTime}</span>
                    </td>
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setSelectedRequest(req)}
                          className="px-2.5 py-1 text-[10px] font-semibold text-emerald-600 border border-emerald-200 rounded hover:bg-emerald-50"
                        >
                          View Details
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-white">
            <span>Showing 1 to 5 of 1,248 requests</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded text-gray-400 hover:bg-gray-100"><ChevronLeft size={16} /></button>
              <button className="w-6 h-6 rounded text-xs font-semibold bg-emerald-600 text-white flex items-center justify-center">1</button>
              <button className="w-6 h-6 rounded text-xs font-semibold text-gray-600 hover:bg-gray-100 flex items-center justify-center">2</button>
              <button className="p-1 rounded text-gray-400 hover:bg-gray-100"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </main>

      {/* RIGHT SIDE DETAILS DRAWER */}
      {selectedRequest && (
        <aside className="w-[360px] border-l border-gray-100 bg-white flex flex-col shrink-0 overflow-hidden shadow-lg xl:shadow-none">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900">Request ID: {selectedRequest.id}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getStatusBadge(selectedRequest.status)}`}>
                {selectedRequest.status}
              </span>
            </div>
            <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <img src={selectedRequest.vehicleImage} alt="Vehicle" className="w-16 h-12 rounded object-cover border shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 text-xs">{selectedRequest.regNumber}</h3>
                <p className="text-[10px] text-gray-500 font-medium">
                  {selectedRequest.model} • {selectedRequest.fuelType} • {selectedRequest.transmission}
                </p>
                <p className="text-[10px] text-gray-400">Expected Weight: {selectedRequest.expectedWeight}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] pb-2 border-b border-gray-100">
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block text-[10px]">Owner:</span>
                <span className="font-bold text-gray-800 block">{selectedRequest.ownerName}</span>
                <span className="text-gray-500 text-[10px] flex items-center gap-1"><Phone size={10} /> {selectedRequest.ownerPhone}</span>
                <span className="text-gray-500 text-[10px] flex items-center gap-1 truncate"><Mail size={10} /> {selectedRequest.ownerEmail}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block text-[10px]">Partner / RVSF</span>
                <span className="font-bold text-gray-800 block">{selectedRequest.partnerName}</span>
                <span className="text-gray-500 text-[10px] block">{selectedRequest.partnerLocation}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-xs">Scrapping Process Status</h4>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                {selectedRequest.timeline.map((step) => {
                  const isDone = step.status === 'Completed';
                  return (
                    <div key={step.step} className="relative">
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white ${
                        isDone ? 'border-emerald-500 text-emerald-600' : 'border-gray-300 text-gray-300'
                      }`}>
                        {isDone ? <CheckCircle2 size={12} className="fill-emerald-50 text-emerald-600" /> : <span className="text-[9px] font-bold">{step.step}</span>}
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-bold text-gray-900 text-[11px] leading-tight">{step.title}</h5>
                          <p className="text-[9px] text-gray-400 mt-0.5">{step.date}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{step.description}</p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          isDone ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs transition-colors">
              View Full Details
            </button>
          </div>
        </aside>
      )}

    </div>
  );
}