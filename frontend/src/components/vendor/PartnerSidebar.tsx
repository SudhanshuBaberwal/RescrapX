'use client';

import React from 'react';
import {
  LayoutDashboard, Gavel, Award, Calendar, Truck, X,
  Warehouse, FileText, CreditCard, BarChart3, Bell, HelpCircle,
  Settings, LogOut, ShieldCheck, HeadphonesIcon
} from 'lucide-react';
import { File } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
interface SidebarProps {
  onClose?: () => void;
}

export default function PartnerSidebar({ onClose }: SidebarProps) {
  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "dashboard",
      active: true,
    },
    {
      label: "Live Auctions",
      icon: Gavel,
      href: "live-auctions",
    },
    {
      label: "My Bids",
      icon: File,
      href: "my-bids",
    },
    {
      label: "Won Vehicles",
      icon: Award,
      href: "won-vehicles",
    },
    {
      label: "Incoming Vehicles",
      icon: Truck,
      href: "incoming-vehicles",
    },
    {
      label: "Processing Yard",
      icon: Warehouse,
      href: "processing-yard",
    },
    {
      label: "Documents",
      icon: FileText,
      href: "documents",
      badge: 6,
    },
    {
      label: "Payments & Settlements",
      icon: CreditCard,
      href: "payments-settlements",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "analytics",
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "notifications",
      badge: 12,
    },
    {
      label: "Support",
      icon: HelpCircle,
      href: "support",
    },
    {
      label: "Profile & Settings",
      icon: Settings,
      href: "profile-settings",
    },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "dashboard";
  return (
    <aside className="w-64 h-full bg-[#062614] text-white flex flex-col justify-between p-4 shrink-0 text-xs tracking-tight overflow-y-auto">
      <div className="space-y-5">

        {/* Sidebar Header Title with responsive close trigger */}
        <div className="flex items-center justify-between px-2 pt-2">
          <div>
            <span className="text-xl font-black block tracking-tight">Rescrap<span className="text-[#3CD87A]">X</span></span>
            <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-400 block -mt-1 opacity-80">Partner Portal</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-emerald-400/60 hover:text-white p-1.5 rounded-lg hover:bg-emerald-950/50 cursor-pointer">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Profile Details Block */}
        <div className="bg-[#0A381E] border border-emerald-900/40 rounded-xl p-3 space-y-2">
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 bg-emerald-800 text-emerald-300 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">GA</div>
            <div className="min-w-0">
              <h4 className="font-black leading-tight text-gray-100 truncate">GreenAuto Recyclers Pvt. Ltd.</h4>
              <div className="inline-flex items-center gap-1 text-[8px] bg-emerald-950 text-emerald-400 font-bold px-1.5 py-0.5 rounded-sm border border-emerald-900 mt-1">
                <ShieldCheck size={10} /> <span>Verified Partner</span>
              </div>
            </div>
          </div>
          <p className="text-[9px] text-emerald-500/70 font-mono tracking-wider pt-1 border-t border-emerald-900/50">Partner ID: RX987654</p>
        </div>

        {/* Navigation Link Lists */}
        <nav className="space-y-0.5">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;

            const isActive = activeTab === item.href;

            return (
              <Link
                key={idx}
                href={`?tab=${item.href}`}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all group ${isActive
                  ? "bg-[#0B5B32] text-white shadow-3xs"
                  : "text-emerald-300/60 hover:text-white hover:bg-emerald-950/40"
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={14}
                    className={
                      isActive
                        ? "text-white"
                        : "text-emerald-400/50 group-hover:text-emerald-300"
                    }
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 font-black rounded-full shrink-0 ${isActive
                      ? "bg-white text-[#0B5B32]"
                      : "bg-red-600 text-white"
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Support Box widget footer section */}
      <div className="space-y-3 pt-6 border-t border-emerald-950/60 mt-6">
        <div className="bg-[#0A381E] border border-emerald-900/30 p-3 rounded-xl space-y-2">
          <p className="font-black text-gray-200 text-[10px]">Need Help?</p>
          <p className="text-[9px] text-emerald-400/60 font-medium leading-tight">Our partner support channels are active for assistance.</p>
          <button className="w-full bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all text-[10px] cursor-pointer">
            <HeadphonesIcon size={12} /> <span>Contact Support</span>
          </button>
        </div>

        <button className="w-full flex items-center gap-3 px-3 py-2 text-emerald-300/50 hover:text-white font-bold transition-all rounded-lg hover:bg-red-950/20 cursor-pointer">
          <LogOut size={14} /> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}