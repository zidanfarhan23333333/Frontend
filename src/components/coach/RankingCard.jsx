import { motion } from 'framer-motion'
import { HiTrophy } from 'react-icons/hi2'
import Avatar from '../ui/Avatar'
import clsx from 'clsx'

const medals = ['🥇', '🥈', '🥉']
const rankColors = [
  'from-amber-400 to-amber-600',
  'from-slate-300 to-slate-500',
  'from-amber-600 to-amber-800',
]

export default function RankingCard({ coach, rank, delay = 0 }) {
  const isTop3 = rank <= 3

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={clsx(
        'flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-700/50',
        isTop3 && rank === 1 && 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30'
      )}
    >
      {/* Rank */}
      <div className={clsx(
        'w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-sm flex-shrink-0',
        isTop3
          ? `bg-gradient-to-br ${rankColors[rank - 1]} text-white shadow-md`
          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
      )}>
        {isTop3 ? medals[rank - 1] : rank}
      </div>

      {/* Avatar + info */}
      <Avatar initials={coach.initials} size="sm" id={coach.id} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{coach.nama}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{coach.cabor}</p>
      </div>

      {/* AHP Score */}
      <div className="text-right">
        <p className={clsx(
          'text-base font-display font-black',
          coach.skorAHP >= 0.9 ? 'text-emerald-500' : coach.skorAHP >= 0.8 ? 'text-primary-600' : 'text-amber-500'
        )}>
          {coach.skorAHP.toFixed(2)}
        </p>
        <p className="text-[10px] text-slate-400">Skor AHP</p>
      </div>
    </motion.div>
  )
}
