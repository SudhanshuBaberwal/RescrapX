import { z } from "zod";

export const partnerSignupSchema = z
  .object({
    fullName: z.string().trim().min(3).max(50),
    email: z.string().trim().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    phoneNumber: z.string().min(10).max(15),
    companyName: z.string().trim().min(2),
    gstNumber: z.string().trim(),
    panNumber: z.string().trim(),
    registrationNumber: z.string().trim(),
    address: z.string().trim(),
    city: z.string().trim(),
    state: z.string().trim(),
    pincode: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type PartnerSignupDto = z.infer<typeof partnerSignupSchema>;
