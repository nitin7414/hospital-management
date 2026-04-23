import Link from "next/link";

import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminPatientListPage() {
  await requireAdmin();

  const patients = await prisma.patientProfile.findMany({
    include: {
      user: {
        select: {
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      user: {
        createdAt: "desc",
      },
    },
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Patients</h1>
        <Link href="/admin/patients/new" className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">
          Add Patient
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Name</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Age</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Gender</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Registered</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-4 py-3">{patient.name}</td>
                <td className="px-4 py-3">{patient.user.email}</td>
                <td className="px-4 py-3">{patient.age}</td>
                <td className="px-4 py-3">{patient.gender}</td>
                <td className="px-4 py-3">{patient.user.createdAt.toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/patients/${patient.id}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {patients.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={6}>
                  No patients found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
