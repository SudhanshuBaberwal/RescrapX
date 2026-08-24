export interface VehiclePricingDetails {
  manufacturer: string | null;
  model: string | null;
  variant: string | null;
  fuelType: string | null;
  transmission: string | null;

  kerbWeightKg: number;
  kerbWeightSource: string;

  kerbWeightMatch: "EXACT" | "RANGE_MIDPOINT" | "BEST_MATCH";
}

export interface VehiclePricing {
  initialBaseRate: number;
  netBaseRate: number;
  materialValue: number;
  netFlatAdjustments: number;
  bav: number;
  lowerBound: number;
  upperBound: number;
}

export interface VehiclePriceEstimation {
  vehicleId: string;

  vehicle: VehiclePricingDetails;

  pricing: VehiclePricing;

  adjustments: string[];
}

export interface VehiclePriceEstimationResponse {
  data: VehiclePriceEstimation;
}