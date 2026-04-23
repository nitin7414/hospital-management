import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Hospital Management System</h1>
        <div className="space-x-3">
          <Link href="/login" className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white">
            Login
          </Link>
          <Link href="/signup" className="rounded-md border border-slate-300 px-4 py-2 text-sm">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
