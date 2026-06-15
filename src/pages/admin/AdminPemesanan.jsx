import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiMagnifyingGlass, HiCheck, HiXMark } from "react-icons/hi2";
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
  const [updating, setUpdating] = useState(null); // id yang sedang diupdate
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
        confirmed: list.filter((b) => b.status === "konfirmasi").length,
        pending: list.filter((b) => b.status === "pending").length,
        completed: list.filter((b) => b.status === "selesai").length,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memuat data booking");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    setUpdating(bookingId);
    try {
      await api.patch(`/api/admin/bookings/${bookingId}/status`, { status });
      toast.success(
        status === "konfirmasi"
          ? "Booking dikonfirmasi!"
          : "Booking dibatalkan!",
      );
      // Update lokal tanpa refetch
      setBookingList((prev) =>
        prev.map((b) =>
          (b.booking_id || b.id) === bookingId ? { ...b, status } : b,
        ),
      );
      setSummaryStats((prev) => ({
        ...prev,
        confirmed:
          status === "konfirmasi" ? prev.confirmed + 1 : prev.confirmed,
        pending: prev.pending - 1,
      }));
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal update status");
    } finally {
      setUpdating(null);
    }
  };

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
      {/* Stats */}
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
        {/* Search */}
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
                    {[
                      "#",
                      "User",
                      "Pelatih",
                      "Cabor",
                      "Tanggal",
                      "Status",
                      "Aksi",
                    ].map((h) => (
                      <th key={h} className="table-header whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {bookingList.map((b, i) => {
                    const bId = b.booking_id || b.id;
                    const isPending = b.status === "pending";
                    const isUpdating = updating === bId;
                    return (
                      <motion.tr
                        key={bId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="table-cell text-slate-400 text-xs">
                          #{bId}
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
                        <td className="table-cell">
                          {isPending ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateStatus(bId, "konfirmasi")}
                                disabled={isUpdating}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-semibold transition-colors disabled:opacity-50"
                              >
                                {isUpdating ? (
                                  <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <HiCheck className="w-3.5 h-3.5" />
                                )}
                                Konfirmasi
                              </button>
                              <button
                                onClick={() => updateStatus(bId, "dibatalkan")}
                                disabled={isUpdating}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-semibold transition-colors disabled:opacity-50"
                              >
                                <HiXMark className="w-3.5 h-3.5" />
                                Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
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
