import { z } from "zod";

export const verificationEmailSchema = z.object({
  email: z.email(),
  fullName: z.string().min(2).max(50),
  otp: z.string().length(6),
});

export const welcomeEmailSchema = z.object({
  email: z.email(),
  fullName: z.string().min(2).max(50),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
  fullName: z.string().min(2).max(50),
  otp: z.string().length(6),
});

export const passwordChangeSchema = z.object({
  email: z.email(),
  fullName: z.string().min(2).max(50),
});

export const otpEmailSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});