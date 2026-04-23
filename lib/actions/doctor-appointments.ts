"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireRole } from "@/lib/auth/role";
import { prisma } from "@/lib/prisma";

const updateNotesSchema = z.object({
  appointmentId: z.string().uuid("Invalid appointment ID."),
  notes: z.string().max(2000, "Notes are too long.").optional(),
});

export type UpdateAppointmentNotesState = {
  success: boolean;
  message: string;
};

export async function updateAppointmentNotesAction(
  _prevState: UpdateAppointmentNotesState,
  formData: FormData,
): Promise<UpdateAppointmentNotesState> {
  const session = await requireRole("DOCTOR");

  const parsed = updateNotesSchema.safeParse({
    appointmentId: formData.get("appointmentId"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid payload.",
    };
  }

  try {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!doctor) {
      return {
        success: false,
        message: "Doctor profile not found.",
      };
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: parsed.data.appointmentId },
      select: { id: true, doctorId: true },
    });

    if (!appointment || appointment.doctorId !== doctor.id) {
      return {
        success: false,
        message: "You are not allowed to update this appointment.",
      };
    }

    await prisma.appointment.update({
      where: { id: parsed.data.appointmentId },
      data: { notes: parsed.data.notes?.trim() || null },
    });

    revalidatePath("/doctor/dashboard");
    revalidatePath("/doctor/appointments");

    return {
      success: true,
      message: "Notes updated successfully.",
    };
  } catch (error) {
    console.error("Update appointment notes error:", error);
    return {
      success: false,
      message: "Failed to update notes.",
    };
  }
}
