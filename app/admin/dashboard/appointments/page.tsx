import { updateAppointmentStatusAction } from "@/lib/actions/admin-dashboard";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ doctor?: string; status?: string; date?: string }>;
}) {
  const { doctor = "", status = "", date = "" } = await searchParams;
  const doctors = await prisma.doctorProfile.findMany({ include: { user: { select: { email: true } } } });

  const appointments = await prisma.appointment.findMany({
    where: {
      ...(doctor ? { doctorId: doctor } : {}),
      ...(status ? { status: status as "PENDING" | "CONFIRMED" | "COMPLETED" } : {}),
      ...(date
        ? {
            date: {
              gte: new Date(`${date}T00:00:00`),
              lte: new Date(`${date}T23:59:59`),
            },
          }
        : {}),
    },
    include: {
      patient: { include: { user: { select: { email: true } } } },
      doctor: { include: { user: { select: { email: true } } } },
    },
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-4">
      <form className="grid gap-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200 md:grid-cols-4">
        <input type="date" name="date" defaultValue={date} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
        <select name="doctor" defaultValue={doctor} className="rounded-md border border-slate-300 px-3 py-2 text-sm"><option value="">All Doctors</option>{doctors.map((d)=><option key={d.id} value={d.id}>{d.user.email}</option>)}</select>
        <select name="status" defaultValue={status} className="rounded-md border border-slate-300 px-3 py-2 text-sm"><option value="">All Status</option><option value="PENDING">PENDING</option><option value="CONFIRMED">CONFIRMED</option><option value="COMPLETED">COMPLETED</option></select>
        <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">Apply</button>
      </form>

      <div className="space-y-2">
        {appointments.map((a) => (
          <div key={a.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm">{a.patient.name} ({a.patient.user.email}) → {a.doctor.user.email}</p>
            <p className="text-xs text-slate-600">{a.date.toLocaleString()}</p>
            <form action={updateAppointmentStatusAction} className="mt-2 flex items-center gap-2">
              <input type="hidden" name="appointmentId" value={a.id} />
              <select name="status" defaultValue={a.status} className="rounded-md border border-slate-300 px-3 py-1 text-sm">
                <option value="PENDING">PENDING</option><option value="CONFIRMED">CONFIRMED</option><option value="COMPLETED">COMPLETED</option>
              </select>
              <button className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white">Update</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
