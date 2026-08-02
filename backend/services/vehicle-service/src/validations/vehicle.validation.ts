import { z } from "zod";
import {
  structuralDamage,
  TransmissionType,
  accidentType,
  ComponentCondition,
} from "../models/vehicle.model.js";
import ApiError from "../lib/ApiError.js";

const component = ComponentCondition;

export const vehicleBasicSchema = z.object({
  carName: z.string().min(2),
  registrationNumber: z.string(),
  manufacturingYear: z.number().min(1990).max(new Date().getFullYear()),
  model: z.string(),
  variant: z.string().min(1),
  fuelType: z.enum(["PETROL", "DIESEL", "CNG", "EV", "HYBRID"]),
  transmission: z.enum(TransmissionType),
  odometerReading: z.number().min(0),
  ownership: z.number(),
});

export const vehicleConditionSchema = z.object({
  accidentType: z.enum(accidentType),
  structuralDamage: z.enum(structuralDamage),
  airbagsDeployed: z.boolean(),
  description: z.string().max(200).optional(),
});

export const vehicleMajorComponentsSchema = z.object({
  engine: z.enum(component),
  radiator: z.enum(component),
  fuelSystem: z.enum(component),
  gearbox: z.enum(component),
  suspension: z.enum(component),
  steering: z.enum(component),
  electrical: z.enum(component),
  exhaust: z.enum(component),
  tyres: z.enum(component),
  ac: z.enum(component),
  bodyPanels: z.enum(component),
  glass: z.enum(component),
  lights: z.enum(component),
  interior: z.enum(component),
});

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
] as const;

export const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"] as const;

export const REQUIRED_DOCUMENTS = [
  "rcbook",
  "loan_closure",
  "puc",
  "insurance",
  "other",
] as const;

export type UploadedFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

export type UploadedFiles = Record<string, UploadedFile[]>;

export const vehicleDocumentSchema = (files: UploadedFiles): void => {
  for (const field of REQUIRED_DOCUMENTS) {
    if (!files[field] || files[field].length === 0) {
      throw new ApiError(400, `${field} file is required`);
    }

    const file = files[field][0];

    if (!file.buffer || file.size === 0) {
      throw new ApiError(400, `${field} file is empty`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype as any)) {
      throw new ApiError(400, `${field} must be PDF, JPG or PNG`);
    }

    const extension = file.originalname
      .substring(file.originalname.lastIndexOf("."))
      .toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension as any)) {
      throw new ApiError(400, `${field} has an invalid file extension`);
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError(400, `${field} size should not exceed 5 MB`);
    }
  }
};

export type vehicleBasicDto = z.infer<typeof vehicleBasicSchema>;
export type vehicleConditionDto = z.infer<typeof vehicleConditionSchema>;
export type vehicleMajorComponentsDto = z.infer<
  typeof vehicleMajorComponentsSchema
>;
export type vehicleDocumentDto = z.infer<typeof vehicleDocumentSchema>;
