"use client";

import { useActionState } from "react";

import { createMedicineAction, type PharmacyActionState } from "@/lib/actions/pharmacy";

const initialState: PharmacyActionState = { success: false, message: "" };

export function AddMedicineForm() {
  const [state, formAction, pending] = useActionState(createMedicineAction, initialState);

  return (
    <form action={formAction} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-4 md:items-end">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Medicine Name</label>
        <input name="name" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Stock</label>
        <input name="stock" type="number" min={0} required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Price</label>
        <input name="price" type="number" step="0.01" min={0.01} required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <button type="submit" disabled={pending} className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60">
        {pending ? "Adding..." : "Add Medicine"}
      </button>
      {state.message ? <p className={`md:col-span-4 text-sm ${state.success ? "text-green-700" : "text-red-600"}`}>{state.message}</p> : null}
    </form>
  );
}
