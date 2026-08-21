'use client'

import React from 'react';
import Image from 'next/image';
import {
    ClipboardCheck,
    Truck,
    FileCheck,
    Leaf,
    CreditCard,
    Headphones,
    ShieldCheck,
    Award,
    Lock,
    UserCheck,
    ArrowRight,
    Phone,
    MapPin,
    Mail,
} from 'lucide-react';
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,

} from "react-icons/fa";
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
    const router = useRouter();

    const services = [
        {
            icon: <ClipboardCheck className="w-8 h-8 text-[#0B5B32]" />,
            title: "Vehicle Evaluation",
            description: "Get a quick and accurate evaluation of your vehicle. Fill in a few details and receive the best market value instantly."
        },
        {
            icon: <Truck className="w-8 h-8 text-[#0B5B32]" />,
            title: "Vehicle Pickup",
            description: "Convenient pickup of your end-of-life vehicle from your location through our authorized RVSF network."
        },
        {
            icon: <FileCheck className="w-8 h-8 text-[#0B5B32]" />,
            title: "Documentation Assistance",
            description: "We assist with all the required paperwork including RC cancellation and issuance of Certificate of Depollution."
        },
        {
            icon: <Leaf className="w-8 h-8 text-[#0B5B32]" />,
            title: "Environment-Friendly Recycling",
            description: "Your vehicle is dismantled and recycled responsibly in an eco-friendly manner as per CPCB guidelines by authorized RVSFs."
        },
        {
            icon: <CreditCard className="w-8 h-8 text-[#0B5B32]" />,
            title: "Secure Payment",
            description: "Receive your payment securely directly to your bank account once the vehicle is successfully processed."
        },
        {
            icon: <Headphones className="w-8 h-8 text-[#0B5B32]" />,
            title: "Customer Support",
            description: "Our support team is always ready to assist you at every step and ensure a smooth scrapping experience."
        }
    ];

    return (
        <div className="w-full bg-[#FAFDFB] min-h-screen text-gray-800 font-sans flex flex-col justify-between">

            {/* Main Container */}
            <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-12 w-full">

                {/* 1. Header Hero Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-transparent">
                    <div className="space-y-4">
                        <span className="inline-block px-3 py-1 bg-[#E6F4EA] text-[#0B5B32] text-xs font-bold rounded-full uppercase tracking-wider">
                            OUR SERVICES
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                            Complete Vehicle Scrapping Solutions, <span className="text-[#0B5B32]">Made Simple</span>
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base max-w-lg leading-relaxed">
                            RescrapX offers end-to-end services to help you scrap your vehicle legally, safely and hassle-free.
                        </p>
                    </div>

                    <div className="relative w-full h-56 sm:h-72 flex items-center justify-center">
                        {/* Background Graphic Illustration / Image Placeholder */}
                        <div className="relative w-full h-full">
                            <Image
                                src="/Gemini_Generated_Image_q2253fq2253fq225.png" // Replace with your car illustration image path
                                alt="Green eco car scrapping"
                                width={350}
                                height={120}
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Services Grid (6 Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col items-center text-center space-y-4 transition hover:shadow-md"
                        >
                            <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center">
                                {service.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* 3. Trusted Banner Section */}
                <div className="bg-[#F2F8F4] border border-[#D4EAD9] rounded-2xl p-6 sm:p-8 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#0B5B32] text-white flex items-center justify-center shadow-md">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                    </div>

                    <div className="space-y-2 max-w-2xl mx-auto">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                            Trusted. Transparent. <span className="text-[#0B5B32]">Compliant.</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            RescrapX works only with authorized RVSFs and follows all government norms to ensure a safe and legal scrapping process.
                        </p>
                    </div>

                    {/* Compliance Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
                        <div className="flex flex-col items-center gap-1.5 p-2">
                            <ShieldCheck className="w-6 h-6 text-[#0B5B32]" />
                            <span className="text-xs font-bold text-gray-800">CPCB Compliant</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 p-2">
                            <Award className="w-6 h-6 text-[#0B5B32]" />
                            <span className="text-xs font-bold text-gray-800">Authorized RVSF Network</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 p-2">
                            <Lock className="w-6 h-6 text-[#0B5B32]" />
                            <span className="text-xs font-bold text-gray-800">100% Secure Process</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 p-2">
                            <UserCheck className="w-6 h-6 text-[#0B5B32]" />
                            <span className="text-xs font-bold text-gray-800">Hassle-Free Experience</span>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}