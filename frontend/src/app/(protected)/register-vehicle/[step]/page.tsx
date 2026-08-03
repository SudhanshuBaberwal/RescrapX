'use client';

import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/UserNavbar';
import VehicleRegistrationDetails from '@/components/user/vehicleRegistraion/VehicleRegistationDetails';
import { RootState } from '@/store/store';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';

import { ComponentCondition } from "@/context/vehicleProvider";
import api from "@/utils/api";

export const createDraftVehicle = async () => {
  try {
    const result = await api.post("/api/vehicle/register");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const basicDetails = async (data: {
  registrationNumber: number;
  manufacturer: string;
  model: string;
  variant: string;
  fuelType: string;
  transmission: string;
  manufacturingYear: number;
  ownership: number;
  kmsDriven: number;
}) => {
  try {
    // const result = await api.put("/api/vehicle/register/basic-details", data);
    // return result.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const vehicleCondition = async (data: {
  accidentType: string;
  structuralDamage: string;
  airbagsDeployed: boolean;
  description: string;
}) => {
  try {
    // const result = await api.put("/api/vehicle/register/vehicle-condition");
    // return result;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const majorComponents = async (data: {
  engine: ComponentCondition;
  radiator: ComponentCondition;
  fuelSystem: ComponentCondition;
  gearbox: ComponentCondition;
  suspension: ComponentCondition;
  steering: ComponentCondition;
  electrial: ComponentCondition;
  exhaust: ComponentCondition;
  tyres: ComponentCondition;
  ac: ComponentCondition;
  bodyPanels: ComponentCondition;
  glass: ComponentCondition;
  lights: ComponentCondition;
  interior: ComponentCondition;
}) => {
  try {
    // const result = await api.put("/api/vehicle/register/major-components");
    // return result;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const documents = async (data: {
  rcbook: File,
  loan_closure: File,
  puc: File,
  insurance: File,
  other: File
}) => {
  try {
    // const result = await api.put("/api/vehicle/register/document");
    // return result;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const photos = async (data: {
  front: File,
  rear: File,
  left: File,
  right: File,
  dashboard: File,
  interior: File,
  engine: File,
  odometer: File
}) => {
  try {
    // const result = await api.put("/api/vehicle/register/photos");
    // return result;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const pickupLocation = async (data: {
  houseNumber: string,
  street: string,
  area: string,
  landmark: string,
  city: string,
  state: string,
  pincode: string,
  latitude: number,
  longitude: number,
  formattedAddress: string,
  placeId: string,
  contectName: string,
  mobileNumber: string,
  alternateNumber: string,
  vehicleLocation: string,
  towAccessibility: string,
  currentVehiclePosition: string
}) => {
  try {
    // const result = await api.put("/api/vehicle/register/pickup-location");
    // return result;
    return data;
  } catch (error) {
    console.log(error);
  }
};


export default function Page() {

  const { vehicleData } = useSelector((state: RootState) => state.vehicle)
  console.log(vehicleData?.currentStep)
  const { step } = useParams<{ step: string }>();
  const PageStep = Number(step);
  const TOTAL_PAGES = 8;
  // const [currentPage, setCurrentPage] = useState(1);
  

  switch (vehicleData?.currentStep) {
    case 1:
      basicDetails
      break;
    case 2:
      vehicleCondition
      break;
    case 3:
      majorComponents
      break;
    case 4:
      document
      break;
    case 5:
      photos
      break;
    case 6:
      pickupLocation
      break;
    default:
      break;
  }

  const handleContinue = () => {

  };

  const handlePrevious = () => {

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