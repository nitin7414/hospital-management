import { AddRoomForm } from "@/components/rooms/add-room-form";
import { UpdateRoomForm } from "@/components/rooms/update-room-form";
import { requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

export default async function AdminRoomsPage() {
  await requireAdmin();

  const [rooms, patients] = await Promise.all([
    prisma.room.findMany({
      include: {
        patient: true,
      },
      orderBy: {
        type: "asc",
      },
    }),
    prisma.patientProfile.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Room & Bed Management</h1>

      <div className="mb-6">
        <AddRoomForm />
      </div>

      <div className="space-y-4">
        {rooms.map((room) => {
          const isOccupied = room.status === "OCCUPIED";

          return (
            <section key={room.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">Room ID</p>
                  <p className="font-medium">{room.id}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Type</p>
                  <p className="font-medium">{room.type}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      isOccupied ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {room.status}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Patient</p>
                  <p className="font-medium">{room.patient?.name ?? "Unassigned"}</p>
                </div>
              </div>

              <UpdateRoomForm
                roomId={room.id}
                status={room.status}
                patientId={room.patientId}
                patients={patients}
              />
            </section>
          );
        })}

        {rooms.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
            No rooms available. Add a room to get started.
          </div>
        ) : null}
      </div>
    </main>
  );
}
