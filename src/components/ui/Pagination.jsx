import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2'
import clsx from 'clsx'

export default function Pagination({ page, total, perPage = 10, onChange }) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Menampilkan {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} dari {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg disabled:opacity-40
                     hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
        >
          <HiChevronLeft className="w-4 h-4" />
        </button>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={clsx(
              'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors',
              page === p
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg disabled:opacity-40
                     hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
        >
          <HiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
