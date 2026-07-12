import React from 'react';

interface NavbarProps {
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Left Action Menu */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden text-lg"
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
            Welcome back, Super Admin 👋
          </h1>
          <p className="hidden md:block text-xs text-slate-500 mt-0.5">
            Here's what's happening on RescrapX today.
          </p>
        </div>
      </div>

      {/* Responsive Tools Panel Area */}
      <div className="flex items-center gap-5">
        {/* Dynamic Context Omnibox Search Box */}
        <div className="relative hidden xl:flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 w-72">
          <span className="text-slate-400 text-sm">🔍</span>
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full border-none bg-transparent pl-2 text-xs text-slate-800 placeholder-slate-400 outline-none"
          />
          <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400 font-mono shadow-sm ml-1">
            Ctrl+K
          </kbd>
        </div>

        <div className="hidden sm:block rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700">
          📅 Today: 2 Jun 2025
        </div>

        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100">
            <span className="text-xl">🔔</span>
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
              12
            </span>
          </button>
          <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-slate-100 cursor-pointer shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="Profile Avatar" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};