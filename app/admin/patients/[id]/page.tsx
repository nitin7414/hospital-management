import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

type PatientDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  await requireAdmin();
  const { id } = await params;

  const patient = await prisma.patientProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          email: true,
          createdAt: true,
        },
      },
    },
  });

  if (!patient) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Patient Detail</h1>
        <Link href="/admin/patients" className="text-sm text-blue-600 hover:underline">
          Back to patient list
        </Link>
      </div>

      <section className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div>
          <p className="text-sm text-slate-500">Name</p>
          <p className="font-medium">{patient.name}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Email</p>
          <p className="font-medium">{patient.user.email}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Age</p>
            <p className="font-medium">{patient.age}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Gender</p>
            <p className="font-medium">{patient.gender}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-500">Medical History</p>
          <p className="whitespace-pre-wrap font-medium">{patient.medicalHistory}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Registered</p>
          <p className="font-medium">{patient.user.createdAt.toLocaleString()}</p>
        </div>
      </section>
    </main>
  );
}
