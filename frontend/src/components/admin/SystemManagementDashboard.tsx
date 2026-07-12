import React, { useState } from 'react';

export default function SystemManagementDashboard() {
  const [activeTab, setActiveTab] = useState('User Management');

  // Core Data sets modeled exactly off your system design layout
  const metrics = [
    { label: 'Total Users', value: '256', sub: '+ 12.5% vs last 30 days', trend: 'up' },
    { label: 'Active Users', value: '198', sub: '+ 15.3% vs last 30 days', trend: 'up' },
    { label: 'User Roles', value: '7', sub: 'No change', trend: 'neutral' },
    { label: 'System Uptime', value: '99.98%', sub: '▲ 0.02% vs last 30 days', trend: 'up' },
    { label: 'Security Score', value: '92 / 100', sub: 'Good', trend: 'neutral' },
    { label: 'Active Sessions', value: '34', sub: 'View all sessions →', trend: 'link' },
  ];

  const users = [
    { initials: 'SA', name: 'Super Admin', isYou: true, role: 'Super Admin', partner: 'RescrapX', email: 'super.admin@rescrapx.com', phone: '+91 98765 43210', status: 'Active', login: '02 Jun 2025 10:23 AM' },
    { initials: 'AM', name: 'Amit Kumar', isYou: false, role: 'Operations Manager', partner: 'RescrapX', email: 'amit.kumar@rescrapx.com', phone: '+91 98765 12345', status: 'Active', login: '02 Jun 2025 09:15 AM' },
    { initials: 'NV', name: 'Neha Verma', isYou: false, role: 'Finance Manager', partner: 'RescrapX', email: 'neha.verma@rescrapx.com', phone: '+91 98765 67890', status: 'Active', login: '02 Jun 2025 08:45 AM' },
    { initials: 'RS', name: 'Rahul Sharma', isYou: false, role: 'Support Manager', partner: 'RescrapX', email: 'rahul.sharma@rescrapx.com', phone: '+91 98765 54321', status: 'Active', login: '01 Jun 2025 06:30 PM' },
    { initials: 'AP', name: 'Arjun Patel', isYou: false, role: 'RVSF Partner Admin', partner: 'Green Auto RVSF', email: 'arjun.patel@greenauto.com', phone: '+91 98760 11122', status: 'Active', login: '01 Jun 2025 05:20 PM' },
  ];

  const roles = [
    { title: 'Super Admin', count: '1 User', tag: 'System' },
    { title: 'Operations Manager', count: '3 Users' },
    { title: 'Finance Manager', count: '2 Users' },
    { title: 'Support Manager', count: '2 Users' },
    { title: 'RVSF Partner Admin', count: '28 Users' },
    { title: 'Content Manager', count: '2 Users' },
    { title: 'Viewer', count: '218 Users' },
  ];

  const liveSessions = [
    { user: 'Super Admin', os: 'Chrome on Windows', location: 'Delhi, India', time: '10:23 AM', status: 'online' },
    { user: 'Amit Kumar', os: 'Chrome on Windows', location: 'Delhi, India', time: '09:15 AM', status: 'online' },
    { user: 'Neha Verma', os: 'Safari on MacOS', location: 'Mumbai, India', time: '08:45 AM', status: 'online' },
    { user: 'Rahul Sharma', os: 'Chrome on Android', location: 'Pune, India', time: '06:30 PM', status: 'online' },
    { user: 'Arjun Patel', os: 'Chrome on Windows', location: 'Bangalore, India', time: '05:20 PM', status: 'offline' },
  ];

  const systemLogs = [
    { time: '02 Jun 2025, 10:23 AM', user: 'Super Admin', action: 'Login', module: 'Authentication', ip: '103.123.45.67' },
    { time: '02 Jun 2025, 09:45 AM', user: 'Amit Kumar', action: 'Updated Booking Status', module: 'Operations', ip: '103.123.45.68' },
    { time: '02 Jun 2025, 09:15 AM', user: 'Neha Verma', action: 'Approved Payment', module: 'Finance', ip: '103.123.45.69' },
    { time: '02 Jun 2025, 08:30 AM', user: 'Rahul Sharma', action: 'Resolved Ticket', module: 'Support', ip: '103.123.45.70' },
    { time: '01 Jun 2025, 11:05 PM', user: 'Arjun Patel', action: 'Uploaded Documents', module: 'Compliance', ip: '103.123.45.71' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-sans antialiased w-full">
      <div className="p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto space-y-6">
        
        {/* Module Header Segment */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">System Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage system settings, users, roles, permissions and configurations.</p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-600 shadow-xs outline-none cursor-pointer">
              <option>01 Jun 2025 - 02 Jun 2025</option>
            </select>
          </div>
        </div>

        {/* Global Overview Analytics Strips */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {metrics.map((m, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-sm transition-all duration-200">
              <span className="text-[11px] font-bold tracking-tight text-slate-400 uppercase truncate">{m.label}</span>
              <div className="mt-2.5">
                <div className="text-xl font-black text-slate-900 tracking-tight">{m.value}</div>
                <div className={`text-[10px] font-bold mt-1 ${
                  m.trend === 'up' ? 'text-emerald-600' : m.trend === 'link' ? 'text-emerald-700 underline cursor-pointer' : 'text-slate-400'
                }`}>
                  {m.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top-Level Horizontal Category Tab Bar Control */}
        <div className="border-b border-slate-200 overflow-x-auto whitespace-nowrap flex gap-6 scrollbar-none">
          {['User Management', 'Roles & Permissions', 'System Settings', 'Configurations', 'Security', 'Integrations', 'Backup & Recovery', 'Audit Logs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 relative ${
                activeTab === tab ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Responsive Dashboard Two Column Grid Layout Framework */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* LEFT WING: Core System Logs, User Lists & Configurations */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* User Management Component Card Grid */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">User Management</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Manage admin users and their access to the system.</p>
                </div>
                <button className="bg-white border border-emerald-600 hover:bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-colors self-start sm:self-auto">
                  + Add New User
                </button>
              </div>

              {/* Filters Matrix Frame */}
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                <div className="flex flex-col gap-1 sm:col-span-1 md:col-span-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Search User</label>
                  <input type="text" placeholder="Search by name, email or phone" className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Role</label>
                  <select className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"><option>All Roles</option></select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-slate-400 text-[10px] uppercase">Status</label>
                  <select className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"><option>All Status</option></select>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-bold text-slate-400 text-[10px] uppercase">RVSF Partner</label>
                    <select className="bg-white border border-slate-200 rounded-lg p-2 text-slate-600 outline-none"><option>All Partners</option></select>
                  </div>
                  <button className="border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold px-2.5 py-2 rounded-lg text-xs transition-colors">Reset</button>
                </div>
              </div>

              {/* Dynamic User Roster Ledger Table Viewport container */}
              <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600 min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="p-3">User</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">RVSF Partner</th>
                      <th className="p-3">Email / Phone</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3">Last Login</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-3 flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-[10px] tracking-tighter shrink-0">
                            {row.initials}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-[12px]">{row.name}</span>
                            {row.isYou && <span className="ml-1.5 bg-emerald-100 text-emerald-800 font-bold text-[9px] px-1 py-0.2 rounded">You</span>}
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-700">{row.role}</td>
                        <td className="p-3 text-slate-500 font-medium">{row.partner}</td>
                        <td className="p-3 font-medium">
                          <div className="text-slate-700">{row.email}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{row.phone}</div>
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">
                            {row.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-medium whitespace-nowrap">{row.login}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button className="text-slate-400 hover:text-slate-600 text-xs">✏️</button>
                            <button className="text-slate-400 hover:text-slate-600 font-black text-sm">⋮</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Info Matrix Bar */}
              <div className="flex items-center justify-between text-xs pt-1.5 text-slate-400">
                <span>Showing 1 to 5 of 256 users</span>
                <div className="flex items-center gap-1 font-bold">
                  <button className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-600">1</button>
                  <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">2</button>
                  <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">3</button>
                  <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">4</button>
                  <span className="px-0.5 text-slate-300">...</span>
                  <button className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50">52</button>
                </div>
              </div>
            </div>

            {/* Split Sub-Settings Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box 1: Global System Configuration Access Points */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">System Settings</h4>
                  <p className="text-[11px] text-slate-400">Configure global system preferences.</p>
                </div>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: 'General Settings', desc: 'Manage basic system configurations' },
                    { label: 'Email Settings', desc: 'Manage email templates and notifications' },
                    { label: 'SMS Settings', desc: 'Configure SMS templates and providers' },
                    { label: 'Payment Settings', desc: 'Configure payment methods and settings' },
                    { label: 'Application Settings', desc: 'Manage application behavior and preferences' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors cursor-pointer text-xs">
                      <div>
                        <div className="font-bold text-slate-700">{s.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                      </div>
                      <span className="text-emerald-600 font-bold text-[11px] hover:underline shrink-0">Configure →</span>
                    </div>
                  ))}
                </div>
                <button className="text-emerald-600 hover:underline text-xs font-bold pt-1 block">View all system settings →</button>
              </div>

              {/* Box 2: Core Business Rule Engine Parameters Matrix */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Configurations</h4>
                  <p className="text-[11px] text-slate-400">Manage business rules and configurations.</p>
                </div>
                <div className="space-y-2.5 pt-1">
                  {[
                    { label: 'Booking Configurations', desc: 'Configure booking rules and limits' },
                    { label: 'Bidding Configurations', desc: 'Configure bidding rules and timing' },
                    { label: 'Vehicle Configurations', desc: 'Configure vehicle categories and rules' },
                    { label: 'Document Configurations', desc: 'Configure document requirements' },
                    { label: 'Pricing Configurations', desc: 'Configure charges and pricing rules' },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors cursor-pointer text-xs">
                      <div>
                        <div className="font-bold text-slate-700">{c.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{c.desc}</div>
                      </div>
                      <span className="text-emerald-600 font-bold text-[11px] hover:underline shrink-0">Configure →</span>
                    </div>
                  ))}
                </div>
                <button className="text-emerald-600 hover:underline text-xs font-bold pt-1 block">View all configurations →</button>
              </div>

            </div>

            {/* Comprehensive Real-time System Audit Logging Line Items Container */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">System Logs (Latest)</h3>
              </div>
              <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600 min-w-[750px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="p-3">Time</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Module</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {systemLogs.map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50/40">
                        <td className="p-3 text-slate-500 whitespace-nowrap">{log.time}</td>
                        <td className="p-3 text-slate-800 font-bold">{log.user}</td>
                        <td className="p-3 text-slate-600">{log.action}</td>
                        <td className="p-3 text-slate-500">{log.module}</td>
                        <td className="p-3 font-mono text-slate-400 text-[11px]">{log.ip}</td>
                        <td className="p-3 text-center">
                          <span className="text-emerald-600 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded">Success</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>


          {/* RIGHT WING: Roles Distribution, Live Active User Sessions & Data Recovery Controls */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Component 1: Roles Access Control Roster Profile breakdown metrics list */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Roles & Permissions</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Manage user roles and their permissions.</p>
                </div>
                <button className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-2.5 py-1 rounded-md transition-all shrink-0">
                  Manage Roles
                </button>
              </div>

              <div className="divide-y divide-slate-100/70 space-y-2">
                {roles.map((role, i) => (
                  <div key={i} className="flex items-center justify-between text-xs pt-2 first:pt-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                      <span className="font-bold text-slate-700">{role.title}</span>
                      {role.tag && <span className="bg-blue-50 text-blue-600 font-bold text-[9px] px-1 rounded border border-blue-100">{role.tag}</span>}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-medium">
                      <span>{role.count}</span>
                      <button className="hover:text-slate-600 font-bold text-sm px-1">⋮</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-emerald-600 hover:underline text-xs font-bold block pt-1">View all roles & permissions →</button>
            </div>

            {/* Component 2: Realtime Interactive Live State Operational Session Checklist */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900">Active Sessions</h3>
                <button className="text-slate-400 hover:text-slate-600 text-xs font-bold">View all</button>
              </div>

              <div className="space-y-3">
                {liveSessions.map((session, i) => (
                  <div key={i} className="flex items-start justify-between text-xs bg-slate-50/50 p-2.5 rounded-lg border border-slate-100/80">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${session.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        <p className="font-bold text-slate-800 truncate">{session.user}</p>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{session.os}</p>
                    </div>
                    <div className="text-right text-[11px] font-medium shrink-0 space-y-0.5 pl-2">
                      <div className="text-slate-700">{session.location}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{session.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="text-emerald-600 hover:underline text-xs font-bold block pt-1">View all sessions →</button>
            </div>

            {/* Component 3: Storage Maintenance Backup Schedule Console Module */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Backup & Recovery</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Manage system backups and restore data.</p>
              </div>

              <div className="space-y-2.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Last Backup</span><span className="font-bold text-slate-700">02 Jun 2025, 02:30 AM</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Next Backup</span><span className="font-bold text-slate-700">03 Jun 2025, 02:30 AM</span></div>
                <div className="flex justify-between items-center border-t border-slate-200/50 pt-2"><span className="text-slate-400 font-medium">Backup Size</span><span className="font-mono font-bold text-slate-800">2.45 GB</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400 font-medium">Total Backups</span><span className="font-mono font-bold text-slate-800">28</span></div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-center shadow-2xs transition-colors">
                  ☁️ Backup Now
                </button>
                <button className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2 rounded-lg text-center transition-colors">
                  🔄 Restore Data
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}