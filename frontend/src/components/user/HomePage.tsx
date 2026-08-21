'use client'

import React from "react";
import { useSelector as useReduxSelector } from "react-redux";
import { RootState } from "@/store/store";
import Navbar from "../navbar/user/UserNavbar";
import Sidebar from "./Sidebar";
import JourneyAndReviews from "../reviews/JourneyAndReviews";
import Footer from "../footer/Footer";
import UserPage from "./UserPage";

export default function HomePage() {
  const { userData } = useReduxSelector((state: RootState) => state.user);

  return (
    <main className="w-full min-h-screen bg-white flex flex-col antialiased">
      <Navbar />

      {/* Dynamic layout grid: switches between full width and sidebar grid */}
      <div
        className={`w-full px-4 md:px-12 pt-4 sm:pt-6 gap-8 items-start relative flex-1 ${userData
          ? "grid grid-cols-1 lg:grid-cols-[290px_1fr]"
          : "block"
          }`}
      >
        {/* Render Sidebar only if userData exists */}
        {userData && (
          <aside className="w-full lg:sticky lg:top-24 h-fit z-20">
            <Sidebar />
          </aside>
        )}

        {/* Main Content Area */}
        <section className="w-full min-w-0">
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