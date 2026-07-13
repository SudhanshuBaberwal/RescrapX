import { email, z } from "zod";

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50),

    email: z
      .email("Invalid email")
      .trim()
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignupDto = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email : z.email(),
  password: z.string().min(8)
});

export type LoginDto = z.infer<typeof loginSchema>;