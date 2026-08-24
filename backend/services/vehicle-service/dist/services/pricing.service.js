import { CAR_KERB_WEIGHT_KG, } from "../data/kerb-weight.dictionary.js";
class BrandClassifierService {
    BRAND_BASE_RATES = {
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
    getBaseRate(brand) {
        const normalized = brand.toUpperCase().trim();
        return this.BRAND_BASE_RATES[normalized] ?? 30;
    }
}
class PricingService {
    brandClassifier = new BrandClassifierService();
    /**
     * Normalizes both vehicle data and dictionary keys so small formatting
     * differences do not break the lookup.
     *
     * Example:
     * "Maruti Suzuki" -> "marutisuzuki"
     * "Maruti_Suzuki_Maruti_Swift" -> "marutisuzukimarutiswift"
     */
    normalize(value) {
        return String(value ?? "")
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/land\s*rover/g, "landrover")
            .replace(/mercedes[-\s]?benz/g, "mercedes")
            .replace(/maruti[-\s]?suzuki/g, "marutisuzuki")
            .replace(/volkswagen/g, "volkswagen")
            .replace(/[^a-z0-9]+/g, "");
    }
    toWeight(value) {
        // Single weight
        if (typeof value === "number") {
            return {
                weightKg: value,
                match: "EXACT",
            };
        }
        // Weight range: [minimum, maximum]
        const [minWeight, maxWeight] = value;
        return {
            weightKg: Math.round((minWeight + maxWeight) / 2),
            match: "RANGE_MIDPOINT",
        };
    }
    /**
     * Automatically finds kerb weight from the uploaded 308-car dictionary.
     * No weight is required from the frontend and no DB weight is required.
     */
    findKerbWeight(vehicle) {
        const details = vehicle.vehicleDetails;
        const manufacturer = String(details?.manufacturer ?? "").trim();
        const model = String(details?.model ?? "").trim();
        const variant = String(details?.variant ?? "").trim();
        const carName = String(details?.carName ?? "").trim();
        if (!manufacturer && !model && !carName) {
            throw new Error("Vehicle manufacturer/model is required to find kerb weight");
        }
        const manufacturerKey = this.normalize(manufacturer);
        const modelKey = this.normalize(model);
        const variantKey = this.normalize(variant);
        const carNameKey = this.normalize(carName);
        const entries = Object.entries(CAR_KERB_WEIGHT_KG);
        // ------------------------------------------------------------
        // 1. Try the most specific exact combinations first.
        // ------------------------------------------------------------
        const exactCandidates = [
            [manufacturerKey, modelKey, variantKey].filter(Boolean).join(""),
            [manufacturerKey, carNameKey, variantKey].filter(Boolean).join(""),
            [manufacturerKey, modelKey].filter(Boolean).join(""),
            [manufacturerKey, carNameKey].filter(Boolean).join(""),
            [modelKey, variantKey].filter(Boolean).join(""),
        ].filter(Boolean);
        for (const candidate of exactCandidates) {
            const exact = entries.find(([key]) => this.normalize(key) === candidate);
            if (exact) {
                const [sourceKey, value] = exact;
                const result = this.toWeight(value);
                return {
                    weightKg: result.weightKg,
                    sourceKey,
                    match: result.match,
                };
            }
        }
        // ------------------------------------------------------------
        // 2. Best-match search.
        // This handles dictionary names such as:
        // Maruti_Suzuki_Maruti_Swift
        // while DB data may be manufacturer=Maruti Suzuki, model=Swift.
        // ------------------------------------------------------------
        const brandTokens = this.tokens(manufacturerKey);
        const modelTokens = this.tokens(modelKey || carNameKey);
        const variantTokens = this.tokens(variantKey);
        if (modelTokens.length === 0) {
            throw new Error(`Cannot find kerb weight: vehicle model is missing for manufacturer ${manufacturer || "unknown"}`);
        }
        let best;
        for (const [key, value] of entries) {
            const normalizedKey = this.normalize(key);
            let score = 0;
            // Manufacturer is important but should not decide the result alone.
            for (const token of brandTokens) {
                if (token.length >= 2 && normalizedKey.includes(token)) {
                    score += 15;
                }
            }
            // Model is the strongest signal.
            let modelMatched = 0;
            for (const token of modelTokens) {
                if (token.length >= 2 && normalizedKey.includes(token)) {
                    score += 30;
                    modelMatched++;
                }
            }
            // Variant is useful for generation/engine-specific entries.
            for (const token of variantTokens) {
                if (token.length >= 2 && normalizedKey.includes(token)) {
                    score += 10;
                }
            }
            // Reject entries that do not contain the model signal at all.
            if (modelMatched === 0)
                continue;
            // Prefer keys that are more specific than a generic model name.
            score += Math.min(normalizedKey.length / 100, 10);
            if (!best || score > best.score) {
                best = { key, value, score };
            }
        }
        if (!best) {
            throw new Error(`Kerb weight not found for ${manufacturer || ""} ${model || carName || ""}`.trim());
        }
        const result = this.toWeight(best.value);
        return {
            weightKg: result.weightKg,
            sourceKey: best.key,
            match: "BEST_MATCH",
        };
    }
    tokens(value) {
        if (!value)
            return [];
        // Re-split normalized text into useful chunks using common car separators.
        // Also preserve the complete normalized value as a fallback token.
        const original = value
            .replace(/([a-z])([0-9])/gi, "$1 $2")
            .replace(/([0-9])([a-z])/gi, "$1 $2");
        const parts = original
            .split(/[^a-z0-9]+/i)
            .map((part) => this.normalize(part))
            .filter((part) => part.length >= 2);
        return Array.from(new Set([...parts, value].filter(Boolean)));
    }
    calculateValuation(vehicle) {
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
        const brand = details.manufacturer ?? details.carName;
        if (!brand) {
            throw new Error("Vehicle manufacturer/brand is required");
        }
        // =====================================================
        // AUTOMATIC KERB WEIGHT LOOKUP
        // =====================================================
        const weight = this.findKerbWeight(vehicle);
        const kerbWeightKg = weight.weightKg;
        let baseRate = this.brandClassifier.getBaseRate(brand);
        const initialBaseRate = baseRate;
        const adjustments = [];
        adjustments.push(`Brand [${brand}] → Initial Base Rate ₹${baseRate}/kg`);
        adjustments.push(`Kerb Weight [${weight.sourceKey}] → ${kerbWeightKg} kg (${weight.match})`);
        const fuelType = String(details.fuelType ?? "").toUpperCase();
        if (fuelType === "CNG") {
            baseRate -= 1.5;
            adjustments.push("CNG → -₹1.50/kg");
        }
        const transmission = String(details.transmission ?? "").toUpperCase();
        if (transmission === "AUTOMATIC" ||
            transmission === "CVT" ||
            transmission === "DCT" ||
            transmission === "AMT") {
            baseRate -= 0.2;
            adjustments.push(`${transmission} transmission → -₹0.20/kg`);
        }
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
        const structure = String(condition.structure ?? "").toUpperCase();
        if (structure === "MINOR_DAMAGE" || structure === "MAJOR_DAMAGE") {
            baseRate -= 2;
            adjustments.push(`Structural Damage (${structure}) → -₹2.00/kg`);
        }
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
        baseRate = Math.max(0, baseRate);
        const netBaseRate = baseRate;
        const materialValue = kerbWeightKg * netBaseRate;
        adjustments.push(`Material Value = ${kerbWeightKg}kg × ₹${netBaseRate}/kg = ₹${materialValue}`);
        let netFlatAdjustments = 0;
        if (condition.airbagsDeployed === true) {
            netFlatAdjustments -= 500;
            adjustments.push("Airbags Missing/Deployed → -₹500");
        }
        if (components.exhaust === "GOOD" || components.exhaust === "NOT_WORKING") {
            netFlatAdjustments += 1000;
            adjustments.push("Exhaust Present → +₹1,000");
        }
        else if (components.exhaust === "MISSING") {
            netFlatAdjustments -= 3000;
            adjustments.push("Exhaust Missing → -₹3,000");
        }
        if (components.tyres === "MISSING") {
            netFlatAdjustments -= 1200;
            adjustments.push("Tyres & Wheels Missing → -₹1,200");
        }
        if (components.battery === "MISSING") {
            if (fuelType === "ELECTRIC") {
                netFlatAdjustments -= 4000;
                adjustments.push("EV Battery Missing → -₹4,000");
            }
            else {
                netFlatAdjustments -= 1500;
                adjustments.push("Battery Missing → -₹1,500");
            }
        }
        const bav = Math.max(0, materialValue + netFlatAdjustments);
        const lowerBound = bav * 0.93;
        const upperBound = bav * 1.03;
        return {
            vehicleId: vehicle._id.toString(),
            vehicle: {
                manufacturer: details.manufacturer ?? null,
                model: details.model ?? null,
                variant: details.variant ?? null,
                fuelType: details.fuelType ?? null,
                transmission: details.transmission ?? null,
                kerbWeightKg,
                kerbWeightSource: weight.sourceKey,
                kerbWeightMatch: weight.match,
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
