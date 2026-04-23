import { MarkPaidForm } from "@/components/billing/mark-paid-form";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminBillingPage() {
  await requireAdmin();

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const [dailyAppointmentsCount, invoices] = await Promise.all([
    prisma.appointment.count({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),
    prisma.invoice.findMany({
      include: {
        patient: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const revenueTotal = invoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0);
  const paidRevenue = invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0);

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Billing & Reports</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Daily Appointments</p>
          <p className="mt-1 text-2xl font-semibold">{dailyAppointmentsCount}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="mt-1 text-2xl font-semibold">${revenueTotal.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-500">Paid Revenue</p>
          <p className="mt-1 text-2xl font-semibold">${paidRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Invoice ID</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Patient</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Created</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-4 py-3">{invoice.id}</td>
                <td className="px-4 py-3">{invoice.patient.name}</td>
                <td className="px-4 py-3">${Number(invoice.amount).toFixed(2)}</td>
                <td className="px-4 py-3">{invoice.status}</td>
                <td className="px-4 py-3">{invoice.createdAt.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <MarkPaidForm invoiceId={invoice.id} disabled={invoice.status === "PAID"} />
                </td>
              </tr>
            ))}
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No invoices found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
