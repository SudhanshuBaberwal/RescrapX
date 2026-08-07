import ApiError from "../lib/ApiError.js";
import { z } from "zod";

export const USER_DOCUMENT_TYPES = [
  "AADAHR_CARD",
  "PAN_CARD",
  "PASSPORT",
  "VOTERID",
  "DRIVING_LICENSE",
] as const;

export type UserDocumentType = (typeof USER_DOCUMENT_TYPES)[number];

export type UploadedFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

export type UploadedFiles = Record<string, UploadedFile[]>;

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
] as const;

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"] as const;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validate document type
 */
export function validateDocumentType(
  documentType: unknown,
): asserts documentType is UserDocumentType {
  if (
    typeof documentType !== "string" ||
    !USER_DOCUMENT_TYPES.includes(documentType as UserDocumentType)
  ) {
    throw new ApiError(
      400,
      `Invalid document type. Allowed types: ${USER_DOCUMENT_TYPES.join(", ")}`,
    );
  }
}

/**
 * Validate a single uploaded file
 */
function validateFile(
  file: UploadedFile | undefined,
  fieldName: string,
  required = true,
): void {
  if (!file) {
    if (required) {
      throw new ApiError(400, `${fieldName} file is required`);
    }

    return;
  }

  if (!file.buffer || file.size === 0) {
    throw new ApiError(400, `${fieldName} file is empty`);
  }

  if (
    !ALLOWED_MIME_TYPES.includes(
      file.mimetype as (typeof ALLOWED_MIME_TYPES)[number],
    )
  ) {
    throw new ApiError(
      400,
      `${fieldName} must be a PDF, JPG, JPEG or PNG file`,
    );
  }

  const extension = file.originalname
    .substring(file.originalname.lastIndexOf("."))
    .toLowerCase();

  if (
    !ALLOWED_EXTENSIONS.includes(
      extension as (typeof ALLOWED_EXTENSIONS)[number],
    )
  ) {
    throw new ApiError(400, `${fieldName} has an invalid file extension`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ApiError(400, `${fieldName} size should not exceed 5 MB`);
  }
}

export function validateUserDocuments(files: UploadedFiles): void {
  const currentPic = files.currentPic?.[0];

  validateFile(currentPic, "Current/live photo", true);

  const front = files.front?.[0];

  validateFile(front, "Document front", true);

  const back = files.back?.[0];

  validateFile(back, "Document back", false);
}

export const GENDER_VALUES = [
  "MALE",
  "FEMALE",
  "OTHER",
  "PREFER_NOT_TO_SAY",
] as const;

export const ADDRESS_TYPE_VALUES = ["PRIMARY", "SECONDARY"] as const;

/* =========================
   UPDATE PROFILE SCHEMA
========================= */

export const updateUserProfileSchema = z.object({
  dateOfBirth: z
    .string()
    .trim()
    .min(1, "Date of birth is required")
    .refine(
      (value) => {
        const date = new Date(value);
        return !Number.isNaN(date.getTime());
      },
      {
        message: "Invalid date of birth",
      },
    )
    .refine(
      (value) => {
        const date = new Date(value);
        return date < new Date();
      },
      {
        message: "Date of birth must be in the past",
      },
    ),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),

  gender: z.enum(GENDER_VALUES, {
    message: "Invalid gender",
  }),

  addressType: z.enum(ADDRESS_TYPE_VALUES, {
    message: "Invalid address type",
  }),

  addressDetails: z
    .string()
    .trim()
    .min(5, "Address must contain at least 5 characters")
    .max(500, "Address cannot exceed 500 characters"),

  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),

  landmark: z
    .string()
    .trim()
    .max(150, "Landmark cannot exceed 150 characters")
    .optional()
    .or(z.literal("")),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
