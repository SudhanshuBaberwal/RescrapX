'use client'

import React from 'react';
import { Mail, Phone, MapPin, ChevronRight } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <main className="w-full bg-white font-sans text-gray-800 py-8 px-4 sm:px-8 lg:px-16 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <a href="/" className="hover:text-gray-900 transition-colors">Home</a>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-gray-900 font-semibold">Privacy Policy</span>
        </nav>

        {/* Page Title & Header Info */}
        <div className="space-y-2 pb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            Last updated: 21 May 2025
          </p>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-2">
            RescrapX (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store and protect your personal information when you use our website and services.
          </p>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            By using RescrapX, you agree to the practices described in this policy.
          </p>
        </div>

        <hr className="border-gray-200 my-4" />

        {/* Section 1 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            1. Information We Collect
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We may collect the following types of information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <li><strong className="text-gray-900">Personal Information:</strong> Name, mobile number, email address, address, identity proof details, etc.</li>
            <li><strong className="text-gray-900">Vehicle Information:</strong> Registration number, make, model, year, fuel type, condition, and other related details.</li>
            <li><strong className="text-gray-900">Documents:</strong> RC, insurance, PUC, and other documents you upload.</li>
            <li><strong className="text-gray-900">Usage Information:</strong> Information about how you use our website and services.</li>
            <li><strong className="text-gray-900">Device & Technical Information:</strong> IP address, browser type, device information, and cookies.</li>
          </ul>
        </section>

        <hr className="border-gray-200" />

        {/* Section 2 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            2. How We Use Your Information
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <li>Provide, operate and maintain our services.</li>
            <li>Connect you with Registered Vehicle Scrapping Facilities (RVSFs).</li>
            <li>Process bids, offers and payments.</li>
            <li>Communicate with you about your requests and transactions.</li>
            <li>Improve our website, services and user experience.</li>
            <li>Comply with legal obligations and prevent fraud.</li>
          </ul>
        </section>

        <hr className="border-gray-200" />

        {/* Section 3 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            3. Information Sharing
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We do not sell your personal information. We may share your information only in the following cases:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <li>With Registered Vehicle Scrapping Facilities (RVSFs) to help them place bids and provide services.</li>
            <li>With service providers who help us operate our platform (e.g., hosting, analytics, communication).</li>
            <li>When required by law, regulation or valid legal process.</li>
            <li>In case of business transfer, merger or acquisition, with proper confidentiality obligations.</li>
          </ul>
        </section>

        <hr className="border-gray-200" />

        {/* Section 4 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            4. Cookies and Tracking Technologies
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We use cookies and similar technologies to enhance your browsing experience, analyze website traffic and understand user behavior. You can choose to disable cookies in your browser settings, but some features of the website may not function properly.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 5 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            5. Data Security
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 6 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            6. Your Rights
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            You have the right to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <li>Access, update or correct your personal information.</li>
            <li>Request deletion of your personal information.</li>
            <li>Withdraw your consent at any time.</li>
          </ul>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
            To exercise these rights, please contact us using the details provided at the end of this policy.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 7 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            7. Data Retention
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We retain your information only for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 8 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            8. Third-Party Links
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites. We encourage you to read their privacy policies.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 9 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            9. Changes to This Policy
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time. The updated version will be posted on this page with the revised date. Continued use of our website after changes indicates your acceptance of the updated policy.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 10: Contact Us */}
        <section className="space-y-3 py-2 pt-1">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            10. Contact Us
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us:
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-700 font-medium pt-1">
            <a
              href="mailto:info@rescrapx.com"
              className="flex items-center gap-2 hover:text-[#0B5B32] transition-colors"
            >
              <Mail size={16} className="text-gray-500" />
              <span>info@rescrapx.com</span>
            </a>

            <span className="text-gray-300 hidden sm:inline">|</span>

            <a
              href="tel:+919990856709"
              className="flex items-center gap-2 hover:text-[#0B5B32] transition-colors"
            >
              <Phone size={16} className="text-gray-500" />
              <span>+91 9990856709</span>
            </a>

            <span className="text-gray-300 hidden sm:inline">|</span>

            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-500" />
              <span>IIT Dharwad, Dharwad, Karnataka</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}