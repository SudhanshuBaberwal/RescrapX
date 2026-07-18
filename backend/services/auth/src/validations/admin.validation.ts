import { email, z } from "zod";
import { PartnerStatus, UserRole } from "../models/user.model.js";

export const partnerStatusChangeSchema = z.object({
  partnerId: z.string(),
});

export type partnerStatusChangeDto = z.infer<typeof partnerStatusChangeSchema>;
