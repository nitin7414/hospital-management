"use client";

import { useActionState } from "react";

import { updateRoomAction, type RoomActionState } from "@/lib/actions/room";

type PatientOption = {
  id: string;
  name: string;
};

type UpdateRoomFormProps = {
  roomId: string;
  status: "VACANT" | "OCCUPIED";
  patientId: string | null;
  patients: PatientOption[];
};

const initialState: RoomActionState = {
  success: false,
  message: "",
};

export function UpdateRoomForm({ roomId, status, patientId, patients }: UpdateRoomFormProps) {
  const [state, formAction, pending] = useActionState(updateRoomAction, initialState);

  return (
    <form action={formAction} className="mt-3 grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-4 md:items-end">
      <input type="hidden" name="roomId" value={roomId} />

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Status</label>
        <select name="status" defaultValue={status} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="VACANT">VACANT</option>
          <option value="OCCUPIED">OCCUPIED</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium text-slate-600">Assign Patient</label>
        <select name="patientId" defaultValue={patientId ?? ""} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">Unassigned</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-60"
      >
        {pending ? "Saving..." : "Update"}
      </button>

      {state.message ? (
        <p className={`md:col-span-4 text-xs ${state.success ? "text-green-700" : "text-red-600"}`}>{state.message}</p>
      ) : null}
    </form>
  );
}
