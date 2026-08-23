'use client';

import React from 'react';
import Link from 'next/link';

export default function PartnerFooter() {
  return (
    <footer className="w-full max-w-full bg-white border-t border-gray-200/80 px-4 sm:px-6 py-4 text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto shadow-3xs box-border">
      <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
        <p className="font-semibold">
          © 2026 <span className="font-black text-gray-800">RescrapX Partner Portal</span>. All rights reserved.
        </p>
        <span className="hidden sm:inline text-gray-300">|</span>
        <p className="text-gray-400 font-medium">Authorized Infrastructure Platform</p>
      </div>

      <div className="flex items-center gap-4 font-bold text-gray-600">
        <Link href="/blog" className="hover:text-[#0B5B32] transition-colors">Blog</Link>
        <Link href="/newsroom" className="hover:text-[#0B5B32] transition-colors">Newsroom</Link>
        <Link href="/contact" className="hover:text-[#0B5B32] transition-colors">Contact Us</Link>
      </div>
    </footer>
  );
}