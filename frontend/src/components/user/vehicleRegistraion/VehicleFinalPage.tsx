"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getVehiclePricing, getVehicle } from "@/services/vehicle.service";
import {
  CheckCircle2,
  FileText,
  Clock,
  MessageSquare,
  MessageCircle,
  Mail,
  Bell,
  Users,
  ShieldCheck,
  Award,
  Lock,
  PhoneCall,
  Gavel,
  Trophy,
  Calendar,
  SearchCheck,
  CreditCard,
  Tag,
  Info,
  Send,
  Image as ImageIcon,
  Car,
  Home,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { IVehicle } from "@/context/vehicleProvider";

interface BookingSuccessProps {
  bookingId?: string;
  submissionTime?: string;
  vehicleName?: string;
  registrationNo?: string;
  expectedMinPrice?: string;
  expectedMaxPrice?: string;
  currentStatus?: string;
  onNext?: () => void;
  nextPageUrl?: string;
  homePageUrl?: string;
}

export default function BookingSuccessPage(props: BookingSuccessProps) {
  const router = useRouter();

  // 1. Redux Store Fallbacks
  const { vehicleData: IVehicle } = useSelector(
    (state: RootState) => state.vehicle,
  );
  const { userEstimatedPrice } = useSelector((state: RootState) => state.user);
  const estimatedData: any = userEstimatedPrice || {};

  const reduxVehicle =
    estimatedData?.vehicle || estimatedData?.data?.vehicle || {};
  const reduxPricing =
    estimatedData?.pricing || estimatedData?.data?.pricing || {};

  // 2. Route Params
  const params = useParams<{ _id?: string }>();
  const vehicleId = params?._id;

  // 3. Dynamic Local States
  const [pricing, setPricing] = useState<any>(reduxPricing);
  const [vehicle, setVehicle] = useState<any>(reduxVehicle);
  const [vehicleData, setVehicleData] = useState<IVehicle>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 4. Fetch Dynamic Vehicle Details (Requested Function)
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!vehicleId) {
        setFetchError("Vehicle ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await getVehicle(vehicleId);
        const responseData = res?.data?.data || res?.data || res;
        if (responseData) {
          setVehicleData(responseData);
        } else {
          setFetchError("Failed to load vehicle details.");
        }
      } catch (error: any) {
        console.error("Error fetching vehicle:", error);
        setFetchError(
          error?.message || "Something went wrong while fetching vehicle data.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [vehicleId]);

  // 5. Fetch Pricing / Cache Fallback
  useEffect(() => {
    if (!vehicleId) return;

    let cancelled = false;

    const loadPricing = async () => {
      const cacheKey = `vehicle-pricing-${vehicleId}`;

      try {
        const cachedPricing = sessionStorage.getItem(cacheKey);
        if (cachedPricing) {
          const parsed = JSON.parse(cachedPricing);
          if (!cancelled) {
            setPricing(parsed?.pricing ?? parsed);
            if (parsed?.vehicle) setVehicle(parsed.vehicle);
          }
          return;
        }

        const result = await getVehiclePricing(vehicleId);
        if (cancelled) return;

        sessionStorage.setItem(cacheKey, JSON.stringify(result));
        setPricing(result?.pricing ?? result);
        if (result?.vehicle) setVehicle(result.vehicle);
      } catch (error) {
        // Silently handle fallback to Redux/Props
      }
    };
    loadPricing();
    return () => {
      cancelled = true;
    };
  }, [vehicleId]);

  // 6. Compute Dynamic Vehicle Data with Fallbacks
  const vehicleName = vehicleData?.vehicleDetails.carName;

  const registrationNo = vehicleData?.vehicleDetails.registrationNumber;
  ("N/A");

  const bookingId = vehicleId
    ? vehicleId.substring(0, 18)
    : props.bookingId || "RSX-2024-05-07-7852";

  // Min and Max Price Calculations
  const minPriceVal = vehicleData?.pricing?.lowerBound;
  const maxPriceVal = vehicleData?.pricing?.upperBound;

  const expectedMinPrice =
    typeof minPriceVal === "number"
      ? minPriceVal.toLocaleString("en-IN")
      : props.expectedMinPrice || "65,000";

  const expectedMaxPrice =
    typeof maxPriceVal === "number"
      ? maxPriceVal.toLocaleString("en-IN")
      : props.expectedMaxPrice || "85,000";

  const submissionTime = vehicleData?.updatedAt;
  const currentStatus = vehicleData?.status;

  // Navigation Handlers
  const handleNext = () => {
    if (props.onNext) {
      props.onNext();
    } else {
      router.push(
        props.nextPageUrl || `/register-vehicle/${vehicleId || ""}/9`,
      );
    }
  };

  const handleHome = () => {
    router.push(props.homePageUrl || "/");
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans text-gray-900">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT MAIN CONTENT COLUMN (8 COLS) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* HERO BANNER CARD */}
          <div className="bg-[#F2F8F4] border border-emerald-100/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden space-y-6">
            <div className="flex items-start gap-4 z-10 relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0B5B32] text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 size={26} strokeWidth={2.5} />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">
                  Your Vehicle Has Been Submitted Successfully!
                </h1>
                <p className="text-sm sm:text-base font-bold text-[#0B5B32]">
                  Your vehicle is now live for bidding.
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium max-w-md pt-1">
                  Our network of authorized recyclers is reviewing your vehicle
                  details and photos.
                </p>
              </div>
            </div>

            {/* EXPECTED VALUE BOX */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
              <div className="md:col-span-7 bg-white/90 backdrop-blur-xs border border-emerald-200/60 rounded-2xl p-4 sm:p-5 space-y-2 z-10">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Expected Value Range
                </p>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-[#0B5B32]">
                    <Tag size={20} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B5B32]">
                    ₹ {expectedMinPrice} – ₹ {expectedMaxPrice}*
                  </h2>
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-tight">
                  Estimated value based on your vehicle details and current
                  scrap market trends.
                </p>
                <p className="text-[10px] text-gray-400 italic pt-1">
                  * The final offer depends on recycler bids and physical
                  verification during pickup.
                </p>
              </div>

              <div className="md:col-span-5 flex justify-center relative min-h-[160px]">
                <Image
                  src="/cars/white-suv.png"
                  alt="Vehicle Illustration"
                  width={280}
                  height={160}
                  className="object-contain drop-shadow-md z-10"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>

          {/* CURRENT STATUS */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
              Current Status
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#0B5B32] flex items-center justify-center">
                    <Car size={18} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">
                    Vehicle details submitted
                  </span>
                </div>
                <CheckCircle2 size={20} className="text-[#0B5B32]" />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#0B5B32] flex items-center justify-center">
                    <ImageIcon size={18} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">
                    Photos verified
                  </span>
                </div>
                <CheckCircle2 size={20} className="text-[#0B5B32]" />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#0B5B32] flex items-center justify-center">
                    <Send size={18} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">
                    Sent to authorized recyclers
                  </span>
                </div>
                <CheckCircle2 size={20} className="text-[#0B5B32]" />
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#0B5B32] flex items-center justify-center shrink-0">
                    <Gavel size={18} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-extrabold text-[#0B5B32]">
                      Bidding in progress
                    </span>
                    <p className="text-[11px] font-medium text-gray-500">
                      Our partner recyclers are placing their bids.
                    </p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-dashed border-[#0B5B32] animate-spin" />
              </div>
            </div>
          </div>

          {/* WHAT HAPPENS NEXT */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
              What happens next?
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 relative">
              <div className="text-center space-y-2 group">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-[#0B5B32] flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
                  <Gavel size={20} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-gray-900">
                    1. Bidding Starts
                  </h4>
                  <p className="text-[9px] font-medium text-gray-500 mt-0.5">
                    Authorized recyclers compete for your vehicle.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-2 group">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-[#0B5B32] flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
                  <Trophy size={20} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-gray-900">
                    2. Best Offer Selected
                  </h4>
                  <p className="text-[9px] font-medium text-gray-500 mt-0.5">
                    The highest valid bid is automatically selected.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-2 group">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-[#0B5B32] flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-gray-900">
                    3. Partner Assigned
                  </h4>
                  <p className="text-[9px] font-medium text-gray-500 mt-0.5">
                    The recycler who placed the highest bid becomes your
                    assigned partner.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-2 group">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-[#0B5B32] flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-gray-900">
                    4. Pickup Scheduled
                  </h4>
                  <p className="text-[9px] font-medium text-gray-500 mt-0.5">
                    Choose a convenient pickup date and time.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-2 group">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-[#0B5B32] flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
                  <SearchCheck size={20} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-gray-900">
                    5. Physical Verification
                  </h4>
                  <p className="text-[9px] font-medium text-gray-500 mt-0.5">
                    Driver verifies the vehicle using the uploaded photos.
                  </p>
                </div>
              </div>

              <div className="text-center space-y-2 group">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-[#0B5B32] flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-gray-900">
                    6. Payment & Docs
                  </h4>
                  <p className="text-[9px] font-medium text-gray-500 mt-0.5">
                    Payment is made after verification and legal documentation
                    begins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* IMPORTANT NOTICE BANNER */}
          <div className="bg-[#FFFBEB] border border-amber-200/70 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Info size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wide">
                  Important Notice
                </h4>
                <p className="text-xs font-bold text-gray-800 leading-snug">
                  Your assigned recycler will only be revealed after the bidding
                  process is completed and the highest offer is finalized.
                </p>
                <p className="text-[11px] font-medium text-gray-500">
                  This ensures fair competition and helps you receive the best
                  possible value for your vehicle.
                </p>
              </div>
            </div>

            <div className="w-14 h-14 bg-emerald-800/90 rounded-2xl flex items-center justify-center text-white shrink-0 self-end sm:self-center shadow-md">
              <Lock size={26} />
            </div>
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleHome}
              className="flex-1 py-3.5 px-6 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-extrabold text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home size={18} />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3.5 px-6 bg-[#0B5B32] hover:bg-[#084827] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Next</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR COLUMN (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* YOUR BOOKING SUMMARY CARD */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#0B5B32]" />
                <h3 className="text-sm font-black text-gray-900 tracking-tight">
                  Your Booking Summary
                </h3>
              </div>
              {isLoading && (
                <Loader2 size={16} className="animate-spin text-[#0B5B32]" />
              )}
            </div>

            {fetchError && (
              <p className="text-[11px] text-red-500 font-semibold">
                {fetchError}
              </p>
            )}

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-500">Booking ID</span>
                <span className="font-extrabold text-gray-900">
                  {bookingId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-500">Vehicle</span>
                <span className="font-bold text-gray-800">
                  {isLoading ? "Loading..." : vehicleName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-500">
                  Registration No.
                </span>
                <span className="font-bold text-gray-800">
                  {isLoading ? "Loading..." : registrationNo}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-500">
                  Expected Offer Range
                </span>
                <span className="font-black text-[#0B5B32]">
                  ₹ {expectedMinPrice} – ₹ {expectedMaxPrice}*
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-gray-500">
                  Current Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-[#0B5B32] border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B5B32] animate-ping" />
                  {currentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* WHEN WILL I RECEIVE FINAL OFFER CARD */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl text-[#0B5B32]">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-gray-900">
                  When will I receive my final offer?
                </h4>
                <p className="text-xs font-extrabold text-gray-700 mt-0.5">
                  Expected within 30 – 60 minutes
                </p>
                <p className="text-[11px] font-medium text-gray-500 mt-1">
                  As soon as the bidding period ends, we'll notify you through:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center gap-1">
                <MessageSquare size={16} className="text-emerald-700" />
                <span className="text-[9px] font-bold text-gray-600">SMS</span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center gap-1">
                <MessageCircle size={16} className="text-emerald-700" />
                <span className="text-[9px] font-bold text-gray-600">
                  WhatsApp
                </span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center gap-1">
                <Mail size={16} className="text-emerald-700" />
                <span className="text-[9px] font-bold text-gray-600">
                  Email
                </span>
              </div>
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center gap-1">
                <Bell size={16} className="text-emerald-700" />
                <span className="text-[9px] font-bold text-gray-600">
                  Push Notification
                </span>
              </div>
            </div>
          </div>

          {/* WHY WAIT FOR BIDDING CARD */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
              Why wait for bidding?
            </h4>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-50 text-[#0B5B32] rounded-lg shrink-0 mt-0.5">
                  <Users size={16} />
                </div>
                <p className="text-xs font-bold text-gray-700 leading-snug">
                  Multiple recyclers compete for your vehicle.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-50 text-[#0B5B32] rounded-lg shrink-0 mt-0.5">
                  <ShieldCheck size={16} />
                </div>
                <p className="text-xs font-bold text-gray-700 leading-snug">
                  Transparent and competitive pricing.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-50 text-[#0B5B32] rounded-lg shrink-0 mt-0.5">
                  <Award size={16} />
                </div>
                <p className="text-xs font-bold text-gray-700 leading-snug">
                  Best available offer is selected automatically.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-50 text-[#0B5B32] rounded-lg shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-xs font-bold text-gray-700 leading-snug">
                  No obligation to accept the offer.
                </p>
              </div>
            </div>
          </div>

          {/* HELP CARD */}
          <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0B5B32] flex items-center justify-center mx-auto">
              <PhoneCall size={22} />
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">
                We're here to help!
              </h4>
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                Our support team is available to assist you at every step.
              </p>
            </div>

            <a
              href="tel:9990856709"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white border border-[#0B5B32] text-[#0B5B32] hover:bg-emerald-50 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            >
              <PhoneCall size={16} />
              <span>Call 99908 56709</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
