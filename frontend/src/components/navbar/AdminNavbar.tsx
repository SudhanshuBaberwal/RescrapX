'use client';

import React from 'react';
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Menu,
  Search,
} from 'lucide-react';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
   <header className="sticky top-0 z-[60] bg-white/90 backdrop-blur-xl border-b border-slate-200">
      <div className="flex h-16 md:h-18 lg:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-3 lg:gap-5">

          {/* Mobile Menu */}
          <button
  onClick={onMenuToggle}
  className="relative z-[70] lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
>
  <Menu size={20} />
</button>
          {/* Heading */}
          <div>
            <h1 className="text-base sm:text-lg lg:text-2xl font-bold text-slate-900">
              ReScrapX
            </h1>

            <p className="hidden md:block text-sm text-slate-500">
              Manage your platform efficiently.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">

          {/* Search */}
          <div className="relative hidden md:flex items-center">

            <Search
              size={18}
              className="absolute left-3 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="
                w-44
                lg:w-64
                xl:w-80
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                py-2.5
                pl-10
                pr-16
                text-sm
                outline-none
                transition-all
                duration-300
                focus:w-72
                xl:focus:w-96
                focus:border-emerald-500
                focus:bg-white
                focus:ring-4
                focus:ring-emerald-100
              "
            />

            <kbd className="absolute right-3 hidden xl:block rounded-md border bg-white px-2 py-1 text-[10px] text-slate-500 shadow-sm">
              Ctrl K
            </kbd>
          </div>

          {/* Search Button on Mobile */}
          <button className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50">
            <Search size={18} />
          </button>

          {/* Date */}
          <div className="hidden xl:flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">

            <CalendarDays
              size={18}
              className="text-emerald-600"
            />

            <span className="text-sm font-medium text-slate-700">
              {today}
            </span>

          </div>

          {/* Notification */}
          <button className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <Bell
              size={20}
              className="text-slate-600"
            />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              12
            </span>

          </button>

          {/* Profile */}
          <button className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 sm:px-2 shadow-sm transition hover:shadow-md">

            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Profile"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover"
            />

            <div className="hidden lg:block text-left">

              <p className="text-sm font-semibold text-slate-900">
                Super Admin
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>

            </div>

            <ChevronDown
              size={16}
              className="hidden lg:block text-slate-400 transition group-hover:rotate-180"
            />

          </button>

        </div>
      </div>
    </header>
  );
};