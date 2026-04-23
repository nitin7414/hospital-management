import { requireRole } from "@/lib/auth/role";
import { prisma } from "@/lib/prisma";

export default async function DoctorAppointmentsPage() {
  const session = await requireRole("DOCTOR");

  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const appointments = doctor
    ? await prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: {
          patient: {
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
      <h1 className="mb-6 text-2xl font-semibold">Doctor Schedule</h1>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Patient</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Date</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-4 py-3">{appointment.patient.name}</td>
                <td className="px-4 py-3">{appointment.patient.user.email}</td>
                <td className="px-4 py-3">{appointment.date.toLocaleString()}</td>
                <td className="px-4 py-3">{appointment.status}</td>
              </tr>
            ))}
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No appointments scheduled.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
