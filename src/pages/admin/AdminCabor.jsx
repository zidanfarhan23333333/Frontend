// AdminCabor.jsx
import { motion } from 'framer-motion'
import { HiTrophy, HiPlus } from 'react-icons/hi2'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { caborList } from '../../data/dummy'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export function AdminCabor() {
  return (
    <DashboardLayout title="Cabang Olahraga" subtitle="Kelola daftar cabang olahraga">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex justify-end mb-5">
          <button onClick={() => toast('Form tambah cabor (coming soon)')} className="btn-primary text-sm">
            <HiPlus className="w-4 h-4" /> Tambah Cabor
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {caborList.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="card p-5 text-center hover:shadow-sport hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <div className={clsx('w-12 h-12 rounded-2xl bg-gradient-to-br mx-auto mb-3 flex items-center justify-center text-2xl', c.color)}>
                {c.icon}
              </div>
              <p className="font-display font-bold text-sm text-slate-800 dark:text-white">{c.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">{c.category}</p>
              <div className="mt-2 badge-blue">{c.count} Pelatih</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
