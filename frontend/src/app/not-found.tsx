'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex flex-col items-center justify-center p-4 font-sans text-gray-900">
      <div className="max-w-xl w-full text-center space-y-6">

        {/* 404 HEADER WITH CAR ICON */}
        <div className="relative inline-flex items-center justify-center">
          <h1 className="text-8xl sm:text-9xl font-black text-[#0B5B32] tracking-wider select-none flex items-center gap-1">
            4
            <span className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-[#0B5B32] rounded-full mx-1">
              {/* CAR SVG ICON INSIDE THE 0 */}
              <svg
                className="w-12 h-12 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
            </span>
            4
          </h1>
        </div>

        {/* MAIN TEXT */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Oops! Page Not Found
          </h2>
          {/* GREEN ACCENT LINE */}
          <div className="w-8 h-1 bg-[#0B5B32] mx-auto rounded-full my-2" />
          <p className="text-sm sm:text-base font-semibold text-gray-500 max-w-sm mx-auto leading-relaxed">
            The page you are looking for doesn’t exist or has been moved.
          </p>
        </div>

        {/* ILLUSTRATION CONTAINER */}
        <div className="relative w-full max-w-lg mx-auto py-6">
          {/* SVG ILLUSTRATION: TOW TRUCK & WRONG TURN SIGN */}
          <svg viewBox="0 0 600 240" fill="none" className="w-full h-auto">
            {/* Background Skyline Silhouette */}
            <path
              d="M100 180 V150 H120 V130 H140 V150 H160 V180 M200 180 V120 H220 V100 H240 V180 M300 180 V140 H330 V180"
              stroke="#E2E8F0"
              strokeWidth="2"
              fill="none"
            />
            
            {/* Ground Line */}
            <line x1="40" y1="180" x2="560" y2="180" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />

            {/* Plants on left */}
            <path d="M70 180 Q65 150 50 140 Q65 160 70 180" fill="#A7F3D0" />
            <path d="M75 180 Q85 145 95 135 Q85 160 75 180" fill="#0B5B32" />

            {/* Tow Truck */}
            <g transform="translate(120, 80)">
              {/* Truck Body */}
              <rect x="0" y="50" width="130" height="40" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" rx="4" />
              <rect x="0" y="20" width="40" height="70" fill="#FFFFFF" stroke="#1E293B" strokeWidth="3" rx="4" />
              {/* Window */}
              <rect x="8" y="28" width="22" height="20" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2" />
              {/* RescrapX Logo Badge */}
              <rect x="8" y="60" width="24" height="12" fill="#0B5B32" rx="2" />
              <text x="10" y="69" fill="#FFFFFF" fontSize="6" fontWeight="bold">RESCRAPX</text>

              {/* Tow Crane Arm */}
              <path d="M60 50 L100 10 L140 10 L140 30" stroke="#0B5B32" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {/* Cable & Hook */}
              <line x1="140" y1="30" x2="140" y2="45" stroke="#1E293B" strokeWidth="2" />
              
              {/* Towed Broken Car */}
              <g transform="translate(110, 10)">
                <path d="M10 35 Q30 15 50 15 Q80 15 90 35 L100 35 L100 50 L0 50 Z" fill="#94A3B8" stroke="#1E293B" strokeWidth="3" />
                {/* Broken Window Cracks */}
                <path d="M30 22 L38 28 M35 22 L32 30" stroke="#1E293B" strokeWidth="1.5" />
                {/* Car Wheels */}
                <circle cx="20" cy="50" r="8" fill="#1E293B" />
                <circle cx="80" cy="50" r="8" fill="#1E293B" />
              </g>

              {/* Truck Wheels */}
              <circle cx="25" cy="90" r="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="4" />
              <circle cx="25" cy="90" r="4" fill="#1E293B" />
              <circle cx="110" cy="90" r="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="4" />
              <circle cx="110" cy="90" r="4" fill="#1E293B" />
            </g>

            {/* Road Sign Board */}
            <g transform="translate(420, 100)">
              <rect x="0" y="0" width="100" height="55" rx="10" fill="#FFFFFF" stroke="#0B5B32" strokeWidth="3" />
              <text x="50" y="20" fill="#1E293B" fontSize="8" fontWeight="bold" textAnchor="middle">Looks like you've</text>
              <text x="50" y="30" fill="#1E293B" fontSize="8" fontWeight="bold" textAnchor="middle">taken a wrong turn.</text>
              
              {/* Dotted Route Icon */}
              <path d="M20 42 Q35 32 45 42 T70 42" stroke="#0B5B32" strokeWidth="2" strokeDasharray="3 3" fill="none" />
              {/* Pin */}
              <path d="M72 36 C70 36 68 38 68 40 C68 44 72 47 72 47 C72 47 76 44 76 40 C76 38 74 36 72 36 Z" fill="#0B5B32" />

              {/* Pole */}
              <line x1="50" y1="55" x2="50" y2="80" stroke="#64748B" strokeWidth="5" />
            </g>
          </svg>
        </div>

        {/* BUTTON ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0B5B32] hover:bg-[#094A28] text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-sm cursor-pointer"
          >
            <Home size={16} />
            <span>Go to Home</span>
          </Link>

          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-[#0B5B32] text-[#0B5B32] hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-full transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>

        {/* FOOTER SUPPORT LINK */}
        <p className="text-xs font-semibold text-gray-500 pt-4">
          Need help?{' '}
          <Link href="/support" className="text-[#0B5B32] hover:underline font-bold">
            Contact our support team.
          </Link>
        </p>

      </div>
    </div>
  );
}