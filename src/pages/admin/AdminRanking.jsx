import { motion } from 'framer-motion'
import DashboardLayout from '../../components/layout/DashboardLayout'
import RankingCard from '../../components/coach/RankingCard'
import { RankingBarChart, AHPBobot } from '../../components/charts/Charts'
import { pelatihList, ahpBobot } from '../../data/dummy'

export default function AdminRanking() {
  return (
    <DashboardLayout title="Ranking AHP" subtitle="Peringkat pelatih berdasarkan skor AHP">
      {/* AHP info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {ahpBobot.map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{k.kriteria}</p>
              <div className="w-3 h-3 rounded-full" style={{ background: k.fill }} />
            </div>
            <p className="text-2xl font-display font-black text-slate-900 dark:text-white">{(k.bobot * 100).toFixed(0)}%</p>
            <p className="text-xs text-slate-400 mt-0.5">Bobot Kriteria</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">Distribusi Bobot AHP</h3>
          <p className="text-xs text-slate-400 mb-4">Persentase bobot setiap kriteria evaluasi</p>
          <AHPBobot />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-6">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">Skor AHP Pelatih</h3>
          <p className="text-xs text-slate-400 mb-4">Perbandingan skor AHP seluruh pelatih terverifikasi</p>
          <RankingBarChart />
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6 mt-6">
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Peringkat Lengkap</h3>
        <div className="space-y-1">
          {pelatihList
            .filter(p => p.status === 'verified')
            .sort((a, b) => b.skorAHP - a.skorAHP)
            .map((coach, i) => (
              <RankingCard key={coach.id} coach={coach} rank={i + 1} delay={i * 0.05} />
            ))}
        </div>
      </motion.div>
    </DashboardLayout>
  )
}
