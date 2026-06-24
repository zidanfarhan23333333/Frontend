import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import RankingCard from "../../components/coach/RankingCard";
import { AHPBobot } from "../../components/charts/Charts";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const KRITERIA_COLOR = {
  pengalaman: "#6366f1",
  lisensi: "#22c55e",
  prestasi: "#94a3b8",
  biaya: "#ec4899",
};

const URUTAN_KRITERIA = ["pengalaman", "lisensi", "prestasi", "biaya"];

export default function AdminRanking() {
  const { api } = useAuth();
  const [allPelatih, setAllPelatih] = useState([]);
  const [bobot, setBobot] = useState({});
  const [konsistensi, setKonsistensi] = useState(null);
  const [cr, setCr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("semua");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rankingRes, bobotRes] = await Promise.all([
        api.get("/api/rekomendasi/ranking"),
        api.get("/api/ahp/bobot"),
      ]);

      // Ranking global
      const rankRaw = rankingRes.data.data || rankingRes.data;
      setAllPelatih(Array.isArray(rankRaw) ? rankRaw : []);

      // Bobot AHP
      const bobotRaw = bobotRes.data.data || bobotRes.data;
      const list = Array.isArray(bobotRaw?.kriteria)
        ? bobotRaw.kriteria
        : Array.isArray(bobotRaw)
          ? bobotRaw
          : [];
      const bobotMap = {};
      list.forEach((k) => {
        const key = (k.nama || k.kriteria || "").toLowerCase();
        bobotMap[key] = parseFloat(k.bobot);
      });
      setBobot(bobotMap);
      setKonsistensi(bobotRaw?.konsistensi || null);
      setCr(bobotRaw?.CR ?? null);
    } catch (err) {
      console.error("❌ Error fetching ranking:", err);
      toast.error(err.response?.data?.message || "Gagal memuat data ranking");
    } finally {
      setLoading(false);
    }
  };

  // ── Daftar cabor unik dari data ──
  const caborList = useMemo(() => {
    const set = new Set(allPelatih.map((p) => p.cabor).filter(Boolean));
    return Array.from(set).sort();
  }, [allPelatih]);

  // ── Filter + re-rank per cabor ──
  const displayList = useMemo(() => {
    if (activeTab === "semua") return allPelatih;
    return allPelatih
      .filter((p) => p.cabor === activeTab)
      .map((p, i) => ({ ...p, peringkat: i + 1 }));
  }, [allPelatih, activeTab]);

  const bobotCards = URUTAN_KRITERIA.filter(
    (key) => bobot[key] !== undefined,
  ).map((key) => ({
    key,
    kriteria: key.charAt(0).toUpperCase() + key.slice(1),
    bobot: bobot[key],
    fill: KRITERIA_COLOR[key] || "#94a3b8",
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
      {/* ── Bobot kriteria cards ── */}
      {bobotCards.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {bobotCards.map((k, i) => (
            <motion.div
              key={k.key}
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
                {(k.bobot * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Bobot Kriteria</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Info konsistensi ── */}
      {konsistensi && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className={`mb-6 px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2
            ${
              konsistensi === "konsisten"
                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${konsistensi === "konsisten" ? "bg-green-500" : "bg-red-500"}`}
          />
          Matriks AHP{" "}
          {konsistensi === "konsisten" ? "konsisten" : "tidak konsisten"}
          {cr !== null && (
            <span className="text-xs opacity-70">
              (CR = {Number(cr).toFixed(4)})
            </span>
          )}
        </motion.div>
      )}

      {/* ── Distribusi Bobot Chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6 mb-6"
      >
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
          Distribusi Bobot AHP
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Persentase bobot setiap kriteria evaluasi
        </p>
        <AHPBobot />
      </motion.div>

      {/* ── Peringkat dengan Tabs per Cabor ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card p-6"
      >
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
          Peringkat Pelatih
        </h3>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          <TabButton
            label="Semua"
            count={allPelatih.length}
            active={activeTab === "semua"}
            onClick={() => setActiveTab("semua")}
          />
          {caborList.map((cabor) => {
            const count = allPelatih.filter((p) => p.cabor === cabor).length;
            return (
              <TabButton
                key={cabor}
                label={cabor}
                count={count}
                active={activeTab === cabor}
                onClick={() => setActiveTab(cabor)}
              />
            );
          })}
        </div>

        {/* List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {displayList.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                Belum ada pelatih terverifikasi
                {activeTab !== "semua" ? ` untuk ${activeTab}` : ""}
              </p>
            ) : (
              <div className="space-y-1">
                {displayList.map((coach, i) => (
                  <RankingCard
                    key={`${activeTab}-${coach.pelatih_id || coach.id}`}
                    coach={{ ...coach, skorAHP: coach.skor }}
                    rank={coach.peringkat ?? i + 1}
                    delay={i * 0.04}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}

// ── Tab Button ──────────────────────────────────────────────────────────────
function TabButton({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold
        transition-all duration-200 border
        ${
          active
            ? "bg-primary-600 text-white border-primary-600 shadow-sm"
            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-400 hover:text-primary-600"
        }
      `}
    >
      {label}
      <span
        className={`
          text-xs px-1.5 py-0.5 rounded-full font-bold
          ${
            active
              ? "bg-white/20 text-white"
              : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
          }
        `}
      >
        {count}
      </span>
    </button>
  );
}
