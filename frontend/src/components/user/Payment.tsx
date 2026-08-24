'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Check, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { getUserPaymentsData } from '@/hooks/getUserPaymentsData';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface UserPaymentRecord {
  _id?: string;
  vehicleId?: string;
  status?: string;
  paymentStatus?: string;
  processingStage?: string;
  updatedAt?: string;
  createdAt?: string;
  vehicleDetails?: {
    _id?: string;
    registrationNumber?: string;
    model?: string;
    carName?: string | null;
    variant?: string;
    manufacturingYear?: number;
  };
  auctionResult?: {
    auctionId?: string;
    finalBid?: number;
  };
  paymentVerifiedAt?: string;
  photos?: {
    front?: {
      url?: string;
    };
  };
}

export default function PaymentHistory() {
    getUserPaymentsData();

  const { userPaymentsData } = useSelector((state: RootState) => state.user);

  const rawPayments = (
    Array.isArray(userPaymentsData) ? userPaymentsData : []
  ) as unknown as UserPaymentRecord[];

  const [sortOrder, setSortOrder] = useState<'LATEST' | 'OLDEST'>('LATEST');

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const sortedPayments = [...rawPayments].sort((a, b) => {
    const timeA = new Date(a.createdAt || a.updatedAt || 0).getTime();
    const timeB = new Date(b.createdAt || b.updatedAt || 0).getTime();
    return sortOrder === 'LATEST' ? timeB - timeA : timeA - timeB;
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
        {sortedPayments.length === 0 ? (
          <div className="py-12 text-center text-gray-400 font-bold text-xs">
            No payment history found.
          </div>
        ) : (
          sortedPayments.map((item, index) => {
            const isPaid = item.paymentStatus?.toUpperCase() === 'VERIFIED' || item.status?.toUpperCase() === 'PAID';
            const carTitle = item.vehicleDetails?.carName || item.vehicleDetails?.model || 'Vehicle';
            const year = item.vehicleDetails?.manufacturingYear ? ` ${item.vehicleDetails.manufacturingYear}` : '';
            const carFullName = `${carTitle}${year}`;
            const regNum = item.vehicleDetails?.registrationNumber || 'N/A';
            const bookingId = item.auctionResult?.auctionId || item.vehicleId || item._id || 'N/A';
            const amount = item.auctionResult?.finalBid || 0;
            const imageUrl = item.photos?.front?.url || '/cars/swift.png';

            const dateLabel = isPaid
              ? item.paymentVerifiedAt
                ? `Paid on ${formatDate(item.paymentVerifiedAt)}`
                : 'Payment verified'
              : 'Payment in progress';

            return (
              <div
                key={item._id || item.vehicleId || index}
                className="py-4 sm:py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 group cursor-pointer"
              >
                {/* LEFT: VEHICLE IMAGE & DETAILS */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                  {/* Image Box */}
                  <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-2xl bg-[#F1F5F9] border border-gray-200/60 shrink-0 overflow-hidden relative flex items-center justify-center p-1">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={carFullName}
                        width={96}
                        height={72}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span className="text-[10px] font-black text-gray-400 tracking-wider">
                      VEHICLE
                    </span>
                  </div>

                  {/* Car Info */}
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <h3 className="font-extrabold text-xs sm:text-sm text-[#0F172A] group-hover:text-[#0B5B32] transition-colors truncate">
                      {carFullName}
                    </h3>
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                      {regNum}
                    </p>
                    <p className="text-[10px] font-semibold text-gray-400 truncate max-w-[180px] sm:max-w-xs">
                      Booking ID:{' '}
                      <span className="font-extrabold text-gray-600">
                        {bookingId}
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
                      className={`font-black text-sm sm:text-base ${isPaid ? 'text-[#0B5B32]' : 'text-amber-600'
                        }`}
                    >
                      ₹ {amount.toLocaleString('en-IN')}
                    </p>

                    {/* Date or Subtitle */}
                    <p className="text-[10px] font-semibold text-gray-400">
                      {dateLabel}
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
          })
        )}
      </div>
    </div>
  );
}