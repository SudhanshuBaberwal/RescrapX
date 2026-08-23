import { IVehicle } from "../models/vehicle.model.js";

interface ValuationResult {
  vehicleId: string;

  vehicle: {
    manufacturer: string | null;
    model: string | null;
    variant: string | null;
    fuelType: string | null;
    transmission: string | null;
    kerbWeightKg: number;
  };

  pricing: {
    initialBaseRate: number;
    netBaseRate: number;
    materialValue: number;
    netFlatAdjustments: number;
    bav: number;
    lowerBound: number;
    upperBound: number;
  };

  adjustments: string[];
}

class BrandClassifierService {
  private readonly BRAND_BASE_RATES: Record<string, number> = {
    "MARUTI SUZUKI": 30,
    HYUNDAI: 30,
    MAHINDRA: 30,
    KIA: 30,
    RENAULT: 30,
    NISSAN: 30,
    MG: 30,
    CITROEN: 30,
    DATSUN: 30,
    TATA: 30,
    FORCE: 30,

    TOYOTA: 31,
    HONDA: 31,
    VOLKSWAGEN: 31,
    SKODA: 31,
    BYD: 31,
    JEEP: 31,

    VOLVO: 32,
    AUDI: 32,
    BMW: 32,
    MERCEDES: 32,
    LEXUS: 32,

    VINFAST: 33,
    JAGUAR: 33,
    "LAND ROVER": 33,
    PORSCHE: 33,
  };

  getBaseRate(brand: string): number {
    const normalized = brand.toUpperCase().trim();

    return this.BRAND_BASE_RATES[normalized] ?? 30;
  }
}

class PricingService {
  private readonly brandClassifier = new BrandClassifierService();

  calculateValuation(vehicle: IVehicle): ValuationResult {
    const details = vehicle.vehicleDetails;
    const condition = vehicle.vehicleCondition;
    const components = vehicle.majorComponents;

    if (!details) {
      throw new Error("Vehicle details are missing");
    }

    if (!condition) {
      throw new Error("Vehicle condition is missing");
    }

    if (!components) {
      throw new Error("Major components data is missing");
    }

    if (
      details.kerbWeightKg === null ||
      details.kerbWeightKg === undefined ||
      details.kerbWeightKg <= 0
    ) {
      throw new Error("Kerb weight is required for vehicle valuation");
    }

    const brand = (details as any).manufacturer ?? (details as any).carName;

    if (!brand) {
      throw new Error("Vehicle manufacturer/brand is required");
    }

    let baseRate = this.brandClassifier.getBaseRate(brand);

    const initialBaseRate = baseRate;

    const adjustments: string[] = [];

    adjustments.push(`Brand [${brand}] → Initial Base Rate ₹${baseRate}/kg`);

    const fuelType = String(details.fuelType ?? "").toUpperCase();

    if (fuelType === "CNG") {
      baseRate -= 1.5;

      adjustments.push("CNG → -₹1.50/kg");
    }

    // =====================================================
    // TRANSMISSION
    // =====================================================

    const transmission = String(details.transmission ?? "").toUpperCase();

    if (
      transmission === "AUTOMATIC" ||
      transmission === "CVT" ||
      transmission === "DCT" ||
      transmission === "AMT"
    ) {
      baseRate -= 0.2;

      adjustments.push(`${transmission} transmission → -₹0.20/kg`);
    }

    // =====================================================
    // DAMAGE
    // =====================================================

    const accidentType = String(condition.accidentType ?? "").toUpperCase();

    switch (accidentType) {
      case "ACCIDENTAL_DAMAGE":
        baseRate -= 2.5;

        adjustments.push("Accidental Damage → -₹2.50/kg");

        break;

      case "FLOODED":
        baseRate -= 2.5;

        adjustments.push("Flooded → -₹2.50/kg");

        break;

      case "BURNT":
        baseRate -= 5;

        adjustments.push("Burnt → -₹5.00/kg");

        break;
    }

    // =====================================================
    // STRUCTURAL DAMAGE
    // =====================================================

    const structure = String(condition.structure ?? "").toUpperCase();

    if (structure === "MINOR_DAMAGE" || structure === "MAJOR_DAMAGE") {
      baseRate -= 2;

      adjustments.push(`Structural Damage (${structure}) → -₹2.00/kg`);
    }

    // =====================================================
    // MISSING COMPONENTS
    // =====================================================

    if (components.engine === "MISSING") {
      baseRate -= 8;

      adjustments.push("Engine Missing → -₹8.00/kg");
    }

    if (components.gearbox === "MISSING") {
      baseRate -= 1;

      adjustments.push("Gearbox Missing → -₹1.00/kg");
    }

    if (components.ac === "MISSING") {
      baseRate -= 0.75;

      adjustments.push("AC/Compressor Missing → -₹0.75/kg");
    }

    if (components.radiator === "MISSING") {
      baseRate -= 0.85;

      adjustments.push("Radiator Missing → -₹0.85/kg");
    }

    if (components.suspension === "MISSING") {
      baseRate -= 0.55;

      adjustments.push("Suspension Missing → -₹0.55/kg");
    }

    if (components.bodyPanels === "MISSING") {
      baseRate -= 0.35;

      adjustments.push("Body Panels Missing → -₹0.35/kg");
    }

    if (components.interior === "MISSING") {
      baseRate -= 0.25;

      adjustments.push("Interior Missing → -₹0.25/kg");
    }

    // Prevent negative rate
    baseRate = Math.max(0, baseRate);

    const netBaseRate = baseRate;

    // =====================================================
    // MATERIAL VALUE
    // =====================================================

    const kerbWeightKg = Number(details.kerbWeightKg);

    const materialValue = kerbWeightKg * netBaseRate;

    adjustments.push(
      `Material Value = ${kerbWeightKg}kg × ₹${netBaseRate}/kg = ₹${materialValue}`,
    );

    // =====================================================
    // FLAT ADJUSTMENTS
    // =====================================================

    let netFlatAdjustments = 0;

    // Airbags
    if (condition.airbagsDeployed === true) {
      netFlatAdjustments -= 500;

      adjustments.push("Airbags Missing/Deployed → -₹500");
    }

    // =====================================================
    // EXHAUST
    // =====================================================

    if (components.exhaust === "GOOD" || components.exhaust === "NOT_WORKING") {
      netFlatAdjustments += 1000;

      adjustments.push("Exhaust Present → +₹1,000");
    } else if (components.exhaust === "MISSING") {
      netFlatAdjustments -= 3000;

      adjustments.push("Exhaust Missing → -₹3,000");
    }

    // =====================================================
    // TYRES
    // =====================================================

    if (components.tyres === "MISSING") {
      netFlatAdjustments -= 1200;

      adjustments.push("Tyres & Wheels Missing → -₹1,200");
    }

    // =====================================================
    // BATTERY
    // =====================================================

    if (components.battery === "MISSING") {
      if (fuelType === "ELECTRIC") {
        netFlatAdjustments -= 4000;

        adjustments.push("EV Battery Missing → -₹4,000");
      } else {
        netFlatAdjustments -= 1500;

        adjustments.push("Battery Missing → -₹1,500");
      }
    }

    // =====================================================
    // FINAL BAV
    // =====================================================

    const bav = Math.max(0, materialValue + netFlatAdjustments);

    // =====================================================
    // PRICE RANGE
    // =====================================================

    const lowerBound = bav * 0.93;

    const upperBound = bav * 1.03;

    return {
      vehicleId: vehicle._id.toString(),

      vehicle: {
        manufacturer: (details as any).manufacturer ?? null,

        model: details.model ?? null,

        variant: details.variant ?? null,

        fuelType: details.fuelType ?? null,

        transmission: details.transmission ?? null,

        kerbWeightKg,
      },

      pricing: {
        initialBaseRate,
        netBaseRate,
        materialValue,
        netFlatAdjustments,
        bav,
        lowerBound,
        upperBound,
      },

      adjustments,
    };
  }
}

export default new PricingService();
