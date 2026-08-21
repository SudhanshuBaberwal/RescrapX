'use client'

import React from 'react';
import {
  Headphones, ChevronDown, Calendar, IndianRupee, MapPin,
  Clock, ExternalLink, Compass, CheckCircle2, Package
} from 'lucide-react';
import { getUserBookingData } from '@/hooks/getUserBookingData';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function MyBookings() {
  getUserBookingData();

  const { userBookingData } = useSelector((state: RootState) => state.user);

  // Safely extract the array whether userBookingData is an object or an array directly
  const rawData: any = userBookingData;
  const bookings: any[] = Array.isArray(rawData)
    ? rawData
    : (rawData?.bookings || []);
  // Helper date formatter
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="w-full bg-white text-[#374151] font-sans antialiased space-y-6">

      {/* PAGE HEADER & SUPPORT COMPONENT BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Bookings</h1>
          <p className="text-xs font-semibold text-gray-400 mt-0.5">
            Track all your vehicle scrapping bookings in one place.
          </p>
        </div>

        {/* Support Help Block Area */}
        <div className="flex items-center justify-between gap-4 bg-gray-50/70 border border-gray-100 p-3 rounded-xl sm:min-w-[320px]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 rounded-lg text-[#0B5B32]">
              <Headphones size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-900 leading-tight">Need Help?</h4>
              <p className="text-[10px] font-semibold text-gray-400">Our support team is here for you</p>
            </div>
          </div>
          <button className="bg-white hover:bg-gray-50 border border-[#0B5B32]/30 text-[#0B5B32] font-bold text-[11px] px-3 py-1.5 rounded-lg transition shadow-2xs">
            Contact Support
          </button>
        </div>
      </div>

      {/* FILTERS AND SORT TAB CONTROLS RUNWAY */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
        {/* Dynamic Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button className="bg-[#0B5B32] text-white px-3 py-1.5 rounded-lg font-black shadow-xs">
            All Bookings ({bookings.length})
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg transition">
            Active ({bookings.filter((b: any) => b.pickup?.status !== 'COMPLETED' && b.pickup?.status !== 'CANCELLED').length})
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg transition">
            Completed ({bookings.filter((b: any) => b.pickup?.status === 'COMPLETED').length})
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-lg transition">
            Cancelled ({bookings.filter((b: any) => b.pickup?.status === 'CANCELLED').length})
          </button>
        </div>

        {/* Sort Dropdown Selector */}
        <div className="flex items-center gap-1.5 border border-gray-200 bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-50 transition w-fit">
          <span>Sort by: <span className="text-gray-900">Latest</span></span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>

      {/* EMPTY STATE */}
      {bookings.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
            <Package size={24} />
          </div>
          <h3 className="text-base font-black text-gray-800">No Bookings Found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto font-medium">
            You haven't placed any vehicle scrapping requests yet.
          </p>
        </div>
      ) : (
        /* DYNAMIC BOOKINGS LIST */
        bookings.map((booking: any) => {
          const { bookingId, bookingDate, offerAmount, pickup, vehicle, journey } = booking;
          const status = pickup?.status || 'PENDING';

          // Fixed steps definition mapped dynamically against backend values
          const steps = [
            { key: 'SOLD', title: '1. Sold', time: journey?.soldAt ? formatDateTime(journey.soldAt) : formatDateTime(bookingDate), done: true },
            { key: 'READY_FOR_PICKUP', title: '2. Ready For Pickup', time: journey?.readyAt ? formatDateTime(journey.readyAt) : '', done: !!journey?.readyAt || status === 'ARRIVED' },
            { key: 'PICKUP_SCHEDULED', title: '3. Pickup Scheduled', time: pickup?.scheduledAt ? formatDateTime(pickup.scheduledAt) : '', current: status === 'SCHEDULED' || status === 'ARRIVED', done: status === 'ARRIVED' },
            { key: 'DRIVER_ASSIGNED', title: '4. Driver Assigned', done: status === 'ARRIVED' },
            { key: 'PICKED_UP', title: '5. Picked Up', done: status === 'ARRIVED' },
            { key: 'IN_TRANSIT', title: '6. In Transit' },
            { key: 'ARRIVED', title: '7. Arrived', current: status === 'ARRIVED', done: status === 'ARRIVED' },
            { key: 'INSPECTION_COMPLETE', title: '8. Inspection Complete' },
          ];

          return (
            <div key={bookingId} className="bg-white border border-gray-200/90 rounded-2xl shadow-2xs grid grid-cols-1 lg:grid-cols-12 overflow-hidden mb-6">

              {/* LEFT COMPARTMENT: VEHICLE & CURRENT STATUS META */}
              <div className="lg:col-span-8 p-5 sm:p-6 space-y-6 lg:border-r lg:border-gray-100">

                {/* Booking Id Header Node */}
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-black text-gray-900">
                    Booking ID : <span className="text-gray-600 font-extrabold">{bookingId}</span>
                  </h2>
                  <span className="bg-[#E6F4EA] text-[#0B5B32] text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                    {status}
                  </span>
                </div>

                {/* Sub Grid Split Layout: Car Profile and Status Block */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">

                  {/* Vehicle Specs */}
                  <div className="sm:col-span-6 space-y-1.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vehicle Details</p>
                    <h3 className="text-base font-black text-gray-900">{vehicle?.name || 'Vehicle'}</h3>
                    <p className="text-xs font-semibold text-gray-400 capitalize">{vehicle?.fuelType?.toLowerCase() || 'N/A'}</p>
                    {vehicle?.registrationNumber && (
                      <div className="inline-block bg-gray-100 border border-gray-200 text-gray-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase mt-1">
                        {vehicle.registrationNumber}
                      </div>
                    )}
                  </div>

                  {/* Current Status Block */}
                  <div className="sm:col-span-6 bg-[#E6F4EA]/30 border border-[#A7F3D0]/30 rounded-xl p-4 space-y-3.5">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Current Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-8 h-8 rounded-full bg-[#E6F4EA] flex items-center justify-center text-[#0B5B32] text-sm">
                          🛻
                        </div>
                        <h4 className="text-sm font-black text-[#0B5B32]">{status}</h4>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-1.5 leading-relaxed">
                        Vehicle status updated at destination facility.
                      </p>
                    </div>

                    {/* Appointment Datetime / Location parameters */}
                    <div className="space-y-1.5 text-xs font-bold text-gray-700 pt-1 border-t border-[#A7F3D0]/30">
                      {pickup?.scheduledAt && (
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-[#0B5B32]" />
                          <span>{formatDate(pickup.scheduledAt)}</span>
                        </div>
                      )}
                      {pickup?.scheduledAt && (
                        <div className="flex items-center gap-2">
                          <Clock size={13} className="text-[#0B5B32]" />
                          <span>{new Date(pickup.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                        </div>
                      )}
                      {pickup?.address && (
                        <div className="flex items-start gap-2 pt-0.5">
                          <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
                          <span className="text-gray-500 font-medium text-[11px] leading-tight">
                            {pickup.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                <hr className="border-gray-100" />

                {/* Core Booking Metrics Block Row */}
                <div className="flex flex-wrap items-center gap-8 sm:gap-14 pt-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Booking Date</p>
                      <p className="text-xs font-black text-gray-800 mt-0.5">{formatDate(bookingDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                      <IndianRupee size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Offer Amount</p>
                      <p className="text-xs font-black text-gray-900 mt-0.5">₹ {offerAmount?.toLocaleString('en-IN') || 0}</p>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Action Interactive Call To Actions Layout Footer */}
                <div className="flex items-center justify-end gap-3 pt-1">
                  <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-2xs transition">
                    <span>View Details</span>
                    <ExternalLink size={13} className="text-gray-400" />
                  </button>
                  <button className="bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition">
                    <span>Track Live</span>
                    <Compass size={13} />
                  </button>
                </div>

              </div>

              {/* RIGHT COMPARTMENT: VERTICAL JOURNEY TIMELINE VERTEX */}
              <div className="lg:col-span-4 bg-gray-50/40 p-5 sm:p-6 space-y-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                  Journey Progress
                </h3>

                {/* Full Process Matrix Container */}
                <div className="relative pl-1 space-y-4 pt-1">

                  {/* Timeline Vertical Pillar Wire */}
                  <div className="absolute top-2 bottom-2 left-[7px] w-[2px] bg-gray-200 z-0"></div>

                  {/* Dynamic Step Node Processor */}
                  {steps.map((node, i) => (
                    <div key={i} className="relative flex items-start gap-3 z-10">
                      {/* Visual Circle Checkpoint Bullet */}
                      <div className="mt-0.5 shrink-0">
                        {node.done || node.current ? (
                          <CheckCircle2 size={16} className="fill-[#10B981] text-white" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 bg-white mx-0.5"></div>
                        )}
                      </div>

                      {/* Progress Metric Text Wrapper */}
                      <div className="space-y-0.5">
                        <p className={`text-xs font-bold tracking-tight ${node.current
                            ? 'text-[#0B5B32] font-black'
                            : node.done
                              ? 'text-gray-800'
                              : 'text-gray-400 font-medium'
                          }`}>
                          {node.title}
                        </p>
                        {node.time && (
                          <p className="text-[10px] text-gray-400 font-semibold tracking-normal">
                            {node.time}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                </div>
              </div>

            </div>
          );
        })
      )}

    </div>
  );
}