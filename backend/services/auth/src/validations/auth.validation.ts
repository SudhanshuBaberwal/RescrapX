import { email, z } from "zod";
import { UserRole } from "../models/user.model.js";

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

    signupType:z.enum(["USER","PARTNER"]).default("USER")
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(50),
});

export const roleSchema = z.object({
  role: z.nativeEnum(UserRole),
});


export const VerifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z
  .object({
    email: z.email(),
    otp: z.string().length(6),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => (data.password = data.confirmPassword), {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(8),

    newPassword: z.string().min(8),

    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resendVerificationSchema = z.object({
  email: z.email(),
});

export const googleLoginSchema = z.object({
  token: z.string().min(1),
});

export type GoogleLoginDto = z.infer<typeof googleLoginSchema>;
export type ResendVerificationDto = z.infer<typeof resendVerificationSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type VerifyOtpDto = z.infer<typeof VerifyOtpSchema>;
export type SignupDto = z.infer<typeof signupSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type RoleDto = z.infer<typeof roleSchema>;
