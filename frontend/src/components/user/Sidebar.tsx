'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, FileText, Settings,
  HelpCircle, LogOut, LogIn, CheckCircle, ShieldCheck,
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
      // Logout Logic
      try {
        await logout();
        queryClient.removeQueries({ queryKey: ["current-user"] });
        window.location.href = "/login";
      } catch (error: any) {
        showToast(error?.message || "Logout failed. Please try again.", "error");
      }
    } else {
      // Login Logic
      router.push('/login');
    }
  };

  return (
    <div className="w-full bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-6">
      {/* User Header Details */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-200 shrink-0">
          <User className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <h3 className="text-sm font-black text-gray-900 leading-tight">
            {userData?.fullName || "Guest User"}
          </h3>
          <p className="text-xs font-semibold text-gray-400">
            {userData?.email || "Welcome to Rescrap X"}
          </p>

          {/* Status Badge */}
          {userData ? (
            <div className="inline-flex items-center gap-1 bg-[#E6F4EA] text-[#0B5B32] text-[10px] font-black px-2 py-0.5 rounded-md mt-1.5">
              <span>Verified</span>
              <CheckCircle size={10} className="fill-[#0B5B32] text-white" />
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
      <nav className="space-y-1 relative">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = currentTab === item.href;

          return (
            <Link
              key={item.href}
              href={`?tab=${item.href}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors duration-300 relative select-none group ${
                active ? "text-[#0B5B32] font-black" : "text-gray-600 font-bold hover:text-gray-900"
              }`}
            >
              {/* Animated Floating Background Capsule Indicator */}
              {active && (
                <motion.div
                  layoutId="activeSidebarIndicator"
                  className="absolute inset-0 bg-[#E6F4EA]/70 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Dynamic Left Vertical Stroke Accent Animation */}
              {active && (
                <motion.div
                  layoutId="activeSidebarLine"
                  className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-[#0B5B32] rounded-r-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <Icon
                size={16}
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

        {/* Dynamic Auth Button (Logout / Login) */}
        <button
          onClick={handleAuthAction}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group active:scale-[0.98] ${
            userData
              ? "text-red-600 hover:bg-red-50/50"
              : "text-[#0B5B32] hover:bg-[#E6F4EA]/50"
          }`}
        >
          {userData ? (
            <>
              <LogOut size={16} className="text-red-400 transition-transform group-hover:-translate-x-0.5" />
              <span>Logout</span>
            </>
          ) : (
            <>
              <LogIn size={16} className="text-[#0B5B32] transition-transform group-hover:translate-x-0.5" />
              <span>Login</span>
            </>
          )}
        </button>
      </nav>

      {/* Bottom Encryption Security Box */}
      <div className="bg-[#E6F4EA]/40 border border-[#A7F3D0]/30 rounded-xl p-3.5 space-y-1">
        <div className="flex items-center gap-1.5 text-[#0B5B32] font-black text-xs">
          <ShieldCheck size={16} className="fill-[#0B5B32] text-white" />
          <span>100% Secure</span>
        </div>
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
          Your data is protected with bank-level encryption.
        </p>
      </div>
    </div>
  );
}