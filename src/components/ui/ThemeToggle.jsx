import { HiSun, HiMoon } from 'react-icons/hi2'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { dark, toggle } = useTheme()
  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      className={`relative w-10 h-10 flex items-center justify-center rounded-xl
                 text-slate-500 dark:text-slate-400
                 hover:bg-slate-100 dark:hover:bg-slate-700
                 transition-colors duration-200 ${className}`}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        key={dark ? 'moon' : 'sun'}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 30, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
      </motion.div>
    </motion.button>
  )
}
