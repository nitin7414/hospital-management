import { z } from "zod";

export const generateInvoiceSchema = z.object({
  appointmentId: z.string().uuid("Invalid appointment ID."),
});

export const markInvoicePaidSchema = z.object({
  invoiceId: z.string().uuid("Invalid invoice ID."),
});
