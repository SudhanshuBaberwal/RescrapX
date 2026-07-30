'use client'

import axios from "axios";
import React, { useState } from 'react';
import Sidebar from './AdminSidebar';
import { Navbar } from '../navbar/AdminNavbar';
import { getAllPartners } from '@/hooks/getAllPartners';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const RVSFPartners: React.FC = () => {
  getAllPartners()

  const { allPartnersData } = useSelector((state: RootState) => state.admin)
  // console.log(allPartnersData)
  // Set selectedPartner to null by default so panel stays closed initially
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);

  const activePartner = allPartnersData.filter((partner) => partner.partnerStatus === "APPROVED")
  const onHoldPartner = allPartnersData.filter((partner) => partner.partnerStatus === "UNDER_REVIEW")
  const pendingPartner = allPartnersData.filter((partner) => partner.partnerStatus === "PENDING")

  const partnerKPIs = [
    { title: 'Total Partners', value: `${allPartnersData.length}`, trend: '+10% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Active Partners', value: `${activePartner.length}`, trend: '+12% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'On Hold', value: `${onHoldPartner.length}`, trend: '-7% vs last month', color: 'text-red-600 bg-red-50' },
    { title: 'Pending Applications', value: `${pendingPartner.length}`, trend: '+22% vs last month', color: 'text-purple-600 bg-purple-50' },
    { title: 'Total Completed Jobs', value: '1,248', trend: '+18% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Total Payouts (MTD)', value: '₹2,46,85,340', trend: '+16% vs last month', color: 'text-emerald-600 bg-emerald-50' },
  ];

  // Helper function to handle opening PDF documents in a new browser tab

  const handleViewPDF = async (path: string) => {
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/auth/admin/document/view",
        {
          path,
        },
        {
          withCredentials: true,
        }
      );
      window.open(data.data, "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  // List mapping all 6 partner verification documents
  const getPartnerDocuments = (docsObj: any) => [
    {
      name: "RVSF",
      url: docsObj?.rvsfCertificate,
    },
    {
      name: "GST",
      url: docsObj?.gstCertificate,
    },
    {
      name: "Pollution",
      url: docsObj?.pollutionLicense,
    },
    {
      name: "PAN",
      url: docsObj?.panCard,
    },
    {
      name: "Aadhar",
      url: docsObj?.aadharCard,
    },
    {
      name: "Bank",
      url: docsObj?.cancelledCheque,
    },
  ];

  return (
    <div className="w-full flex flex-col justify-between">

      {/* Dynamic Canvas Container View area */}
      <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">

        {/* Action Ribbon Area */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900">RVSF Partners</h2>
            <p className="text-xs text-slate-500">Manage and monitor all RVSF partners registered on RescrapX.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button className="border border-slate-200 bg-white text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-1.5">
              📤 Export <span className="text-[10px] text-slate-400">▼</span>
            </button>
            <button className="bg-emerald-600 text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm">
              + Add Partner
            </button>
          </div>
        </div>

        {/* Core Portal Micro Metrics Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {partnerKPIs.map((kpi, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase truncate">{kpi.title}</span>
              <div className="mt-2">
                <div className="text-xl font-bold text-slate-900 tracking-tight">{kpi.value}</div>
                <div className={`text-[10px] inline-block mt-1 px-1.5 py-0.5 rounded font-medium ${kpi.color}`}>
                  {kpi.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Multi-Query Context Search Filter Matrix */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            <div className="relative lg:col-span-2">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Search by name, GST, city, state..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-slate-300"
              />
            </div>
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"><option>All Status</option></select>
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"><option>Verification (All)</option></select>
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"><option>All States</option></select>
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"><option>All Cities</option></select>
            <button className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-xs rounded-lg py-2 transition-colors">
              Reset
            </button>
          </div>
        </div>

        {/* Split Screen Master-Detail Workspace Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {/* Left Ledger Master View Grid Table */}
          <div className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4 transition-all duration-300 ${selectedPartner ? 'xl:col-span-8' : 'xl:col-span-12'}`}>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">All Partners <span className="text-slate-400 font-normal">({allPartnersData.length})</span></h3>
            </div>

            {/* Data Table Scroll View Enclosure Mask */}
            <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs text-slate-600 min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="p-3 w-10"><input type="checkbox" className="rounded" /></th>
                    <th className="p-3">Partner Details</th>
                    <th className="p-3">GST Number</th>
                    <th className="p-3">State / City</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Registration Number</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allPartnersData.map((partner, index) => {
                    const isSelected = selectedPartner && selectedPartner._id === partner._id;
                    return (
                      <tr
                        key={partner._id || index}
                        onClick={() => setSelectedPartner(partner)}
                        className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${isSelected ? 'bg-emerald-50/30' : ''}`}
                      >
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-slate-800">{partner.fullName}</div>
                          <div className="text-[10px] text-slate-400">{partner.company?.companyName} • {partner.phoneNumber}</div>
                        </td>
                        <td className="p-3 font-mono text-slate-500">{partner.company?.gstNumber || 'N/A'}</td>
                        <td className="p-3">
                          <div className="font-medium text-slate-700">{partner.company?.state || 'N/A'}</div>
                          <span className="text-[10px] text-slate-400">{partner.company?.city || 'N/A'}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${partner.partnerStatus === "APPROVED"
                            ? 'bg-emerald-100 text-emerald-700'
                            : partner.partnerStatus === "UNDER_REVIEW"
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                            }`}>
                            {partner.partnerStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-600 font-mono">
                            {partner.company?.registrationNumber || 'N/A'}
                          </span>
                        </td>
                        <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedPartner(partner)}
                            className="border border-slate-200 bg-white rounded px-2.5 py-1 text-[11px] font-semibold hover:bg-slate-50"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Detailed Panel View Context Card */}
          {selectedPartner && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm xl:col-span-4 space-y-5 sticky top-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{selectedPartner.fullName}</h3>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${selectedPartner.partnerStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                      {selectedPartner.partnerStatus}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    {selectedPartner.company?.registrationNumber || 'RVSF-NODE'} • {selectedPartner.company?.companyName || 'RVSF Partner'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1 rounded-md hover:bg-slate-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Dynamic Metrics Panel Rows */}
              <div className="grid grid-cols-2 gap-3.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Completed Jobs</span>
                  <span className="font-bold text-slate-900 text-sm">26</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Success Rate</span>
                  <span className="font-bold text-slate-900 text-sm">96%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Total Payout</span>
                  <span className="font-bold text-emerald-600 text-sm">₹72,115</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-medium">Avg Rating</span>
                  <span className="font-bold text-slate-900 text-sm">⭐ 4.6</span>
                </div>
              </div>

              {/* 6 MANDATORY PDF DOCUMENTS VERIFICATION CHECKLIST */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Verification Documents (6 PDFs)
                  </h4>
                  <span className="text-[10px] font-medium text-slate-400">Click to preview</span>
                </div>

                <div className="space-y-2 text-xs">
                  {getPartnerDocuments(selectedPartner.documents).map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 transition-all cursor-pointer group"
                      onClick={() => {
                        if (doc.url?.path) {
                          handleViewPDF(doc.url.path);
                        } else {
                          alert("Document not uploaded");
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold text-xs">📄</span>
                        <span className="text-slate-700 font-medium group-hover:text-emerald-700 transition-colors">
                          {doc.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {selectedPartner.partnerStatus === "APPROVED" ? (
                          <span className="text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px]">
                            Verified
                          </span>
                        ) : (
                          <button className="text-emerald-600 hover:text-emerald-700 font-bold text-[10px] bg-white border border-slate-200 group-hover:border-emerald-500 px-2 py-0.5 rounded shadow-2xs transition-colors flex items-center gap-1">
                            <span>Open PDF</span>
                            <span className="text-[8px]">↗</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: If UNDER_REVIEW, show Approve / Reject controls */}
              <div className="pt-3 border-t border-slate-100 flex gap-2">
                {selectedPartner.partnerStatus === "UNDER_REVIEW" || selectedPartner.partnerStatus === "PENDING" ? (
                  <>
                    <button className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs py-2 rounded-lg transition-colors">
                      Reject Partner
                    </button>
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-sm shadow-emerald-600/10">
                      Approve & Verify
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 rounded-lg transition-colors">
                      Edit Partner
                    </button>
                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-sm shadow-emerald-600/10">
                      More Actions
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Global Batch Update Footer System Row bar */}
      <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 w-full shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">0 Selected</span>
          <select className="bg-slate-50 border border-slate-200 rounded p-1 text-xs outline-none text-slate-600"><option>Bulk Actions</option></select>
          <button className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-[11px] px-3 py-1.5 rounded transition-colors">Apply</button>
        </div>
        <p className="text-[11px] text-slate-400">© 2026 RescrapX. All rights reserved.</p>
      </footer>

    </div>
  );
};