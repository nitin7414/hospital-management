"use client";

import { useFormStatus } from "react-dom";

export function ConfirmSubmitButton({
  label,
  confirmText,
  className,
}: {
  label: string;
  confirmText: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmText)) {
          e.preventDefault();
        }
      }}
      disabled={pending}
      className={className ?? "rounded-md border border-red-300 px-3 py-1 text-xs text-red-700"}
    >
      {pending ? "Processing..." : label}
    </button>
  );
}
