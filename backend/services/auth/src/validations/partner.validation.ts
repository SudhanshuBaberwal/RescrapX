import { z } from "zod";
import ApiError from "../lib/ApiError.js";

export const partnerSignupSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),

  companyName: z.string().trim().min(2, "Company name is required"),
  latitude: z.number(),
  longitude: z.number(),
  gstNumber: z
    .string()
    .trim()
    .min(15, "Invalid GST Number")
    .max(15, "Invalid GST Number"),

  panNumber: z
    .string()
    .trim()
    .min(10, "Invalid PAN Number")
    .max(10, "Invalid PAN Number"),

  registrationNumber: z
    .string()
    .trim()
    .min(3, "Registration number is required"),

  address: z.string().trim().min(5, "Address is required"),

  city: z.string().trim().min(2, "City is required"),

  state: z.string().trim().min(2, "State is required"),

  pincode: z.string().trim().length(6, "Pincode must be exactly 6 digits"),
});
export type PartnerSignupDto = z.infer<typeof partnerSignupSchema>;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
] as const;

export const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"] as const;

export const REQUIRED_DOCUMENTS = [
  "rvsfCertificate",
  "gstCertificate",
  "panCard",
  "registrationCertificate",
  "bankDetails",
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

export const validatePartnerDocuments = (
  files: UploadedFiles | undefined,
): void => {
  if (!files) {
    throw new ApiError(
      400,
      "No documents received. Please upload all required documents.",
    );
  }

  for (const field of REQUIRED_DOCUMENTS) {
    if (!files[field] || files[field].length === 0) {
      throw new ApiError(400, `${field} document is required`);
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
