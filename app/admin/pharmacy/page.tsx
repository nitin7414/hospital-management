import { AddMedicineForm } from "@/components/pharmacy/add-medicine-form";
import { UpdateStockForm } from "@/components/pharmacy/update-stock-form";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminPharmacyPage() {
  await requireAdmin();

  const medicines = await prisma.medicine.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Pharmacy Management</h1>

      <div className="mb-6">
        <AddMedicineForm />
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Medicine</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Price</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Stock</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Update Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td className="px-4 py-3">{medicine.name}</td>
                <td className="px-4 py-3">${medicine.price.toString()}</td>
                <td className="px-4 py-3">{medicine.stock}</td>
                <td className="px-4 py-3">
                  <UpdateStockForm medicineId={medicine.id} currentStock={medicine.stock} />
                </td>
              </tr>
            ))}
            {medicines.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No medicines found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
