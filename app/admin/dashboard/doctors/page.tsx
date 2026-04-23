import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { createDoctorAction, deleteDoctorAction, updateDoctorAction } from "@/lib/actions/admin-dashboard";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardDoctorsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const doctors = await prisma.doctorProfile.findMany({
    where: { specialization: { contains: q, mode: "insensitive" } },
    include: { user: { select: { email: true } } },
    orderBy: { specialization: "asc" },
  });

  return (
    <div className="space-y-6">
      <form action={createDoctorAction} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-5">
        <input name="email" placeholder="Email" className="rounded-md border border-slate-300 px-3 py-2 text-sm" required />
        <input name="password" type="password" placeholder="Password" className="rounded-md border border-slate-300 px-3 py-2 text-sm" required />
        <input name="name" placeholder="Name" className="rounded-md border border-slate-300 px-3 py-2 text-sm" required />
        <input name="specialization" placeholder="Specialization" className="rounded-md border border-slate-300 px-3 py-2 text-sm" required />
        <div className="flex gap-2">
          <input name="experienceYears" type="number" min={0} placeholder="Experience" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" required />
          <button className="rounded-md bg-slate-900 px-3 py-2 text-xs text-white">Add</button>
        </div>
      </form>

      <form className="max-w-md"><input name="q" defaultValue={q} placeholder="Search by specialization..." className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" /></form>

      <div className="space-y-3">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold">{doctor.user.email}</p>
            <form action={updateDoctorAction} className="mt-3 grid gap-2 md:grid-cols-4">
              <input type="hidden" name="doctorId" value={doctor.id} />
              <input name="name" defaultValue={doctor.user.email.split("@")[0]} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <input name="specialization" defaultValue={doctor.specialization} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <input name="experienceYears" type="number" min={0} defaultValue={doctor.experienceYears} className="rounded-md border border-slate-300 px-3 py-2 text-sm" />
              <div className="flex gap-2">
                <button className="rounded-md bg-blue-600 px-3 py-2 text-xs text-white">Save</button>
              </div>
            </form>
            <form action={deleteDoctorAction} className="mt-2">
              <input type="hidden" name="id" value={doctor.id} />
              <ConfirmSubmitButton label="Delete Doctor" confirmText="Delete this doctor account?" />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
