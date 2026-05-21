import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiCheckBadge, HiXCircle, HiClock } from "react-icons/hi2";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Avatar from "../../components/ui/Avatar";
import { StatusBadge } from "../../components/ui/Badges";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminVerifikasi() {
  const { api } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPelatih();
  }, []);

  const fetchPelatih = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/pelatih?limit=100");
      const raw = res.data.data || res.data;
      const data = raw.pelatih || (Array.isArray(raw) ? raw : []);
      setList(data);
    } catch (err) {
      console.error("❌ Error fetching pelatih:", err);
      toast.error(err.response?.data?.message || "Gagal memuat data pelatih");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      // FIX: pakai /api/admin/pelatih/:id/verify (sesuai adminRoutes.js)
      await api.patch(`/api/admin/pelatih/${id}/verify`, { status });
      setList((prev) =>
        prev.map((p) =>
          (p.pelatih_id || p.id) === id
            ? { ...p, status_verifikasi: status }
            : p,
        ),
      );
      toast.success(
        status === "terverifikasi"
          ? "Pelatih berhasil diverifikasi!"
          : "Pelatih ditolak.",
      );
    } catch (err) {
      console.error("❌ Error updating status:", err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Gagal memperbarui status",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const approve = (p) => updateStatus(p.pelatih_id || p.id, "terverifikasi");
  const reject = (p) => updateStatus(p.pelatih_id || p.id, "ditolak");

  const formatRp = (n) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);

  const isPending = (p) =>
    !p.status_verifikasi || p.status_verifikasi === "pending";
  const isVerified = (p) => p.status_verifikasi === "terverifikasi";
  const isRejected = (p) => p.status_verifikasi === "ditolak";

  const pending = list.filter(isPending);
  const verified = list.filter(isVerified);
  const rejected = list.filter(isRejected);

  if (loading) {
    return (
      <DashboardLayout
        title="Verifikasi Pelatih"
        subtitle="Review dan verifikasi pendaftaran pelatih baru"
      >
        <div className="flex items-center justify-center h-96">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Verifikasi Pelatih"
      subtitle="Review dan verifikasi pendaftaran pelatih baru"
    >
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Menunggu",
            value: pending.length,
            icon: HiClock,
            color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
          },
          {
            label: "Terverifikasi",
            value: verified.length,
            icon: HiCheckBadge,
            color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
          },
          {
            label: "Ditolak",
            value: rejected.length,
            icon: HiXCircle,
            color: "text-red-500 bg-red-50 dark:bg-red-900/20",
          },
          {
            label: "Total",
            value: list.length,
            icon: HiCheckBadge,
            color: "text-primary-600 bg-primary-50 dark:bg-primary-900/20",
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-5 flex items-center gap-4"
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center ${s.color}`}
            >
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-display font-black text-slate-900 dark:text-white">
                {s.value}
              </p>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pending list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card overflow-hidden mb-6"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <HiClock className="w-5 h-5 text-amber-500" /> Menunggu Verifikasi (
            {pending.length})
          </h3>
        </div>

        {pending.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <HiCheckBadge className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
            <p className="font-semibold">Semua sudah diverifikasi!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {pending.map((p, i) => {
              const id = p.pelatih_id || p.id;
              const isActioning = actionLoading === id;
              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className="px-6 py-4 flex items-center gap-4 flex-wrap"
                >
                  <Avatar
                    initials={
                      p.nama
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2) || "P"
                    }
                    size="sm"
                    id={id}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {p.nama}
                    </p>
                    <p className="text-xs text-slate-400">
                      {p.cabor || p.cabang?.nama_cabor || "-"} ·{" "}
                      {p.pengalaman || 0} thn · {p.lisensi || "-"} ·{" "}
                      {formatRp(p.biaya || 0)}/sesi
                    </p>
                    {p.prestasi && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {p.prestasi}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approve(p)}
                      disabled={isActioning}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold transition-colors"
                    >
                      {isActioning ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <HiCheckBadge className="w-4 h-4" />
                      )}
                      Setujui
                    </button>
                    <button
                      onClick={() => reject(p)}
                      disabled={isActioning}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-bold transition-colors"
                    >
                      {isActioning ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <HiXCircle className="w-4 h-4" />
                      )}
                      Tolak
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Verified list */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card overflow-hidden mb-6"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <HiCheckBadge className="w-5 h-5 text-emerald-500" /> Terverifikasi
            ({verified.length})
          </h3>
        </div>
        {verified.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            Belum ada pelatih terverifikasi
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {verified.map((p) => (
              <div
                key={p.pelatih_id || p.id}
                className="px-6 py-3 flex items-center gap-4"
              >
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
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    {p.nama}
                  </p>
                  <p className="text-xs text-slate-400">
                    {p.cabor || p.cabang?.nama_cabor || "-"} · Skor AHP:{" "}
                    {(p.skorAHP || 0).toFixed(2)}
                  </p>
                </div>
                <StatusBadge status="terverifikasi" />
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Rejected list */}
      {rejected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <HiXCircle className="w-5 h-5 text-red-500" /> Ditolak (
              {rejected.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {rejected.map((p) => {
              const id = p.pelatih_id || p.id;
              const isActioning = actionLoading === id;
              return (
                <div key={id} className="px-6 py-3 flex items-center gap-4">
                  <Avatar
                    initials={
                      p.nama
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2) || "P"
                    }
                    size="sm"
                    id={id}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                      {p.nama}
                    </p>
                    <p className="text-xs text-slate-400">
                      {p.cabor || p.cabang?.nama_cabor || "-"}
                    </p>
                  </div>
                  {/* Bisa disetujui ulang dari sini */}
                  <button
                    onClick={() => approve(p)}
                    disabled={isActioning}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 text-xs font-bold transition-colors"
                  >
                    {isActioning ? (
                      <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <HiCheckBadge className="w-3.5 h-3.5" />
                    )}
                    Setujui Ulang
                  </button>
                  <StatusBadge status="ditolak" />
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
