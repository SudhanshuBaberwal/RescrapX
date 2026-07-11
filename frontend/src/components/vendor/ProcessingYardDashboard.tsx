'use client';

import React, { useState } from 'react';
import { 
  Building2, Wrench, Ban, RefreshCw, CheckCircle2, 
  Search, SlidersHorizontal, RotateCcw, ChevronDown, 
  ChevronLeft, ChevronRight, MoreVertical, Calendar,
  Car, FileText, CheckCircle, Clock, AlertCircle, ArrowUpRight
} from 'lucide-react';

export default function ProcessingYardDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  // Top Metrics Banner Configuration
  const summaryCards = [
    { title: 'Total in Processing', value: '14', unit: 'Vehicles', icon: Building2, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { title: 'Inspection Completed', value: '5', unit: 'Vehicles', icon: Wrench, color: 'text-blue-700 bg-blue-50 border-blue-100' },
    { title: 'Dismantling in Progress', value: '6', unit: 'Vehicles', icon: Ban, color: 'text-purple-700 bg-purple-50 border-purple-100' },
    { title: 'Recycling in Progress', value: '2', unit: 'Vehicles', icon: RefreshCw, color: 'text-amber-700 bg-amber-50 border-amber-100' },
    { title: 'Completed Today', value: '3', unit: 'Vehicles', icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' }
  ];

  // Pipeline Processing Progress Stages Tracker
  const processingStages = [
    { step: 1, label: 'Waiting for Arrival', count: 3, status: 'current', color: 'border-emerald-600 bg-emerald-50 text-emerald-700' },
    { step: 2, label: 'Vehicle Received', count: 2, status: 'upcoming', color: 'border-blue-600 bg-blue-50 text-blue-700' },
    { step: 3, label: 'Inspection Completed', count: 5, status: 'upcoming', color: 'border-amber-500 bg-amber-50 text-amber-700' },
    { step: 4, label: 'Dismantling', count: 6, status: 'upcoming', color: 'border-purple-600 bg-purple-50 text-purple-700' },
    { step: 5, label: 'Recycling', count: 2, status: 'upcoming', color: 'border-teal-600 bg-teal-50 text-teal-700' },
    { step: 6, label: 'Certificate Pending', count: 2, status: 'upcoming', color: 'border-gray-400 bg-gray-50 text-gray-700' },
    { step: 7, label: 'Completed', count: 8, status: 'upcoming', color: 'border-emerald-600 bg-emerald-50 text-emerald-700' }
  ];

  // Primary Table / Card View Data Stream
  const vehiclesData = [
    {
      id: '1',
      makeModel: 'Maruti Swift Dzire 2014',
      specs: 'Petrol • Manual • 1st Owner',
      rc: 'RC: HR26AX1122',
      receivedDate: '08 Jul 2025',
      receivedTime: '19:10 AM',
      stageTag: 'Vehicle Received',
      stageSub: 'At your facility',
      stageColor: 'bg-blue-50 text-blue-700 border-blue-100',
      lastUpdateDate: '08 Jul 2025',
      lastUpdateTime: '09:10 AM',
      nextStepTitle: 'Inspection',
      nextStepDesc: 'Schedule inspection',
      documents: [
        { name: 'RC Verified', status: 'success' },
        { name: 'Photos Verified', status: 'success' }
      ]
    },
    {
      id: '2',
      makeModel: 'Hyundai i20 2016',
      specs: 'Petrol • Manual • 2nd Owner',
      rc: 'RC: HR26AZ7789',
      receivedDate: '08 Jul 2025',
      receivedTime: '19:40 AM',
      stageTag: 'Inspection Completed',
      stageSub: 'Ready for dismantling',
      stageColor: 'bg-amber-50 text-amber-700 border-amber-100',
      lastUpdateDate: '08 Jul 2025',
      lastUpdateTime: '11:20 AM',
      nextStepTitle: 'Dismantling',
      nextStepDesc: 'Start dismantling',
      documents: [
        { name: 'All Verified', status: 'success' }
      ]
    },
    {
      id: '3',
      makeModel: 'Honda City 2012',
      specs: 'Petrol • Manual • 2nd Owner',
      rc: 'RC: DL3CBE5678',
      receivedDate: '08 Jul 2025',
      receivedTime: '10:20 AM',
      stageTag: 'Dismantling',
      stageSub: 'In progress',
      stageColor: 'bg-purple-50 text-purple-700 border-purple-100',
      lastUpdateDate: '08 Jul 2025',
      lastUpdateTime: '02:15 PM',
      nextStepTitle: 'Recycling',
      nextStepDesc: 'Proceed to recycling',
      documents: []
    },
    {
      id: '4',
      makeModel: 'Tata Indica Vista 2011',
      specs: 'Diesel • Manual • 2nd Owner',
      rc: 'RC: HR51AS7789',
      receivedDate: '08 Jul 2025',
      receivedTime: '10:45 AM',
      stageTag: 'Recycling',
      stageSub: 'In progress',
      stageColor: 'bg-teal-50 text-teal-700 border-teal-100',
      lastUpdateDate: '08 Jul 2025',
      lastUpdateTime: '03:30 PM',
      nextStepTitle: 'CoD Generation',
      nextStepDesc: 'Generate CoD',
      documents: []
    },
    {
      id: '5',
      makeModel: 'Mahindra XUV500 2013',
      specs: 'Diesel • Manual • 2nd Owner',
      rc: 'RC: HR26DE1122',
      receivedDate: '07 Jul 2025',
      receivedTime: '11:30 AM',
      stageTag: 'Certificate Pending',
      stageSub: 'CoD to be uploaded',
      stageColor: 'bg-amber-50 text-amber-700 border-amber-100',
      lastUpdateDate: '08 Jul 2025',
      lastUpdateTime: '04:10 PM',
      nextStepTitle: 'Upload CoD',
      nextStepDesc: 'Upload certificate',
      documents: [
        { name: 'CoD Pending', status: 'pending' }
      ]
    },
    {
      id: '6',
      makeModel: 'Toyota Etios Liva 2015',
      specs: 'Petrol • Manual • 1st Owner',
      rc: 'RC: DL8CAM3466',
      receivedDate: '07 Jul 2025',
      receivedTime: '12:15 PM',
      stageTag: 'Completed',
      stageSub: 'Scrapping completed',
      stageColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      lastUpdateDate: '08 Jul 2025',
      lastUpdateTime: '01:35 PM',
      nextStepTitle: '-',
      nextStepDesc: '',
      documents: [
        { name: 'CoD Uploaded', status: 'success' },
        { name: 'All Documents', status: 'success' }
      ]
    }
  ];

  return (
    <div className="space-y-6 w-full text-xs antialiased text-gray-700">
      
      {/* 1. TOP HEADER SECTION PANEL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-black text-gray-900 text-sm tracking-tight">Processing Yard</h3>
          <p className="text-[10px] text-gray-400 font-bold">Track and manage all vehicles in your processing yard.</p>
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-3 py-1.5 font-black text-gray-700 flex items-center gap-2 self-start sm:self-auto shadow-3xs cursor-pointer">
          <Calendar size={13} className="text-[#0B5B32]" />
          <span>8 July 2025</span>
          <ChevronDown size={11} className="text-gray-400" />
        </button>
      </div>

      {/* 2. OVERVIEW METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {summaryCards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex justify-between items-start">
              <div className="space-y-2">
                <span className="text-gray-400 font-bold block leading-tight">{card.title}</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black text-gray-900 tracking-tight">{card.value}</span>
                  <span className="text-[9px] text-gray-400 font-bold">{card.unit}</span>
                </div>
              </div>
              <div className={`p-2 rounded-xl shrink-0 border ${card.color}`}>
                <IconComponent size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. MULTI-CONTROL TOOLBAR FILTER BLOCK */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          
          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Search Vehicle</span>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search by make, model or year..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-700 font-medium placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white" 
              />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {['Processing Status', 'Stage'].map((label, i) => (
            <div key={i}>
              <span className="text-[10px] text-gray-400 font-black block mb-1">{label}</span>
              <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-bold flex items-center justify-between hover:bg-gray-100/50 transition-all cursor-pointer">
                <span>All {i === 0 ? 'Status' : 'Stages'}</span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>
            </div>
          ))}

          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Date Range</span>
            <button className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-400 font-bold flex items-center justify-between hover:bg-gray-100/50 transition-all cursor-pointer">
              <span className="flex items-center gap-1.5"><Calendar size={12} /> Select Date Range</span>
              <ChevronDown size={12} className="text-gray-400" />
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

      {/* 4. PIPELINE STAGES STEP PROGRESSION TRACKER BAR */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3 overflow-hidden">
        <h4 className="font-black text-gray-900 text-[11px] tracking-tight">Processing Stages</h4>
        <div className="overflow-x-auto scrollbar-none -mx-4 px-4 pb-2 sm:mx-0 sm:px-0 sm:pb-0">
          <div className="flex items-center justify-between min-w-[960px] gap-2 relative">
            
            {/* Background Connector Pipe Line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-100 z-0" />

            {processingStages.map((stage, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-1.5 relative z-10 flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-[11px] shadow-3xs ${stage.color}`}>
                    {stage.step}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <p className="font-black text-gray-800 text-[10px] whitespace-nowrap">{stage.label}</p>
                  <div className="flex justify-center items-center gap-1">
                    <span className="text-xs font-black text-gray-900">{stage.count}</span>
                    <span className="text-[8px] text-gray-400 font-bold uppercase">Vehicles</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. DATA RENDERING ENGINE LAYER (DESKTOP TABLE vs MOBILE GRID) */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">
        
        {/* DESKTOP TABLE INTERFACE CONTAINER */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3.5 px-4 font-black">Vehicle Details</th>
                <th className="py-3.5 px-3 font-black">Received On</th>
                <th className="py-3.5 px-3 font-black">Stage / Status</th>
                <th className="py-3.5 px-3 font-black">Last Updated</th>
                <th className="py-3.5 px-3 font-black">Next Step</th>
                <th className="py-3.5 px-3 font-black">Documents</th>
                <th className="py-3.5 px-4 font-black text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {vehiclesData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/35 transition-colors">
                  
                  {/* Vehicle Blueprint identity block */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 shrink-0 mt-0.5">
                        <Car size={15} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-black text-gray-900 block text-xs tracking-tight">{row.makeModel}</span>
                        <p className="text-[10px] text-gray-400 font-bold block">{row.specs}</p>
                        <span className="inline-block text-[9px] bg-gray-100 text-gray-500 rounded-sm px-1 font-bold mt-1">{row.rc}</span>
                      </div>
                    </div>
                  </td>

                  {/* Arrival Date Marker */}
                  <td className="py-3.5 px-3 font-bold text-[10px]">
                    <div className="space-y-0.5 text-gray-700">
                      <p className="flex items-center gap-1"><Calendar size={11} className="text-gray-300" /> {row.receivedDate}</p>
                      <p className="text-gray-400 font-normal pl-3.5">{row.receivedTime}</p>
                    </div>
                  </td>

                  {/* Active Processing Tag Badge Status */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-1">
                      <span className={`px-2 py-0.5 border rounded-md font-black text-[9px] uppercase tracking-wider inline-block ${row.stageColor}`}>
                        {row.stageTag}
                      </span>
                      <p className="text-[10px] text-gray-400 font-medium pl-0.5">{row.stageSub}</p>
                    </div>
                  </td>

                  {/* Sync Last Update Marker */}
                  <td className="py-3.5 px-3 font-bold text-[10px]">
                    <div className="space-y-0.5 text-gray-700">
                      <p>{row.lastUpdateDate}</p>
                      <p className="text-gray-400 font-normal">{row.lastUpdateTime}</p>
                    </div>
                  </td>

                  {/* Action Workflow Next Target Step */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-0.5">
                      <p className="font-black text-gray-800 text-[11px]">{row.nextStepTitle}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{row.nextStepDesc}</p>
                    </div>
                  </td>

                  {/* Documentation Checklist Grid List */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-1">
                      {row.documents.length > 0 ? (
                        row.documents.map((doc, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-1 text-[10px] font-bold">
                            {doc.status === 'success' ? (
                              <CheckCircle size={11} className="text-emerald-600 shrink-0" />
                            ) : (
                              <Clock size={11} className="text-amber-500 shrink-0" />
                            )}
                            <span className={doc.status === 'success' ? 'text-emerald-700' : 'text-amber-700'}>{doc.name}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-300 font-normal pl-1">-</span>
                      )}
                    </div>
                  </td>

                  {/* Operational Dropdown Execution Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-2.5 py-1 rounded-xl shadow-3xs transition-all h-7 cursor-pointer flex items-center gap-0.5">
                        <span>View Details</span>
                        <ArrowUpRight size={11} className="text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 cursor-pointer">
                        <MoreVertical size={13} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE RESPONSIVE ITEM CARD INTERFACE WRAPPER */}
        <div className="block lg:hidden divide-y divide-gray-100">
          {vehiclesData.map((row) => (
            <div key={row.id} className="p-4 space-y-3">
              
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-0.5">
                  <h4 className="font-black text-gray-900 text-xs tracking-tight">{row.makeModel}</h4>
                  <p className="text-[10px] text-gray-400 font-bold">{row.specs} • <span className="text-gray-500">{row.rc}</span></p>
                </div>
                <span className={`px-2 py-0.5 border rounded-md font-black text-[8px] uppercase tracking-wider shrink-0 ${row.stageColor}`}>
                  {row.stageTag}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50 text-[10px]">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold block">Arrival Timestamp</span>
                  <p className="font-bold text-gray-700 mt-0.5">{row.receivedDate} • {row.receivedTime}</p>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold block">Last Synchronized</span>
                  <p className="font-bold text-gray-700 mt-0.5">{row.lastUpdateDate} • {row.lastUpdateTime}</p>
                </div>
                {row.nextStepTitle !== '-' && (
                  <div>
                    <span className="text-[9px] text-gray-400 font-bold block">Target Next Step</span>
                    <p className="font-black text-gray-800 mt-0.5">{row.nextStepTitle}</p>
                    <p className="text-[9px] text-gray-400">{row.nextStepDesc}</p>
                  </div>
                )}
                <div>
                  <span className="text-[9px] text-gray-400 font-bold block">Verification Status</span>
                  <div className="space-y-0.5 mt-0.5">
                    {row.documents.length > 0 ? (
                      row.documents.map((doc, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-1 text-[9px] font-bold">
                          {doc.status === 'success' ? <CheckCircle size={10} className="text-emerald-600" /> : <Clock size={10} className="text-amber-500" />}
                          <span className={doc.status === 'success' ? 'text-emerald-700' : 'text-amber-700'}>{doc.name}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-300 font-medium">-</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-[9px] text-gray-400 font-medium italic">{row.stageSub}</span>
                <div className="flex items-center gap-1">
                  <button className="border border-gray-200 bg-white px-3 py-1 rounded-lg font-black text-gray-700 text-[10px] shadow-3xs cursor-pointer">
                    View Details
                  </button>
                  <button className="p-1 text-gray-400 hover:bg-gray-50 rounded-lg"><MoreVertical size={13} /></button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* COMPONENT FOOTER SHEET CONTROLS PAGINATION PANEL */}
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 font-bold text-[11px]">
          <span>Showing <strong className="text-gray-800 font-black">1 to 6</strong> of <strong className="text-gray-800 font-black">14</strong> vehicles</span>
          
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-40" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black bg-[#0B5B32] text-white shadow-3xs">1</button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50">2</button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50">3</button>
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}