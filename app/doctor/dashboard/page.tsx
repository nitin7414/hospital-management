import { AppointmentNotesForm } from "@/components/doctors/appointment-notes-form";
import { AddPrescriptionForm } from "@/components/pharmacy/add-prescription-form";
import { requireRole } from "@/lib/auth/role";
import { prisma } from "@/lib/prisma";

export default async function DoctorDashboardPage() {
  const session = await requireRole("DOCTOR");

  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const [appointments, medicines] = doctor
    ? await Promise.all([prisma.appointment.findMany({
        where: {
          doctorId: doctor.id,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          patient: {
            include: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          prescriptions: {
            include: {
              medicine: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          date: "asc",
        },
      }), prisma.medicine.findMany({
        where: { stock: { gt: 0 } },
        select: { id: true, name: true, stock: true },
        orderBy: { name: "asc" },
      })])
    : [[], []];

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-2 text-2xl font-semibold">Doctor Dashboard</h1>
      <p className="mb-6 text-sm text-slate-600">Today's appointments and patient details.</p>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <details key={appointment.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{appointment.patient.name}</p>
                  <p className="text-sm text-slate-600">{appointment.patient.user.email}</p>
                </div>
                <div className="text-right text-sm">
                  <p>{appointment.date.toLocaleTimeString()}</p>
                  <p className="text-slate-600">{appointment.status}</p>
                </div>
              </div>
            </summary>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-600">Age: {appointment.patient.age}</p>
              <p className="text-sm text-slate-600">Gender: {appointment.patient.gender}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Medical History:</span> {appointment.patient.medicalHistory}
              </p>

              <AppointmentNotesForm appointmentId={appointment.id} initialNotes={appointment.notes} />

              <AddPrescriptionForm appointmentId={appointment.id} medicines={medicines} />

              {appointment.prescriptions.length > 0 ? (
                <div className="mt-3">
                  <p className="mb-1 text-sm font-medium">Prescriptions</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {appointment.prescriptions.map((prescription) => (
                      <li key={prescription.id}>
                        {prescription.medicine.name} × {prescription.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </details>
        ))}

        {appointments.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
            No appointments scheduled for today.
          </div>
        ) : null}
      </div>
    </main>
  );
}
