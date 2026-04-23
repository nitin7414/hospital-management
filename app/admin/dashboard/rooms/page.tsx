import { AddRoomForm } from "@/components/rooms/add-room-form";
import { UpdateRoomForm } from "@/components/rooms/update-room-form";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardRoomsPage() {
  const [rooms, patients] = await Promise.all([
    prisma.room.findMany({ include: { patient: true }, orderBy: { type: "asc" } }),
    prisma.patientProfile.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-4">
      <AddRoomForm />
      {rooms.map((room) => (
        <div key={room.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{room.type} - {room.id.slice(0, 8)}</p>
            <span className={`rounded-full px-2 py-1 text-xs ${room.status === "OCCUPIED" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{room.status}</span>
          </div>
          <UpdateRoomForm roomId={room.id} status={room.status} patientId={room.patientId} patients={patients} />
        </div>
      ))}
    </div>
  );
}
