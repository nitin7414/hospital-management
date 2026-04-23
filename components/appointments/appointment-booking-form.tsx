"use client";

import { useActionState } from "react";

import { bookAppointmentAction, type BookAppointmentState } from "@/lib/actions/appointment";

type DoctorOption = {
  id: string;
  name: string;
  specialization: string;
};

type AppointmentBookingFormProps = {
  doctors: DoctorOption[];
};

const initialState: BookAppointmentState = {
  success: false,
  message: "",
};

export function AppointmentBookingForm({ doctors }: AppointmentBookingFormProps) {
  const [state, formAction, pending] = useActionState(bookAppointmentAction, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div>
        <label htmlFor="doctorId" className="mb-1 block text-sm font-medium">
          Doctor
        </label>
        <select id="doctorId" name="doctorId" required className="w-full rounded-md border border-slate-300 px-3 py-2">
          <option value="">Select a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} ({doctor.specialization})
            </option>
          ))}
        </select>
        {state.errors?.doctorId ? <p className="mt-1 text-xs text-red-600">{state.errors.doctorId[0]}</p> : null}
      </div>

      <div>
        <label htmlFor="date" className="mb-1 block text-sm font-medium">
          Appointment Date & Time
        </label>
        <input
          id="date"
          name="date"
          type="datetime-local"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
        {state.errors?.date ? <p className="mt-1 text-xs text-red-600">{state.errors.date[0]}</p> : null}
      </div>

      {state.message ? (
        <p className={`text-sm ${state.success ? "text-green-700" : "text-red-600"}`}>{state.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending || doctors.length === 0}
        className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Booking..." : "Book Appointment"}
      </button>
    </form>
  );
}
