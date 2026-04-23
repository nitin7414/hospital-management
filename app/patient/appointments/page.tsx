import Link from "next/link";

import { requireRole } from "@/lib/auth/role";
import { prisma } from "@/lib/prisma";

export default async function PatientAppointmentsPage() {
  const session = await requireRole("PATIENT");

  const patient = await prisma.patientProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const appointments = patient
    ? await prisma.appointment.findMany({
        where: { patientId: patient.id },
        include: {
          doctor: {
            include: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { date: "asc" },
      })
    : [];

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Appointments</h1>
        <Link href="/patient/appointments/book" className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">
          Book Appointment
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Doctor</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Specialization</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Date</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-4 py-3">{appointment.doctor.user.email}</td>
                <td className="px-4 py-3">{appointment.doctor.specialization}</td>
                <td className="px-4 py-3">{appointment.date.toLocaleString()}</td>
                <td className="px-4 py-3">{appointment.status}</td>
              </tr>
            ))}
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No appointments found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
