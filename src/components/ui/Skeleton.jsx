export function SkeletonCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg flex-1" />
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-16" />
      </div>
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
      <div className="flex-1">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-1" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
      </div>
      <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
    </div>
  )
}
