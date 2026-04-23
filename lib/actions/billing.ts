"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { requireRole } from "@/lib/auth/role";
import { prisma } from "@/lib/prisma";
import { generateInvoiceSchema, markInvoicePaidSchema } from "@/lib/validations/billing";

export type BillingActionState = {
  success: boolean;
  message: string;
};

export async function generateInvoiceAction(
  _prevState: BillingActionState,
  formData: FormData,
): Promise<BillingActionState> {
  const session = await requireRole("DOCTOR");

  const parsed = generateInvoiceSchema.safeParse({
    appointmentId: formData.get("appointmentId"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid request." };
  }

  try {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!doctor) {
      return { success: false, message: "Doctor profile not found." };
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: parsed.data.appointmentId },
      include: {
        prescriptions: {
          include: {
            medicine: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    });

    if (!appointment || appointment.doctorId !== doctor.id) {
      return { success: false, message: "You cannot generate invoice for this appointment." };
    }

    const existingInvoice = await prisma.invoice.findUnique({
      where: { appointmentId: appointment.id },
      select: { id: true },
    });

    if (existingInvoice) {
      return { success: false, message: "Invoice already exists for this appointment." };
    }

    const prescriptionTotal = appointment.prescriptions.reduce(
      (total, item) => total + Number(item.medicine.price) * item.quantity,
      0,
    );

    const consultationFee = 50;
    const totalAmount = prescriptionTotal + consultationFee;

    await prisma.invoice.create({
      data: {
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        amount: new Prisma.Decimal(totalAmount),
        status: "UNPAID",
      },
    });

    revalidatePath("/doctor/dashboard");
    revalidatePath("/admin/billing");

    return { success: true, message: "Invoice generated successfully." };
  } catch (error) {
    console.error("Generate invoice error:", error);
    return { success: false, message: "Failed to generate invoice." };
  }
}

export async function markInvoicePaidAction(
  _prevState: BillingActionState,
  formData: FormData,
): Promise<BillingActionState> {
  await requireAdmin();

  const parsed = markInvoicePaidSchema.safeParse({
    invoiceId: formData.get("invoiceId"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid request." };
  }

  try {
    await prisma.invoice.update({
      where: { id: parsed.data.invoiceId },
      data: { status: "PAID" },
    });

    revalidatePath("/admin/billing");
    return { success: true, message: "Invoice marked as paid." };
  } catch (error) {
    console.error("Mark invoice paid error:", error);
    return { success: false, message: "Unable to update invoice status." };
  }
}
