import clsx from 'clsx'
import { motion } from 'framer-motion'

export function Badge({ children, variant = 'blue' }) {
  const variants = {
    blue: 'badge-blue',
    green: 'badge-green',
    yellow: 'badge-yellow',
    red: 'badge-red',
    gray: 'badge-gray',
  }
  return <span className={variants[variant]}>{children}</span>
}

export function StatusBadge({ status }) {
  const map = {
    verified:  { label: 'Terverifikasi', variant: 'green' },
    pending:   { label: 'Menunggu', variant: 'yellow' },
    rejected:  { label: 'Ditolak', variant: 'red' },
    confirmed: { label: 'Dikonfirmasi', variant: 'green' },
    completed: { label: 'Selesai', variant: 'blue' },
    cancelled: { label: 'Dibatalkan', variant: 'red' },
  }
  const { label, variant } = map[status] || { label: status, variant: 'gray' }
  return <Badge variant={variant}>{label}</Badge>
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
      )}
      <h3 className="font-display font-bold text-xl text-slate-700 dark:text-slate-300">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  )
}
