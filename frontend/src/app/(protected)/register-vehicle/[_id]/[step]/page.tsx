'use client';

import React from 'react';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/UserNavbar';
import { RootState } from '@/store/store';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import VehicleRegistrationDetails from '@/components/user/vehicleRegistraion/VehicleRegistationDetails';

export default function Page() {
  const router = useRouter();

  // 1. Extract BOTH params from route: [_id] and [step]
  const params = useParams<{ _id: string; step: string }>();
  
  const vehicleId = params?._id;
  const stepParam = params?.step;
  const currentStepNumber = Number(stepParam) || 1;

  const TOTAL_PAGES = 8;

  // Access vehicle data from Redux if needed
  const { vehicleData } = useSelector((state: RootState) => state.vehicle);

  // 2. Next Step Navigation Handler
  const handleContinue = () => {
    if (currentStepNumber < TOTAL_PAGES) {
      const nextStep = currentStepNumber + 1;
      router.push(`/register-vehicle/${vehicleId}/${nextStep}`);
    } else {
      // Final Step Complete -> Go to My Vehicles or Summary
      router.push('/my-vehicles');
    }
  };

  // 3. Previous Step Navigation Handler
  const handlePrevious = () => {
    if (currentStepNumber > 1) {
      const prevStep = currentStepNumber - 1;
      router.push(`/register-vehicle/${vehicleId}/${prevStep}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] text-[#374151] antialiased flex flex-col justify-between">
      <div>
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5">
          <div className="mb-4">
            <Navbar />
          </div>

          {/* Render Step Component passing the extracted params and navigation functions */}
          <VehicleRegistrationDetails
            vehicleId={vehicleId}
            currentStepNumber={currentStepNumber}
            totalStepsCount={TOTAL_PAGES}
            isFirstStep={currentStepNumber === 1}
            isLastStep={currentStepNumber === TOTAL_PAGES}
            onContinue={handleContinue}
            onPrevious={handlePrevious}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}