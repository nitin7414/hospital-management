"use client";

import { useActionState } from "react";

import { createRoomAction, type RoomActionState } from "@/lib/actions/room";

const initialState: RoomActionState = {
  success: false,
  message: "",
};

export function AddRoomForm() {
  const [state, formAction, pending] = useActionState(createRoomAction, initialState);

  return (
    <form action={formAction} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:grid-cols-[1fr_auto] sm:items-end">
      <div>
        <label htmlFor="type" className="mb-1 block text-sm font-medium text-slate-700">
          Room Type
        </label>
        <select id="type" name="type" defaultValue="GENERAL" className="w-full rounded-md border border-slate-300 px-3 py-2">
          <option value="GENERAL">GENERAL</option>
          <option value="ICU">ICU</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
      >
        {pending ? "Adding..." : "Add Room"}
      </button>

      {state.message ? (
        <p className={`sm:col-span-2 text-sm ${state.success ? "text-green-700" : "text-red-600"}`}>{state.message}</p>
      ) : null}
    </form>
  );
}
