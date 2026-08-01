'use client';

import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/UserNavbar';
import VehicleRegistrationDetails from '@/components/user/vehicleRegistraion/VehicleRegistationDetails';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Page() {

  const { vehicleData } = useSelector((state: RootState) => state.vehicle)
  console.log(vehicleData)
  const { step } = useParams<{ step: string }>();
  const PageStep = Number(step);
  const TOTAL_PAGES = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const handleContinue = () => {
    if (currentPage < TOTAL_PAGES) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] text-[#374151] antialiased">
      {/* Edge-to-edge max-w-7xl panoramic optimization layout */}
      <div className="w-full  mx-auto px-3 sm:px-6 lg:px-8 py-5">
        <div className='mb-4'>
          <Navbar />
        </div>
        <VehicleRegistrationDetails
          currentPage={PageStep}
          currentNumber={PageStep}
          onContinue={handleContinue}
          onPrevious={handlePrevious}
          isFirstStep={PageStep === 1}
          isLastStep={PageStep === TOTAL_PAGES}
          totalSteps={TOTAL_PAGES}
        />
      </div>
      <Footer />
    </div>
  );
}