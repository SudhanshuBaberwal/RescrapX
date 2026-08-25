'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Smartphone, Mail, CreditCard, Handshake,
  ArrowRight, Loader2, CheckCircle2
} from 'lucide-react';
import { setPartner } from '@/services/partner.service';
import { useToast } from '@/lib/ui/toast/ToastContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function Footer() {

  const router = useRouter();
  const { showToast } = useToast();
  const { userData } = useSelector((state: RootState) => state.user);

  // Client-side Mount state to prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check roleSelected safely after client hydration
  const isroleSelected = isMounted ? userData?.roleSelected : false;

  const handlePartnerSignup = async () => {
    if (loading || isSuccess) return;
    if (!userData){
      router.push("/login")
      return;
    }
    setLoading(true);
    try {
      const result = await setPartner();
      if (result?.data) {
        setIsSuccess(true);
        if (showToast) {
          showToast("Partner registration initiated successfully!", "success");
        }
        router.push("/partner/register");
      }
    } catch (error: any) {
      console.error("Partner Signup Error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to register as partner.";

      if (showToast) {
        showToast(errorMessage, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#111827] text-gray-400 text-xs mt-16 sm:mt-20 pt-10 sm:pt-14 pb-8 border-t-4 border-[#0B5B32] overflow-x-hidden">

      {/* Outer Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between gap-8 pb-10 border-b border-gray-800">

        {/* Left Section: Bio + Navigation Directories */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 flex-1">

          {/* 1. Bio Segment */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-3">
            <div className="flex flex-col">
              <Link href="/" className="flex items-center gap-1 text-xl font-bold text-white tracking-tight">
                <span className="text-emerald-500">Rescrap</span>
                <span className="text-[#10B981]">X</span>
              </Link>
              <p className="text-gray-500 text-[9px] font-bold tracking-wider uppercase mt-0.5">Recycle Today, Drive Tomorrow</p>
            </div>
            <p className="text-gray-400 leading-relaxed font-medium text-[11px] sm:text-xs">
              India's premier digital infrastructure platform for end-of-life vehicle disposal, delivering authorized transparent recycling protocols.
            </p>
          </div>

          {/* 2. Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">Company</h4>
            <ul className="space-y-2 font-medium text-[11px] sm:text-xs">
              {[
                { title: "About Us", href: "/about" },
                // { title: "Careers", href: "/careers" },
                // { title: "Blog", href: "/blog" },
                // { title: "Newsroom", href: "/newsroom" },
                { title: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="hover:text-emerald-400 transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Services Directory */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">Services</h4>
            <ul className="space-y-2 font-medium text-[11px] sm:text-xs">
              {[
                "Instant Valuation", "Vehicle Pickup", "RC Deregistration",
                "Certificate of Deposit", "ELV Services"
              ].map((service) => (
                <li key={service}>
                  <a href="?nav=services" className="hover:text-emerald-400 transition-colors">{service}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Resources Panel */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">Resources</h4>
            <ul className="space-y-2 font-medium text-[11px] sm:text-xs">
              {[
                "Scrapping Guide", "Required Documents", "Vehicle Valuation Guide",
                "FAQs", 
              ].map((resource) => (
                <li key={resource}>
                  <a href="?nav=privacy-policy" className="hover:text-emerald-400 transition-colors">{resource}</a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Right Section: Partner CTA + Service Helpline Cards */}
        <div className={`flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 w-full shrink-0 ${
          !isroleSelected ? "lg:w-[340px] xl:w-[400px]" : "lg:w-[260px] xl:w-[280px]"
        }`}>

          {/* Partner Sign Up CTA Card (Hidden when role is already selected) */}
          {!isroleSelected && (
            <div className="flex-1 bg-gradient-to-br from-emerald-950/40 via-gray-900 to-gray-900 border border-emerald-500/30 p-4 rounded-xl shadow-lg relative overflow-hidden group">
              <div className="flex items-start gap-3 relative z-10">
                <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 text-emerald-400 shrink-0">
                  <Handshake size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Become a Partner</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                    Join our scrapper & towing network.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePartnerSignup}
                disabled={loading || isSuccess}
                className={`mt-3.5 w-full font-bold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
                  isSuccess
                    ? "bg-emerald-800 text-emerald-200 cursor-default"
                    : "bg-[#0B5B32] hover:bg-emerald-600 text-white active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin text-white" />
                    <span>Registering...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 size={15} className="text-emerald-300" />
                    <span>Partner Request Sent</span>
                  </>
                ) : (
                  <>
                    <span>Partner Sign Up</span>
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Dynamic Service Helpline Panel */}
          <div className="flex-1 space-y-3 bg-gray-900/60 p-4 rounded-xl border border-gray-800 flex flex-col justify-center">
            <div className="flex gap-2.5 items-center">
              <Smartphone size={16} className="text-emerald-500 shrink-0" />
              <div>
                <a href="tel:+919876543210" className="text-white font-black text-xs tracking-wide hover:text-emerald-400 transition-colors">
                  +91 99908 56709
                </a>
                <p className="text-[9px] text-gray-500 font-bold mt-0.5">Mon - Sat | 9:00 AM - 7:00 PM</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-center pt-2 border-t border-gray-800">
              <Mail size={16} className="text-emerald-500 shrink-0" />
              <a href="mailto:support@rescrapx.com" className="text-white font-bold hover:text-emerald-400 text-[11px] truncate transition-colors">
                support@rescrapx.com
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Safety Compliance Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 font-semibold text-[11px] text-center sm:text-left">
        <p>© 2026 RescrapX Inc. All rights reserved globally.</p>

        <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
          <CreditCard size={14} className="text-emerald-500 shrink-0" />
          <span>Verified Secure Payment Architecture</span>
        </div>

        {/* Payments Badge Indicators */}
        <div className="flex items-center gap-1.5 opacity-60 grayscale hover:grayscale-0 transition-all">
          <span className="bg-white text-black px-1.5 py-0.5 rounded-xs font-black text-[9px]">UPI</span>
          <span className="bg-white text-blue-900 px-1.5 py-0.5 rounded-xs font-black text-[9px] italic">VISA</span>
          <span className="bg-white text-orange-600 px-1.5 py-0.5 rounded-xs font-black text-[9px]">mastercard</span>
          <span className="bg-white text-amber-800 px-1.5 py-0.5 rounded-xs font-black text-[9px]">RuPay</span>
        </div>
      </div>
    </footer>
  );
}