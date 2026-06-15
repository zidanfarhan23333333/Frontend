import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import RankingCard from "../../components/coach/RankingCard";
import { RankingBarChart, AHPBobot } from "../../components/charts/Charts";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// ✅ Halaman ini sudah benar sejak awal: ambil data dari /api/admin/ranking
//    (backend yang menghitung skor AHP), tidak ada kalkulasi di frontend.
//    AdminDashboard.jsx dan Charts.jsx (RankingBarChart) kini menggunakan
//    endpoint yang sama sehingga skor selalu konsisten di seluruh halaman.

export default function AdminRanking() {
  const { api } = useAuth();
  const [pelatihList, setPelatihList] = useState([]);
  const [bobot, setBobot] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/ranking");
      const raw = res.data.data || res.data;
      setPelatihList(raw.pelatih || (Array.isArray(raw) ? raw : []));
      setBobot(raw.bobot || {});
    } catch (err) {
      console.error("❌ Error fetching ranking:", err);
      toast.error(err.response?.data?.message || "Gagal memuat data ranking");
    } finally {
      setLoading(false);
    }
  };

  // Format bobot object jadi array untuk ditampilkan
  const bobotCards = Object.entries(bobot).map(([key, val]) => ({
    kriteria:
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
    bobot: val,
    fill:
      {
        pengalaman: "#6366f1",
        lisensi: "#22c55e",
        rating: "#f59e0b",
        totalBooking: "#06b6d4",
        biaya: "#ec4899",
      }[key] || "#94a3b8",
  }));

  if (loading) {
    return (
      <DashboardLayout
        title="Ranking AHP"
        subtitle="Peringkat pelatih berdasarkan skor AHP"
      >
        <div className="flex items-center justify-center h-96">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Ranking AHP"
      subtitle="Peringkat pelatih berdasarkan skor AHP"
    >
      {/* Bobot kriteria cards */}
      {bobotCards.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {bobotCards.map((k, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {k.kriteria}
                </p>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: k.fill }}
                />
              </div>
              <p className="text-2xl font-display font-black text-slate-900 dark:text-white">
                {(k.bobot * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Bobot Kriteria</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
            Distribusi Bobot AHP
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Persentase bobot setiap kriteria evaluasi
          </p>
          <AHPBobot />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-6"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
            Skor AHP Pelatih
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Perbandingan skor AHP seluruh pelatih terverifikasi
          </p>
          <RankingBarChart />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6 mt-6"
      >
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
          Peringkat Lengkap
        </h3>
        {pelatihList.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            Belum ada pelatih terverifikasi
          </p>
        ) : (
          <div className="space-y-1">
            {pelatihList.map((coach, i) => (
              <RankingCard
                key={coach.pelatih_id || coach.id}
                coach={coach}
                rank={i + 1}
                delay={i * 0.05}
              />
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
