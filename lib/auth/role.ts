import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export async function requireRole(role: "ADMIN" | "DOCTOR" | "PATIENT") {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== role) {
    redirect("/login");
  }

  return session;
}
