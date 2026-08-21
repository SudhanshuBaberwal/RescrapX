'use client'

import React from 'react';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Headphones,
} from 'lucide-react';
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
} from "react-icons/fa";

export default function ContactUs() {
    return (
        <div className="w-full bg-[#FBFDFB] min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl space-y-8">

                {/* Hero Header Banner */}
                <div className="relative w-full bg-[#EFF5F0] rounded-3xl p-8 sm:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between text-center md:text-left">

                    {/* Background Decorative Graphic Elements */}
                    <div className="absolute top-4 left-6 grid grid-cols-4 gap-1.5 opacity-20 pointer-events-none">
                        {[...Array(16)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0B5B32]"></div>
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                    {/* Header Text Content */}
                    <div className="space-y-3 z-10 max-w-md">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                            Contact Us
                        </h1>
                        <p className="text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed">
                            We&apos;re here to help! Reach out to us for any queries, support or partnership opportunities.
                        </p>
                    </div>

                    {/* Right Floating Badge Graphic */}
                    <div className="relative mt-8 md:mt-0 z-10 flex items-center justify-center">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white/70 rounded-full flex items-center justify-center border border-emerald-100 shadow-2xs relative">
                            <Headphones size={54} className="text-[#0B5B32] stroke-[1.5]" />

                            {/* Surrounding Icon Badges */}
                            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#0B5B32] text-white flex items-center justify-center shadow-xs">
                                <Mail size={14} />
                            </div>
                            <div className="absolute top-2 -left-4 w-8 h-8 rounded-full bg-[#0B5B32] text-white flex items-center justify-center shadow-xs">
                                <Phone size={14} />
                            </div>
                            <div className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-[#0B5B32] text-white flex items-center justify-center shadow-xs">
                                <MapPin size={14} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Central Contact Details Card */}
                <div className="max-w-lg mx-auto bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">

                    <div className="space-y-1">
                        <h3 className="text-base font-extrabold text-gray-900">
                            Get in Touch
                        </h3>
                        <div className="w-7 h-0.5 bg-[#0B5B32] rounded-full"></div>
                    </div>

                    <div className="space-y-6 divide-y divide-gray-100">

                        {/* Phone Item */}
                        <div className="flex items-start gap-4 pt-1">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-[#0B5B32] shrink-0">
                                <Phone size={20} className="fill-[#0B5B32]" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-gray-900">Phone</h4>
                                <p className="text-xs font-semibold text-gray-700">+91 9990856709</p>
                                <p className="text-[10px] font-medium text-gray-400">Mon - Sat | 9:00 AM - 6:00 PM</p>
                            </div>
                        </div>

                        {/* Email Item */}
                        <div className="flex items-start gap-4 pt-5">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-[#0B5B32] shrink-0">
                                <Mail size={20} />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-gray-900">Email</h4>
                                <a href="mailto:support@rescrapx.com" className="text-xs font-semibold text-gray-700 hover:text-[#0B5B32] transition">
                                    support@rescrapx.com
                                </a>
                            </div>
                        </div>

                        {/* Address Item */}
                        <div className="flex items-start gap-4 pt-5">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-[#0B5B32] shrink-0">
                                <MapPin size={20} className="fill-[#0B5B32]" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-gray-900">Address</h4>
                                <p className="text-xs font-semibold text-gray-700">IIIT DHARWAD,</p>
                                <p className="text-xs font-semibold text-gray-700">DHarwad, Karnataka</p>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="pt-5 space-y-3">
                            <h4 className="text-xs font-bold text-gray-900">Follow Us</h4>
                            <div className="flex items-center gap-3">
                                <a href="#" className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0B5B32] rounded-full transition">
                                    <FaFacebookF size={16} />
                                </a>
                                <a href="#" className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0B5B32] rounded-full transition">
                                    <FaInstagram size={16} />
                                </a>
                                <a href="#" className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0B5B32] rounded-full transition">
                                    <FaLinkedinIn size={16} />
                                </a>
                                <a href="#" className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0B5B32] rounded-full transition">
                                    <FaYoutube size={16} />
                                </a>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Quick Response Bottom Bar */}
                <div className="w-full bg-[#EFF5F0] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">

                    <div className="flex items-center gap-4 z-10">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 text-[#0B5B32] flex items-center justify-center shrink-0">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-extrabold text-gray-900">Quick Response</h4>
                            <p className="text-[10px] sm:text-xs font-medium text-gray-600">
                                Our team usually responds within 24 hours on business days.
                            </p>
                        </div>
                    </div>

                    {/* Right Skyline Vector Graphic */}
                    <div className="flex items-end gap-1 opacity-40 shrink-0 z-10 h-10">
                        <div className="w-1.5 h-6 bg-[#0B5B32] rounded-t-xs"></div>
                        <div className="w-2 h-8 bg-[#0B5B32] rounded-t-xs"></div>
                        <div className="w-1.5 h-4 bg-[#0B5B32] rounded-t-xs"></div>
                        <div className="w-2.5 h-10 bg-[#0B5B32] rounded-t-xs"></div>
                        <div className="w-2 h-7 bg-[#0B5B32] rounded-t-xs"></div>
                        <div className="w-1.5 h-5 bg-[#0B5B32] rounded-t-xs"></div>
                    </div>

                </div>

            </div>
        </div>
    );
}