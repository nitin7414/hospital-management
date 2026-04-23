import { z } from "zod";

export const appointmentBookingSchema = z.object({
  doctorId: z.string().uuid("Please select a valid doctor."),
  date: z
    .string()
    .min(1, "Appointment date is required.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Appointment date is invalid."),
});
