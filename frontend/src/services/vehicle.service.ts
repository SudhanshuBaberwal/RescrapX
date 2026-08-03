import { ComponentCondition } from "@/context/vehicleProvider";
import api from "@/utils/api";

export const createDraftVehicle = async () => {
  try {
    const result = await api.post("/api/vehicle/register");
    return result.data;
  } catch (error) {
    console.error("createDraftVehicle error:", error);
    throw error;
  }
};

// vehicle.service.ts
export const basicDetails = async (
  vehicleId: string,
  data: {
    carName: string; // Key updated to match Zod schema
    model: string;
    variant: string;
    registrationNumber: string;
    manufacturingYear: number;
    fuelType: string;
    transmission: string;
    odometerReading: number; // Key updated to match Zod schema
    ownership: number;
  },
) => {
  try {
    const result = await api.put(
      `/api/vehicle/register/basic-details?vehicleId=${vehicleId}`,
      data,
    );
    return result.data;
  } catch (error) {
    console.error("basicDetails error:", error);
    throw error;
  }
};

// vehicle.service.ts
export const vehicleCondition = async (
  vehicleId: string,
  data: {
    accidentType: string;
    structuralDamage: string;
    airbagsDeployed: boolean;
    description?: string;
  }
) => {
  try {
    const result = await api.put(
      `/api/vehicle/register/vehicle-condition?vehicleId=${vehicleId}`,
      data
    );
    return result.data;
  } catch (error) {
    console.error("vehicleCondition error:", error);
    throw error;
  }
};

export const majorComponents = async (
  vehicleId: string,
  data: {
    engine: string;
    radiator: string;
    fuelSystem: string; 
    gearbox: string;
    suspension: string;
    steering: string;
    electrical: string;  
    exhaust: string;
    tyres: string;
    ac: string;
    bodyPanels: string;  
    glass: string;
    lights: string;
    interior: string;
  }
) => {
  try {
    const result = await api.put(
      `/api/vehicle/register/major-components?vehicleId=${vehicleId}`,
      data
    );
    return result.data;
  } catch (error) {
    console.error("majorComponents error:", error);
    throw error;
  }
};

export const documents = async (
  vehicleId: string,
  data: {
    rcbook?: File | null;
    loan_closure?: File | null;
    puc?: File | null;
    insurance?: File | null;
    other?: File | null;
  }
) => {
  try {
    const formData = new FormData();
    if (data.rcbook) formData.append("rcbook", data.rcbook);
    if (data.loan_closure) formData.append("loan_closure", data.loan_closure);
    if (data.puc) formData.append("puc", data.puc);
    if (data.insurance) formData.append("insurance", data.insurance);
    if (data.other) formData.append("other", data.other);

    const result = await api.put(
      `/api/vehicle/register/document?vehicleId=${vehicleId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return result.data;
  } catch (error) {
    console.error("documents error:", error);
    throw error;
  }
};

export const photos = async (
  vehicleId: string,
  data: {
    front?: File;
    rear?: File;
    left?: File;
    right?: File;
    dashboard?: File;
    interior?: File;
    engine?: File;
    odometer?: File;
  }
) => {
  try {
    const formData = new FormData();
    Object.entries(data).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    const result = await api.put(
      `/api/vehicle/register/photos?vehicleId=${vehicleId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return result.data;
  } catch (error) {
    console.error("photos error:", error);
    throw error;
  }
};

export const pickupLocation = async (
  vehicleId: string,
  data: {
    houseNumber: string;
    street: string;
    area: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
    formattedAddress: string;
    placeId: string;
    contactName: string;
    mobileNumber: string;
    alternateNumber?: string;
    vehicleLocation: string;
    towAccessibility: string;
    currentVehiclePosition: string;
  }
) => {
  try {
    const result = await api.put(
      `/api/vehicle/register/pickup-location?vehicleId=${vehicleId}`,
      data
    );
    return result.data;
  } catch (error) {
    console.error("pickupLocation error:", error);
    throw error;
  }
};

export const getAllVehiclesData = async () => {
  try {
    const res = await api.get("/api/vehicle/register/all-vehicles");
    return res.data;
  } catch (error) {
    console.error("getAllVehiclesData error:", error);
    throw error;
  }
};

export const getVehicle = async (vehicleId:string) => {
  try {
    const data = await api.get(`/api/vehicle/register/get-vehicle?vehicleId=${vehicleId}`)
    return data;
  } catch (error) {
    console.log(error)
  }
}

export const reviewAndSubmit = async (vehicleId:string) => {
  try {
    const data = await api.put(`/api/vehicle/register/reviews?vehicleId=${vehicleId}`)
    return data;
  } catch (error) {
    console.log(error)
  }
}