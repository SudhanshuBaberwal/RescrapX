import { VehicleStatus } from "@/components/admin/VehiclesDashboard";
import { ComponentCondition, ProcessingStage } from "@/context/vehicleProvider";
import api from "@/utils/api";

export const createDraftVehicle = async () => {
  const result = await api.post("/api/vehicle/register");
  return result.data;
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
  const result = await api.put(
    `/api/vehicle/register/basic-details?vehicleId=${vehicleId}`,
    data,
  );
  return result.data.data;
};

// vehicle.service.ts
export const vehicleCondition = async (
  vehicleId: string,
  data: {
    accidentType: string;
    structuralDamage: string;
    airbagsDeployed: boolean;
    description?: string;
  },
) => {
  const result = await api.put(
    `/api/vehicle/register/vehicle-condition?vehicleId=${vehicleId}`,
    data,
  );
  return result.data.data;
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
  },
) => {
  const result = await api.put(
    `/api/vehicle/register/major-components?vehicleId=${vehicleId}`,
    data,
  );
  return result.data.data;
};

export const documents = async (
  vehicleId: string,
  data: {
    rcbook?: File | null;
    loan_closure?: File | null;
    puc?: File | null;
    insurance?: File | null;
    other?: File | null;
  },
) => {
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
    },
  );
  return result.data.data;
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
  },
) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, file]) => {
    if (file) formData.append(key, file);
  });

  const result = await api.put(
    `/api/vehicle/register/photos?vehicleId=${vehicleId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return result.data.data;
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
  },
) => {
  const result = await api.put(
    `/api/vehicle/register/pickup-location?vehicleId=${vehicleId}`,
    data,
  );
  return result.data.data;
};

export const getAllVehiclesData = async () => {
  const res = await api.get("/api/vehicle/register/user-vehicles");
  return res.data.data;
};

export const getVehicle = async (vehicleId: string) => {
  const data = await api.get(
    `/api/vehicle/register/get-vehicle?vehicleId=${vehicleId}`,
  );
  return data.data.data;
};

export const reviewAndSubmit = async (vehicleId: string) => {
  const data = await api.put(
    `/api/vehicle/register/reviews?vehicleId=${vehicleId}`,
  );
  return data.data.data;
};

export const getAllVehiclesDataForAdmin = async () => {
  const res = await api.get("/api/vehicle/register/vehicles");
  return res.data.data;
};

export const updateVehicleStatus = async (
  vehicleId: string,
  status: VehicleStatus,
  rejectionReason?: string,
) => {
  const res = await api.put(
    `/api/vehicle/register/status?vehicleId=${vehicleId}`,
    { status, rejectionReason },
  );
  return res.data.data;
};

export const vehiclesRegisterForPickup = async () => {
  const result = await api.get("/api/vehicle/register/scheduled-vehicles");
  return result.data.data;
};

export const schedulePickup = async (
  vehicleId: string,
  scheduledAt: string,
  pickupCharges: number,
  documentCharges: number,
) => {
  const response = await api.patch(
    "/api/vehicle/register/admin/pickup/schedule",
    {
      vehicleId,
      scheduledAt,
      pickupCharges,
      documentCharges,
    },
  );

  return response.data.data;
};

export const assignDriver = async (vehicleId: string, driverName: string) => {
  const response = await api.patch(
    "/api/vehicle/register/admin/pickup/assign-driver",
    {
      vehicleId,
      driverName,
    },
  );
  return response.data.data;
};

export const getIncomingVehicles = async () => {
  const response = await api.get("/api/vehicle/register/partner/incoming");
  return response.data.data;
};

export const pickupVehicle = async (vehicleId: string) => {
  const response = await api.post("/api/vehicle/register/pickup-vehicle", {
    vehicleId,
  });
  return response.data.data;
};

export const processingVehicles = async () => {
  const response = await api.get("/api/vehicle/register/partner/processing");
  return response.data.data;
};

export const processingVehicleStates = async () => {
  const response = await api.get(
    "/api/vehicle/register/partner/processing/stats",
  );
  return response.data.data;
};

export const getAllVehiclesService = async () => {
  const response = await api.get("/api/vehicle/register/admin/all-status");
  return response.data.data;
};

export const makeVehicleArrived = async (vehicleId: string) => {
  const response = await api.patch("/api/vehicle/register/admin/arrived", {
    vehicleId,
  });
  return response.data.data;
};

export const partnerDocuments = async () => {
  const response = await api.get(
    "/api/vehicle/register/partner/documents/vehicles",
  );
  return response.data.data;
};

export const uploadPartnerDocument = async () => {
  const response = await api.post(
    "/api/vehicle/register/partner/documents/upload",
  );
  return response.data.data;
};

export const submitPartnerDocuments = async () => {
  const response = await api.patch(
    "/api/vehicle/register/partner/documents/submit",
  );
  return response.data.data;
};

export const customerBooking = async () => {
  const response = await api.get("/api/vehicle/register/customer/bookings");
  return response.data.data;
};

export const customerBookingByid = async (vehicleId: string) => {
  const response = await api.get(
    `/api/vehicle/register/customer/bookings?vehicleId=${vehicleId}`,
  );
  return response.data.data.data;
};

export const changeProcessingStage = async (
  vehicleId: string,
  processingStage: ProcessingStage,
) => {
  const response = await api.patch(
    "/api/vehicle/register/partner/processing-stage",
    { vehicleId, processingStage },
  );
  return response.data.data;
};

export const getPartnerUploadedDocuments = async () => {
  const response = await api.get(
    "/api/vehicle/register/admin/partner-documents/vehicles",
  );
  return response.data.data;
};

export const revirePartnerUploadedDocumentByAdmin = async (
  vehicleId: string,
  data: {
    documentId: string;
    status: "APPROVED" | "REJECTED";
    rejectionReason: string;
  },
) => {
  const response = await api.patch(
    `api/vehicle/register/admin/partner-documents/vehicles/review?vehicleId=${vehicleId}`,
    data,
  );
  return response.data.data;
};

export const approvePartnerDocuments = async (vehicleId: string) => {
  const response = await api.patch(
    `/api/vehicle/register/admin/partner-documents/vehicles/approve?vehicleId=${vehicleId}`,
  );
  return response.data.data;
};

export const pendingVehiclesForPayment = async () => {
  const response = await api.get(
    "/api/vehicle/register/partner/payments/vehicles",
  );
  return response.data.data;
};
export const addPaymentProof = async (data: {
  vehicleId: string;
  paymentProof: File;
}) => {
  const formData = new FormData();
  // Must match multer field name: 'paymentProof'
  formData.append("paymentProof", data.paymentProof);
  formData.append("vehicleId", data.vehicleId);

  const response = await api.post(
    "/api/vehicle/register/partner/payments/proof",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data.data;
};

export const getPendingPaymentsData = async () => {
  const response = await api.get(
    "/api/vehicle/register/admin/payments/pending",
  );
  return response.data.data;
};

export const approvePayment = async (vehicleId: string) => {
  const response = await api.patch(
    `/api/vehicle/register/admin/payments/review?vehicleId=${vehicleId}`,
    {
      action: "APPROVE",
    },
  );

  return response.data.data;
};

export const rejectPayment = async (
  vehicleId: string,
  rejectionReason: string,
) => {
  const response = await api.patch(
    `/api/vehicle/register/admin/payments/review?vehicleId=${vehicleId}`,
    {
      action: "REJECT",
      rejectionReason,
    },
  );

  return response.data.data;
};

export const calculateVehicleEstimatedPrice = async (vehicleId: string) => {
  const response = await api.get(
    `/api/vehicle/register/vehicles/estimated-price?vehicleId=${vehicleId}`,
  );
  return response.data.data;
};

export const getVehiclePricing = async (vehicleId: string) => {
  const response = await api.get(
    `/api/vehicle/register/vehicles/pricing?vehicleId=${vehicleId}`,
  );
  return response.data.data;
};
