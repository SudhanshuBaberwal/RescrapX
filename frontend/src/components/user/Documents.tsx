'use client'

import React, { useState, useMemo } from 'react';
import {
  FileText, ShieldAlert, Clock, AlertTriangle, UploadCloud,
  Eye, Download, Search, ChevronDown, ChevronLeft, ChevronRight, Car
} from 'lucide-react';
import { useSelector as useReduxSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getAllVehicles } from '@/hooks/getAllVehicles';
import { getUserProfileData } from '@/hooks/getUserProfileData';
import axios from 'axios';

const formatDate = (dateValue?: string | Date) => {
  if (!dateValue) return 'N/A';
  return new Date(dateValue).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default function Documents() {
  getAllVehicles();
  getUserProfileData();

  const { allVehiclesData } = useReduxSelector((state: RootState) => state.vehicle);
  const { userProfileData } = useReduxSelector((state: RootState) => state.user);

  const [activeTab, setActiveTab] = useState('All Documents');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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
    loanClosure: { name: 'Sale Closure / NOC', category: 'Other Documents' },
    other: { name: 'Other Document', category: 'Other Documents' },
  };

  // Extract vehicles either from userProfileData.vehicles or fall back to allVehiclesData
  const vehiclesList = useMemo(() => {
    if (userProfileData && Array.isArray(userProfileData.vehicles) && userProfileData.vehicles.length > 0) {
      return userProfileData.vehicles;
    }
    if (Array.isArray(allVehiclesData) && allVehiclesData.length > 0) {
      return allVehiclesData;
    }
    return [];
  }, [userProfileData, allVehiclesData]);

  // Process documents dynamically from incoming API data
  const extractedDocuments = useMemo(() => {
    if (!vehiclesList || vehiclesList.length === 0) return [];
    const list: any[] = [];
    const vehiclesToProcess = selectedVehicleId === 'ALL'
      ? vehiclesList
      : vehiclesList.filter((v: any) => (v.vehicleId || v._id) === selectedVehicleId);

    vehiclesToProcess.forEach((vehicle: any) => {
      if (!vehicle) return;

      const rawDocs = vehicle.documents || {};
      const vehicleId = vehicle.vehicleId || vehicle._id || 'veh';
      const regNo = vehicle.registrationNumber || vehicle.registrationNo || 'KA01AB1234';
      const modelName = vehicle.model || vehicle.brand || 'Vehicle';

      Object.entries(rawDocs).forEach(([docKey, docObj]: [string, any]) => {
        if (!docObj) return;

        const config = docConfig[docKey] || {
          name: docKey.toUpperCase(),
          category: 'Other Documents'
        };

        const rawPath = typeof docObj === 'string'
          ? docObj
          : docObj?.path || docObj?.fullPath || docObj?.key || docObj?.url || '';

        const fileName = rawPath.split('/').pop() || `${docKey}.pdf`;

        const docStatusRaw = (typeof docObj === 'object' && docObj.status)
          ? docObj.status.toUpperCase()
          : (vehicle?.status ? vehicle.status.toUpperCase() : 'VERIFIED');

        let uiStatus = 'Verified';
        if (docStatusRaw === 'PENDING' || docStatusRaw === 'UNDER_REVIEW') uiStatus = 'Under Review';
        if (docStatusRaw === 'REJECTED') uiStatus = 'Rejection';

        list.push({
          id: `${vehicleId}-${docKey}`,
          name: config.name,
          file: fileName,
          category: config.category,
          vehicleNumber: regNo,
          vehicleName: modelName,
          status: uiStatus,
          date: formatDate(docObj?.updatedAt || vehicle?.updatedAt || new Date()),
          rawPath,
          rejectionReason: (typeof docObj === 'object' && docObj.rejectionReason) || vehicle?.rejectionReason || 'Document re-upload required.'
        });
      });
    });

    return list;
  }, [vehiclesList, selectedVehicleId, userProfileData]);

  const filteredDocuments = useMemo(() => {
    return extractedDocuments.filter((doc) => {
      const matchesTab = activeTab === 'All Documents' || doc.category === activeTab;
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, extractedDocuments, searchQuery]);

  const stats = useMemo(() => {
    const total = extractedDocuments.length;
    const verified = extractedDocuments.filter(d => d.status === 'Verified').length;
    const underReview = extractedDocuments.filter(d => d.status === 'Under Review').length;
    const rejection = extractedDocuments.filter(d => d.status === 'Rejection').length;

    return [
      { label: "Total Documents", count: total, subText: "Across all vehicles", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", icon: FileText },
      { label: "Verified", count: verified, subText: "Successfully verified", color: "text-blue-600", bg: "bg-blue-50 border-blue-100", icon: ShieldAlert },
      { label: "Under Review", count: underReview, subText: "Awaiting verification", color: "text-amber-600", bg: "bg-amber-50 border-amber-100", icon: Clock },
      { label: "Rejection", count: rejection, subText: "Requires attention", color: "text-red-600", bg: "bg-red-50 border-red-100", icon: AlertTriangle },
    ];
  }, [extractedDocuments]);

  const handleViewPDF = async (path: string) => {
    if (!path) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vehicle/register/view-document`,
        { path },
        { withCredentials: true }
      );

      let targetUrl = typeof response.data === 'string'
        ? response.data
        : response.data?.data?.url || response.data?.data || response.data?.url;

      if (targetUrl) {
        window.open(targetUrl, "_blank");
      } else {
        const cleanPath = path.replace(/^\/+/, '');
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`, "_blank");
      }
    } catch {
      const cleanPath = path.replace(/^\/+/, '');
      window.open(`${process.env.NEXT_PUBLIC_API_URL}/${cleanPath}`, "_blank");
    }
  };

  return (
    <div className="w-full space-y-5 text-[#374151] bg-[#F9FAFB] p-6 rounded-2xl min-h-screen">

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Documents</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">Manage and track your vehicle documents.</p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-100/80 rounded-xl px-3.5 py-2">
          <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
            <FileText size={16} />
          </div>
          <div className="text-[11px]">
            <p className="font-bold text-gray-800 leading-tight">Your email documents updated</p>
            <p className="text-gray-500 font-medium">You can see all documents in My Documents.</p>
          </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-full ${stat.bg} ${stat.color} border`}>
                  <Icon size={18} />
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-900 leading-none">{stat.count}</span>
                  <p className="text-xs font-bold text-gray-800 mt-1">{stat.label}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{stat.subText}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABS */}
      <div className="border-b border-gray-200 flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-bold pb-3 border-b-2 transition-all whitespace-nowrap ${activeTab === tab
                ? 'border-[#0B5B32] text-[#0B5B32]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* UPLOAD DOCUMENT CARD */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
            <UploadCloud size={20} className="text-gray-700" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Upload New Document</h4>
            <p className="text-[11px] text-gray-400 font-medium">JPG, PNG, PDF (Max. 10MB)</p>
          </div>
        </div>
        <button className="px-4 py-2 border border-emerald-600 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-50 transition cursor-pointer">
          Upload Document
        </button>
      </div>

      {/* CAR SELECTOR DROPDOWN */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-700">
            <Car size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">View Documents Car Wise</h4>
            <p className="text-[11px] text-gray-400 font-medium">Select a car to view all its documents</p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-gray-800 pr-8 focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="ALL">All Vehicles</option>
            {vehiclesList.map((v: any, index: number) => {
              const vId = v.vehicleId || v._id || index;
              const title = `${v.registrationNumber || v.registrationNo || 'KA01AB1234'} - ${v.model || v.brand || 'Vehicle'}`;
              return (
                <option key={vId} value={vId}>
                  {title}
                </option>
              );
            })}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100">
          <div>
            <h3 className="text-xs font-bold text-gray-900">Your Documents</h3>
            <p className="text-[11px] text-gray-400 font-medium">Documents across all your vehicles</p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-emerald-600 placeholder:text-gray-400"
            />
            <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Uploaded On</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <React.Fragment key={doc.id}>
                    <tr className="hover:bg-gray-50/50 text-xs text-gray-700 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md shrink-0">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">{doc.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{doc.file}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 font-medium">{doc.category}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900 leading-tight">{doc.vehicleNumber}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">{doc.vehicleName}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' :
                            doc.status === 'Under Review' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                          }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 font-medium">{doc.date}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewPDF(doc.rawPath)}
                            className="p-1.5 border border-emerald-100 hover:border-emerald-600 text-emerald-700 rounded-md transition cursor-pointer"
                            title="View Document"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleViewPDF(doc.rawPath)}
                            className="p-1.5 border border-emerald-100 hover:border-emerald-600 text-emerald-700 rounded-md transition cursor-pointer"
                            title="Download Document"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {doc.status === 'Rejection' && (
                      <tr>
                        <td colSpan={6} className="bg-red-50/40 px-4 py-2 border-b border-gray-100">
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
                  <td colSpan={6} className="py-8 text-center text-xs font-bold text-gray-400">
                    No documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-3 border-t border-gray-100 flex justify-center items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" disabled>
            <ChevronLeft size={14} />
          </button>
          <span className="w-6 h-6 bg-emerald-600 text-white rounded-md text-xs font-bold flex items-center justify-center">
            1
          </span>
          <button className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30" disabled>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}