'use client'

import React, { useState, useMemo } from 'react';
import {
  FileText, CheckCircle2, Clock, AlertTriangle, UploadCloud,
  Eye, Download, ShieldAlert, Phone, Mail
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getAllVehicles } from '@/hooks/getAllVehicles';
import axios from 'axios';

const formatDate = (dateValue?: string | Date) => {
  if (!dateValue) return 'N/A';
  return new Date(dateValue).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function Documents() {
  getAllVehicles();

  const { allVehiclesData } = useSelector((state: RootState) => state.vehicle);
  const [activeTab, setActiveTab] = useState('All Documents');

  const tabs = [
    'All Documents',
    'Vehicle Documents',
    'Identity Documents',
    'Other Documents'
  ];

  const docConfig: Record<string, { name: string; category: string }> = {
    rcbook: { name: 'Registration Certificate (RC)', category: 'Vehicle Documents' },
    insurance: { name: 'Insurance Certificate', category: 'Vehicle Documents' },
    puc: { name: 'PUC Certificate', category: 'Vehicle Documents' },
    loanClosure: { name: 'Loan Closure / NOC', category: 'Vehicle Documents' },
    other: { name: 'Other Document', category: 'Other Documents' },
  };

  const extractedDocuments = useMemo(() => {
    if (!allVehiclesData || !Array.isArray(allVehiclesData) || allVehiclesData.length === 0) return [];

    const activeVehicle: any = allVehiclesData[0];
    if (!activeVehicle) return [];

    const rawDocs = activeVehicle.documents || {};
    const list: any[] = [];

    Object.entries(rawDocs).forEach(([docKey, docObj]: [string, any]) => {
      if (!docObj) return;

      const config = docConfig[docKey] || {
        name: docKey.toUpperCase(),
        category: 'Other Documents'
      };

      // Extract raw path for API payload
      const rawPath = typeof docObj === 'string'
        ? docObj
        : docObj?.path || docObj?.fullPath || docObj?.key || docObj?.url || '';

      const fileName = rawPath.split('/').pop() || `${docKey}.pdf`;

      const docStatusRaw = (typeof docObj === 'object' && docObj.status)
        ? docObj.status.toUpperCase()
        : (activeVehicle?.status ? activeVehicle.status.toUpperCase() : 'PENDING');

      let uiStatus = 'Under Review';
      if (docStatusRaw === 'VERIFIED' || docStatusRaw === 'APPROVED') uiStatus = 'Verified';
      if (docStatusRaw === 'REJECTED') uiStatus = 'Rejection';

      list.push({
        id: `${activeVehicle?._id}-${docKey}`,
        name: config.name,
        file: fileName,
        category: config.category,
        status: uiStatus,
        date: formatDate(activeVehicle?.updatedAt || activeVehicle?.createdAt),
        rawPath,
        rejectionReason: (typeof docObj === 'object' && docObj.rejectionReason) || activeVehicle?.rejectionReason || 'Document re-upload required.'
      });
    });

    return list;
  }, [allVehiclesData]);

  const filteredDocuments = useMemo(() => {
    if (activeTab === 'All Documents') return extractedDocuments;
    return extractedDocuments.filter((doc) => doc.category === activeTab);
  }, [activeTab, extractedDocuments]);

  const stats = useMemo(() => {
    const total = extractedDocuments.length;
    const verified = extractedDocuments.filter(d => d.status === 'Verified').length;
    const underReview = extractedDocuments.filter(d => d.status === 'Under Review').length;
    const rejection = extractedDocuments.filter(d => d.status === 'Rejection').length;

    return [
      { label: "Total Documents", count: total, subText: "Uploaded by you", color: "text-emerald-600", bg: "bg-emerald-50", icon: FileText },
      { label: "Verified", count: verified, subText: "Documents verified", color: "text-blue-600", bg: "bg-blue-50", icon: CheckCircle2 },
      { label: "Under Review", count: underReview, subText: "Verification in progress", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
      { label: "Rejection", count: rejection, subText: "Action required", color: "text-red-600", bg: "bg-red-50", icon: ShieldAlert },
    ];
  }, [extractedDocuments]);

  // Robust PDF viewer supporting absolute backend fallback
  const handleViewPDF = async (path: string) => {
    if (!path) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/vehicle/register/view-document",
        { path },
        { withCredentials: true }
      );

      let targetUrl = typeof response.data === 'string'
        ? response.data
        : response.data?.data?.url || response.data?.data || response.data?.url;

      if (targetUrl) {
        window.open(targetUrl, "_blank");
      } else {
        // Fallback to backend static serve route instead of relative frontend route
        const cleanPath = path.replace(/^\/+/, '');
        window.open(`http://localhost:8000/${cleanPath}`, "_blank");
      }
    } catch {
      const cleanPath = path.replace(/^\/+/, '');
      window.open(`http://localhost:8000/${cleanPath}`, "_blank");
    }
  };

  return (
    <div className="w-full space-y-6 text-[#374151]">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-2 rounded-xl">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Documents</h1>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">Manage and track your vehicle documents.</p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 max-w-md">
          <FileText className="text-emerald-600 shrink-0" size={20} />
          <div className="text-[11px] leading-relaxed">
            <p className="font-extrabold text-gray-800">Keep your documents updated</p>
            <p className="text-gray-500 font-medium">Accurate documents help speed up processing.</p>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
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

      {/* TABS */}
      <div className="border-b border-gray-100 flex gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-bold pb-3 px-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'border-[#0B5B32] text-[#0B5B32] font-black'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* UPLOAD SECTION */}
      <div className="border border-dashed border-gray-200 rounded-2xl p-6 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 bg-emerald-50 text-[#0B5B32] rounded-xl flex items-center justify-center shrink-0 mx-auto">
            <UploadCloud size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">Upload New Document</h4>
            <p className="text-xs text-gray-400 font-medium">JPG, PNG, PDF (Max. 10MB)</p>
          </div>
        </div>
      </div>

      {/* TABLE */}
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
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <React.Fragment key={doc.id}>
                    <tr className="hover:bg-gray-50/40 text-xs font-semibold text-gray-700 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg shrink-0 ${doc.status === 'Rejection' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
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
                          <button
                            onClick={() => handleViewPDF(doc.rawPath)}
                            className="p-1.5 hover:bg-gray-100 rounded-md transition hover:text-gray-700 cursor-pointer"
                            title="View Document"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleViewPDF(doc.rawPath)}
                            className="p-1.5 hover:bg-gray-100 rounded-md transition hover:text-gray-700 cursor-pointer"
                            title="Download Document"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {doc.status === 'Rejection' && (
                      <tr>
                        <td colSpan={5} className="bg-red-50/40 px-4 py-2.5 border-b border-gray-100">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-red-700">
                            <AlertTriangle size={14} className="text-red-500 shrink-0" />
                            <span>{doc.rejectionReason}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs font-bold text-gray-400">
                    No documents uploaded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-emerald-50/30 border border-emerald-100 rounded-2xl p-5 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 relative bg-white border border-emerald-100 rounded-xl flex items-center justify-center text-3xl shadow-2xs shrink-0">
            📂
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5">
              <CheckCircle2 size={10} className="fill-emerald-500 stroke-white" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">Need help with documents?</h4>
            <p className="text-xs text-gray-400 font-medium max-w-md mt-0.5 leading-relaxed">
              Our support team is available to assist you with any questions.
            </p>
          </div>
        </div>

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
        </div>
      </div>

    </div>
  );
}