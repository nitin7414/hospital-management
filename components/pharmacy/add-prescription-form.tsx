"use client";

import { useActionState } from "react";

import { addPrescriptionAction, type PharmacyActionState } from "@/lib/actions/pharmacy";

type MedicineOption = {
  id: string;
  name: string;
  stock: number;
};

type AddPrescriptionFormProps = {
  appointmentId: string;
  medicines: MedicineOption[];
};

const initialState: PharmacyActionState = { success: false, message: "" };

export function AddPrescriptionForm({ appointmentId, medicines }: AddPrescriptionFormProps) {
  const [state, formAction, pending] = useActionState(addPrescriptionAction, initialState);

  return (
    <form action={formAction} className="mt-3 grid gap-2 rounded-lg border border-slate-200 p-3 md:grid-cols-4 md:items-end">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium text-slate-600">Medicine</label>
        <select name="medicineId" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select medicine</option>
          {medicines.map((medicine) => (
            <option key={medicine.id} value={medicine.id}>
              {medicine.name} (stock: {medicine.stock})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-600">Quantity</label>
        <input name="quantity" type="number" min={1} defaultValue={1} required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
      </div>
      <button type="submit" disabled={pending || medicines.length === 0} className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-60">
        {pending ? "Adding..." : "Add Prescription"}
      </button>
      {state.message ? <p className={`md:col-span-4 text-xs ${state.success ? "text-green-700" : "text-red-600"}`}>{state.message}</p> : null}
    </form>
  );
}
