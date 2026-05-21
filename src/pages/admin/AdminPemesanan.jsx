import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiMagnifyingGlass } from "react-icons/hi2";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { StatusBadge } from "../../components/ui/Badges";
import Pagination from "../../components/ui/Pagination";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminPemesanan() {
  const { api } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [bookingList, setBookingList] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    completed: 0,
  });

  const perPage = 8;

  useEffect(() => {
    fetchBookings();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchBookings();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // FIX: pakai /api/admin/bookings (bukan /api/booking yang tidak ada)
      const res = await api.get(
        `/api/admin/bookings?search=${search}&page=${page}&limit=${perPage}`,
      );
      const raw = res.data.data || res.data;
      const list = raw.bookings || (Array.isArray(raw) ? raw : []);
      const pag = raw.pagination || {
        total: list.length,
        totalPages: Math.ceil(list.length / perPage),
      };

      setBookingList(list);
      setPagination(pag);
      setSummaryStats({
        total: pag.total || list.length,
        confirmed: list.filter(
          (b) => b.status === "confirmed" || b.status === "dikonfirmasi",
        ).length,
        pending: list.filter(
          (b) => b.status === "pending" || b.status === "menunggu",
        ).length,
        completed: list.filter(
          (b) => b.status === "completed" || b.status === "selesai",
        ).length,
      });
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Gagal memuat data booking",
      );
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

  const statCards = [
    { label: "Total", val: summaryStats.total, col: "text-primary-600" },
    {
      label: "Dikonfirmasi",
      val: summaryStats.confirmed,
      col: "text-emerald-500",
    },
    { label: "Menunggu", val: summaryStats.pending, col: "text-amber-500" },
    { label: "Selesai", val: summaryStats.completed, col: "text-slate-500" },
  ];

  return (
    <DashboardLayout
      title="Manajemen Pemesanan"
      subtitle="Monitor seluruh booking pelatih"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {statCards.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-4 text-center"
          >
            <p className={`text-2xl font-display font-black ${s.col}`}>
              {s.val}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="relative max-w-xs">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="input-field pl-9 py-2"
              placeholder="Cari booking..."
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookingList.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="font-semibold">Tidak ada data booking</p>
            <p className="text-sm">Coba ubah filter pencarian</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    {["#", "User", "Pelatih", "Cabor", "Tanggal", "Status"].map(
                      (h) => (
                        <th key={h} className="table-header whitespace-nowrap">
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {bookingList.map((b, i) => (
                    <motion.tr
                      key={b.booking_id || b.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="table-cell text-slate-400 text-xs">
                        #{b.booking_id || b.id}
                      </td>
                      <td className="table-cell font-medium text-sm">
                        {b.userName || b.user?.nama || "-"}
                      </td>
                      <td className="table-cell text-sm text-slate-500 dark:text-slate-400">
                        {b.pelatihNama || b.pelatih?.nama || "-"}
                      </td>
                      <td className="table-cell text-sm">
                        {b.cabor || b.pelatih?.cabang?.nama_cabor || "-"}
                      </td>
                      <td className="table-cell text-xs text-slate-500">
                        {b.tanggal
                          ? new Date(b.tanggal).toLocaleDateString("id-ID")
                          : "-"}
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={b.status} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              total={pagination.total}
              perPage={perPage}
              onChange={setPage}
            />
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
