import { z } from "zod";

export const authPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/;

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Invalid email address");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long");
const strongPasswordSchema = passwordSchema.regex(
  authPasswordRegex,
  "Password does not meet all mandatory requirements"
);
const verificationCodeRegex = /^\d{6}$/;
const verificationCodeSchema = z
  .string()
  .regex(verificationCodeRegex, "Code must be exactly 6 digits");

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const emailRequestSchema = z.object({ email: emailSchema });
export const verificationCodeFormSchema = z.object({
  code: verificationCodeSchema,
});

export function createAccountSchema(enforcePasswordPolicy: boolean) {
  return z
    .object({
      confirmPassword: enforcePasswordPolicy
        ? strongPasswordSchema
        : z.string().min(1, "Please confirm your password"),
      email: emailSchema,
      name: z.string().trim().min(2, "Full name is required"),
      password: enforcePasswordPolicy
        ? strongPasswordSchema
        : z.string().min(1, "Password is required"),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
}

export function resetPasswordSchema(enforcePasswordPolicy: boolean) {
  return z
    .object({
      confirmPassword: enforcePasswordPolicy
        ? strongPasswordSchema
        : z.string().min(1, "Please confirm your password"),
      password: enforcePasswordPolicy
        ? strongPasswordSchema
        : z.string().min(1, "Password is required"),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
}
