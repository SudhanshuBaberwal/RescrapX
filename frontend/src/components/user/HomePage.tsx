'use client'

import React from "react";
import Navbar from "../navbar/UserNavbar";
import Sidebar from "./Sidebar";
import JourneyAndReviews from "../reviews/JourneyAndReviews";
import Footer from "../footer/Footer";
import UserPage from "./UserPage";

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-white flex flex-col antialiased">
      <Navbar />
      {/* Reduced pt-10 to pt-4 and corrected sticky top offset to top-20 */}
      <div className="w-full px-4 md:px-12 pt-4 sm:pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-3 lg:sticky lg:top-20 h-fit">
          <Sidebar />
        </aside>
        <section className="lg:col-span-9 w-full">
          <UserPage />
        </section>
      </div>
      <div className="w-full px-4 md:px-12 py-6">
        <JourneyAndReviews />
      </div>
      <Footer />
    </main>
  );
}