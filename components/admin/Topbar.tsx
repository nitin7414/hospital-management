"use client";

import { signOut } from "next-auth/react";

export function Topbar({ adminName }: { adminName: string }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <h1 className="text-sm font-semibold sm:text-base">Admin Dashboard</h1>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-600 sm:text-sm">{adminName}</span>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-md border border-slate-300 px-3 py-1 text-xs sm:text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
