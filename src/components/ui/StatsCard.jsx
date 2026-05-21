import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, color = 'blue', delay = 0 }) {
  const colors = {
    blue: 'from-primary-500 to-primary-700',
    indigo: 'from-indigo-500 to-indigo-700',
    cyan: 'from-cyan-400 to-cyan-600',
    emerald: 'from-emerald-400 to-emerald-600',
    amber: 'from-amber-400 to-amber-600',
    red: 'from-red-400 to-red-600',
    purple: 'from-purple-400 to-purple-600',
  }
  const bgColors = {
    blue: 'bg-primary-50 dark:bg-primary-900/20',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20',
    amber: 'bg-amber-50 dark:bg-amber-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="card p-6 hover:shadow-sport transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-display font-black text-slate-900 dark:text-white">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          {trend && (
            <div className={clsx('mt-2 inline-flex items-center gap-1 text-xs font-semibold',
              trend > 0 ? 'text-emerald-600' : 'text-red-500')}>
              <span>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
              <span className="text-slate-400 font-normal">vs bulan lalu</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center', bgColors[color])}>
            <div className={clsx('w-7 h-7 rounded-xl flex items-center justify-center bg-gradient-to-br text-white', colors[color])}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
