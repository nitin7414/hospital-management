"use client";

import { useActionState } from "react";

import { generateInvoiceAction, type BillingActionState } from "@/lib/actions/billing";

const initialState: BillingActionState = { success: false, message: "" };

export function GenerateInvoiceForm({ appointmentId }: { appointmentId: string }) {
  const [state, formAction, pending] = useActionState(generateInvoiceAction, initialState);

  return (
    <form action={formAction} className="mt-2 space-y-1">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <button type="submit" disabled={pending} className="rounded-md bg-indigo-600 px-3 py-2 text-xs text-white disabled:opacity-60">
        {pending ? "Generating..." : "Generate Invoice"}
      </button>
      {state.message ? <p className={`text-xs ${state.success ? "text-green-700" : "text-red-600"}`}>{state.message}</p> : null}
    </form>
  );
}
