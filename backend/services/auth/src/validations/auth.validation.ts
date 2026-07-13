import { email, z } from "zod";

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50),

    email: z.email("Invalid email").trim().toLowerCase(),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(50),
});

export const VerifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>;
export type SignupDto = z.infer<typeof signupSchema>;
