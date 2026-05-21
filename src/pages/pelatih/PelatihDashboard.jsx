import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiCalendarDays,
  HiClipboardDocumentList,
  HiCurrencyDollar,
  HiStar,
  HiTrophy,
  HiUsers,
} from "react-icons/hi2";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatsCard from "../../components/ui/StatsCard";
import { BookingLineChart } from "../../components/charts/Charts";
import { StatusBadge } from "../../components/ui/Badges";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function PelatihDashboard() {
  const { user, api } = useAuth();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, bookingsRes, jadwalRes] = await Promise.all([
        api.get("/api/pelatih/my-stats"),
        api.get("/api/pelatih/bookings"),
        api.get("/api/pelatih/my-jadwal"),
      ]);

      setStats(statsRes.data.data || statsRes.data);
      setBookings(
        bookingsRes.data.data?.bookings ||
          bookingsRes.data.data ||
          bookingsRes.data ||
          [],
      );
      setJadwal(jadwalRes.data.data || jadwalRes.data.jadwal || []);
    } catch (err) {
      console.error("❌ Error fetching dashboard:", err);
      setError(err.response?.data?.message || "Gagal memuat data");
      toast.error("Gagal memuat dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatRp = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n ?? 0);

  const s = stats ?? {
    totalBooking: 0,
    bookingBulanIni: 0,
    pendapatan: 0,
    rating: 0,
    totalSiswa: 0,
    ranking: 0,
    skorAHP: 0,
    statusVerifikasi: "pending",
  };

  const isVerified = s.statusVerifikasi === "terverifikasi";

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

  return (
    <DashboardLayout
      title={`Halo, ${user?.nama?.split(" ")[0] || "Pelatih"} 👋`}
      subtitle="Pantau aktivitas dan performa Anda"
    >
      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Verification banner — dinamis sesuai status */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-6 p-4 border rounded-2xl flex items-center gap-3 ${
          isVerified
            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30"
            : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isVerified ? "bg-emerald-500" : "bg-amber-500"}`}
        >
          <HiTrophy className="w-4 h-4 text-white" />
        </div>
        <div>
          <p
            className={`font-bold text-sm ${isVerified ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}
          >
            {isVerified ? "Akun Terverifikasi" : "Menunggu Verifikasi Admin"}
          </p>
          <p
            className={`text-xs ${isVerified ? "text-emerald-600/70 dark:text-emerald-400/70" : "text-amber-600/70 dark:text-amber-400/70"}`}
          >
            {isVerified
              ? "Profil Anda aktif dan dapat ditemukan oleh calon atlet."
              : "Proses verifikasi membutuhkan 1-3 hari kerja."}
          </p>
        </div>
        {isVerified && (
          <span className="ml-auto font-display font-black text-emerald-600 text-xl">
            #{s.ranking || "-"}
          </span>
        )}
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Booking"
          value={s.totalBooking}
          subtitle={`${s.bookingBulanIni} bulan ini`}
          icon={HiClipboardDocumentList}
          color="blue"
          delay={0}
        />
        <StatsCard
          title="Pendapatan"
          value={formatRp(s.pendapatan)}
          subtitle="Total semua waktu"
          icon={HiCurrencyDollar}
          color="emerald"
          delay={0.05}
        />
        <StatsCard
          title="Rating"
          value={`${s.rating ?? 0}/5`}
          subtitle="Dari atlet saya"
          icon={HiStar}
          color="amber"
          delay={0.1}
        />
        <StatsCard
          title="Total Siswa"
          value={s.totalSiswa}
          subtitle="Atlet aktif"
          icon={HiUsers}
          color="indigo"
          delay={0.15}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-6 lg:col-span-2"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
            Tren Booking Saya
          </h3>
          <p className="text-xs text-slate-400 mb-4">Jumlah sesi per bulan</p>
          <BookingLineChart />
        </motion.div>

        {/* AHP Score */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
            Skor AHP Saya
          </h3>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
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
                  strokeDasharray={`${(s.skorAHP ?? 0) * 251.2} 251.2`}
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
                <span className="font-display font-black text-3xl text-primary-700 dark:text-primary-400">
                  {s.skorAHP?.toFixed(2) ?? "0.00"}
                </span>
                <span className="text-xs text-slate-400">Skor AHP</span>
              </div>
            </div>
            <p className="text-2xl font-display font-black text-amber-500">
              #{s.ranking || "-"}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ranking Nasional
            </p>
          </div>

          {/* Bobot AHP — statis karena ini memang konfigurasi sistem */}
          <div className="space-y-2 mt-2">
            {[
              ["Pengalaman", "35%", 0.35],
              ["Lisensi", "25%", 0.25],
              ["Prestasi", "25%", 0.25],
              ["Biaya", "15%", 0.15],
            ].map(([k, pct, w]) => (
              <div key={k}>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>{k}</span>
                  <span>{pct}</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${w * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Jadwal & Booking terbaru */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Jadwal preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <HiCalendarDays className="w-5 h-5 text-primary-600" /> Jadwal
              Latihan
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {jadwal.length > 0 ? (
              jadwal.slice(0, 4).map((j) => (
                <div key={j.id} className="px-6 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                    {j.hari.slice(0, 3)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {j.hari} · {j.jam}
                    </p>
                    <p className="text-xs text-slate-400">{j.lokasi}</p>
                  </div>
                  <span
                    className={`badge ${j.status === "available" ? "badge-green" : "badge-red"}`}
                  >
                    {j.status === "available" ? "Tersedia" : "Penuh"}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm">
                Belum ada jadwal
              </div>
            )}
          </div>
        </motion.div>

        {/* Booking terbaru */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="card overflow-hidden"
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
                  key={b.id}
                  className="px-6 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {b.user?.nama || b.userName || "-"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {b.tanggal} · {b.jam} · {b.durasi}jam
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
      </div>
    </DashboardLayout>
  );
}
