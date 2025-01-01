import { z } from 'zod';

export const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/; // Example: Allows +1234567890 or 1234567890

export const salonSchema = z.object({
  name: z
    .string()
    .optional(),
  location: z
    .string()
    .url("Invalid URL format for link."),
  phone: z
    .string()
    .regex(phoneRegex, "Invalid phone number format."),
  services: z
    .array(z.object({
      name: z.string().optional(),
      id: z.string().optional(),
      price: z.number().optional(),
    }))
    .optional(),
});

// Update salon schema
export const updateSalonSchema = z.object({
  name: z
    .string()
    .optional(),
  location: z
    .string()
    .optional(),
  phone: z
    .string()
    .regex(phoneRegex, "Invalid phone number format."),
  services: z
    .array(z.object({
      name: z.string().optional(),
      id: z.string().optional(),
      price: z.number().optional(),
    }))
    .optional(),
})

