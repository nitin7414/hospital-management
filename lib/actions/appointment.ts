"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/role";
import { prisma } from "@/lib/prisma";
import { appointmentBookingSchema } from "@/lib/validations/appointment";

export type BookAppointmentState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function bookAppointmentAction(
  _prevState: BookAppointmentState,
  formData: FormData,
): Promise<BookAppointmentState> {
  const session = await requireRole("PATIENT");

  const parsed = appointmentBookingSchema.safeParse({
    doctorId: formData.get("doctorId"),
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the validation errors.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const appointmentDate = new Date(parsed.data.date);
  if (appointmentDate <= new Date()) {
    return {
      success: false,
      message: "Appointment date must be in the future.",
    };
  }

  try {
    const [patientProfile, doctorProfile] = await Promise.all([
      prisma.patientProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      }),
      prisma.doctorProfile.findUnique({
        where: { id: parsed.data.doctorId },
        select: { id: true },
      }),
    ]);

    if (!patientProfile) {
      return {
        success: false,
        message: "Patient profile is not set up for this account.",
      };
    }

    if (!doctorProfile) {
      return {
        success: false,
        message: "Selected doctor is not available.",
      };
    }

    await prisma.appointment.create({
      data: {
        patientId: patientProfile.id,
        doctorId: doctorProfile.id,
        date: appointmentDate,
        status: "PENDING",
      },
    });

    revalidatePath("/patient/appointments");
    revalidatePath("/patient/appointments/book");
    revalidatePath("/doctor/appointments");
    revalidatePath("/admin/appointments");

    return {
      success: true,
      message: "Appointment booked successfully.",
    };
  } catch (error) {
    console.error("Book appointment error:", error);
    return {
      success: false,
      message: "Failed to book appointment.",
    };
  }
}
