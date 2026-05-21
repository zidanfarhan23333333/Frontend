import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  HiMagnifyingGlass,
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
} from "react-icons/hi2";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { StatusBadge } from "../../components/ui/Badges";
import Avatar from "../../components/ui/Avatar";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminPelatih() {
  const { api } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  // FIX: renamed from pelatihList to match usage throughout — was inconsistently called pemainList in render
  const [pelatihList, setPelatihList] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
    totalPages: 1,
  });

  const perPage = 6;

  useEffect(() => {
    fetchPelatih();
  }, [page]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPelatih();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPelatih = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/pelatih?search=${search}&page=${page}&limit=${perPage}`,
      );

      // Backend returns { pelatih: [...] } or { data: { pelatih: [...], pagination: {...} } }
      const data = res.data.data || res.data;
      // FIX: normalize across both response shapes
      const list = data.pelatih || (Array.isArray(data) ? data : []);
      setPelatihList(list);
      setPagination(
        data.pagination || {
          total: list.length,
          page,
          limit: perPage,
          totalPages: Math.ceil(list.length / perPage),
        },
      );
    } catch (err) {
      console.error("❌ Error fetching pelatih:", err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Gagal memuat data pelatih",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin hapus pelatih ini?")) return;
    try {
      await api.delete(`/api/pelatih/${id}`);
      toast.success("Pelatih dihapus");
      fetchPelatih();
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal menghapus");
    }
  };

  const handleViewDetail = (p) => {
    setSelected(p);
    setShowDetail(true);
  };

  const formatRp = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <DashboardLayout
      title="Manajemen Pelatih"
      subtitle="Kelola data pelatih terdaftar"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-xs">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2"
              placeholder="Cari pelatih..."
            />
          </div>
          <button
            onClick={() => toast("Form tambah pelatih (coming soon)")}
            className="btn-primary text-sm py-2"
          >
            <HiPlus className="w-4 h-4" /> Tambah Pelatih
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : pelatihList.length === 0 ? (
          // FIX: was pemainList.length (undefined) — now pelatihList.length
          <div className="py-12 text-center text-slate-400">
            <p className="font-semibold">Tidak ada data pelatih</p>
            <p className="text-sm">Coba ubah filter pencarian</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    {[
                      "Pelatih",
                      "Cabor",
                      "Pengalaman",
                      "Lisensi",
                      "Biaya/Sesi",
                      "Skor AHP",
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
                  {/* FIX: was iterating `paged` (= pemainList, undefined) — now directly pelatihList */}
                  {pelatihList.map((p, i) => (
                    <motion.tr
                      key={p.pelatih_id || p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <Avatar
                            initials={
                              p.nama
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2) || "P"
                            }
                            size="sm"
                            id={p.pelatih_id || p.id}
                          />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                              {p.nama}
                            </p>
                            <p className="text-xs text-slate-400">{p.lokasi}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        {p.cabor || p.cabang?.nama_cabor || "-"}
                      </td>
                      <td className="table-cell">{p.pengalaman || 0} Thn</td>
                      <td className="table-cell text-xs">{p.lisensi || "-"}</td>
                      <td className="table-cell font-medium text-primary-600 dark:text-primary-400">
                        {formatRp(p.biaya || 0)}
                      </td>
                      <td className="table-cell">
                        <span
                          className={`font-display font-black text-sm ${
                            (p.skorAHP || 0) >= 0.9
                              ? "text-emerald-500"
                              : "text-primary-600"
                          }`}
                        >
                          {(p.skorAHP || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="table-cell">
                        <StatusBadge
                          status={p.status_verifikasi || p.status || "pending"}
                        />
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewDetail(p)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 transition-colors"
                            title="Lihat Detail"
                          >
                            <HiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toast("Edit form (coming soon)")}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 transition-colors"
                            title="Edit"
                          >
                            <HiPencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.pelatih_id || p.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                            title="Hapus"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
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

      {/* Detail Modal */}
      <Modal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        title="Detail Pelatih"
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar
                initials={
                  selected.nama
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2) || "P"
                }
                size="xl"
                id={selected.pelatih_id || selected.id}
              />
              <div>
                <h4 className="font-display font-black text-xl text-slate-900 dark:text-white">
                  {selected.nama}
                </h4>
                <p className="text-slate-500 text-sm">
                  {selected.cabor || selected.cabang?.nama_cabor} ·{" "}
                  {selected.lokasi}
                </p>
                <StatusBadge
                  status={
                    selected.status_verifikasi || selected.status || "pending"
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Pengalaman", (selected.pengalaman || 0) + " Tahun"],
                ["Lisensi", selected.lisensi || "-"],
                ["Biaya/Sesi", formatRp(selected.biaya || 0)],
                ["Skor AHP", (selected.skorAHP || 0).toFixed(2)],
                ["Rating", (selected.rating || 0) + "/5.0"],
                ["Total Sesi", selected.totalBooking || 0],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3"
                >
                  <p className="text-xs text-slate-400">{k}</p>
                  <p className="font-bold text-slate-800 dark:text-white text-sm mt-0.5">
                    {v}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Prestasi</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {selected.prestasi || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Deskripsi</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {selected.deskripsi || "-"}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
