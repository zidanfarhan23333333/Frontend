import { motion } from 'framer-motion'
import { HiTrophy, HiBolt, HiShieldCheck, HiUsers } from 'react-icons/hi2'
import Navbar from '../../components/layout/Navbar'
import { ahpBobot } from '../../data/dummy'
import { AHPBobot } from '../../components/charts/Charts'

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="section-title text-5xl mb-4">Tentang <span className="gradient-text">SportCoach</span></h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              SportCoach adalah platform digital yang membantu atlet dan penggemar olahraga menemukan pelatih terbaik menggunakan metode ilmiah Analytic Hierarchy Process (AHP).
            </p>
          </motion.div>

          {/* AHP section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-display font-black text-3xl text-slate-900 dark:text-white mb-4">Metode AHP</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Analytic Hierarchy Process (AHP) adalah metode pengambilan keputusan multi-kriteria yang dikembangkan oleh Thomas L. Saaty. Metode ini mengurai masalah kompleks menjadi hierarki yang terstruktur dan terukur secara objektif.
              </p>
              <div className="space-y-3">
                {ahpBobot.map((k, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="w-3 h-3 rounded-full" style={{ background: k.fill }} />
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm flex-1">{k.kriteria}</span>
                    <span className="font-display font-black text-sm" style={{ color: k.fill }}>{(k.bobot * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card p-6">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4 text-center">Distribusi Bobot Kriteria</h3>
              <AHPBobot />
            </motion.div>
          </div>

          {/* Team */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <h2 className="font-display font-black text-3xl text-slate-900 dark:text-white mb-3">Dikembangkan dengan ❤️</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              SportCoach adalah proyek penelitian skripsi yang mengimplementasikan metode AHP untuk sistem rekomendasi pelatih olahraga di Yogyakarta.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
