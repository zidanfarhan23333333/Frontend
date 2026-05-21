import clsx from 'clsx'

const gradients = [
  'from-primary-500 to-indigo-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-600',
  'from-red-400 to-rose-600',
  'from-purple-400 to-violet-600',
  'from-cyan-400 to-blue-600',
]

export default function Avatar({ initials = '?', size = 'md', className = '', id = 0 }) {
  const sizes = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }
  const gradient = gradients[id % gradients.length]
  return (
    <div className={clsx(
      'rounded-2xl flex items-center justify-center font-display font-black text-white bg-gradient-to-br flex-shrink-0',
      sizes[size], gradient, className
    )}>
      {initials?.slice(0, 2).toUpperCase()}
    </div>
  )
}
