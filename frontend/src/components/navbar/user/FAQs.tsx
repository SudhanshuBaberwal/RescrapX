'use client'

import React, { useState } from 'react';
import {
  ChevronDown,
  Car,
  Recycle,
  ShieldCheck,
  FileText,
  IndianRupee,
  Truck,
  CreditCard,
  FileCheck,
  Lock,
  Headphones,
  MessageSquare,
  PhoneCall
} from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: React.ElementType;
}

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const faqData: FAQItem[] = [
    {
      id: 1,
      icon: Car,
      question: "What is RescrapX?",
      answer: "RescrapX is a digital platform that connects vehicle owners with Registered Vehicle Scrapping Facilities (RVSFs). We make the scrapping process easy, transparent and compliant with government guidelines."
    },
    {
      id: 2,
      icon: Recycle,
      question: "Why should I scrap my old vehicle?",
      answer: "Scrapping an old vehicle helps ensure safe disposal, recycling, and compliance with applicable rules."
    },
    {
      id: 3,
      icon: ShieldCheck,
      question: "Is RescrapX authorized by the government?",
      answer: "RescrapX connects users with registered RVSFs. The scrapping is carried out by the selected RVSF."
    },
    {
      id: 4,
      icon: FileText,
      question: "What documents do I need to scrap my vehicle?",
      answer: "You generally need your RC, identity proof, and other required vehicle documents."
    },
    {
      id: 5,
      icon: IndianRupee,
      question: "How much will I get for my vehicle?",
      answer: "The amount depends on the vehicle and the bid/offer provided by the RVSF."
    },
    {
      id: 6,
      icon: Truck,
      question: "Do you provide pickup service for my vehicle?",
      answer: "Yes, pickup can be arranged through RescrapX where the service is available."
    },
    {
      id: 7,
      icon: CreditCard,
      question: "How and when will I receive the payment?",
      answer: "Payment is made as per the terms of the selected RVSF after the required process is completed."
    },
    {
      id: 8,
      icon: FileCheck,
      question: "What is a Certificate of Deposit (CoD)?",
      answer: "A CoD is a document confirming that your vehicle has been deposited for scrapping at an authorized facility."
    },
    {
      id: 9,
      icon: Lock,
      question: "Is my data safe with RescrapX?",
      answer: "Yes. We take reasonable measures to protect your information and follow our Privacy Policy."
    },
    {
      id: 10,
      icon: Headphones,
      question: "Whom can I contact for support?",
      answer: "You can contact us through the Contact Us page for any assistance."
    }
  ];

  return (
    <section className="w-full bg-[#FAFBF9] min-h-screen py-6 sm:py-10 px-0 font-sans flex flex-col items-center">
      <div className="w-full max-w-5xl px-4 sm:px-6 space-y-8">

        {/* Hero Header Banner */}
        <div className="relative w-full rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
          
          {/* Header Text Content */}
          <div className="space-y-2 z-10 max-w-lg">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-gray-900 tracking-tight leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 leading-relaxed">
              Find answers to common questions about RescrapX and the vehicle scrapping process.
            </p>
          </div>

          {/* Right Floating Badge Graphic */}
          <div className="relative z-10 self-end md:self-center shrink-0">
            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#EAF3EC] rounded-full flex items-center justify-center relative">
              <span className="text-6xl sm:text-7xl font-bold text-[#8FB899]/70 select-none">
                ?
              </span>
              <div className="absolute bottom-2 right-2 p-2.5 bg-[#0B5B32] text-white rounded-2xl shadow-md">
                <MessageSquare size={20} className="fill-white" />
              </div>
            </div>
          </div>

        </div>

        {/* Accordion List with Smooth Height Transition */}
        <div className="space-y-3">
          {faqData.map((item) => {
            const Icon = item.icon;
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className={`w-full p-4 sm:p-5 flex items-center justify-between text-left transition-colors duration-200 cursor-pointer ${
                    isOpen ? 'bg-[#F2F7F3]' : 'hover:bg-gray-50/80'
                  }`}
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <div className="p-2.5 bg-[#EAF5EE] text-[#0B5B32] rounded-xl shrink-0">
                      <Icon size={18} className="stroke-[2.2]" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      {item.question}
                    </span>
                  </div>

                  <ChevronDown
                    size={18}
                    className={`text-gray-700 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* CSS Grid Animation for Smooth Collapse/Expand */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden bg-[#F2F7F3]">
                    <div className="px-5 pb-5 pt-1 border-t border-gray-100/60 text-xs sm:text-sm font-semibold text-gray-600 leading-relaxed pl-14 sm:pl-16">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Bottom Callout */}
        <div className="w-full bg-[#EAF3EC] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-100/50">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white text-[#0B5B32] flex items-center justify-center shrink-0 shadow-xs">
              <Headphones size={22} className="stroke-[2]" />
            </div>
            <div className="space-y-0.5 text-center sm:text-left">
              <h4 className="text-xs sm:text-sm font-black text-gray-900">
                Still have questions?
              </h4>
              <p className="text-[11px] sm:text-xs font-semibold text-gray-600">
                We&apos;re here to help. Reach out to our support team and we&apos;ll get back to you as soon as possible.
              </p>
            </div>
          </div>

          <a
            href="/contact"
            className="flex items-center gap-2 border border-[#0B5B32] text-[#0B5B32] hover:bg-[#0B5B32] hover:text-white transition-all duration-200 font-bold text-xs px-5 py-2.5 rounded-xl shrink-0 bg-white sm:bg-transparent shadow-2xs"
          >
            <PhoneCall size={14} />
            <span>Contact Us</span>
          </a>

        </div>

      </div>
    </section>
  );
}