import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiClipboardDocumentList,
  HiStar,
  HiTrophy,
  HiUsers,
} from "react-icons/hi2";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatsCard from "../../components/ui/StatsCard";
import { StatusBadge } from "../../components/ui/Badges";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// Label skala 1-5 untuk field integer
const SKALA = {
  1: "Pemula",
  2: "Dasar",
  3: "Menengah",
  4: "Mahir",
  5: "Expert",
};
const LISENSI = {
  1: "Tidak Ada",
  2: "Daerah",
  3: "Nasional",
  4: "Asia",
  5: "Internasional",
};

export default function PelatihDashboard() {
  const { user, api } = useAuth();
  const [profil, setProfil] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      // Ambil semua pelatih, filter berdasarkan user yang login
      // Sesuaikan jika sudah ada endpoint /api/pelatih/me
      const [pelatihRes, rankingRes] = await Promise.all([
        api.get("/api/pelatih"),
        api.get("/api/public/ranking"),
      ]);

      const pelatihRaw =
        pelatihRes.data.pelatih ||
        pelatihRes.data.data?.pelatih ||
        pelatihRes.data.data ||
        [];
      // Cari profil pelatih yang login berdasarkan nama user
      const myProfil = Array.isArray(pelatihRaw)
        ? pelatihRaw.find((p) => p.nama === user?.nama) || pelatihRaw[0]
        : null;
      setProfil(myProfil);

      // Ranking dari admin endpoint
      const rankingRaw = rankingRes.data.data || rankingRes.data;
      const rankList = rankingRaw.pelatih || [];
      if (myProfil) {
        const idx = rankList.findIndex(
          (p) => p.pelatih_id === myProfil.pelatih_id,
        );
        setRanking({ rank: idx + 1, skorAHP: rankList[idx]?.skorAHP || 0 });
      }

      // Booking milik pelatih ini
      if (myProfil) {
        const bookingRes = await api.get(
          `/api/public/bookings/${myProfil.pelatih_id}`,
        );
        const bRaw = bookingRes.data.data || bookingRes.data;
        setBookings(bRaw.bookings || (Array.isArray(bRaw) ? bRaw : []));
      }
    } catch (err) {
      console.error("❌ Error fetching dashboard:", err);
      setError(err.response?.data?.message || "Gagal memuat data");
      toast.error("Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  };

  const p = profil;
  const r = ranking;

  // Bobot AHP sesuai schema: pengalaman, lisensi, prestasi, biaya (skala 1-5)
  const bobotDisplay = [
    {
      label: "Pengalaman",
      bobot: "35%",
      w: 0.35,
      nilai: SKALA[p?.pengalaman] || "-",
    },
    {
      label: "Lisensi",
      bobot: "25%",
      w: 0.25,
      nilai: LISENSI[p?.lisensi] || "-",
    },
    {
      label: "Prestasi",
      bobot: "25%",
      w: 0.25,
      nilai: SKALA[p?.prestasi] || "-",
    },
    {
      label: "Biaya",
      bobot: "15%",
      w: 0.15,
      nilai: p?.biaya ? `Skala ${p.biaya}/5` : "-",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout
        title={`Halo, ${user?.nama?.split(" ")[0] || "Pelatih"} 👋`}
        subtitle="Memuat data..."
      >
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Memuat dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isVerified = p?.status_verifikasi === "terverifikasi";

  return (
    <DashboardLayout
      title={`Halo, ${user?.nama?.split(" ")[0] || "Pelatih"} 👋`}
      subtitle="Pantau aktivitas dan performa Anda"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Verification banner */}
      {p && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 border rounded-2xl flex items-center gap-3 ${
            isVerified
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200"
              : "bg-amber-50 dark:bg-amber-900/20 border-amber-200"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isVerified ? "bg-emerald-500" : "bg-amber-500"}`}
          >
            <HiTrophy className="w-4 h-4 text-white" />
          </div>
          <div>
            <p
              className={`font-bold text-sm ${isVerified ? "text-emerald-700" : "text-amber-700"}`}
            >
              {isVerified ? "Akun Terverifikasi" : "Menunggu Verifikasi Admin"}
            </p>
            <p
              className={`text-xs ${isVerified ? "text-emerald-600/70" : "text-amber-600/70"}`}
            >
              {isVerified
                ? "Profil Anda aktif dan dapat ditemukan oleh calon atlet."
                : "Proses verifikasi membutuhkan 1-3 hari kerja."}
            </p>
          </div>
          {isVerified && r?.rank && (
            <span className="ml-auto font-display font-black text-emerald-600 text-xl">
              #{r.rank}
            </span>
          )}
        </motion.div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Booking"
          value={bookings.length}
          subtitle="Semua waktu"
          icon={HiClipboardDocumentList}
          color="blue"
          delay={0}
        />
        <StatsCard
          title="Skor AHP"
          value={r?.skorAHP?.toFixed(3) || "0.000"}
          subtitle="Skor rekomendasi"
          icon={HiStar}
          color="amber"
          delay={0.05}
        />
        <StatsCard
          title="Ranking"
          value={r?.rank ? `#${r.rank}` : "-"}
          subtitle="Dari semua pelatih"
          icon={HiTrophy}
          color="purple"
          delay={0.1}
        />
        <StatsCard
          title="Cabor"
          value={p?.cabang?.nama_cabor || "-"}
          subtitle="Cabang olahraga"
          icon={HiUsers}
          color="indigo"
          delay={0.15}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profil ringkas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
            Data Profil
          </h3>
          {p ? (
            <div className="space-y-3">
              {[
                ["Nama", p.nama],
                ["Cabor", p.cabang?.nama_cabor || "-"],
                ["Pengalaman", SKALA[p.pengalaman] || "-"],
                ["Lisensi", LISENSI[p.lisensi] || "-"],
                ["Prestasi", SKALA[p.prestasi] || "-"],
                ["Biaya", `Skala ${p.biaya}/5`],
                ["Status", null],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                >
                  <span className="text-xs text-slate-400 font-medium">
                    {k}
                  </span>
                  {k === "Status" ? (
                    <StatusBadge status={p.status_verifikasi || "pending"} />
                  ) : (
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {v}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">
              Data profil tidak ditemukan
            </p>
          )}
        </motion.div>

        {/* Skor AHP */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-6"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
            Komponen Skor AHP
          </h3>

          {/* Ring chart */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-28 h-28 mb-2">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#grad)"
                  strokeWidth="8"
                  strokeDasharray={`${(r?.skorAHP || 0) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1D4ED8" />
                    <stop offset="100%" stopColor="#4338CA" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-black text-2xl text-primary-700 dark:text-primary-400">
                  {r?.skorAHP?.toFixed(2) || "0.00"}
                </span>
                <span className="text-xs text-slate-400">AHP</span>
              </div>
            </div>
            {r?.rank && (
              <p className="text-lg font-display font-black text-amber-500">
                🏆 Ranking #{r.rank}
              </p>
            )}
          </div>

          {/* Progress bars */}
          <div className="space-y-3">
            {bobotDisplay.map((k, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>
                    {k.label}{" "}
                    <span className="text-slate-300">({k.bobot})</span>
                  </span>
                  <span className="font-medium">{k.nilai}</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((p?.[k.label.toLowerCase()] || 0) / 5) * 100}%`,
                    }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Booking terbaru */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card overflow-hidden mt-6"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Booking Terbaru
          </h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {bookings.length > 0 ? (
            bookings.slice(0, 5).map((b) => (
              <div
                key={b.booking_id || b.pemesanan_id}
                className="px-6 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {b.userName || b.user?.nama || "-"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {b.tanggal
                      ? new Date(b.tanggal).toLocaleDateString("id-ID")
                      : "-"}
                  </p>
                </div>
                <StatusBadge status={b.status} />
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-slate-400 text-sm">
              Belum ada booking
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
