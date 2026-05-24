import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiPencil, HiCheck, HiPlus, HiTrash } from "react-icons/hi2";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { StatusBadge } from "../../components/ui/Badges";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../components/ui/Avatar";
import toast from "react-hot-toast";

// Label skala 1-5 sesuai schema Prisma
const PENGALAMAN_LABEL = {
  1: "1 Tempat",
  2: "2 Tempat",
  3: "3 Tempat",
  4: "4 Tempat",
  5: "5+ Tempat",
};
const LISENSI_LABEL = {
  1: "Tidak Ada",
  2: "Daerah",
  3: "Nasional C",
  4: "Nasional A/B",
  5: "Internasional",
};
const PRESTASI_LABEL = {
  1: "Belum Ada",
  2: "Juara Daerah",
  3: "Juara Nasional",
  4: "Juara Internasional",
  5: "Olimpiade",
};
const BIAYA_LABEL = {
  1: "< Rp50rb",
  2: "Rp50–150rb",
  3: "Rp150–300rb",
  4: "Rp300–500rb",
  5: "> Rp500rb",
};
const SKALA_OPTIONS = [1, 2, 3, 4, 5];

// Ambil profil pelatih berdasarkan user yang login
async function fetchMyProfil(api, userName) {
  const res = await api.get("/api/pelatih");
  const raw = res.data.pelatih || res.data.data?.pelatih || res.data.data || [];
  const list = Array.isArray(raw) ? raw : [];
  // Cari berdasarkan nama user, fallback ke index 0
  return list.find((p) => p.nama === userName) || list[0] || null;
}

// ─── PROFIL ──────────────────────────────────────────────────────────────────
export function PelatihProfil() {
  const { user, api } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [myId, setMyId] = useState(null);
  const [caborList, setCaborList] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    cabor_id: "",
    cabor_nama: "",
    pengalaman: 1,
    lisensi: 1,
    prestasi: 1,
    biaya: 1,
    status_verifikasi: "pending",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [profil, caborRes] = await Promise.all([
          fetchMyProfil(api, user?.nama),
          api.get("/api/public/cabor"),
        ]);

        if (profil) {
          setMyId(profil.pelatih_id);
          setForm({
            nama: profil.nama || "",
            cabor_id: String(profil.cabor_id || ""),
            cabor_nama: profil.cabang?.nama_cabor || "",
            pengalaman: profil.pengalaman || 1,
            lisensi: profil.lisensi || 1,
            prestasi: profil.prestasi || 1,
            biaya: profil.biaya || 1,
            status_verifikasi: profil.status_verifikasi || "pending",
          });
        }

        const cRaw = caborRes.data.data || caborRes.data;
        setCaborList(Array.isArray(cRaw) ? cRaw : []);
      } catch {
        toast.error("Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!myId) return toast.error("ID pelatih tidak ditemukan");
    setSaving(true);
    try {
      await api.put(`/api/pelatih/${myId}`, {
        nama: form.nama,
        cabor_id: Number(form.cabor_id),
        pengalaman: Number(form.pengalaman),
        lisensi: Number(form.lisensi),
        prestasi: Number(form.prestasi),
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

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

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
        <div className="card p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar
              initials={form.nama?.slice(0, 2).toUpperCase() || "P"}
              size="xl"
              id={myId || 1}
            />
            <div>
              <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">
                {form.nama}
              </h3>
              <p className="text-slate-500 text-sm">{form.cabor_nama}</p>
              <StatusBadge status={form.status_verifikasi} />
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

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Nama */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                Nama Lengkap
              </label>
              {editing ? (
                <input
                  value={form.nama}
                  onChange={set("nama")}
                  className="input-field py-2 text-sm"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-2.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  {form.nama}
                </p>
              )}
            </div>

            {/* Cabor */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                Cabang Olahraga
              </label>
              {editing ? (
                <select
                  value={form.cabor_id}
                  onChange={(e) => {
                    const c = caborList.find(
                      (x) => String(x.cabor_id) === e.target.value,
                    );
                    setForm((p) => ({
                      ...p,
                      cabor_id: e.target.value,
                      cabor_nama: c?.nama_cabor || "",
                    }));
                  }}
                  className="input-field py-2 text-sm"
                >
                  <option value="">Pilih cabor</option>
                  {caborList.map((c) => (
                    <option key={c.cabor_id} value={String(c.cabor_id)}>
                      {c.nama_cabor}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-2.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  {form.cabor_nama || "-"}
                </p>
              )}
            </div>

            {/* Skala fields */}
            {[
              { key: "pengalaman", label: "Pengalaman", map: PENGALAMAN_LABEL },
              { key: "lisensi", label: "Lisensi", map: LISENSI_LABEL },
              { key: "prestasi", label: "Prestasi", map: PRESTASI_LABEL },
              { key: "biaya", label: "Biaya", map: BIAYA_LABEL },
            ].map(({ key, label, map }) => (
              <div key={key}>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                  {label}
                </label>
                {editing ? (
                  <select
                    value={form[key]}
                    onChange={set(key)}
                    className="input-field py-2 text-sm"
                  >
                    {SKALA_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n} — {map[n]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-2.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    {map[form[key]] || "-"}{" "}
                    <span className="text-slate-400 font-normal">
                      ({form[key]}/5)
                    </span>
                  </p>
                )}
              </div>
            ))}
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
  return (
    <DashboardLayout
      title="Jadwal Latihan"
      subtitle="Atur jadwal sesi latihan Anda"
    >
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 text-center"
        >
          <p className="text-slate-400 text-sm">
            Fitur jadwal belum tersedia — tabel jadwal belum ada di schema.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

// ─── STATUS ──────────────────────────────────────────────────────────────────
export function PelatihStatus() {
  const { user, api } = useAuth();
  const [profil, setProfil] = useState(null);
  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [myProfil, rankingRes] = await Promise.all([
          fetchMyProfil(api, user?.nama),
          api.get("/api/public/ranking"),
        ]);

        setProfil(myProfil);

        const rankRaw = rankingRes.data.data || rankingRes.data;
        const rankList = rankRaw.pelatih || [];
        const idx = rankList.findIndex(
          (p) => p.pelatih_id === myProfil?.pelatih_id,
        );
        setRanking({
          rank: idx >= 0 ? idx + 1 : null,
          skorAHP: idx >= 0 ? rankList[idx].skorAHP : 0,
        });
      } catch {
        toast.error("Gagal memuat status");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const p = profil;

  const komponen = [
    {
      label: "Pengalaman",
      bobot: "35%",
      nilai: PENGALAMAN_LABEL[p?.pengalaman] || "-",
      progress: (p?.pengalaman || 0) / 5,
      color: "from-primary-500 to-primary-700",
    },
    {
      label: "Lisensi",
      bobot: "25%",
      nilai: LISENSI_LABEL[p?.lisensi] || "-",
      progress: (p?.lisensi || 0) / 5,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      label: "Prestasi",
      bobot: "25%",
      nilai: PRESTASI_LABEL[p?.prestasi] || "-",
      progress: (p?.prestasi || 0) / 5,
      color: "from-cyan-400 to-cyan-600",
    },
    {
      label: "Biaya",
      bobot: "15%",
      nilai: BIAYA_LABEL[p?.biaya] || "-",
      progress: (p?.biaya || 0) / 5,
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
            <p className="text-5xl font-display font-black text-primary-700 dark:text-primary-400">
              {ranking?.skorAHP?.toFixed(2) || "0.00"}
            </p>
            <p className="text-sm text-amber-500 font-bold mt-2">
              {ranking?.rank
                ? `🏆 Ranking #${ranking.rank} Nasional`
                : "Belum masuk ranking"}
            </p>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
