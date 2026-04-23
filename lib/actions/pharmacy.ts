"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { requireAdmin } from "@/lib/auth/admin";
import { requireRole } from "@/lib/auth/role";
import { prisma } from "@/lib/prisma";
import {
  addPrescriptionSchema,
  createMedicineSchema,
  updateMedicineStockSchema,
} from "@/lib/validations/pharmacy";

export type PharmacyActionState = {
  success: boolean;
  message: string;
};

export async function createMedicineAction(
  _prevState: PharmacyActionState,
  formData: FormData,
): Promise<PharmacyActionState> {
  await requireAdmin();

  const parsed = createMedicineSchema.safeParse({
    name: formData.get("name"),
    stock: formData.get("stock"),
    price: formData.get("price"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid medicine data." };
  }

  try {
    await prisma.medicine.create({
      data: {
        name: parsed.data.name,
        stock: parsed.data.stock,
        price: new Prisma.Decimal(parsed.data.price),
      },
    });

    revalidatePath("/admin/pharmacy");
    return { success: true, message: "Medicine added successfully." };
  } catch (error) {
    console.error("Create medicine error:", error);
    return { success: false, message: "Unable to add medicine." };
  }
}

export async function updateMedicineStockAction(
  _prevState: PharmacyActionState,
  formData: FormData,
): Promise<PharmacyActionState> {
  await requireAdmin();

  const parsed = updateMedicineStockSchema.safeParse({
    medicineId: formData.get("medicineId"),
    stock: formData.get("stock"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid stock data." };
  }

  try {
    await prisma.medicine.update({
      where: { id: parsed.data.medicineId },
      data: { stock: parsed.data.stock },
    });

    revalidatePath("/admin/pharmacy");
    return { success: true, message: "Stock updated successfully." };
  } catch (error) {
    console.error("Update stock error:", error);
    return { success: false, message: "Unable to update stock." };
  }
}

export async function addPrescriptionAction(
  _prevState: PharmacyActionState,
  formData: FormData,
): Promise<PharmacyActionState> {
  const session = await requireRole("DOCTOR");

  const parsed = addPrescriptionSchema.safeParse({
    appointmentId: formData.get("appointmentId"),
    medicineId: formData.get("medicineId"),
    quantity: formData.get("quantity"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid prescription data." };
  }

  try {
    const [doctor, appointment, medicine] = await Promise.all([
      prisma.doctorProfile.findUnique({ where: { userId: session.user.id }, select: { id: true } }),
      prisma.appointment.findUnique({ where: { id: parsed.data.appointmentId }, select: { id: true, doctorId: true } }),
      prisma.medicine.findUnique({ where: { id: parsed.data.medicineId }, select: { id: true, stock: true, name: true } }),
    ]);

    if (!doctor || !appointment || appointment.doctorId !== doctor.id) {
      return { success: false, message: "You cannot prescribe for this appointment." };
    }

    if (!medicine) {
      return { success: false, message: "Medicine not found." };
    }

    if (medicine.stock < parsed.data.quantity) {
      return { success: false, message: `Insufficient stock for ${medicine.name}.` };
    }

    await prisma.$transaction(async (tx) => {
      await tx.prescription.create({
        data: {
          appointmentId: parsed.data.appointmentId,
          medicineId: parsed.data.medicineId,
          quantity: parsed.data.quantity,
        },
      });

      await tx.medicine.update({
        where: { id: parsed.data.medicineId },
        data: { stock: { decrement: parsed.data.quantity } },
      });
    });

    revalidatePath("/doctor/dashboard");
    revalidatePath("/admin/pharmacy");

    return { success: true, message: "Prescription added successfully." };
  } catch (error) {
    console.error("Add prescription error:", error);
    return { success: false, message: "Unable to add prescription." };
  }
}
