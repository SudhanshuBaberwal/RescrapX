'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Check, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface PaymentItem {
  id: string;
  carName: string;
  regNumber: string;
  bookingId: string;
  amount: number;
  status: 'PAID' | 'PENDING';
  date: string;
  imageUrl: string;
}

export default function PaymentHistory() {
  const [sortOrder, setSortOrder] = useState<'LATEST' | 'OLDEST'>('LATEST');

  const payments: PaymentItem[] = [
    {
      id: '1',
      carName: 'Maruti Suzuki Swift 2012',
      regNumber: 'KA05AB1234',
      bookingId: 'BKNG12345',
      amount: 6250,
      status: 'PAID',
      date: 'Paid on 20 May 2026',
      imageUrl: '/cars/swift.png',
    },
    {
      id: '2',
      carName: 'Hyundai i20 2011',
      regNumber: 'KA03CD5678',
      bookingId: 'BKNG12344',
      amount: 7800,
      status: 'PAID',
      date: 'Paid on 15 May 2026',
      imageUrl: '/cars/i20.png',
    },
    {
      id: '3',
      carName: 'Tata Indigo eCS 2010',
      regNumber: 'KA02EF9012',
      bookingId: 'BKNG12343',
      amount: 4700,
      status: 'PAID',
      date: 'Paid on 10 May 2026',
      imageUrl: '/cars/indigo.png',
    },
    {
      id: '4',
      carName: 'Honda City 2010',
      regNumber: 'KA04GH3458',
      bookingId: 'BKNG12342',
      amount: 5200,
      status: 'PENDING',
      date: 'Payment in progress',
      imageUrl: '/cars/city.png',
    },
  ];

  const sortedPayments = [...payments].sort((a, b) => {
    return sortOrder === 'LATEST'
      ? Number(b.id) - Number(a.id)
      : Number(a.id) - Number(b.id);
  });

  return (
    <div className="w-full bg-white border border-gray-100 rounded-3xl p-4 sm:p-6 shadow-xs font-sans">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between pb-4 sm:pb-6">
        <h2 className="text-base sm:text-lg font-black text-[#1E293B] tracking-tight">
          Payment History
        </h2>

        {/* SORT BUTTON */}
        <button
          onClick={() =>
            setSortOrder((prev) => (prev === 'LATEST' ? 'OLDEST' : 'LATEST'))
          }
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-50/80 hover:bg-gray-100 border border-gray-200/80 rounded-xl text-xs font-extrabold text-gray-700 transition-colors cursor-pointer"
        >
          <span>{sortOrder === 'LATEST' ? 'Latest First' : 'Oldest First'}</span>
          <SlidersHorizontal size={14} className="text-gray-400 rotate-90" />
        </button>
      </div>

      {/* ITEMS LIST */}
      <div className="divide-y divide-gray-100">
        {sortedPayments.map((item) => {
          const isPaid = item.status === 'PAID';

          return (
            <div
              key={item.id}
              className="py-4 sm:py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 group cursor-pointer"
            >
              {/* LEFT: VEHICLE IMAGE & DETAILS */}
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                {/* Image Box */}
                <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-2xl bg-[#F1F5F9] border border-gray-200/60 shrink-0 overflow-hidden relative flex items-center justify-center p-1">
                  <Image
                    src={item.imageUrl}
                    alt={item.carName}
                    width={96}
                    height={72}
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      // Fallback UI if image isn't loaded
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                    }}
                  />
                  <span className="text-[10px] font-black text-gray-400 tracking-wider">
                    VEHICLE
                  </span>
                </div>

                {/* Car Info */}
                <div className="space-y-0.5 sm:space-y-1 min-w-0">
                  <h3 className="font-extrabold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#0B5B32] transition-colors truncate">
                    {item.carName}
                  </h3>
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                    {item.regNumber}
                  </p>
                  <p className="text-[10px] font-semibold text-gray-400">
                    Booking ID:{' '}
                    <span className="font-extrabold text-gray-600">
                      {item.bookingId}
                    </span>
                  </p>
                </div>
              </div>

              {/* RIGHT: STATUS, AMOUNT & CHEVRON */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                {/* Status & Amount Info */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto space-y-0 sm:space-y-1">
                  {/* Status Badge */}
                  <div>
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#E6F4EA] text-[#0B5B32]">
                        Paid <Check size={11} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Amount */}
                  <p
                    className={`font-black text-sm sm:text-base ${
                      isPaid ? 'text-[#0B5B32]' : 'text-amber-600'
                    }`}
                  >
                    ₹ {item.amount.toLocaleString('en-IN')}
                  </p>

                  {/* Date or Subtitle */}
                  <p className="text-[10px] font-semibold text-gray-400">
                    {item.date}
                  </p>
                </div>

                {/* Arrow Icon */}
                <ChevronRight
                  size={16}
                  className="text-gray-400 group-hover:text-gray-800 group-hover:translate-x-0.5 transition-all shrink-0"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}