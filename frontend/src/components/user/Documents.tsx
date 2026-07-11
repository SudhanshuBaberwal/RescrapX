'use client'

import React, { useState } from 'react';
import { 
  FileText, CheckCircle2, Clock, AlertTriangle, UploadCloud, 
  Eye, Download, MoreVertical, ShieldAlert, Phone, Mail, ExternalLink 
} from 'lucide-react';

export default function Documents() {
  const [activeTab, setActiveTab] = useState('All Documents');

  const tabs = [
    'All Documents', 
    'Required for Scrapping', 
    'Vehicle Documents', 
    'Identity Documents', 
    'Other Documents'
  ];

  const stats = [
    { label: "Total Documents", count: 7, subText: "Uploaded by you", color: "text-emerald-600", bg: "bg-emerald-50", icon: FileText },
    { label: "Verified", count: 5, subText: "Documents verified", color: "text-blue-600", bg: "bg-blue-50", icon: CheckCircle2 },
    { label: "Under Review", count: 1, subText: "Verification in progress", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
    { label: "Rejection", count: 1, subText: "Action required", color: "text-red-600", bg: "bg-red-50", icon: ShieldAlert },
  ];

  const documents = [
    { name: "Registration Certificate (RC)", file: "UP16BD4567_RC.pdf", category: "Vehicle Documents", status: "Verified", date: "05 July 2024" },
    { name: "Certificate of Deposit", file: "CoD_RX240015.pdf", category: "Scrapping Documents", status: "Verified", date: "07 July 2024" },
    { name: "Insurance Certificate", file: "Insurance_2024.pdf", category: "Vehicle Documents", status: "Under Review", date: "08 July 2024" },
    { 
      name: "Aadhaar Card", 
      file: "Aadhaar_Shubham.pdf", 
      category: "Identity Documents", 
      status: "Rejection", 
      date: "06 July 2024",
      alert: "Document blurred. Please upload a clear copy." 
    },
    { name: "Pan Card", file: "PAN_Shubham.pdf", category: "Identity Documents", status: "Verified", date: "05 July 2024" },
    { name: "Address Proof", file: "Electricity_Bill.pdf", category: "Identity Documents", status: "Verified", date: "05 July 2024" },
  ];

  return (
    <div className="w-full space-y-6 text-[#374151]">
      
      {/* ========================================== */}
      {/* HEADER SECTION                             */}
      {/* ========================================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-2 rounded-xl">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Documents</h1>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">Manage and track all your documents in one place.</p>
        </div>
        
        {/* Update Notification Banner */}
        <div className="flex items-center gap-3 bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 max-w-md">
          <FileText className="text-emerald-600 shrink-0" size={20} />
          <div className="text-[11px] leading-relaxed">
            <p className="font-extrabold text-gray-800">Keep your documents updated</p>
            <p className="text-gray-500 font-medium">Accurate documents help us process your scrapping request faster.</p>
          </div>
          <button className="text-[11px] font-black text-emerald-700 bg-white border border-emerald-200 px-3 py-1.5 rounded-lg shrink-0 hover:bg-emerald-50 transition">
            Learn More
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* STATS COUNT GRID GRID                      */}
      {/* ========================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-3.5 shadow-2xs">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-gray-900 leading-none">{stat.count}</span>
                </div>
                <p className="text-[11px] font-black text-gray-800 mt-1">{stat.label}</p>
                <p className="text-[10px] font-medium text-gray-400">{stat.subText}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* TAB NAVIGATION FILTER                      */}
      {/* ========================================== */}
      <div className="border-b border-gray-100 flex gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-bold pb-3 px-2 border-b-2 transition-all whitespace-nowrap whitespace-none ${
              activeTab === tab 
                ? 'border-[#0B5B32] text-[#0B5B32] font-black' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ========================================== */}
      {/* UPLOAD BOX DROPZONE                        */}
      {/* ========================================== */}
      <div className="border border-dashed border-gray-200 rounded-2xl p-6 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 bg-emerald-50 text-[#0B5B32] rounded-xl flex items-center justify-center shrink-0 mx-auto">
            <UploadCloud size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">Upload New Document</h4>
            <p className="text-xs text-gray-400 font-medium">Drag and drop files here, or <span className="text-[#0B5B32] font-bold underline cursor-pointer">browse</span></p>
          </div>
        </div>
        <div className="text-center sm:text-right space-y-1">
          <button className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-xs">
            Upload Document
          </button>
          <p className="text-[10px] text-gray-400 font-medium block">JPG, PNG, PDF (Max. 10MB)</p>
        </div>
      </div>

      {/* ========================================== */}
      {/* DOCUMENTS DATATABLE SECTION                */}
      {/* ========================================== */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-black text-gray-900">Your Documents</h3>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Uploaded On</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((doc, idx) => (
                <React.Fragment key={idx}>
                  <tr className="hover:bg-gray-50/40 text-xs font-semibold text-gray-700 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          doc.status === 'Rejection' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-tight">{doc.name}</p>
                          <p className="text-[11px] text-gray-400 font-mono mt-0.5">{doc.file}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md ${
                        doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' :
                        doc.status === 'Under Review' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          doc.status === 'Verified' ? 'bg-emerald-600' :
                          doc.status === 'Under Review' ? 'bg-amber-500' : 'bg-red-600'
                        }`} />
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-gray-400">{doc.date}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5 text-gray-400">
                        <button className="p-1.5 hover:bg-gray-100 rounded-md transition hover:text-gray-700"><Eye size={14} /></button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-md transition hover:text-gray-700"><Download size={14} /></button>
                        <button className="p-1.5 hover:bg-gray-100 rounded-md transition hover:text-gray-700"><MoreVertical size={14} /></button>
                      </div>
                    </td>
                  </tr>

                  {/* Contextual Rejection Alert Drawer */}
                  {doc.alert && (
                    <tr>
                      <td colSpan={5} className="bg-red-50/40 px-4 py-2.5 border-b border-gray-100">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-red-700">
                            <AlertTriangle size={14} className="text-red-500" />
                            <span>{doc.alert}</span>
                          </div>
                          <button className="bg-white border border-red-200 text-red-600 text-[10px] font-black px-3 py-1 rounded-md hover:bg-red-50 transition shadow-2xs">
                            Re-upload
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* HELP & SUPPORT CONTACT FOOTER PANEL        */}
      {/* ========================================== */}
      <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {/* Decorative graphic asset wrapper */}
          <div className="w-16 h-16 relative bg-white border border-emerald-100 rounded-xl flex items-center justify-center text-3xl shadow-2xs shrink-0">
            📂
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5">
              <CheckCircle2 size={10} className="fill-emerald-500 stroke-white" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">Need help with documents?</h4>
            <p className="text-xs text-gray-400 font-medium max-w-md mt-0.5 leading-relaxed">
              Our support team is here to help you with any document-related queries.
            </p>
          </div>
        </div>

        {/* Support Channels Contacts */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-gray-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-lg border border-gray-100 text-[#0B5B32] shadow-2xs"><Phone size={14} /></div>
            <div>
              <p className="text-gray-900 font-black">+91 98765 43210</p>
              <p className="text-[10px] font-medium text-gray-400">Mon – Sat | 9:00 AM – 7:00 PM</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-lg border border-gray-100 text-[#0B5B32] shadow-2xs"><Mail size={14} /></div>
            <div>
              <p className="text-gray-900 font-black">support@rescrapx.com</p>
              <p className="text-[10px] font-medium text-gray-400">We reply within 2 hours</p>
            </div>
          </div>

          <button className="bg-white border border-gray-200 text-gray-700 hover:text-gray-900 font-bold px-4 py-2.5 rounded-xl transition shadow-2xs flex items-center gap-1.5 shrink-0">
            <span>Contact Support</span>
          </button>
        </div>
      </div>

    </div>
  );
}