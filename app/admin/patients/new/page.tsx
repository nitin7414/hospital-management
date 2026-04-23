import Link from "next/link";

import { PatientRegistrationForm } from "@/components/patients/patient-registration-form";
import { requireAdmin } from "@/lib/auth/admin";

export default async function NewPatientPage() {
  await requireAdmin();
  return (
    <main className="mx-auto max-w-2xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Register Patient</h1>
        <Link href="/admin/patients" className="text-sm text-blue-600 hover:underline">
          Back to patient list
        </Link>
      </div>
      <PatientRegistrationForm />
    </main>
  );
}
