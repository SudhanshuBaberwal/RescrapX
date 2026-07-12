'use client'

import React, { useState } from 'react';
import  Sidebar  from './AdminSidebar';
import { Navbar } from '../navbar/AdminNavbar';

export const MarketingCMS: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSubTab, setCurrentSubTab] = useState('Overview');

  const subTabs = ['Overview', 'Pages', 'Banners', 'Blog Posts', 'FAQs', 'Media Library', 'Website Settings', 'Campaigns'];

  const cmsKPIs = [
    { title: 'Total Pages', value: '28', sub: '▲ 7.69% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Banners Active', value: '12', sub: '▲ 20% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Blog Posts', value: '36', sub: '▲ 12.5% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'FAQs', value: '24', sub: '▲ 14.3% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Active Campaigns', value: '5', sub: '▲ 25% vs last month', color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Total Page Views (This Week)', value: '45,672', sub: '▲ 18.6% vs last week', color: 'text-emerald-600 bg-emerald-50' },
  ];

  const websitePages = [
    { title: 'Home Page', slug: '/', status: 'Published', date: '02 Jun 2025, 10:15 AM', author: 'Super Admin' },
    { title: 'About Us', slug: '/about-us', status: 'Published', date: '30 May 2025, 04:20 PM', author: 'Super Admin' },
    { title: 'How It Works', slug: '/how-it-works', status: 'Published', date: '28 May 2025, 11:40 AM', author: 'Content Manager' },
    { title: 'Services', slug: '/services', status: 'Published', date: '25 May 2025, 09:30 AM', author: 'Content Manager' },
    { title: 'Contact Us', slug: '/contact-us', status: 'Published', date: '24 May 2025, 02:15 PM', author: 'Super Admin' },
  ];

  const campaigns = [
    { name: 'Summer Scrap Fest 2025', duration: '01 Jun 2025 - 30 Jun 2025', status: 'Active', sColor: 'text-emerald-700 bg-emerald-50 border-emerald-100', views: '12,456', leads: '342' },
    { name: 'RC Deregistration Awareness', duration: '15 May 2025 - 15 Jun 2025', status: 'Active', sColor: 'text-emerald-700 bg-emerald-50 border-emerald-100', views: '8,932', leads: '215' },
    { name: 'WhatsApp Lead Gen May', duration: '01 May 2025 - 31 May 2025', status: 'Completed', sColor: 'text-purple-700 bg-purple-50 border-purple-100', views: '15,210', leads: '523' },
  ];

  const activeBanners = [
    { name: 'Home Banner 01', type: 'Homepage Hero', updated: '02 Jun 2025', author: 'Super Admin', desc: 'Get the Best Price for Your Scrap Vehicle' },
    { name: 'Home Banner 02', type: 'Homepage Section', updated: '30 May 2025', author: 'Content Manager', desc: 'Free Pickup Pan India' },
    { name: 'Service Banner 01', type: 'Services Page', updated: '28 May 2025', author: 'Content Manager', desc: 'RC Deregistration Made Easy' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased w-full overflow-x-hidden">
      {/* 1. Global Shell Navigation Context Layout Anchor */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Structural Layout View Canvas Frame */}
      <div className="flex flex-col lg:pl-[376px] min-h-screen transition-all duration-300 w-full">
        
        {/* 2. Platform Upper Navigation Command Ribbon Header */}
        <Navbar onMenuToggle={() => setSidebarOpen(true)} />

        {/* Core Workspace Routing Module Canvas Layout */}
        <main className="flex-1 p-4 md:p-6 space-y-6 w-full mx-auto">
          
          {/* Main Title Metadata Overview Block Layout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Marketing & CMS</h2>
              <p className="text-xs text-slate-500 mt-0.5">Manage website content, marketing campaigns and digital assets.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <select className="bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none font-medium text-slate-600 shadow-sm">
                <option>01 Jun 2025 - 02 Jun 2025</option>
              </select>
            </div>
          </div>

          {/* Quick Metrics Multi-Row Analytics Summary grid panels */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {cmsKPIs.map((kpi, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <span className="text-[11px] font-bold tracking-wide text-slate-400 uppercase truncate">{kpi.title}</span>
                <div className="mt-2">
                  <div className="text-lg font-black text-slate-900 tracking-tight">{kpi.value}</div>
                  <div className={`text-[9px] inline-block mt-1 px-1.5 py-0.5 rounded font-bold ${kpi.color}`}>
                    {kpi.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sub Navigation Submenu Horizontal Scroll Strip Segment */}
          <div className="border-b border-slate-200 overflow-x-auto whitespace-nowrap flex gap-6 scrollbar-none">
            {subTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setCurrentSubTab(tab)}
                className={`pb-3 text-xs font-bold transition-all border-b-2 px-1 ${
                  currentSubTab === tab ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Top Half Section: Split System Module Matrix View Component */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Website Pages Content Ledger View Board */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-7 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Website Pages</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Manage and update static pages on the website.</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-sm self-start sm:self-auto shrink-0">
                  + Add New Page
                </button>
              </div>

              {/* Safe Overflow Horizontal Scroll Grid Frame Layout Container */}
              <div className="overflow-x-auto w-full border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs text-slate-600 min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3">Page Title</th>
                      <th className="p-3">URL Slug</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Last Updated</th>
                      <th className="p-3">Updated By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {websitePages.map((page, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-bold text-slate-800">{page.title}</td>
                        <td className="p-3 font-mono text-slate-500 text-[11px]">{page.slug}</td>
                        <td className="p-3">
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-100">
                            {page.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">{page.date}</td>
                        <td className="p-3 text-slate-600 font-medium">{page.author}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Marketing Campaigns Sidebar Split Container Card Block */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Marketing Campaigns</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">View and manage marketing campaigns.</p>
                </div>
                <button className="border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-sm shrink-0">
                  + New Campaign
                </button>
              </div>

              {/* Stacked Vertical Row Module Framework list block */}
              <div className="space-y-3">
                {campaigns.map((camp, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{camp.name}</h4>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-black border uppercase ${camp.sColor}`}>
                          {camp.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400">{camp.duration}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">Views</span>
                        <span className="text-xs font-black text-slate-900">{camp.views}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase">Leads</span>
                        <span className="text-xs font-black text-emerald-600">{camp.leads}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Lower Half Section Layout Frame System row blocks block */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Dynamic Section: Active Banners Grid Visual Cards Display Frame */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-7 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Active Banners</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Manage homepage and inner page banners.</p>
                </div>
                <button className="text-emerald-600 hover:text-emerald-700 font-bold text-xs">View All Banners →</button>
              </div>

              {/* Graphic Mock Card Flexboard Layout Grid System mapping block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeBanners.map((banner, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col justify-between hover:shadow-md transition-shadow group">
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-4 min-h-[90px] flex flex-col justify-between relative text-white">
                      <span className="text-[9px] uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded font-bold self-start">{banner.type}</span>
                      <h4 className="text-xs font-black leading-tight mt-2 drop-shadow-sm line-clamp-2">{banner.desc}</h4>
                    </div>
                    <div className="p-3 space-y-1 text-[11px]">
                      <div className="font-bold text-slate-800 truncate">{banner.name}</div>
                      <div className="text-slate-400 text-[10px]">Updated: {banner.updated}</div>
                      <div className="text-slate-500 font-medium text-[10px] truncate">By {banner.author}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content Column: System Activity Tracking Operational Stream Layout logs block */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm xl:col-span-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Recent Activity Logs</h3>
                <button className="text-slate-400 hover:text-slate-600 font-bold text-xs">View All Activity →</button>
              </div>

              {/* Operational Stream Timeline System Rows Trackers lists segment */}
              <div className="space-y-3.5 text-xs">
                <div className="flex gap-3 justify-between items-start bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-slate-700 font-medium truncate">Page <span className="font-bold text-slate-900">"Cancellation Policy"</span> created as draft</p>
                    <span className="text-[10px] text-slate-400 font-medium block">by Content Manager</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 text-right shrink-0">01 Jun • 05:45 PM</span>
                </div>
                <div className="flex gap-3 justify-between items-start bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-slate-700 font-medium truncate">Banner <span className="font-bold text-slate-900">"Summer Offer"</span> updated</p>
                    <span className="text-[10px] text-slate-400 font-medium block">by Super Admin</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 text-right shrink-0">01 Jun • 03:20 PM</span>
                </div>
                <div className="flex gap-3 justify-between items-start bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-slate-700 font-medium truncate">Blog post <span className="font-bold text-slate-900">"Benefits of Scrapping"</span> published</p>
                    <span className="text-[10px] text-slate-400 font-medium block">by Content Manager</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 text-right shrink-0">31 May • 11:15 AM</span>
                </div>
              </div>
            </div>

          </div>

        </main>

        {/* Global Infrastructure Routing Shell Sticky Bottom Strip View Layer */}
        <footer className="mt-auto border-t border-slate-200 bg-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
          <p>© 2026 RescrapX. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Documentation portal manuals</a>
          </div>
        </footer>

      </div>
    </div>
  );
};