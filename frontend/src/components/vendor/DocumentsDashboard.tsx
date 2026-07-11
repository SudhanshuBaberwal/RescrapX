'use client';

import React, { useState } from 'react';
import { 
  FileText, Clock, UploadCloud, CheckCircle2, AlertOctagon, 
  Calendar, Search, SlidersHorizontal, RotateCcw, ChevronDown, 
  ChevronLeft, ChevronRight, Eye, MoreVertical, 
  Camera, ShieldAlert
} from 'lucide-react';
import {File} from "lucide-react"
export default function DocumentsDashboard() {
  const [activeTab, setActiveTab] = useState('All Documents');

  // Top Metrics Data Grid
  const metrics = [
    { title: 'Total Documents', count: '96', meta: 'All time', icon: FileText, iconColor: 'text-emerald-600 bg-emerald-50' },
    { title: 'Pending Action', count: '6', meta: 'Require your attention', icon: Clock, iconColor: 'text-amber-600 bg-amber-50' },
    { title: 'Uploaded', count: '72', meta: 'Successfully uploaded', icon: UploadCloud, iconColor: 'text-purple-600 bg-purple-50' },
    { title: 'Verified', count: '60', meta: 'Verified by RescrapX', icon: CheckCircle2, iconColor: 'text-blue-600 bg-blue-50' },
    { title: 'Rejected', count: '4', meta: 'Need to re-upload', icon: AlertOctagon, iconColor: 'text-red-600 bg-red-50' },
    { title: 'Expiring Soon', count: '3', meta: 'Within next 30 days', icon: ShieldAlert, iconColor: 'text-teal-600 bg-teal-50' },
  ];

  // Document Segment Filter Tabs
  const tabs = [
    { name: 'All Documents', count: 96, color: 'bg-emerald-50 text-emerald-700' },
    { name: 'Pending', count: 6, color: 'bg-amber-50 text-amber-700' },
    { name: 'Uploaded', count: 72, color: 'bg-purple-50 text-purple-700' },
    { name: 'Verified', count: 60, color: 'bg-blue-50 text-blue-700' },
    { name: 'Rejected', count: 4, color: 'bg-red-50 text-red-700' },
    { name: 'Expiring Soon', count: 3, color: 'bg-amber-50 text-amber-700' },
  ];

  // Primary Documents Dataset
  const documentItems = [
    { id: 1, name: 'Certificate of Deposit (CoD)', vehicle: 'Maruti Swift Dzire 2014', orderId: 'WO-250708-0012', orderTag: 'Won Order', registration: 'HR26AX1122', type: 'CoD', date: '08 Jul 2025 \n 10:15 AM', user: 'by Ravi Kumar', status: 'Verified', statusMeta: '08 Jul 2025', validity: '07 Jan 2026 \n (180 days left)', action: 'view' },
    { id: 2, name: 'Vehicle Photos (Pickup)', vehicle: 'Hyundai i20 2016', orderId: 'WO-250708-0009', orderTag: 'Won Order', registration: 'HR26AZ7789', type: 'Photos', date: '08 Jul 2025 \n 09:45 AM', user: 'by Sandeep', status: 'Pending', statusMeta: 'Verification', validity: '-', action: 'upload' },
    { id: 3, name: 'Chassis Cut Photo', vehicle: 'Honda City 2012', orderId: 'WO-250708-0015', orderTag: 'Won Order', registration: 'DL3CBE5678', type: 'Chassis Cut', date: '08 Jul 2025 \n 02:30 PM', user: 'by Mohit', status: 'Uploaded', statusMeta: 'Under Review', validity: '-', action: 'view' },
    { id: 4, name: 'Engine Cut Photo', vehicle: 'Tata Indica Vista 2011', orderId: 'WO-250708-0007', orderTag: 'Won Order', registration: 'HR51AS7789', type: 'Engine Cut', date: '08 Jul 2025 \n 02:35 PM', user: 'by Aman', status: 'Verified', statusMeta: '08 Jul 2025', validity: '-', action: 'view' },
    { id: 5, name: 'Affidavit', vehicle: 'Mahindra XUV500 2013', orderId: 'WO-250708-0021', orderTag: 'Won Order', registration: 'HR26DE1122', type: 'Affidavit', date: '07 Jul 2025 \n 11:20 AM', user: 'by Vikram', status: 'Pending', statusMeta: 'Verification', validity: '-', action: 'upload' },
    { id: 6, name: 'Payment Proof', vehicle: 'Toyota Etios Liva 2015', orderId: 'WO-250708-0011', orderTag: 'Won Order', registration: 'DL8CAM3456', type: 'Payment Proof', date: '07 Jul 2025 \n 12:10 PM', user: 'by Deepak', status: 'Rejected', statusMeta: 'Re-upload required', validity: '-', action: 'view' },
  ];

  // Document Status CSS Resolver
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Uploaded': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  // Icon Resolver based on doc name
  const getDocIcon = (name: string) => {
    if (name.includes('Photo')) return <Camera className="text-purple-600" size={16} />;
    if (name.includes('Photos')) return <Camera className="text-amber-600" size={16} />;
    if (name.includes('Certificate')) return <File className="text-emerald-600" size={16} />;
    return <FileText className="text-amber-600" size={16} />;
  };

  const getDocIconBg = (name: string) => {
    if (name.includes('Photo') && !name.includes('Photos')) return 'bg-purple-50';
    if (name.includes('Photos')) return 'bg-amber-50';
    if (name.includes('Certificate')) return 'bg-emerald-50';
    return 'bg-amber-50';
  };

  return (
    <div className="space-y-6 w-full text-xs">
      
      {/* HEADER SECTION */}
      <div>
        <h3 className="font-black text-gray-900 text-sm">Documents</h3>
        <p className="text-[10px] text-gray-400 font-bold">Upload, manage and track all required documents.</p>
      </div>

      {/* 1. TOP METRICS MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex justify-between items-start">
              <div className="space-y-3">
                <span className="text-gray-400 font-bold block leading-tight">{metric.title}</span>
                <div>
                  <span className="text-xl font-black text-gray-900 tracking-tight block">{metric.count}</span>
                  <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{metric.meta}</span>
                </div>
              </div>
              <div className={`p-2 rounded-xl ${metric.iconColor}`}><Icon size={14} /></div>
            </div>
          );
        })}
      </div>

      {/* 2. ADVANCED SEARCH & FILTER PANEL */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          
          <div className="relative">
            <span className="text-[10px] text-gray-400 font-black block mb-1">Search Document</span>
            <div className="relative">
              <input type="text" placeholder="Search by document name, vehicle..." className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-gray-700 font-medium placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white" />
              <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {[
            { label: 'Document Type', value: 'All Types' },
            { label: 'Status', value: 'All Status' }
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
            <span className="text-[10px] text-gray-400 font-black block mb-1">Vehicle / Order ID</span>
            <input type="text" placeholder="Enter Vehicle or Order ID" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 font-medium placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 focus:bg-white" />
          </div>

          <div>
            <span className="text-[10px] text-gray-400 font-black block mb-1">Date Range</span>
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

      {/* 3. SEGMENTED CATEGORY TABS (Horizontal scroll guard enabled) */}
      <div className="border-b border-gray-100 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        <div className="flex gap-6 min-w-max pb-px">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-3 font-black transition-all relative cursor-pointer flex items-center gap-2 ${
                activeTab === tab.name ? 'text-emerald-800' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>{tab.name}</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === tab.name ? tab.color : 'bg-gray-100 text-gray-500'
              }`}>{tab.count}</span>
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B5B32] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN SHEET SLAT PANELS */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-3xs overflow-hidden">
        
        {/* DESKTOP DATA SHEET VIEW */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <th className="py-3 px-4 font-black w-[30%]">Document Name</th>
                <th className="py-3 px-2 font-black">Vehicle / Order ID</th>
                <th className="py-3 px-2 font-black">Document Type</th>
                <th className="py-3 px-2 font-black">Uploaded On</th>
                <th className="py-3 px-2 font-black text-center">Status</th>
                <th className="py-3 px-2 font-black">Valid Till</th>
                <th className="py-3 px-4 font-black text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {documentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                  
                  {/* Document Identity metadata cell */}
                  <td className="py-4 px-4">
                    <div className="flex gap-3 items-start">
                      <div className={`p-2.5 rounded-xl shrink-0 ${getDocIconBg(item.name)}`}>
                        {getDocIcon(item.name)}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-black text-gray-900 text-[13px] tracking-tight leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold">{item.vehicle}</p>
                        <p className="text-[9px] text-gray-400 font-bold">Order ID: {item.orderId}</p>
                      </div>
                    </div>
                  </td>

                  {/* Operational reference IDs codes */}
                  <td className="py-4 px-2">
                    <div className="space-y-1">
                      <p className="font-black text-gray-800">{item.registration}</p>
                      <span className="text-[8px] font-black px-1.5 py-0.2 rounded-sm bg-gray-50 text-gray-500 border border-gray-200 uppercase tracking-wide">
                        {item.orderTag}
                      </span>
                    </div>
                  </td>

                  {/* Standard functional categorizations */}
                  <td className="py-4 px-2 text-gray-600 font-bold">{item.type}</td>

                  {/* Logging timestamps profiles */}
                  <td className="py-4 px-2">
                    <div className="text-gray-800 leading-tight">
                      {item.date.split('\n').map((line, i) => <p key={i} className={i === 1 ? 'text-[10px] text-gray-400 font-bold' : ''}>{line}</p>)}
                      <p className="text-[10px] text-gray-400 font-bold mt-0.5">{item.user}</p>
                    </div>
                  </td>

                  {/* Verification state control markers */}
                  <td className="py-4 px-2 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={`px-2.5 py-0.5 rounded-md font-black text-[9px] uppercase tracking-wider border ${getStatusStyle(item.status)}`}>
                        {item.status}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold mt-0.5">{item.statusMeta}</span>
                    </div>
                  </td>

                  {/* Expiration system values mapping tags */}
                  <td className="py-4 px-2">
                    {item.validity !== '-' ? (
                      <div className="leading-tight">
                        <p className="font-bold text-gray-800">{item.validity.split('\n')[0]}</p>
                        <p className="text-[9px] font-black text-emerald-600 mt-0.5">{item.validity.split('\n')[1]}</p>
                      </div>
                    ) : (
                      <span className="text-gray-300 font-bold">—</span>
                    )}
                  </td>

                  {/* Actions interactive control layouts elements */}
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {item.action === 'view' ? (
                        <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-3 py-1.5 rounded-xl shadow-3xs transition-all tracking-tight flex items-center gap-1 h-8 cursor-pointer">
                          <Eye size={12} className="text-gray-400" /> <span>View</span>
                        </button>
                      ) : (
                        <button className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-3 py-1.5 rounded-xl shadow-3xs transition-all tracking-tight flex items-center gap-1 h-8 cursor-pointer">
                          <UploadCloud size={12} /> <span>Upload</span>
                        </button>
                      )}
                      <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors cursor-pointer"><MoreVertical size={14} /></button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* COMPACT CELLULAR CARDS LIST (Active on mobile displays boundaries) */}
        <div className="xl:hidden divide-y divide-gray-100">
          {documentItems.map((item) => (
            <div key={item.id} className="p-4 space-y-4 hover:bg-gray-50/20 transition-all">
              
              {/* Card top banner header wrapper */}
              <div className="flex justify-between items-start gap-3">
                <div className="flex gap-2.5 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center ${getDocIconBg(item.name)}`}>
                    {getDocIcon(item.name)}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-black text-gray-900 text-sm tracking-tight truncate">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold truncate">{item.vehicle}</p>
                    <p className="text-[9px] text-gray-400 font-bold">ID: {item.orderId}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded-md font-black text-[8px] uppercase tracking-wider border block ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="text-[8px] text-gray-400 font-bold block mt-0.5">{item.statusMeta}</span>
                </div>
              </div>

              {/* Context structural details strips fields */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50/60 border border-gray-100/40 p-3 rounded-xl text-gray-600">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold block mb-0.5">Vehicle Details</span>
                  <span className="font-black text-gray-800 block text-[11px]">{item.registration}</span>
                  <span className="text-[8px] font-black px-1 py-0.2 rounded-xs bg-gray-200/50 text-gray-500 uppercase inline-block mt-1 tracking-wide">{item.orderTag}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 font-bold block mb-0.5">Document Type</span>
                  <span className="font-black text-gray-800 block text-[11px]">{item.type}</span>
                </div>
              </div>

              {/* Logs timestamps entries strings parameters */}
              <div className="flex justify-between items-end text-[10px] font-bold text-gray-500 pt-1">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold block mb-0.5">Uploaded Details</span>
                  <p className="text-gray-700 leading-tight">{item.date.replace('\n', '')}</p>
                  <p className="text-[9px] text-gray-400 font-bold">{item.user}</p>
                </div>
                
                {item.validity !== '-' && (
                  <div className="text-right">
                    <span className="text-[9px] text-gray-400 font-bold block mb-0.5">Valid Till</span>
                    <p className="text-gray-700 font-bold">{item.validity.split('\n')[0]}</p>
                    <p className="text-[9px] font-black text-emerald-600">{item.validity.split('\n')[1]}</p>
                  </div>
                )}
              </div>

              {/* Functional execution elements row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-[9px] text-gray-300 font-bold">Actions Available</span>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 border border-gray-200/50 cursor-pointer"><MoreVertical size={14} /></button>
                  {item.action === 'view' ? (
                    <button className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-black px-4 py-2 rounded-xl text-[11px] shadow-3xs transition-all flex items-center gap-1 cursor-pointer">
                      <Eye size={12} className="text-gray-400" /> <span>View</span>
                    </button>
                  ) : (
                    <button className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-black px-4 py-2 rounded-xl text-[11px] shadow-3xs transition-all flex items-center gap-1 cursor-pointer">
                      <UploadCloud size={12} /> <span>Upload</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* 5. RESPONSIVE COMPACT PAGINATION FOOTER */}
        <div className="bg-white border-t border-gray-100 px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-400 font-bold text-[11px]">
          <span>Showing <strong className="text-gray-800 font-black">1 to 6</strong> of <strong className="text-gray-800 font-black">96</strong> documents</span>
          
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all disabled:opacity-40" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black bg-[#0B5B32] text-white shadow-3xs">1</button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">2</button>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">3</button>
            <span className="text-gray-300 font-bold px-0.5">...</span>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center font-black border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">16</button>
            <button className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}