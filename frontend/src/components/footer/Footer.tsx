import React from 'react';
import { Smartphone, Mail, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-gray-400 text-xs mt-20 pt-14 pb-8 border-t-4 border-[#0B5B32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-800">
        
        {/* Bio Segment */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-xl font-bold text-white tracking-tight">
              <span className="text-emerald-500">🚗 Rescrap</span>
              <span className="text-[#10B981]">X</span>
            </div>
            <p className="text-gray-500 text-[9px] font-bold tracking-wider uppercase">Recycle Today, Drive Tomorrow</p>
          </div>
          <p className="text-gray-400 leading-relaxed font-medium">
            India's premier digital infrastructure platform for end-of-life vehicle disposal, delivering authorized transparent recycling protocols.
          </p>
        </div>

        {/* Dynamic Directory Loops */}
        {/* Company Links */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white tracking-wider uppercase">Company</h4>
          <ul className="space-y-2 font-medium">
            {["About Us", "Careers", "Blog", "Newsroom", "Contact Us"].map((link) => (
              <li key={link}><a href="#" className="hover:text-white transition">{link}</a></li>
            ))}
          </ul>
        </div>

        {/* Services Directory */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white tracking-wider uppercase">Services</h4>
          <ul className="space-y-2 font-medium">
            {["Instant Valuation", "Vehicle Pickup", "RC Deregistration", "Certificate of Deposit", "ELV Services"].map((link) => (
              <li key={link}><a href="#" className="hover:text-white transition">{link}</a></li>
            ))}
          </ul>
        </div>

        {/* Resources Panel */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white tracking-wider uppercase">Resources</h4>
          <ul className="space-y-2 font-medium">
            {["Scrapping Guide", "Required Documents", "Vehicle Valuation Guide", "FAQs", "Blogs"].map((link) => (
              <li key={link}><a href="#" className="hover:text-white transition">{link}</a></li>
            ))}
          </ul>
        </div>

        {/* Dynamic Service Helpline Panel */}
        <div className="space-y-4 bg-gray-900/60 p-4 rounded-xl border border-gray-800">
          <h4 className="text-sm font-bold text-white tracking-wider uppercase">Need Help?</h4>
          <div className="flex gap-2.5 items-center">
            <Smartphone size={16} className="text-emerald-500" />
            <div>
              <p className="text-white font-black text-sm tracking-wide">+91 98765 43210</p>
              <p className="text-[10px] text-gray-500 font-bold mt-0.5">Mon - Sat | 9:00 AM - 7:00 PM</p>
            </div>
          </div>
          <div className="flex gap-2.5 items-center pt-1 border-t border-gray-800">
            <Mail size={16} className="text-emerald-500" />
            <p className="text-white font-bold hover:underline cursor-pointer">support@rescrapx.com</p>
          </div>
        </div>

      </div>

      {/* Safety Compliance Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-500 font-semibold text-[11px]">
        <p>© 2026 RescrapX Inc. All rights reserved globally.</p>
        
        <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800">
          <CreditCard size={14} className="text-emerald-500" />
          <span>Verified Secure Payment Architecture</span>
        </div>

        {/* Payments Badge Indicators */}
        <div className="flex items-center gap-2 opacity-60 grayscale">
          <span className="bg-white text-black px-1.5 py-0.5 rounded-xs font-black text-[9px]">UPI</span>
          <span className="bg-white text-blue-900 px-1.5 py-0.5 rounded-xs font-black text-[9px] italic">VISA</span>
          <span className="bg-white text-orange-600 px-1.5 py-0.5 rounded-xs font-black text-[9px]">mastercard</span>
          <span className="bg-white text-amber-800 px-1.5 py-0.5 rounded-xs font-black text-[9px]">RuPay</span>
        </div>
      </div>
    </footer>
  );
}