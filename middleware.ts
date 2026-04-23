import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const roleHome: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  DOCTOR: "/doctor/dashboard",
  PATIENT: "/patient/dashboard",
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedRoute = ["/admin", "/doctor", "/patient"].some((path) =>
    pathname.startsWith(path),
  );

  if (isAuthPage && token?.role) {
    const redirectUrl = roleHome[token.role as string] ?? "/login";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!token?.role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL(roleHome[token.role as string] ?? "/login", request.url));
  }

  if (pathname.startsWith("/doctor") && token.role !== "DOCTOR") {
    return NextResponse.redirect(new URL(roleHome[token.role as string] ?? "/login", request.url));
  }

  if (pathname.startsWith("/patient") && token.role !== "PATIENT") {
    return NextResponse.redirect(new URL(roleHome[token.role as string] ?? "/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/admin/:path*", "/doctor/:path*", "/patient/:path*"],
};
