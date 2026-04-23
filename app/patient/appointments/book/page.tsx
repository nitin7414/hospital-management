import Link from "next/link";

import { AppointmentBookingForm } from "@/components/appointments/appointment-booking-form";
import { requireRole } from "@/lib/auth/role";
import { prisma } from "@/lib/prisma";

export default async function BookAppointmentPage() {
  await requireRole("PATIENT");

  const doctors = await prisma.doctorProfile.findMany({
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
    orderBy: {
      specialization: "asc",
    },
  });

  const doctorOptions = doctors.map((doctor) => ({
    id: doctor.id,
    name: doctor.user.email,
    specialization: doctor.specialization,
  }));

  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Book Appointment</h1>
        <Link href="/patient/appointments" className="text-sm text-blue-600 hover:underline">
          My Appointments
        </Link>
      </div>

      {doctorOptions.length === 0 ? (
        <p className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-700">
          No doctors are available yet. Please contact admin.
        </p>
      ) : (
        <AppointmentBookingForm doctors={doctorOptions} />
      )}
    </main>
  );
}
