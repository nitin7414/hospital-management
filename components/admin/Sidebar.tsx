"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/dashboard/patients", label: "Patients" },
  { href: "/admin/dashboard/doctors", label: "Doctors" },
  { href: "/admin/dashboard/appointments", label: "Appointments" },
  { href: "/admin/dashboard/rooms", label: "Rooms" },
  { href: "/admin/dashboard/pharmacy", label: "Pharmacy" },
  { href: "/admin/dashboard/billing", label: "Billing" },
  { href: "/admin/dashboard/reports", label: "Reports" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-r border-slate-200 bg-white md:w-64">
      <nav className="space-y-1 p-3">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-md px-3 py-2 text-sm ${active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
