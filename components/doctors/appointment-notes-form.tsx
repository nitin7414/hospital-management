"use client";

import { useActionState } from "react";

import {
  type UpdateAppointmentNotesState,
  updateAppointmentNotesAction,
} from "@/lib/actions/doctor-appointments";

type AppointmentNotesFormProps = {
  appointmentId: string;
  initialNotes: string | null;
};

const initialState: UpdateAppointmentNotesState = {
  success: false,
  message: "",
};

export function AppointmentNotesForm({ appointmentId, initialNotes }: AppointmentNotesFormProps) {
  const [state, formAction, pending] = useActionState(updateAppointmentNotesAction, initialState);

  return (
    <form action={formAction} className="mt-3 space-y-2">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <label htmlFor={`notes-${appointmentId}`} className="block text-sm font-medium text-slate-700">
        Notes / Prescription
      </label>
      <textarea
        id={`notes-${appointmentId}`}
        name="notes"
        defaultValue={initialNotes ?? ""}
        rows={4}
        className="w-full rounded-md border border-slate-300 px-3 py-2"
        placeholder="Add clinical notes or prescription details"
      />

      {state.message ? (
        <p className={`text-sm ${state.success ? "text-green-700" : "text-red-600"}`}>{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save Notes"}
      </button>
    </form>
  );
}
