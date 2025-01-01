import { z } from "zod";

const serviceSchema = z.object({
  serviceId: z.string().min(1, {
    message: "Service ID is required."
  })
});

export const bookingSchema = z.object({
  userId: z.string().min(1, {
    message: "User ID is required."
  }),

  beautySalonId: z.string().min(1, {
    message: "Beauty salon ID is required."
  }),

  date: z.coerce.date({
    message: "Date must be a valid date-time format."
  }),

  services: z.array(serviceSchema).min(1, {
    message: "At least one service must be selected."
  }),
});
