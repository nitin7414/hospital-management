import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { AddMedicineForm } from "@/components/pharmacy/add-medicine-form";
import { UpdateStockForm } from "@/components/pharmacy/update-stock-form";
import { deleteMedicineAction } from "@/lib/actions/admin-dashboard";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPharmacyPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const medicines = await prisma.medicine.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-4">
      <AddMedicineForm />
      <form className="max-w-md"><input name="q" defaultValue={q} placeholder="Search medicines..." className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" /></form>
      <div className="space-y-2">
        {medicines.map((m) => (
          <div key={m.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{m.name} {m.stock < 10 ? <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Low stock</span> : null}</p>
              <p className="text-sm text-slate-600">${m.price.toString()}</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <UpdateStockForm medicineId={m.id} currentStock={m.stock} />
              <form action={deleteMedicineAction}><input type="hidden" name="id" value={m.id} /><ConfirmSubmitButton label="Delete" confirmText="Delete this medicine?" /></form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
