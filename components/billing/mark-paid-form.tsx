"use client";

import { useActionState } from "react";

import { markInvoicePaidAction, type BillingActionState } from "@/lib/actions/billing";

const initialState: BillingActionState = { success: false, message: "" };

export function MarkPaidForm({ invoiceId, disabled }: { invoiceId: string; disabled: boolean }) {
  const [state, formAction, pending] = useActionState(markInvoicePaidAction, initialState);

  return (
    <form action={formAction} className="space-y-1">
      <input type="hidden" name="invoiceId" value={invoiceId} />
      <button type="submit" disabled={disabled || pending} className="rounded-md bg-emerald-600 px-3 py-1 text-xs text-white disabled:opacity-60">
        {pending ? "Updating..." : "Mark Paid"}
      </button>
      {state.message ? <p className={`text-xs ${state.success ? "text-green-700" : "text-red-600"}`}>{state.message}</p> : null}
    </form>
  );
}
