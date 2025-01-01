import { z } from "zod";

// Add schema for service validation
export const serviceSchema = z.object({
    // The name of the service
    name: z.string().min(1, {
        message: "Service name is required."
    }),

    // The price of the service
    price: z.number().min(0, {
        message: "Price must be a positive number."
    }),


    description: z.string().optional(),
});
