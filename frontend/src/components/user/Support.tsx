'use client'

import React, { useState } from 'react';
import { 
  Search, Phone, Mail, MessageCircle, MessageSquare, 
  ChevronRight, ChevronDown, Ticket, Clock, CheckCircle2, 
  ShieldCheck, ArrowUpRight 
} from 'lucide-react';

export default function Support() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const quickLinks = [
    "Scrapping Process Guide",
    "Required Documents",
    "Vehicle Valuation Guide",
    "Pickup & Inspection",
    "Payment & Settlement",
    "RC Deregistration (FAQ)",
    "Certificate of Deposit",
    "Policies & Terms"
  ];

  const contactMethods = [
    { title: "Call Us", desc: "Speak to our support executive.", value: "+91 98765 43210", note: "Mon - Sat | 9:00 AM - 7:00 PM", icon: Phone, color: "text-[#0B5B32]", bg: "bg-emerald-50", isLink: false },
    { title: "Email Us", desc: "Drop us an email and we'll get back to you.", value: "support@rescrapx.com", note: "We reply within 2 hours", icon: Mail, color: "text-[#0B5B32]", bg: "bg-emerald-50", isLink: true },
    { title: "WhatsApp Us", desc: "Chat with us on WhatsApp.", value: "+91 98765 43210", note: "Mon - Sat | 9:00 AM - 7:00 PM", icon: MessageCircle, color: "text-[#0B5B32]", bg: "bg-emerald-50", isLink: false },
  ];

  const faqs = [
    { q: "How does the vehicle scrapping process work?", a: "The process is simple: Request valuation, accept the offer, schedule a free pickup, get your documents verified, receive secure payment, and finally, obtain your official Certificate of Deposit and RC deregistration." },
    { q: "What documents are required for scrapping my vehicle?", a: "You generally require the original Registration Certificate (RC), identity proof (Aadhaar/PAN), address proof, and bank details for payment processing." },
    { q: "How is the valuation of my vehicle done?", a: "Valuation is computed instantly using factory metrics, metallic weight charts, vehicle condition inputs, and active market recycling valuations." },
    { q: "Is there a pickup charge for my vehicle?", a: "No, RescrapX provides 100% complimentary hassle-free vehicle towing and pickup services from your specified location." },
    { q: "When and how will I receive the payment?", a: "Payments are initiated digitally via bank transfer (NEFT/RTGS/UPI) right at the time of physical vehicle pickup and dynamic validation." },
    { q: "What is a Certificate of Deposit?", a: "It is an official legal instrument issued upon scrappage that protects you from future vehicle liabilities and unlocks tax concessions on your next vehicle purchase." },
    { q: "How long does RC deregistration take?", a: "Deregistration processing through respective RTO channels generally maps between 2 to 4 weeks depending on institutional queues." }
  ];

  const tickets = [
    { id: "RSX-81234", category: "Payment related query", date: "10 July 2026", status: "Resolved", statusColor: "bg-emerald-50 text-emerald-700" },
    { id: "RSX-79421", category: "Document upload issue", date: "05 July 2024", status: "Resolved", statusColor: "bg-emerald-50 text-emerald-700" },
    { id: "RSX-78109", category: "Pickup reschedule request", date: "28 June 2024", status: "In Progress", statusColor: "bg-blue-50 text-blue-700" },
  ];

  return (
    <div className="w-full space-y-8 text-[#374151]">
      
      {/* ========================================== */}
      {/* PAGE HEADER HERO BLOCK                     */}
      {/* ========================================== */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Support & Help</h1>
        <p className="text-xs font-semibold text-gray-400 mt-0.5">We're here to help you at every step of your scrapping journey.</p>
      </div>

      {/* ========================================== */}
      {/* INNER SEARCH ACTION HERO HERO CARD         */}
      {/* ========================================== */}
      <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-4 w-full md:max-w-md z-10">
          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">How can we help you today?</h2>
            <p className="text-xs font-semibold text-gray-400">Search for help articles, guides or get in touch with our support team.</p>
          </div>
          
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search for help articles (e.g. pickup, payment, documents...)"
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#0B5B32] shadow-2xs transition placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Floating Custom Illustrator Banner Node Component */}
        <div className="relative hidden md:flex items-center gap-4 pr-6">
          <div className="bg-white border border-emerald-100 p-2.5 rounded-xl shadow-2xs text-[10px] font-black leading-tight max-w-[100px] text-gray-700 absolute -left-16 top-4">
            Need help? We're here for you!
          </div>
          <div className="w-24 h-24 bg-[#0B5B32] rounded-full flex items-center justify-center text-4xl text-white border-4 border-white shadow-xs">
            👩‍💻
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* TWO COLUMN GRID CONTENT GRID               */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONTACT CHANNELS & FAQS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Get In Touch Channels Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-black text-gray-900">Get in Touch</h3>
              <p className="text-[11px] font-semibold text-gray-400 mt-0.5">Choose the best way to connect with our support team.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {contactMethods.map((method, idx) => {
                const Icon = method.icon;
                return (
                  <div key={idx} className="bg-white border border-gray-100 p-4 rounded-xl flex flex-col justify-between items-center text-center shadow-2xs space-y-4">
                    <div className="space-y-2 flex flex-col items-center">
                      <div className={`p-2.5 rounded-xl ${method.bg} ${method.color}`}>
                        <Icon size={18} />
                      </div>
                      <h4 className="text-xs font-black text-gray-900">{method.title}</h4>
                      <p className="text-[10px] text-gray-400 font-medium leading-tight max-w-[140px]">{method.desc}</p>
                    </div>

                    <div className="w-full space-y-1">
                      {method.isLink ? (
                        <a href={`mailto:${method.value}`} className="text-xs font-extrabold text-[#0B5B32] block hover:underline truncate">
                          {method.value}
                        </a>
                      ) : (
                        <p className="text-xs font-extrabold text-gray-800 tracking-tight">{method.value}</p>
                      )}
                      <p className="text-[9px] font-bold text-gray-400 whitespace-nowrap">{method.note}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion Section Component */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-900">Frequently Asked Questions</h3>
              <button className="text-[11px] font-black text-[#0B5B32] hover:underline">View All FAQs</button>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100 shadow-2xs overflow-hidden">
              {faqs.map((faq, idx) => (
                <div key={idx} className="w-full text-left">
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-4 py-3.5 flex items-center justify-between text-xs font-bold text-gray-800 hover:bg-gray-50/50 transition gap-4"
                  >
                    <span>{faq.q}</span>
                    <div className="text-gray-400 shrink-0">
                      {openFaq === idx ? <ChevronDown size={14} className="rotate-180 transition" /> : <ChevronDown size={14} className="transition" />}
                    </div>
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 pt-1 text-[11px] font-medium leading-relaxed text-gray-500 bg-gray-50/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: QUICK LINKS & TICKETS LIST */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Links Nav Card */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider pb-1 border-b border-gray-50">Quick Links</h3>
            <div className="flex flex-col text-xs font-bold text-gray-600">
              {quickLinks.map((link, idx) => (
                <button key={idx} className="w-full py-2 flex items-center justify-between group hover:text-gray-900 transition">
                  <span>{link}</span>
                  <ChevronRight size={12} className="text-gray-400 group-hover:text-gray-600 transition" />
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Standalone Request Card Panel */}
          <div className="bg-emerald-50/30 border border-emerald-100/70 rounded-xl p-4 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white rounded-lg border border-emerald-100 text-[#0B5B32] shadow-3xs"><Ticket size={16} /></div>
              <div>
                <h4 className="text-xs font-black text-gray-900">Still can't find what you need?</h4>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 leading-tight">Submit a support ticket and our team will assist you.</p>
              </div>
            </div>
            <button className="w-full bg-[#0B5B32] hover:bg-[#094d2a] text-white font-bold text-xs py-2.5 rounded-lg transition shadow-xs">
              Raise a Ticket
            </button>
          </div>

          {/* My Support Tickets Activity Tracker Component */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">My Support Tickets</h3>
              <button className="text-[10px] font-black text-[#0B5B32] hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {tickets.map((ticket, idx) => (
                <div key={idx} className="bg-white border border-gray-100 p-3.5 rounded-xl space-y-2 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-gray-50 text-gray-400 rounded-lg mt-0.5"><Clock size={12} /></div>
                      <div>
                        <p className="text-[11px] font-mono font-black text-gray-800">{ticket.id}</p>
                        <p className="text-xs font-bold text-gray-700 mt-0.5 leading-tight">{ticket.category}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${ticket.statusColor}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium pl-7">{ticket.date}</p>
                </div>
              ))}
            </div>

            <button className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition shadow-2xs flex items-center justify-center gap-1">
              <span>Raise a New Ticket</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================== */}
      {/* CORE BRAND ASSURANCE SATISFACTION ROW      */}
      {/* ========================================== */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row items-center gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-3 bg-emerald-50 text-[#0B5B32] rounded-xl shrink-0">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900">Your satisfaction is our priority</h4>
            <p className="text-xs text-gray-400 font-medium max-w-sm mt-0.5 leading-relaxed">
              Our dedicated support team is always ready to help you with a smooth and transparent scrapping experience.
            </p>
          </div>
        </div>

        {/* Value Pitch Badges Matrix Layout */}
        <div className="grid grid-cols-3 gap-4 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6 flex-1 w-full text-center sm:text-left">
          <div>
            <p className="text-xs font-black text-gray-900">Quick Response</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5 leading-tight">We respond within 2 hours</p>
          </div>
          <div>
            <p className="text-xs font-black text-gray-900">Expert Support</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5 leading-tight">Trained professionals ready to assist</p>
          </div>
          <div>
            <p className="text-xs font-black text-gray-900">Customer First</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5 leading-tight">Your satisfaction is our top priority</p>
          </div>
        </div>
      </div>

    </div>
  );
}