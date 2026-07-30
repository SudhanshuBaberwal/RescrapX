'use client';

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Gavel,
  Truck,
  Users,
  Building2,
  Package,
  UserCog,
  Settings2,
  FileText,
  CreditCard,
  MessageCircleWarning,
  BarChart3,
  Bell,
  LogOut,
} from 'lucide-react';
import { logout } from '@/services/auth.service';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: 'dashboard' },
    { label: 'Bidding Management', icon: Gavel, href: 'bidding-management' },
    { label: 'Vehicles', icon: Truck, href: 'vehicles', badge: 128 },
    { label: 'Customers', icon: Users, href: 'customers', badge: '1,245' },
    { label: 'Partners (RVSF)', icon: Building2, href: 'partners', badge: 86 },
    { label: 'Pickup & Logistics', icon: Package, href: 'pickup-logistics' },
    { label: 'Drivers', icon: UserCog, href: 'drivers', badge: 82 },
    { label: 'Operations', icon: Settings2, href: 'operations' },
    { label: 'Documents & Compliance', icon: FileText, href: 'documents-compliance' },
    { label: 'Payments & Settlements', icon: CreditCard, href: 'payments-settlements' },
    {
      label: 'Disputes & Support',
      icon: MessageCircleWarning,
      href: 'disputes-support',
      badge: 7,
    },
    {
      label: 'Analytics & Reports',
      icon: BarChart3,
      href: 'analytics-reports',
    },
    { label: 'Notifications', icon: Bell, href: 'notifications' },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get('tab') || 'dashboard';

  const handleNavigation = (href: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', href);

    router.push(`${pathname}?${params.toString()}`);

    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          w-[360px]
          bg-white
          border-r border-slate-200
          shadow-xl
          transition-transform duration-500 ease-in-out
          lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚗</span>

            <div>
              <h1 className="text-lg font-black text-slate-900">
                RescrapX
              </h1>

              <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold">
                Admin Console
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.href;

            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`
                  relative
                  overflow-hidden
                  w-full
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  ease-out
                  group
                  ${isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-md border border-emerald-100'
                    : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900 hover:translate-x-2'
                  }
                `}
              >
                {/* Active Left Border */}
                <span
                  className={`
                    absolute
                    left-0
                    top-2
                    bottom-2
                    w-1
                    rounded-r-full
                    bg-emerald-600
                    transition-all
                    duration-300
                    ${isActive
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                    }
                  `}
                />

                {/* Hover Background */}
                <div
                  className={`
                    absolute
                    inset-0
                    rounded-xl
                    transition-opacity
                    duration-500
                    ${isActive
                      ? 'bg-gradient-to-r from-emerald-500/10 to-transparent'
                      : 'opacity-0 group-hover:opacity-100 bg-gradient-to-r from-slate-100 to-transparent'
                    }
                  `}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center gap-3">
                  <Icon
                    size={18}
                    className={`
                      transition-all
                      duration-300
                      ${isActive
                        ? 'text-emerald-600 scale-110'
                        : 'text-slate-400 group-hover:text-emerald-600 group-hover:scale-110 group-hover:-rotate-6'
                      }
                    `}
                  />

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span
                    className={`
                      relative
                      z-10
                      text-[10px]
                      px-2
                      py-1
                      rounded-full
                      font-bold
                      transition-all
                      duration-300
                      ${isActive
                        ? 'bg-emerald-600 text-white scale-105'
                        : 'bg-slate-200 text-slate-700 group-hover:scale-110'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </button>

            );
          })}
          <button
            type="button"
            onClick={handleLogout} // Replace with your actual logout function logic
            className="
    relative
    overflow-hidden
    w-full
    flex
    items-center
    justify-between
    rounded-xl
    px-4
    py-3
    text-sm
    font-semibold
    transition-all
    duration-300
    ease-out
    group
    text-rose-600
    hover:bg-rose-50/80
    hover:text-rose-700
    hover:translate-x-1
  "
          >
            {/* Left Border Indicator on Hover */}
            <span
              className="
      absolute
      left-0
      top-2
      bottom-2
      w-1
      rounded-r-full
      bg-rose-600
      transition-all
      duration-300
      opacity-0
      group-hover:opacity-100
    "
            />

            {/* Hover Gradient Background */}
            <div
              className="
      absolute
      inset-0
      rounded-xl
      transition-opacity
      duration-500
      opacity-0
      group-hover:opacity-100
      bg-gradient-to-r
      from-rose-500/10
      to-transparent
    "
            />

            {/* Icon and Label */}
            <div className="relative z-10 flex items-center gap-3">
              {/* LogOut Icon (e.g., from lucide-react) */}
              <LogOut
                size={18}
                className="
        text-rose-500
        transition-all
        duration-300
        group-hover:text-rose-600
        group-hover:scale-110
        group-hover:-rotate-6
      "
              />

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                Logout
              </span>
            </div>
          </button>
        </nav>

        {/* Bottom Card */}
        <div className="border-t border-slate-100 p-4 bg-slate-50">
          <div className="rounded-xl border bg-white p-5 shadow-sm text-center">
            <h3 className="font-bold text-slate-800">
              Need Help?
            </h3>

            <p className="text-xs text-slate-500 mt-2 leading-5">
              Our support team is available 24/7 for operational assistance.
            </p>

            <button className="mt-4 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg hover:scale-[1.02] active:scale-95">
              🎧 Contact Support
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;