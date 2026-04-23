import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminAppointmentsPage() {
  await requireAdmin();

  const appointments = await prisma.appointment.findMany({
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
    orderBy: {
      date: "asc",
    },
  });

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">All Appointments</h1>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Patient</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Doctor</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Specialization</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Date</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="px-4 py-3">{appointment.patient.name} ({appointment.patient.user.email})</td>
                <td className="px-4 py-3">{appointment.doctor.user.email}</td>
                <td className="px-4 py-3">{appointment.doctor.specialization}</td>
                <td className="px-4 py-3">{appointment.date.toLocaleString()}</td>
                <td className="px-4 py-3">{appointment.status}</td>
              </tr>
            ))}
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
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
