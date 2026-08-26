'use client';

import React from "react";
import RegistrationStepper from "./RegistraionStepper";
import VehicleDetailsPage from "./VehicleDetails";
import VehicleConditionPage from "./VehicleConditions";
import VehicleComponentsPage from "./VehicleComponentsPage";
import VehicleDocumentsPage from "./VehicleDocumentsPage";
import VehiclePhotosPage from "./VehiclePhotosPage";
import VehiclePickupLocationPage from "./VehiclePickupLocationPage";
import VehicleReviewConfirmPage from "./VehicleReviewConfirmPage";
import VehicleInstantOfferPage from "./VehicleInstantOfferPage";
import { Shield } from "lucide-react";
import VehicleApprovalPendingPage from "./WaitingPage";
import BookingSuccessPage from "./VehicleFinalPage";

interface Props {
  vehicleId: string;
  currentStepNumber: number;
  totalStepsCount: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onContinue: () => void;
  onPrevious: () => void;
}

const pages = [
  VehicleDetailsPage,
  VehicleConditionPage,
  VehicleComponentsPage,
  VehicleDocumentsPage,
  VehiclePhotosPage,
  VehiclePickupLocationPage,
  VehicleReviewConfirmPage,
  BookingSuccessPage,
  VehicleInstantOfferPage,
];

export default function VehicleRegistrationDetails({
  vehicleId,
  currentStepNumber,
  totalStepsCount,
  isFirstStep,
  isLastStep,
  onContinue,
  onPrevious
}: Props) {

  // Dynamic Component Selection according to URL Step Number
  // Inside VehicleRegistrationDetails.tsx

  // Dynamic Component Selection with Type Casting
  const CurrentStepComponent = (pages[currentStepNumber - 1] || VehicleDetailsPage) as React.ComponentType<Props>;
  return (
    <div className="space-y-5 w-full">
      <div className="grid grid-cols-1 md:block lg:grid lg:grid-cols-12 gap-5 items-start">

        {/* Stepper Header */}
        <div className="lg:col-span-12 md:w-full">
          <RegistrationStepper currentStep={currentStepNumber} />
        </div>

        {/* Dynamic Step View Injection with required props */}
        <div className="lg:col-span-12 w-full">
          <CurrentStepComponent
            vehicleId={vehicleId}
            currentStepNumber={currentStepNumber}
            totalStepsCount={totalStepsCount}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            onContinue={onContinue}
            onPrevious={onPrevious}
          />
        </div>

      </div>

      {/* Footer Trust Banner */}
      <footer className="w-full bg-[#E6F4EA]/40 border border-[#A7F3D0]/30 rounded-xl p-3.5 text-center flex items-center justify-center gap-2 text-[11px] font-bold text-gray-600">
        <Shield size={14} className="text-[#0B5B32] shrink-0" />
        <p>Your information is encrypted and safe with us. We never share your data with anyone.</p>
      </footer>
    </div>
  );
}