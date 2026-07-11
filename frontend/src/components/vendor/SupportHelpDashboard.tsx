'use client';

import React, { useState } from 'react';
import { 
  Search, HelpCircle, TicketPlus, ClipboardList, BookOpen, 
  ChevronDown, ChevronRight, Phone, Mail, Clock, FileText, 
  Info, ArrowRight, Calendar
} from 'lucide-react';

export default function SupportHelpDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Quick Support Action Cards Configuration
  const assistanceCards = [
    { title: 'FAQs', desc: 'Find quick answers to common questions.', linkText: 'View FAQs', icon: HelpCircle, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { title: 'Raise a Ticket', desc: 'Facing an issue? Report it to our support team.', linkText: 'Raise Ticket', icon: TicketPlus, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { title: 'My Tickets', desc: 'Track and view status of your support tickets.', linkText: 'View Tickets', icon: ClipboardList, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { title: 'Guides & Resources', desc: 'Step-by-step guides and helpful resources.', linkText: 'View Resources', icon: BookOpen, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' }
  ];

  // Frequently Asked Questions Array Stream
  const faqs = [
    { q: 'How do I participate in an auction?', a: 'To participate in live auctions, navigate to the "Live Auctions" tab in your sidebar dashboard panel, choose an active listing, read the vehicle guidelines, and place your competitive bid within the allotted time interval.' },
    { q: 'What documents are required for vehicle pickup?', a: 'You will need the original registration certificate (RC), valid identification proofs, verified yard release forms, and authorized gate passes for processing updates.' },
    { q: 'When will I receive the payment after winning an auction?', a: 'Payments are initialized automatically inside the settlement ledger pipeline within 24-48 working hours after documentation checks finalize.' },
    { q: 'How do I check the status of my documents?', a: 'Check documentation milestones instantly under the dedicated "Documents" tab or check individual logs within the vehicle history interface updates.' },
    { q: 'What are the charges deducted from my final payment?', a: 'Standard administrative fees, processing yard handling charges, and applicable transport logistics updates are calculated and detailed before payouts.' },
    { q: 'How do I schedule a pickup for a vehicle?', a: 'Access the "Pickup Schedule" workspace inside the sidebar panel, click on new slot assignments, input address data sheets, and hit submit to assign transport partners.' }
  ];

  // Popular Resources Document Checklist Links
  const popularResources = [
    'Scrapping Process Guide',
    'Required Documents List',
    'Payment & Settlement Policy',
    'Pickup & Inspection Policy',
    'Partner Terms & Conditions'
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-6 w-full text-xs text-gray-700 antialiased">
      
      {/* 1. TOP HEADER APP BAR BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-black text-gray-900 text-sm tracking-tight">Support & Help</h3>
          <p className="text-[10px] text-gray-400 font-bold">We're here to help you. Find answers or contact our team.</p>
        </div>
        <button className="bg-white border border-gray-200 hover:bg-gray-50 rounded-xl px-3 py-1.5 font-black text-gray-700 flex items-center gap-2 self-start sm:self-auto shadow-3xs cursor-pointer">
          <Calendar size={13} className="text-[#0B5B32]" />
          <span>8 Jun 2025 - 8 Jul 2025</span>
          <ChevronDown size={11} className="text-gray-400" />
        </button>
      </div>

      {/* 2. CORE MASTER COLUMN SPLIT LAYOUT SHEET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
        
        {/* LEFT PRIMARY PANEL CANVAS INTERACTION STACK */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          
          {/* SEARCH HERO ILLUSTATION WELCOME BANNER PANEL */}
          <div className="bg-gradient-to-r from-emerald-50/60 to-teal-50/20 border border-emerald-100/40 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 min-h-[160px]">
            <div className="space-y-4 max-w-md w-full z-10 text-center md:text-left">
              <div className="space-y-1">
                <h4 className="font-black text-gray-900 text-sm tracking-tight">How can we help you today?</h4>
                <p className="text-[10px] text-gray-400 font-bold">Search for answers or browse help topics.</p>
              </div>
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search for help articles, topics or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200/80 rounded-xl pl-3 pr-9 py-2.5 text-gray-800 font-medium placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-700 shadow-3xs"
                />
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Support Agent Avatar Illustration Frame Layout */}
            <div className="relative hidden md:flex items-end justify-center h-full shrink-0 -mb-6 self-end mr-6">
              <div className="w-32 h-32 bg-emerald-700/10 rounded-full absolute bottom-2 blur-xl" />
              {/* Simplified vector presentation placeholder equivalent to design element */}
              <div className="relative z-10 bg-emerald-800 text-emerald-100 p-4 rounded-t-2xl border border-emerald-700 w-28 text-center space-y-1 font-black shadow-lg">
                <div className="w-8 h-8 rounded-full bg-emerald-600 mx-auto flex items-center justify-center text-xs">CS</div>
                <p className="text-[9px] leading-none">RescrapX</p>
                <div className="w-4 h-1 bg-emerald-500 mx-auto rounded-full mt-1" />
              </div>
            </div>
          </div>

          {/* ASSISTANCE CHANNELS CARD GRID NAVIGATION PANEL */}
          <div className="space-y-3">
            <h4 className="font-black text-gray-900 text-[11px] tracking-tight">How can we assist you?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {assistanceCards.map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs flex flex-col justify-between items-start space-y-3 hover:border-emerald-200/60 transition-colors">
                    <div className="space-y-1.5">
                      <div className={`p-2 rounded-xl border ${card.color} w-fit`}>
                        <CardIcon size={14} />
                      </div>
                      <h5 className="font-black text-gray-900 text-[11px]">{card.title}</h5>
                      <p className="text-[10px] text-gray-400 font-bold leading-normal">{card.desc}</p>
                    </div>
                    <button className="text-[#0B5B32] font-black text-[10px] flex items-center gap-0.5 hover:underline pt-1 cursor-pointer">
                      <span>{card.linkText}</span>
                      <ArrowRight size={11} className="mt-0.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ INTERACTIVE ACCORDION BLOCK SHEET SECTION */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h4 className="font-black text-gray-900 text-[11px] tracking-tight">Frequently Asked Questions</h4>
              <button className="text-[#0B5B32] font-black text-[10px] hover:underline flex items-center gap-0.5 cursor-pointer">
                <span>View All FAQs</span>
                <ArrowRight size={11} />
              </button>
            </div>

            <div className="divide-y divide-gray-50">
              {faqs.map((faq, fIdx) => (
                <div key={fIdx} className="py-2.5 first:pt-0 last:pb-0">
                  <button 
                    onClick={() => toggleFaq(fIdx)}
                    className="w-full flex items-center justify-between text-left font-black text-gray-800 hover:text-gray-900 py-1 cursor-pointer"
                  >
                    <span className="text-[11px] tracking-tight">{faq.q}</span>
                    <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 shrink-0 ml-4 ${openFaq === fIdx ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-200 ${openFaq === fIdx ? 'max-h-24 opacity-100 pt-2' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[10px] text-gray-400 font-bold leading-relaxed pl-0.5">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom inline alert notification utility banner strip */}
            <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-800 font-bold">
              <div className="flex items-center gap-2">
                <Info size={13} className="text-[#0B5B32] shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-[10px]">Still have questions? Raise a ticket and our team will get back to you.</p>
              </div>
              <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-1 rounded-xl shadow-3xs text-[10px] font-black cursor-pointer shrink-0">
                Raise a Ticket
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT STICKY SIDEBAR PANELS COLUMN ASSIGNMENTS */}
        <div className="space-y-6 lg:sticky lg:top-4">
          
          {/* INSTANT CONTACT CHANNELS SUMMARY CARD SYSTEM */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-4">
            <h4 className="font-black text-gray-900 text-[12px] tracking-tight border-b border-gray-50 pb-2">Contact Support</h4>
            
            <p className="text-[10px] text-gray-400 font-bold -mt-2 leading-relaxed">Our support team is available to help you.</p>

            <div className="space-y-3.5 pt-1">
              
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-emerald-50 text-[#0B5B32] rounded-xl shrink-0 mt-0.5"><Phone size={13} /></div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-gray-400 font-black block uppercase tracking-wide">Call Us</span>
                  <p className="font-black text-gray-900 text-[11px]">+91 11 4567 8900</p>
                  <p className="text-[9px] text-gray-400 font-medium">Mon - Sat, 9:00 AM - 7:00 PM</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-emerald-50 text-[#0B5B32] rounded-xl shrink-0 mt-0.5"><Mail size={13} /></div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-gray-400 font-black block uppercase tracking-wide">Email Us</span>
                  <p className="font-black text-emerald-800 text-[11px] hover:underline cursor-pointer">support@rescrapx.com</p>
                  <p className="text-[9px] text-gray-400 font-medium">We reply within 24 hours</p>
                </div>
              </div>

              <div className="flex gap-3 items-start border-t border-gray-50 pt-3">
                <div className="p-2 bg-emerald-50 text-[#0B5B32] rounded-xl shrink-0 mt-0.5"><Clock size={13} /></div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-gray-400 font-black block uppercase tracking-wide">Response Time</span>
                  <p className="font-black text-gray-800 text-[11px]">Within 24 working hours</p>
                </div>
              </div>

            </div>
          </div>

          {/* POPULAR DOCUMENT GUIDEBOOK REPOSITORY LINKS GRID PANEL */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs space-y-3">
            <h4 className="font-black text-gray-900 text-[12px] tracking-tight border-b border-gray-50 pb-2 flex items-center gap-1.5">
              <FileText size={13} className="text-[#0B5B32]" />
              <span>Popular Resources</span>
            </h4>
            
            <div className="space-y-0.5">
              {popularResources.map((docName, rIdx) => (
                <button key={rIdx} className="w-full p-2 rounded-xl flex items-center justify-between group hover:bg-gray-50 transition-all text-left cursor-pointer">
                  <span className="font-bold text-gray-600 group-hover:text-gray-900 text-[11px] truncate pr-2">{docName}</span>
                  <ChevronRight size={13} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-gray-50">
              <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-black py-2 rounded-xl text-center shadow-3xs transition-all text-[11px] cursor-pointer">
                View All Resources
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}