import { AppointmentsTrendChart } from "@/components/admin/charts";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardReportsPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);

  const [dailyAppointments, monthlyRevenue, doctorPerf] = await Promise.all([
    prisma.appointment.count({ where: { date: { gte: startToday } } }),
    prisma.invoice.findMany({ where: { createdAt: { gte: monthStart } }, select: { amount: true } }),
    prisma.doctorProfile.findMany({ include: { user: { select: { email: true } }, appointments: true } }),
  ]);

  const perf = doctorPerf.map((d) => ({ doctor: d.user.email, count: d.appointments.length }));
  const trend = [{ day: "Today", count: dailyAppointments }];
  const revenue = monthlyRevenue.reduce((s, i) => s + Number(i.amount), 0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">Monthly Revenue</p>
        <p className="text-2xl font-semibold">${revenue.toFixed(2)}</p>
      </div>
      <AppointmentsTrendChart data={trend} />
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <h3 className="mb-2 text-sm font-semibold">Doctor Performance</h3>
        <ul className="space-y-1 text-sm">{perf.map((p)=><li key={p.doctor}>{p.doctor}: {p.count} appointments</li>)}</ul>
      </div>
    </div>
  );
}
