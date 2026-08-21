'use client'

import React from 'react';
import { Mail, Phone, ChevronRight } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <main className="w-full bg-white font-sans text-gray-800 py-8 px-4 sm:px-8 lg:px-16 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <a href="/" className="hover:text-gray-900 transition-colors">Home</a>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-gray-900 font-semibold">Terms and Conditions</span>
        </nav>

        {/* Page Title & Header Info */}
        <div className="space-y-2 pb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-xs font-semibold text-gray-500">
            Last updated: 21 May 2025
          </p>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-2">
            Welcome to RescrapX. These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of the RescrapX website and services. By using our platform, you agree to be bound by these Terms.
          </p>
        </div>

        <hr className="border-gray-200 my-4" />

        {/* Section 1 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            1. About RescrapX
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            RescrapX is a platform that connects vehicle owners with Registered Vehicle Scrapping Facilities (RVSFs) to facilitate the scrapping of End-of-Life Vehicles (ELVs) in a transparent, efficient and environmentally responsible manner.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 2 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            2. Eligibility
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            You must be at least 18 years old and the legal owner of the vehicle or authorized to act on behalf of the owner to use our services.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 3 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            3. Use of the Platform
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <li>You agree to provide accurate, current and complete information.</li>
            <li>You will not use the platform for any unlawful purpose or in any way that could harm, disrupt or impair the platform.</li>
            <li>You are responsible for maintaining the confidentiality of your account and all activities that occur under it.</li>
          </ul>
        </section>

        <hr className="border-gray-200" />

        {/* Section 4 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            4. Vehicle Information
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            You agree to provide accurate details about your vehicle, including but not limited to RC details, condition, and documents. RescrapX is not responsible for any loss or damage arising from incorrect or misleading information.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 5 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            5. Bidding and Offers
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
            <li>RVSFs on our platform may place bids for your vehicle.</li>
            <li>You are free to accept or reject any offer at your discretion.</li>
            <li>RescrapX does not guarantee any minimum price or that you will receive any offers.</li>
          </ul>
        </section>

        <hr className="border-gray-200" />

        {/* Section 6 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            6. Payments
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Payments will be made directly by the selected RVSF as per the agreed offer. RescrapX is not a party to the payment transaction and does not hold or process any payments.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 7 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            7. Vehicle Pickup and Scrapping
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Once you accept an offer, the RVSF will arrange for the pickup and scrapping of your vehicle. The process will be carried out as per applicable laws and regulations.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 8 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            8. Certificate of Destruction
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            After successful scrapping, the RVSF will issue a Certificate of Destruction (CoD). You are responsible for using this certificate for RC cancellation and any other legal formalities.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 9 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            9. Limitation of Liability
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            RescrapX acts as an intermediary platform and is not responsible for any actions, disputes or defaults by RVSFs. We do not warrant the quality, legality or completeness of any service provided by RVSFs.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 10 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            10. Indemnification
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            You agree to indemnify and hold RescrapX, its affiliates, directors, employees and partners harmless from any claims, damages, losses or expenses arising from your use of the platform or violation of these Terms.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 11 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            11. Changes to Terms
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We may update these Terms from time to time. The updated version will be posted on this page with the revised date. Continued use of the platform after changes means you accept the new Terms.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 12 */}
        <section className="space-y-2 py-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            12. Governing Law
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
          </p>
        </section>

        <hr className="border-gray-200" />

        {/* Section 13: Contact Us */}
        <section className="space-y-3 py-2 pt-1">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            13. Contact Us
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            If you have any questions about these Terms, please contact us at:
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
          </div>
        </section>

      </div>
    </main>
  );
}