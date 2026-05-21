import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiPlus, HiTrophy } from "react-icons/hi2";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import clsx from "clsx";

// Warna/icon fallback per index (karena backend tidak simpan warna)
const COLORS = [
  "from-blue-400 to-blue-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-violet-400 to-violet-600",
  "from-cyan-400 to-cyan-600",
  "from-orange-400 to-orange-600",
  "from-pink-400 to-pink-600",
  "from-teal-400 to-teal-600",
  "from-indigo-400 to-indigo-600",
];

export function AdminCabor() {
  const { api } = useAuth();
  const [caborList, setCaborList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCabor();
  }, []);

  const fetchCabor = async () => {
    setLoading(true);
    try {
      // FIX: fetch dari backend, tidak lagi pakai dummy data
      const res = await api.get("/api/admin/cabor");
      const raw = res.data.data || res.data;
      setCaborList(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error("❌ Error fetching cabor:", err);
      toast.error(err.response?.data?.message || "Gagal memuat data cabor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Cabang Olahraga"
      subtitle="Kelola daftar cabang olahraga"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-end mb-5">
          <button
            onClick={() => toast("Form tambah cabor (coming soon)")}
            className="btn-primary text-sm"
          >
            <HiPlus className="w-4 h-4" /> Tambah Cabor
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : caborList.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <HiTrophy className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-semibold">Belum ada cabang olahraga</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {caborList.map((c, i) => (
              <motion.div
                key={c.cabor_id || c.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5 text-center hover:shadow-sport hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              >
                <div
                  className={clsx(
                    "w-12 h-12 rounded-2xl bg-gradient-to-br mx-auto mb-3 flex items-center justify-center",
                    COLORS[i % COLORS.length],
                  )}
                >
                  <HiTrophy className="w-6 h-6 text-white" />
                </div>
                <p className="font-display font-bold text-sm text-slate-800 dark:text-white">
                  {c.nama_cabor || c.name}
                </p>
                <div className="mt-2 text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full inline-block">
                  {c.count || 0} Pelatih
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
