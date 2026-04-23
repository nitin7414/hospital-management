import { z } from "zod";

export const createMedicineSchema = z.object({
  name: z.string().trim().min(2, "Medicine name is required."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  price: z.coerce.number().positive("Price must be greater than zero."),
});

export const updateMedicineStockSchema = z.object({
  medicineId: z.string().uuid("Invalid medicine ID."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
});

export const addPrescriptionSchema = z.object({
  appointmentId: z.string().uuid("Invalid appointment ID."),
  medicineId: z.string().uuid("Invalid medicine ID."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
});
