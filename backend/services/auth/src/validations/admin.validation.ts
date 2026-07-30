import { email, z } from "zod";
import { PartnerStatus, UserRole } from "../models/user.model.js";

export const partnerStatusChangeSchema = z.object({
  partnerId: z.string(),
});

export const rejectPartnerSchema = z.object({
  partnerId: z.string().min(1, "Partner Id is required"),

  reason: z
    .string()
    .trim()
    .min(10, "Reason should contain at least 10 characters")
    .max(500),
});

export type RejectPartnerDto = z.infer<typeof rejectPartnerSchema>;
export type partnerStatusChangeDto = z.infer<typeof partnerStatusChangeSchema>;
