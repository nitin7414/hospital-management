export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-5xl items-center justify-center px-6">
      <div className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />
        {label}
      </div>
    </div>
  );
}
