import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiUsers,
  HiTrophy,
  HiClipboardDocumentList,
  HiCheckBadge,
  HiCurrencyDollar,
  HiArrowTrendingUp,
} from "react-icons/hi2";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatsCard from "../../components/ui/StatsCard";
import {
  BookingLineChart,
  CaborPieChart,
  AHPBobot,
  RankingBarChart,
} from "../../components/charts/Charts";
import RankingCard from "../../components/coach/RankingCard";
import { StatusBadge } from "../../components/ui/Badges";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// ✅ FIX: Fungsi hitungSkorAHP dihapus sepenuhnya.
//         Skor AHP kini dihitung eksklusif di backend (/api/admin/ranking),
//         sehingga Dashboard, halaman Ranking, dan RankingBarChart
//         selalu menampilkan angka yang identik.

export default function AdminDashboard() {
  const { api } = useAuth();
  const [stats, setStats] = useState(null);
  const [pelatihList, setPelatihList] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      // ✅ FIX: Gunakan /api/admin/ranking (sama dengan AdminRanking.jsx)
      //         sebagai satu-satunya sumber data pelatih + skor AHP.
      //         Tidak lagi fetch /api/pelatih lalu hitung sendiri di frontend.
      const [statsRes, rankingRes, bookingRes] = await Promise.all([
        api.get("/api/admin/stats"),
        api.get("/api/admin/ranking"),
        api.get("/api/admin/bookings"),
      ]);

      setStats(statsRes.data.data || statsRes.data);

      // Parse pelatih dari ranking endpoint (skor sudah dihitung backend)
      const rankingRaw = rankingRes.data.data || rankingRes.data;
      setPelatihList(
        rankingRaw.pelatih || (Array.isArray(rankingRaw) ? rankingRaw : [])
      );

      const bookingRaw = bookingRes.data.data || bookingRes.data;
      setBookingList(
        bookingRaw.bookings || (Array.isArray(bookingRaw) ? bookingRaw : [])
      );
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
    }).format(n);

  const s = stats || {
    totalPelatih: 0,
    pelatihAktif: 0,
    totalUser: 0,
    totalBooking: 0,
    bookingBulanIni: 0,
    pendingVerifikasi: 0,
    totalRevenue: 0,
    satisfactionRate: 0,
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard Admin" subtitle="Memuat data...">
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
      title="Dashboard Admin"
      subtitle="Selamat datang di panel admin SportCoach"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600"
        >
          {error}
        </motion.div>
      )}

      {/* Stats row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Pelatih"
          value={s.totalPelatih || 0}
          subtitle={`${s.pelatihAktif || 0} aktif`}
          icon={HiUsers}
          color="blue"
          trend={8}
          delay={0}
        />
        <StatsCard
          title="Total User"
          value={s.totalUser || 0}
          subtitle="Pengguna terdaftar"
          icon={HiTrophy}
          color="indigo"
          trend={12}
          delay={0.05}
        />
        <StatsCard
          title="Total Booking"
          value={s.totalBooking || 0}
          subtitle={`${s.bookingBulanIni || 0} bulan ini`}
          icon={HiClipboardDocumentList}
          color="cyan"
          trend={5}
          delay={0.1}
        />
        <StatsCard
          title="Pending Verifikasi"
          value={s.pendingVerifikasi || 0}
          subtitle="Menunggu review"
          icon={HiCheckBadge}
          color="amber"
          delay={0.15}
        />
      </div>

      {/* Stats row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <StatsCard
          title="Total Revenue"
          value={formatRp(s.totalRevenue || 0)}
          subtitle="Semua waktu"
          icon={HiCurrencyDollar}
          color="emerald"
          trend={18}
          delay={0.2}
        />
        <StatsCard
          title="Kepuasan"
          value={`${s.satisfactionRate || 0}/5.0`}
          subtitle="Rata-rata rating"
          icon={HiArrowTrendingUp}
          color="purple"
          trend={2}
          delay={0.25}
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 lg:col-span-2"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
            Tren Booking
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Jumlah booking per bulan
          </p>
          <BookingLineChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-6"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
            Distribusi Cabor
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Booking per cabang olahraga
          </p>
          <CaborPieChart />
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
            Bobot Kriteria AHP
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Distribusi bobot setiap kriteria
          </p>
          <AHPBobot />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="card p-6"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">
            Ranking Pelatih AHP
          </h3>
          <p className="text-xs text-slate-400 mb-4">Skor AHP top 8 pelatih</p>
          <RankingBarChart />
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
            Top 5 Pelatih
          </h3>
          <div className="space-y-1">
            {pelatihList.slice(0, 5).map((coach, i) => (
              <RankingCard
                key={coach.pelatih_id || coach.id}
                coach={coach}
                rank={i + 1}
                delay={i * 0.06}
              />
            ))}
            {pelatihList.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">
                Belum ada data pelatih
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Booking Terbaru
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  {["User", "Pelatih", "Cabor", "Status"].map((h) => (
                    <th key={h} className="table-header">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookingList.slice(0, 5).map((b) => (
                  <tr key={b.booking_id || b.id} className="table-row">
                    <td className="table-cell font-medium">
                      {b.userName || b.user?.nama || "-"}
                    </td>
                    <td className="table-cell text-slate-500 dark:text-slate-400">
                      {(b.pelatihNama || b.pelatih?.nama || "-").split(" ")[0]}
                    </td>
                    <td className="table-cell">
                      {b.cabor || b.pelatih?.cabang?.nama_cabor || "-"}
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
                {bookingList.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="table-cell text-center text-slate-400 py-4"
                    >
                      Belum ada booking
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}