import { subDays } from "date-fns";

import { AppointmentsTrendChart } from "@/components/admin/charts";
import { StatCard } from "@/components/admin/StatCard";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardOverviewPage() {
  const now = new Date();
  const startToday = new Date(now);
  startToday.setHours(0, 0, 0, 0);
  const endToday = new Date(now);
  endToday.setHours(23, 59, 59, 999);

  const [totalPatients, totalDoctors, appointmentsToday, invoices] = await Promise.all([
    prisma.patientProfile.count(),
    prisma.doctorProfile.count(),
    prisma.appointment.count({ where: { date: { gte: startToday, lte: endToday } } }),
    prisma.invoice.findMany({ select: { amount: true } }),
  ]);

  const totalRevenue = invoices.reduce((sum, item) => sum + Number(item.amount), 0);

  const days = Array.from({ length: 7 }).map((_, idx) => subDays(now, 6 - idx));
  const trend = await Promise.all(
    days.map(async (day) => {
      const start = new Date(day);
      start.setHours(0, 0, 0, 0);
      const end = new Date(day);
      end.setHours(23, 59, 59, 999);
      const count = await prisma.appointment.count({ where: { date: { gte: start, lte: end } } });
      return { day: day.toLocaleDateString(undefined, { weekday: "short" }), count };
    }),
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Patients" value={totalPatients} />
        <StatCard label="Total Doctors" value={totalDoctors} />
        <StatCard label="Appointments Today" value={appointmentsToday} />
        <StatCard label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
      </div>

      <AppointmentsTrendChart data={trend} />
    </div>
  );
}
