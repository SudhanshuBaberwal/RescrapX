export interface CustomerBookingResponse {
  bookingId: string;
  vehicleId: string;

  status: string;

  vehicle: {
    name: string;
    registrationNumber: string | null;
    fuelType: string | null;
    model: string | null;
    variant: string | null;
  };

  bookingDate: Date | null;

  offerAmount: number | null;

  pickup: {
    status: string;
    scheduledAt: Date | null;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    contactName: string | null;
    assignedDriver: string | null;
  };

  journey: {
    step: number;
    title: string;
    completed: boolean;
    completedAt: Date | null;
  }[];
}