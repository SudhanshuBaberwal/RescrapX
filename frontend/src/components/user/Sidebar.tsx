'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, FileText, Settings,
  HelpCircle, LogOut, LogIn, ShieldCheck,
  Wallet, User
} from 'lucide-react';
import { useToast } from '@/lib/ui/toast/ToastContext';
import { logout } from '@/services/auth.service';
import queryClient from '@/lib/query/queryClient';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const { userData } = useSelector((state: RootState) => state.user);
  const currentTab = searchParams.get("tab") || "overview";

  const sidebarItems = [
    { title: "Overview", href: "overview", icon: LayoutDashboard },
    { title: "My Bookings", href: "bookings", icon: Package },
    { title: "My Documents", href: "documents", icon: FileText },
    { title: "Payments", href: "payment", icon: Wallet },
    { title: "Support & Help", href: "support", icon: HelpCircle },
    { title: "Settings", href: "settings", icon: Settings },
  ];

  const handleAuthAction = async () => {
    if (userData) {
      try {
        await logout();
        queryClient.removeQueries({ queryKey: ["current-user"] });
        window.location.href = "/login";
      } catch (error: any) {
        showToast(error?.message || "Logout failed. Please try again.", "error");
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      {/* Mobile Horizontal Pill Scrollbar */}
      <div className="lg:hidden w-full mt-1 mb-3 py-1 border-b border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = currentTab === item.href;

          return (
            <Link
              key={item.href}
              href={`?tab=${item.href}`}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                active
                  ? "bg-[#0B5B32] text-white shadow-xs"
                  : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/60"
              }`}
            >
              <Icon size={15} className={active ? "text-white" : "text-gray-500"} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      {/* Fixed Height Sidebar Container */}
      <div className="hidden lg:flex flex-col justify-between w-full h-[calc(100vh-8rem)] bg-white border border-gray-100 rounded-2xl p-5 shadow-xs">

        {/* Top & Middle Section */}
        <div className="space-y-4 overflow-y-auto no-scrollbar pr-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#0B5B32] border border-emerald-200 shrink-0 font-bold">
              {userData?.fullName ? (
                <span className="text-base font-black uppercase">{userData.fullName[0]}</span>
              ) : (
                <User className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-base font-black text-gray-900 leading-tight truncate">
                {userData?.fullName || "Guest User"}
              </h3>
              <p className="text-xs font-semibold text-gray-400 truncate mt-0.5">
                {userData?.email || "Welcome to Rescrap X"}
              </p>

              {userData ? (
                <div className="inline-flex items-center gap-1 bg-[#E6F4EA] text-[#0B5B32] text-[10px] font-black px-2 py-0.5 rounded-md mt-1.5">
                  <span>Verified Account</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-md mt-1.5">
                  <span>Not Logged In</span>
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Navigation Stack */}
          <nav className="space-y-1.5 relative">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.href;

              return (
                <Link
                  key={item.href}
                  href={`?tab=${item.href}`}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-colors duration-300 relative select-none group ${
                    active ? "text-[#0B5B32] font-black" : "text-gray-600 font-bold hover:text-gray-900"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute inset-0 bg-[#E6F4EA]/80 rounded-xl -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {active && (
                    <motion.div
                      layoutId="activeSidebarLine"
                      className="absolute left-0 top-3 bottom-3 w-1 bg-[#0B5B32] rounded-r-md"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <Icon
                    size={18}
                    className={`transition-transform duration-200 group-active:scale-95 ${
                      active ? "text-[#0B5B32]" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="transition-transform duration-200 group-active:translate-x-0.5">
                    {item.title}
                  </span>
                </Link>
              );
            })}

            <button
              onClick={handleAuthAction}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-bold transition-all duration-150 group active:scale-[0.98] ${
                userData
                  ? "text-red-600 hover:bg-red-50/50"
                  : "text-[#0B5B32] hover:bg-[#E6F4EA]/50"
              }`}
            >
              {userData ? (
                <>
                  <LogOut size={18} className="text-red-500 transition-transform group-hover:-translate-x-0.5" />
                  <span>Logout</span>
                </>
              ) : (
                <>
                  <LogIn size={18} className="text-[#0B5B32] transition-transform group-hover:translate-x-0.5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </nav>
        </div>

        {/* Bottom Security Footer */}
        <div className="bg-[#E6F4EA]/50 border border-[#A7F3D0]/40 rounded-xl p-3.5 space-y-1 mt-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[#0B5B32] font-black text-xs">
            <ShieldCheck size={16} className="fill-[#0B5B32] text-white" />
            <span>100% Secure Platform</span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            Your personal data and documents are fully encrypted.
          </p>
        </div>

      </div>
    </>
  );
}