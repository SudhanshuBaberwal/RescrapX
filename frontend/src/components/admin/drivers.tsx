'use client';

import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  UserX,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Truck,
  Calendar,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
} from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  avatar: string;
  dlNumber: string;
  phone: string;
  email: string;
  vehicleNo: string;
  vehicleType: string;
  status: 'Active' | 'On Pickup' | 'Pending' | 'Inactive';
  assignedJob: {
    id: string;
    location: string;
  } | null;
  joinedOn: string;
}

const initialDrivers: Driver[] = [
  {
    id: '1',
    name: 'Rohit Singh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    dlNumber: 'MH12 2018 1234567',
    phone: '9876543210',
    email: 'rohit.singh@email.com',
    vehicleNo: 'MH12 AB 1234',
    vehicleType: 'Tata Ace (Pickup)',
    status: 'Active',
    assignedJob: { id: '#PX1256', location: 'Mumbai, Maharashtra' },
    joinedOn: '12 May 2024',
  },
  {
    id: '2',
    name: 'Amit Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    dlNumber: 'DL08 2019 7654321',
    phone: '8765432109',
    email: 'amit.verma@email.com',
    vehicleNo: 'DL 8CA 5678',
    vehicleType: 'Mahindra Bolero',
    status: 'Active',
    assignedJob: { id: '#PX1257', location: 'Gurugram, Haryana' },
    joinedOn: '18 May 2024',
  },
  {
    id: '3',
    name: 'Sanjay Kumar',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    dlNumber: 'RJ14 2020 2233445',
    phone: '7654321098',
    email: 'sanjay.kumar@email.com',
    vehicleNo: 'RJ14 GA 6789',
    vehicleType: 'Tata 407',
    status: 'On Pickup',
    assignedJob: { id: '#PX1258', location: 'Jaipur, Rajasthan' },
    joinedOn: '20 May 2024',
  },
  {
    id: '4',
    name: 'Imran Khan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    dlNumber: 'UP16 2017 8899001',
    phone: '6543210987',
    email: 'imran.khan@email.com',
    vehicleNo: 'UP16 HT 2345',
    vehicleType: 'Eicher Pro 2059',
    status: 'Pending',
    assignedJob: null,
    joinedOn: '22 May 2024',
  },
  {
    id: '5',
    name: 'Vikram Yadav',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    dlNumber: 'HR26 2016 5566771',
    phone: '9871234560',
    email: 'vikram.yadav@email.com',
    vehicleNo: 'HR26 DK 1122',
    vehicleType: 'Ashok Leyland Dost',
    status: 'Inactive',
    assignedJob: null,
    joinedOn: '10 Apr 2024',
  },
  {
    id: '6',
    name: 'Deepak Mehra',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    dlNumber: 'PB10 2019 3344556',
    phone: '9123456780',
    email: 'deepak.mehra@email.com',
    vehicleNo: 'PB10 EF 7788',
    vehicleType: 'Force Traveller',
    status: 'Active',
    assignedJob: { id: '#PX1259', location: 'Chandigarh' },
    joinedOn: '25 May 2024',
  },
];

export default function DriversContentPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: Driver['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
          </span>
        );
      case 'On Pickup':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> On Pickup
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Inactive
          </span>
        );
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#F8FAFC] font-sans text-slate-700 p-6 space-y-6 antialiased">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Total Drivers</span>
            <div className="text-2xl font-black text-slate-900">68</div>
            <span className="text-[11px] text-slate-400">All registered drivers</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Active Drivers</span>
            <div className="text-2xl font-black text-slate-900">52</div>
            <span className="text-[11px] text-slate-400">Currently active</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Pending Verification</span>
            <div className="text-2xl font-black text-slate-900">6</div>
            <span className="text-[11px] text-slate-400">Awaiting approval</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Inactive Drivers</span>
            <div className="text-2xl font-black text-slate-900">10</div>
            <span className="text-[11px] text-slate-400">Not active</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-500">
            <UserX size={20} />
          </div>
        </div>
      </div>

      {/* DATA TABLE WRAPPER */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900 self-start sm:self-auto">Drivers List</h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search driver by name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
              <Filter size={14} /> Filter
            </button>

            <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer">
              <Plus size={14} /> Add Driver
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Vehicle / Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Job</th>
                <th className="py-3 px-4">Joined On</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
              {initialDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={driver.avatar}
                        alt={driver.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{driver.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">DL: {driver.dlNumber}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Phone size={12} className="text-slate-400" />
                        <span>{driver.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Mail size={12} className="text-slate-400" />
                        <span>{driver.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-2">
                      <Truck size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800">{driver.vehicleNo}</div>
                        <div className="text-[10px] text-slate-400">{driver.vehicleType}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">{getStatusBadge(driver.status)}</td>

                  <td className="py-3.5 px-4">
                    {driver.assignedJob ? (
                      <div>
                        <div className="font-bold text-slate-900">Pickup {driver.assignedJob.id}</div>
                        <div className="text-[10px] text-slate-400">{driver.assignedJob.location}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-slate-400">-</div>
                        <div className="text-[10px] text-slate-400">Not Assigned</div>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{driver.joinedOn}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <MoreVertical size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <div>Showing 1 to 6 of 68 drivers</div>

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center">
              1
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors">
              2
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors">
              12
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}