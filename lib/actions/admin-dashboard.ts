"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import {
  appointmentStatusSchema,
  doctorCreateSchema,
  doctorUpdateSchema,
  idSchema,
  invoiceCreateSchema,
  invoiceStatusSchema,
} from "@/lib/validations/admin-dashboard";

export type AdminActionState = { success: boolean; message: string };

const ok = (message: string): AdminActionState => ({ success: true, message });
const fail = (message: string): AdminActionState => ({ success: false, message });

export async function deletePatientAction(_: AdminActionState, formData: FormData) {
  await requireAdmin();
  const parsed = idSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return fail("Invalid patient ID.");
  await prisma.patientProfile.delete({ where: { id: parsed.data.id } });
  revalidatePath("/admin/dashboard/patients");
  return ok("Patient deleted.");
}

export async function createDoctorAction(_: AdminActionState, formData: FormData) {
  await requireAdmin();
  const parsed = doctorCreateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid doctor data.");

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return fail("Email already in use.");

  const hashed = await hash(parsed.data.password, 12);
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: parsed.data.email, password: hashed, role: "DOCTOR" },
    });
    await tx.doctorProfile.create({
      data: {
        userId: user.id,
        specialization: parsed.data.specialization,
        experienceYears: parsed.data.experienceYears,
      },
    });
  });

  revalidatePath("/admin/dashboard/doctors");
  return ok("Doctor created.");
}

export async function updateDoctorAction(_: AdminActionState, formData: FormData) {
  await requireAdmin();
  const parsed = doctorUpdateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid doctor data.");

  await prisma.doctorProfile.update({
    where: { id: parsed.data.doctorId },
    data: {
      specialization: parsed.data.specialization,
      experienceYears: parsed.data.experienceYears,
    },
  });

  revalidatePath("/admin/dashboard/doctors");
  return ok("Doctor updated.");
}

export async function deleteDoctorAction(_: AdminActionState, formData: FormData) {
  await requireAdmin();
  const parsed = idSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return fail("Invalid doctor ID.");

  const doctor = await prisma.doctorProfile.findUnique({ where: { id: parsed.data.id }, select: { userId: true } });
  if (!doctor) return fail("Doctor not found.");

  await prisma.user.delete({ where: { id: doctor.userId } });
  revalidatePath("/admin/dashboard/doctors");
  return ok("Doctor deleted.");
}

export async function updateAppointmentStatusAction(_: AdminActionState, formData: FormData) {
  await requireAdmin();
  const parsed = appointmentStatusSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return fail("Invalid status update.");

  await prisma.appointment.update({ where: { id: parsed.data.appointmentId }, data: { status: parsed.data.status } });
  revalidatePath("/admin/dashboard/appointments");
  return ok("Appointment status updated.");
}

export async function deleteMedicineAction(_: AdminActionState, formData: FormData) {
  await requireAdmin();
  const parsed = idSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return fail("Invalid medicine ID.");
  await prisma.medicine.delete({ where: { id: parsed.data.id } });
  revalidatePath("/admin/dashboard/pharmacy");
  return ok("Medicine deleted.");
}

export async function createInvoiceAction(_: AdminActionState, formData: FormData) {
  await requireAdmin();
  const parsed = invoiceCreateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return fail("Invalid invoice data.");

  const appointment = await prisma.appointment.findUnique({
    where: { id: parsed.data.appointmentId },
    include: {
      prescriptions: {
        include: { medicine: { select: { price: true } } },
      },
    },
  });

  if (!appointment) return fail("Appointment not found.");

  const exists = await prisma.invoice.findUnique({ where: { appointmentId: appointment.id }, select: { id: true } });
  if (exists) return fail("Invoice already exists for this appointment.");

  const total = appointment.prescriptions.reduce((sum, item) => sum + Number(item.medicine.price) * item.quantity, 50);

  await prisma.invoice.create({
    data: {
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      amount: total,
      status: "UNPAID",
    },
  });

  revalidatePath("/admin/dashboard/billing");
  return ok("Invoice generated.");
}

export async function updateInvoiceStatusAction(_: AdminActionState, formData: FormData) {
  await requireAdmin();
  const parsed = invoiceStatusSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return fail("Invalid invoice status.");

  await prisma.invoice.update({ where: { id: parsed.data.invoiceId }, data: { status: parsed.data.status } });
  revalidatePath("/admin/dashboard/billing");
  return ok("Invoice status updated.");
}
