import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function LoadingSpinner({ full, size = 'md', text = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className={clsx('rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-primary-600', sizes[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {text && <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{text}</p>}
    </div>
  )

  if (full) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-900 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl font-display font-black gradient-text">SportCoach</div>
          {spinner}
        </div>
      </div>
    )
  }
  return spinner
}
