import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiPencil, HiCheck, HiPlus, HiTrash } from "react-icons/hi2";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../components/ui/Avatar";
import toast from "react-hot-toast";

// ─── PROFIL ──────────────────────────────────────────────────────────────────
export function PelatihProfil() {
  const { user, api } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    cabor: "",
    pengalaman: "",
    lisensi: "",
    biaya: "",
    lokasi: "",
    deskripsi: "",
  });

  useEffect(() => {
    api
      .get("/api/pelatih/my-profile")
      .then((res) => {
        const d = res.data.data || res.data;
        setForm({
          nama: d.nama || "",
          cabor: d.cabang?.nama_cabor || d.cabor || "",
          pengalaman: String(d.pengalaman || ""),
          lisensi: String(d.lisensi || ""),
          biaya: String(d.biaya || ""),
          lokasi: d.lokasi || "",
          deskripsi: d.deskripsi || "",
        });
      })
      .catch(() => toast.error("Gagal memuat profil"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/api/pelatih/my-profile", {
        ...form,
        pengalaman: Number(form.pengalaman),
        biaya: Number(form.biaya),
      });
      setEditing(false);
      toast.success("Profil berhasil disimpan!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <DashboardLayout
        title="Profil Saya"
        subtitle="Kelola informasi profil pelatih"
      >
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout
      title="Profil Saya"
      subtitle="Kelola informasi profil pelatih"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <div className="card p-6 mb-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar
              initials={
                user?.initials || form.nama?.slice(0, 2).toUpperCase() || "AB"
              }
              size="xl"
              id={1}
            />
            <div>
              <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">
                {form.nama}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {form.cabor} · {form.lokasi}
              </p>
              <span className="badge-green mt-1 inline-block">
                Terverifikasi
              </span>
            </div>
            <button
              onClick={() => (editing ? handleSave() : setEditing(true))}
              disabled={saving}
              className={`ml-auto btn-${editing ? "secondary" : "ghost"} text-sm`}
            >
              {editing ? (
                <>
                  <HiCheck className="w-4 h-4" />{" "}
                  {saving ? "Menyimpan..." : "Simpan"}
                </>
              ) : (
                <>
                  <HiPencil className="w-4 h-4" /> Edit
                </>
              )}
            </button>
          </div>

          {/* Fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Nama Lengkap", "nama", "text"],
              ["Cabang Olahraga", "cabor", "text"],
              ["Pengalaman (Tahun)", "pengalaman", "number"],
              ["Lisensi", "lisensi", "text"],
              ["Biaya per Sesi (Rp)", "biaya", "number"],
              ["Lokasi", "lokasi", "text"],
            ].map(([label, key, type]) => (
              <div key={key}>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                  {label}
                </label>
                {editing ? (
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    className="input-field py-2 text-sm"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-2.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    {key === "biaya"
                      ? `Rp ${parseInt(form.biaya || 0).toLocaleString("id-ID")}`
                      : form[key] || "-"}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Deskripsi */}
          <div className="mt-4">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
              Deskripsi
            </label>
            {editing ? (
              <textarea
                value={form.deskripsi}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deskripsi: e.target.value }))
                }
                className="input-field text-sm resize-none min-h-[80px]"
              />
            ) : (
              <p className="text-sm text-slate-700 dark:text-slate-300 py-2.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                {form.deskripsi || "-"}
              </p>
            )}
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary mt-5 w-full justify-center"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

// ─── JADWAL ──────────────────────────────────────────────────────────────────
export function PelatihJadwal() {
  const { api } = useAuth();
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newJadwal, setNewJadwal] = useState({
    hari: "Senin",
    jam: "",
    lokasi: "",
  });

  useEffect(() => {
    api
      .get("/api/pelatih/my-jadwal")
      .then((res) => setJadwal(res.data.data || res.data.jadwal || []))
      .catch(() => toast.error("Gagal memuat jadwal"))
      .finally(() => setLoading(false));
  }, []);

  const addJadwal = async () => {
    if (!newJadwal.jam || !newJadwal.lokasi) {
      toast.error("Lengkapi data jadwal");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/api/pelatih/my-jadwal", newJadwal);
      const created = res.data.data || res.data.jadwal;
      setJadwal((prev) => [...prev, created]);
      setShowForm(false);
      setNewJadwal({ hari: "Senin", jam: "", lokasi: "" });
      toast.success("Jadwal ditambahkan!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal menambah jadwal");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteJadwal = async (id) => {
    try {
      await api.delete(`/api/pelatih/my-jadwal/${id}`);
      setJadwal((prev) => prev.filter((x) => x.id !== id));
      toast.success("Jadwal dihapus");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal menghapus jadwal");
    }
  };

  return (
    <DashboardLayout
      title="Jadwal Latihan"
      subtitle="Atur jadwal sesi latihan Anda"
    >
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Jadwal Aktif
            </h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary text-sm py-2"
            >
              <HiPlus className="w-4 h-4" /> Tambah
            </button>
          </div>

          {/* Form tambah */}
          {showForm && (
            <div className="px-6 py-4 bg-primary-50 dark:bg-primary-900/10 border-b border-slate-100 dark:border-slate-700">
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                    Hari
                  </label>
                  <select
                    value={newJadwal.hari}
                    onChange={(e) =>
                      setNewJadwal((p) => ({ ...p, hari: e.target.value }))
                    }
                    className="input-field py-2 text-sm"
                  >
                    {[
                      "Senin",
                      "Selasa",
                      "Rabu",
                      "Kamis",
                      "Jumat",
                      "Sabtu",
                      "Minggu",
                    ].map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                    Jam
                  </label>
                  <input
                    value={newJadwal.jam}
                    onChange={(e) =>
                      setNewJadwal((p) => ({ ...p, jam: e.target.value }))
                    }
                    className="input-field py-2 text-sm"
                    placeholder="08:00-10:00"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                    Lokasi
                  </label>
                  <input
                    value={newJadwal.lokasi}
                    onChange={(e) =>
                      setNewJadwal((p) => ({ ...p, lokasi: e.target.value }))
                    }
                    className="input-field py-2 text-sm"
                    placeholder="GOR UNY"
                  />
                </div>
              </div>
              <button
                onClick={addJadwal}
                disabled={submitting}
                className="btn-primary mt-3 text-sm py-2"
              >
                {submitting ? "Menyimpan..." : "Simpan Jadwal"}
              </button>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : jadwal.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Belum ada jadwal
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {jadwal.map((j, i) => (
                <motion.div
                  key={j.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-6 py-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                    {j.hari.slice(0, 3)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {j.hari} · {j.jam}
                    </p>
                    <p className="text-xs text-slate-400">{j.lokasi}</p>
                  </div>
                  <span
                    className={`badge ${j.status === "available" ? "badge-green" : "badge-red"}`}
                  >
                    {j.status === "available" ? "Tersedia" : "Penuh"}
                  </span>
                  <button
                    onClick={() => deleteJadwal(j.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-400 transition-colors"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

// ─── STATUS ──────────────────────────────────────────────────────────────────
export function PelatihStatus() {
  const { api } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/pelatih/my-stats")
      .then((res) => setStats(res.data.data || res.data))
      .catch(() => toast.error("Gagal memuat status"))
      .finally(() => setLoading(false));
  }, []);

  const s = stats || { ranking: "-", skorAHP: 0, pengalaman: 0, lisensi: "-" };

  const komponen = [
    {
      label: "Pengalaman",
      bobot: "35%",
      nilai: `${s.pengalaman || 0} Tahun`,
      progress: s.skorKomponen?.pengalaman ?? 0,
      color: "from-primary-500 to-primary-700",
    },
    {
      label: "Lisensi",
      bobot: "25%",
      nilai: s.lisensi || "-",
      progress: s.skorKomponen?.lisensi ?? 0,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      label: "Prestasi",
      bobot: "25%",
      nilai: s.prestasi || "-",
      progress: s.skorKomponen?.prestasi ?? 0,
      color: "from-cyan-400 to-cyan-600",
    },
    {
      label: "Biaya",
      bobot: "15%",
      nilai: s.biaya
        ? `Rp ${Number(s.biaya).toLocaleString("id-ID")}/sesi`
        : "-",
      progress: s.skorKomponen?.biaya ?? 0,
      color: "from-emerald-400 to-emerald-600",
    },
  ];

  if (loading)
    return (
      <DashboardLayout
        title="Status & Ranking"
        subtitle="Pantau posisi dan skor AHP Anda"
      >
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout
      title="Status & Ranking"
      subtitle="Pantau posisi dan skor AHP Anda"
    >
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-6">
            Komponen Skor AHP
          </h3>
          <div className="space-y-5">
            {komponen.map((k, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                      {k.label}
                    </span>
                    <span className="ml-2 text-xs text-slate-400">
                      Bobot {k.bobot}
                    </span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {k.nilai}
                  </span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${k.progress * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                    className={`h-full rounded-full bg-gradient-to-r ${k.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-2xl text-center">
            <p className="text-xs text-slate-400 mb-1">Skor AHP Akhir</p>
            <p className="text-5xl font-display font-black gradient-text">
              {typeof s.skorAHP === "number" ? s.skorAHP.toFixed(2) : "0.00"}
            </p>
            <p className="text-sm text-amber-500 font-bold mt-2">
              🏆 Ranking #{s.ranking} Nasional
            </p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
