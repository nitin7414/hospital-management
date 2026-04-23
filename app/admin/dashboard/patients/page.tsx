import Link from "next/link";

import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { deletePatientAction } from "@/lib/actions/admin-dashboard";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  const patients = await prisma.patientProfile.findMany({
    where: {
      name: { contains: q, mode: "insensitive" },
    },
    include: { user: { select: { email: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-4">
      <form className="max-w-md">
        <input name="q" defaultValue={q} placeholder="Search patients..." className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </form>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Age</th><th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-4 py-3">{patient.name}</td>
                <td className="px-4 py-3">{patient.user.email}</td>
                <td className="px-4 py-3">{patient.age}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/patients/${patient.id}`} className="rounded-md border border-slate-300 px-3 py-1 text-xs">View</Link>
                    <form action={deletePatientAction}>
                      <input type="hidden" name="id" value={patient.id} />
                      <ConfirmSubmitButton label="Delete" confirmText="Delete this patient?" />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
