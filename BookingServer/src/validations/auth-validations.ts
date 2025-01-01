import {
  z
} from "zod";

export const registerSchema = z.object({
  phone: z
    .string()
    .min(3, "Phone must be at least 3 characters long.")
    .max(20, "Phone must be at most 20 characters long.")
    .optional(),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  name: z.string().min(2, "Name must be at least 2 characters long."),
  email: z.string().email("Please provide a valid email address."),
});

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address.").optional(),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  phone: z
    .string()
    .min(3, "Phone must be at least 3 characters long.")
    .max(20, "Phone must be at most 20 characters long.")
    .optional(),
}).refine((data) => data.email || data.phone, {
  message: "Either email or phone must be provided.",
  path: ["email", "phone"], // Apply error to both fields if neither is provided
}).refine((data) => (data.email && data.password) || (data.phone && data.password), {
  message: "Both email or phone and password must be provided.",
  path: ["email", "phone", "password"],
});
export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long."),
});