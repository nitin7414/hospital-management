import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] md:flex">
      <Sidebar />
      <div className="flex-1">
        <Topbar adminName={session.user.email ?? "Admin"} />
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
