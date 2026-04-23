import { z } from "zod";

export const doctorCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  specialization: z.string().min(2),
  experienceYears: z.coerce.number().int().min(0),
});

export const doctorUpdateSchema = z.object({
  doctorId: z.string().uuid(),
  name: z.string().min(2),
  specialization: z.string().min(2),
  experienceYears: z.coerce.number().int().min(0),
});

export const idSchema = z.object({ id: z.string().uuid() });

export const appointmentStatusSchema = z.object({
  appointmentId: z.string().uuid(),
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED"]),
});

export const invoiceCreateSchema = z.object({
  appointmentId: z.string().uuid(),
});

export const invoiceStatusSchema = z.object({
  invoiceId: z.string().uuid(),
  status: z.enum(["PAID", "UNPAID"]),
});
