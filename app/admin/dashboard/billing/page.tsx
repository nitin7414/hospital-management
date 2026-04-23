import { MarkPaidForm } from "@/components/billing/mark-paid-form";
import { createInvoiceAction, updateInvoiceStatusAction } from "@/lib/actions/admin-dashboard";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardBillingPage() {
  const [invoices, appointmentsNoInvoice] = await Promise.all([
    prisma.invoice.findMany({ include: { patient: true }, orderBy: { createdAt: "desc" } }),
    prisma.appointment.findMany({
      where: { invoice: null },
      include: { patient: true },
      orderBy: { date: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-4">
      <form action={createInvoiceAction} className="grid gap-2 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-3">
        <select name="appointmentId" className="rounded-md border border-slate-300 px-3 py-2 text-sm" required>
          <option value="">Select appointment to invoice</option>
          {appointmentsNoInvoice.map((a) => <option key={a.id} value={a.id}>{a.patient.name} - {a.date.toLocaleDateString()}</option>)}
        </select>
        <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">Generate Invoice</button>
      </form>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50"><tr><th className="px-4 py-3 text-left">Patient</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-left">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-4 py-3">{inv.patient.name}</td>
                <td className="px-4 py-3">${Number(inv.amount).toFixed(2)}</td>
                <td className="px-4 py-3">{inv.status}</td>
                <td className="px-4 py-3 flex gap-2">
                  <MarkPaidForm invoiceId={inv.id} disabled={inv.status === "PAID"} />
                  <form action={updateInvoiceStatusAction}>
                    <input type="hidden" name="invoiceId" value={inv.id} />
                    <input type="hidden" name="status" value="UNPAID" />
                    <button className="rounded-md border border-slate-300 px-3 py-1 text-xs">Mark Unpaid</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
