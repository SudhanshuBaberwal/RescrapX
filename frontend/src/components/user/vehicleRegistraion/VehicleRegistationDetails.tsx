'use client';

import React from "react";
import RegistrationStepper from "./RegistraionStepper";
import VehicleDetailsPage from "./VehicleDetails";
import { Shield } from "lucide-react";
import VehicleConditionPage from "./VehicleConditions";
import VehicleComponentsPage from "./VehicleComponentsPage";
import VehicleDocumentsPage from "./VehicleDocumentsPage";
import VehiclePhotosPage from "./VehiclePhotosPage";
import VehiclePickupLocationPage from "./VehiclePickupLocationPage";
import VehicleReviewConfirmPage from "./VehicleReviewConfirmPage";
import VehicleInstantOfferPage from "./VehicleInstantOfferPage";

interface Props {
    currentPage: number;
    currentNumber: number;
    onContinue: () => void;
    onPrevious: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    totalSteps: number;
}

const DummyPlaceholderStep = ({ stepName }: { stepName: string }) => (
    <div className="p-8 text-center text-gray-400 bg-white border border-gray-100 rounded-2xl shadow-3xs w-full">
        {stepName} View Content Coming Soon.
    </div>
);

const pages = [
    VehicleDetailsPage,
    VehicleConditionPage,
    VehicleComponentsPage,
    VehicleDocumentsPage,
    VehiclePhotosPage ,
    VehiclePickupLocationPage,
    VehicleReviewConfirmPage,
    VehicleInstantOfferPage
];

export default function VehicleRegistrationDetails({
    currentPage,
    currentNumber,
    onContinue,
    onPrevious,
    isFirstStep,
    isLastStep,
    totalSteps
}: Props) {

    const CurrentStepComponent = pages[currentPage - 1];

    return (
        <div className="space-y-5 w-full">

            {/* Responsive Master Grid Framework */}
            {/* On small viewports: Stepper on left (col-span-4/3), Content on right */}
            {/* On desktop viewports: Stepper completely stacked on top horizontally */}
            <div className="grid grid-cols-1 md:block lg:grid lg:grid-cols-12 gap-5 items-start">

                {/* Left Side Column placement on mobile, top placement on Desktop */}
                <div className="lg:col-span-12 md:w-full">
                    <RegistrationStepper currentStep={currentNumber} />
                </div>

                {/* Dynamic Inner Step Injector Segment */}
                <div className="lg:col-span-12 w-full">
                    <CurrentStepComponent
                        onContinue={onContinue}
                        onPrevious={onPrevious}
                        isFirstStep={isFirstStep}
                        isLastStep={isLastStep}
                        currentStepNumber={currentNumber}
                        totalStepsCount={totalSteps}
                    />
                </div>

            </div>

            {/* Trust compliance banner */}
            <footer className="w-full bg-[#E6F4EA]/40 border border-[#A7F3D0]/30 rounded-xl p-3.5 text-center flex items-center justify-center gap-2 text-[11px] font-bold text-gray-600">
                <Shield size={14} className="text-[#0B5B32] shrink-0" />
                <p>Your information is encrypted and safe with us. We never share your data with anyone.</p>
            </footer>
        </div>
    );
}