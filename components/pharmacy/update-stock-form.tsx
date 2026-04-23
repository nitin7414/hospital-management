"use client";

import { useActionState } from "react";

import { type PharmacyActionState, updateMedicineStockAction } from "@/lib/actions/pharmacy";

const initialState: PharmacyActionState = { success: false, message: "" };

type UpdateStockFormProps = {
  medicineId: string;
  currentStock: number;
};

export function UpdateStockForm({ medicineId, currentStock }: UpdateStockFormProps) {
  const [state, formAction, pending] = useActionState(updateMedicineStockAction, initialState);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="medicineId" value={medicineId} />
      <input name="stock" type="number" min={0} defaultValue={currentStock} className="w-24 rounded-md border border-slate-300 px-2 py-1 text-sm" />
      <button type="submit" disabled={pending} className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white disabled:opacity-60">
        {pending ? "..." : "Update"}
      </button>
      {state.message ? <span className={`text-xs ${state.success ? "text-green-700" : "text-red-600"}`}>{state.message}</span> : null}
    </form>
  );
}
