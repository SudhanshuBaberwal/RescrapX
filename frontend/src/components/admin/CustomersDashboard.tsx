'use client'

import React, { useState } from 'react';
import Sidebar  from './AdminSidebar';
import { Navbar } from '../navbar/AdminNavbar';

export const CustomersDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('Rahul Sharma');

  const customerKPIs = [
    { title: 'Total Customers', value: '2,456', trend: '+16% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Active Customers', value: '1,854', trend: '+18% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'New This Month', value: '356', trend: '+12% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Completed Transactions', value: '1,623', trend: '+20% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Total Payouts', value: '₹24,68,340', trend: '+22% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Disputes', value: '24', trend: '-11% vs last month', color: 'text-rose-600 bg-rose-50' },
  ];

  const customersList = [
    { id: 'CUS001245', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '9876543210', city: 'Delhi, DL', vehicles: 3, payouts: '₹1,45,000', status: 'Active', kyc: 'Verified', date: '02 Jun 2025' },
    { id: 'CUS001244', name: 'Priya Verma', email: 'priya.verma@gmail.com', phone: '9811122334', city: 'Gurgaon, HR', vehicles: 2, payouts: '₹98,500', status: 'Active', kyc: 'Verified', date: '01 Jun 2025' },
    { id: 'CUS001243', name: 'Amit Kumar', email: 'amit.kumar@gmail.com', phone: '9712345678', city: 'Noida, UP', vehicles: 1, payouts: '₹52,000', status: 'Active', kyc: 'Verified', date: '31 May 2025' },
    { id: 'CUS001242', name: 'Neha Singh', email: 'neha.singh@gmail.com', phone: '9998877665', city: 'Faridabad, HR', vehicles: 2, payouts: '₹1,12,300', status: 'Active', kyc: 'Verified', date: '30 May 2025' },
    { id: 'CUS001241', name: 'Vikram Patel', email: 'vikram.patel@gmail.com', phone: '9870012345', city: 'Jaipur, RJ', vehicles: 1, payouts: '₹61,200', status: 'Inactive', kyc: 'Pending', date: '29 May 2025' },
  ];

  return (
    // Explicit fixed layout width overrides removed
    <div className="w-full flex flex-col justify-between">
      
      {/* Workspace Canvas Container Grid View */}
      <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">
        
        {/* Header Description Label Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customers</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage and view all customers registered on RescrapX.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none font-medium text-slate-600">
              <option>01 Jun 2025 - 02 Jun 2025</option>
            </select>
          </div>
        </div>

        {/* Quick Stats Metrics Analytics Summary Row Panels */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {customerKPIs.map((kpi, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase truncate">{kpi.title}</span>
              <div className="mt-2">
                <div className="text-xl font-black text-slate-900 tracking-tight">{kpi.value}</div>
                <div className={`text-[10px] inline-block mt-1 px-1.5 py-0.5 rounded font-bold ${kpi.color}`}>
                  {kpi.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Core Search Filter Actions Container Strip Matrix */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="relative lg:col-span-2">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              <input 
                type="text" 
                placeholder="Search by name, phone, email, Customer ID..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-slate-300"
              />
            </div>
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none text-slate-600"><option>All Status</option></select>
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none text-slate-600"><option>KYC Status (All)</option></select>
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none text-slate-600"><option>All Cities</option></select>
            <button className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-lg py-2 transition-colors">
              Reset
            </button>
          </div>
        </div>

        {/* Master Detail Split Workspace Screen Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Ledger Master Query Table Wrapper Frame */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-8 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">All Customers <span className="text-slate-400 font-normal">(2,456)</span></h3>
            </div>

            {/* Data Table Horizontal Scroll Shield Container */}
            <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
              <table className="w-full text-left text-xs text-slate-600 min-w-[950px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3 w-10"><input type="checkbox" className="rounded" /></th>
                    <th className="p-3">Customer ID</th>
                    <th className="p-3">Customer Details</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">City</th>
                    <th className="p-3 text-center">Total Vehicles</th>
                    <th className="p-3">Total Payouts</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">KYC Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customersList.map((customer, index) => (
                    <tr 
                      key={index} 
                      onClick={() => setSelectedCustomer(customer.name)}
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedCustomer === customer.name ? 'bg-emerald-50/30' : ''}`}
                    >
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-500">{customer.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{customer.name}</div>
                        <div className="text-[10px] text-slate-400">{customer.email}</div>
                      </td>
                      <td className="p-3 font-medium text-slate-600">{customer.phone}</td>
                      <td className="p-3 text-slate-700">{customer.city}</td>
                      <td className="p-3 text-center font-bold text-slate-800">{customer.vehicles}</td>
                      <td className="p-3 font-bold text-slate-900">{customer.payouts}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${customer.kyc === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {customer.kyc === 'Verified' ? '✓ Verified' : '◷ Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Interactive Sidebar Context Context Detail View Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm xl:col-span-4 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{selectedCustomer}</h3>
                  <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">Active</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 block mt-0.5">CUS001245 • Member since Jun 2025</span>
              </div>
              <button className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            {/* Data Summary Counter Rows Box Grid Component */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
              <div>
                <span className="text-slate-400 text-[9px] block uppercase font-bold">Total Vehicles</span>
                <span className="font-black text-slate-900 text-sm">3</span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] block uppercase font-bold">Completed</span>
                <span className="font-black text-emerald-600 text-sm">2</span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] block uppercase font-bold">In Progress</span>
                <span className="font-black text-amber-600 text-sm">1</span>
              </div>
            </div>

            {/* Individual Profile Secondary Details Fields Info */}
            <div className="space-y-2 text-xs border-b border-slate-100 pb-4">
              <div className="flex justify-between"><span className="text-slate-400">Total Payouts</span><span className="font-bold text-slate-900">₹1,45,000</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total Transactions</span><span className="font-bold text-slate-900">2</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Active Disputes</span><span className="font-bold text-rose-600">0</span></div>
            </div>

            {/* Compliance / KYC Status Indicators Rows */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">KYC Documents</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-600">PAN Card Verification</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Verified</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                  <span className="text-slate-600">Aadhaar Card Verification</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Verified</span>
                </div>
              </div>
            </div>

            {/* Interactive Module Context Footer Drawer Panel */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2 rounded-lg transition-colors">
                Edit Profile
              </button>
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2 rounded-lg transition-colors shadow-sm">
                Send Message
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* Global Action Operations Ribbon Sticky Row Footer Layer */}
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