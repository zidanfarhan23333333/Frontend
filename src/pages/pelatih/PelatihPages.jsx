import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiPencil, HiCheck, HiPlus, HiTrash, HiCamera } from "react-icons/hi2";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { StatusBadge } from "../../components/ui/Badges";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../components/ui/Avatar";
import toast from "react-hot-toast";

// ─── Label skala 1-5 ─────────────────────────────────────────────────────────
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
const HARI_OPTIONS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

// ─── PROFIL ──────────────────────────────────────────────────────────────────
export function PelatihProfil() {
  const { user, api } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(null);
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
    deskripsi: "",
    spesialis: "",
    domisili: "",
    pengalaman_melatih: "",
    harga_min: "",
    harga_max: "",
  });
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [profilRes, caborRes] = await Promise.all([
          api.get("/api/pelatih/my-profile"),
          api.get("/api/cabor"),
        ]);

        const profil = profilRes.data.data || profilRes.data;
        if (profil) {
          setMyId(profil.pelatih_id);
          setFotoUrl(profil.foto || null);
          setForm({
            nama: profil.nama || "",
            cabor_id: String(profil.cabor_id || ""),
            cabor_nama: profil.cabang?.nama_cabor || "",
            pengalaman: profil.pengalaman || 1,
            lisensi: profil.lisensi || 1,
            prestasi: profil.prestasi || 1,
            biaya: profil.biaya || 1,
            status_verifikasi: profil.status_verifikasi || "pending",
            deskripsi: profil.deskripsi || "",
            spesialis: profil.spesialis || "",
            domisili: profil.domisili || "",
            pengalaman_melatih: profil.pengalaman_melatih || "",
            harga_min: profil.harga_min ? String(profil.harga_min) : "",
            harga_max: profil.harga_max ? String(profil.harga_max) : "",
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
    setSaving(true);
    try {
      await api.put("/api/pelatih/my-profile", {
        nama: form.nama,
        cabor_id: Number(form.cabor_id),
        pengalaman: Number(form.pengalaman),
        lisensi: Number(form.lisensi),
        prestasi: Number(form.prestasi),
        biaya: Number(form.biaya),
        deskripsi: form.deskripsi || null,
        spesialis: form.spesialis || null,
        domisili: form.domisili || null,
        pengalaman_melatih: form.pengalaman_melatih || null,
        harga_min: form.harga_min ? Number(form.harga_min) : null,
        harga_max: form.harga_max ? Number(form.harga_max) : null,
      });
      setEditing(false);
      toast.success("Profil berhasil disimpan!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadFoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran foto maksimal 2MB");
      return;
    }
    setUploadingFoto(true);
    try {
      const formData = new FormData();
      formData.append("foto", file);
      const res = await api.post("/api/pelatih/my-foto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFotoUrl(res.data.data.foto);
      toast.success("Foto berhasil diupload!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal upload foto");
    } finally {
      setUploadingFoto(false);
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
            {/* Avatar + upload foto */}
            <div className="relative flex-shrink-0 w-16 h-16">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100">
                {fotoUrl ? (
                  <img
                    src={`http://localhost:3000${fotoUrl}`}
                    alt={form.nama}
                    className="w-full h-full object-cover block"
                  />
                ) : (
                  <Avatar
                    initials={form.nama?.slice(0, 2).toUpperCase() || "P"}
                    size="xl"
                    id={myId || 1}
                  />
                )}
              </div>
              <label
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors ${
                  uploadingFoto ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploadingFoto ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HiCamera className="w-3 h-3 text-white" />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleUploadFoto}
                  disabled={uploadingFoto}
                />
              </label>
            </div>

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

            {/* Domisili */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                Domisili / Kota
              </label>
              {editing ? (
                <input
                  value={form.domisili}
                  onChange={set("domisili")}
                  className="input-field py-2 text-sm"
                  placeholder="Kabupaten Magelang"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-2.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  {form.domisili || "-"}
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

            {/* Spesialis */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                Spesialis
              </label>
              {editing ? (
                <input
                  value={form.spesialis}
                  onChange={set("spesialis")}
                  className="input-field py-2 text-sm"
                  placeholder="Antar Sekolah, Club, Daerah"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-2.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  {form.spesialis || "-"}
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

            {/* Range Harga */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                Harga Minimum (Rp)
              </label>
              {editing ? (
                <input
                  type="number"
                  value={form.harga_min}
                  onChange={set("harga_min")}
                  className="input-field py-2 text-sm"
                  placeholder="100000"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-2.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  {form.harga_min
                    ? `Rp ${Number(form.harga_min).toLocaleString("id-ID")}`
                    : "-"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                Harga Maksimum (Rp)
              </label>
              {editing ? (
                <input
                  type="number"
                  value={form.harga_max}
                  onChange={set("harga_max")}
                  className="input-field py-2 text-sm"
                  placeholder="250000"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 py-2.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  {form.harga_max
                    ? `Rp ${Number(form.harga_max).toLocaleString("id-ID")}`
                    : "-"}
                </p>
              )}
            </div>

            {/* Pengalaman Melatih */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                Pengalaman Melatih
              </label>
              {editing ? (
                <>
                  <p className="text-xs text-slate-400 mb-1">
                    Tulis satu per baris (nama sekolah, tim, atau klub)
                  </p>
                  <textarea
                    value={form.pengalaman_melatih}
                    onChange={set("pengalaman_melatih")}
                    className="input-field text-sm resize-none min-h-[120px]"
                    placeholder={
                      "SD N Pucungrejo 1\nSMP IT Ihsanul Fikri\nTIM Putra U19 KAB. Magelang"
                    }
                  />
                </>
              ) : (
                <div className="py-2.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl min-h-[60px]">
                  {form.pengalaman_melatih ? (
                    form.pengalaman_melatih
                      .split("\n")
                      .filter(Boolean)
                      .map((item, i) => (
                        <p
                          key={i}
                          className="text-sm font-semibold text-slate-800 dark:text-slate-100"
                        >
                          • {item}
                        </p>
                      ))
                  ) : (
                    <p className="text-sm text-slate-400">-</p>
                  )}
                </div>
              )}
            </div>

            {/* Deskripsi */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
                Deskripsi
              </label>
              {editing ? (
                <textarea
                  value={form.deskripsi}
                  onChange={set("deskripsi")}
                  className="input-field text-sm resize-none min-h-[80px]"
                  placeholder="Informasi tambahan tentang dirimu..."
                />
              ) : (
                <p className="text-sm text-slate-700 dark:text-slate-300 py-2.5 px-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl min-h-[60px]">
                  {form.deskripsi || "-"}
                </p>
              )}
            </div>
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
    jam_mulai: "",
    jam_selesai: "",
    lokasi: "",
  });

  useEffect(() => {
    api
      .get("/api/pelatih/jadwal")
      .then((res) => setJadwal(res.data.data || []))
      .catch(() => toast.error("Gagal memuat jadwal"))
      .finally(() => setLoading(false));
  }, []);

  const addJadwal = async () => {
    if (
      !newJadwal.jam_mulai ||
      !newJadwal.jam_selesai ||
      !newJadwal.lokasi.trim()
    ) {
      toast.error("Lengkapi semua data jadwal");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/api/pelatih/jadwal", newJadwal);
      setJadwal((prev) => [...prev, res.data.data]);
      setShowForm(false);
      setNewJadwal({
        hari: "Senin",
        jam_mulai: "",
        jam_selesai: "",
        lokasi: "",
      });
      toast.success("Jadwal ditambahkan!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal menambah jadwal");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteJadwal = async (id) => {
    try {
      await api.delete(`/api/pelatih/jadwal/${id}`);
      setJadwal((prev) => prev.filter((x) => x.jadwal_id !== id));
      toast.success("Jadwal dihapus");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal menghapus jadwal");
    }
  };

  const setField = (k) => (e) =>
    setNewJadwal((p) => ({ ...p, [k]: e.target.value }));

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
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                    Hari
                  </label>
                  <select
                    value={newJadwal.hari}
                    onChange={setField("hari")}
                    className="input-field py-2 text-sm"
                  >
                    {HARI_OPTIONS.map((h) => (
                      <option key={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    value={newJadwal.jam_mulai}
                    onChange={setField("jam_mulai")}
                    className="input-field py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    value={newJadwal.jam_selesai}
                    onChange={setField("jam_selesai")}
                    className="input-field py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 block">
                    Lokasi
                  </label>
                  <input
                    value={newJadwal.lokasi}
                    onChange={setField("lokasi")}
                    className="input-field py-2 text-sm"
                    placeholder="GOR UNY, Lapangan Bantul..."
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={addJadwal}
                  disabled={submitting}
                  className="btn-primary text-sm py-2"
                >
                  {submitting ? "Menyimpan..." : "Simpan Jadwal"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="btn-secondary text-sm py-2"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : jadwal.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-400 text-sm">Belum ada jadwal</p>
              <p className="text-slate-300 text-xs mt-1">
                Klik tombol Tambah untuk menambah jadwal latihan
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {jadwal.map((j, i) => (
                <motion.div
                  key={j.jadwal_id}
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
                      {j.hari} · {j.jam_mulai} – {j.jam_selesai}
                    </p>
                    <p className="text-xs text-slate-400">{j.lokasi}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      j.status === "available"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {j.status === "available" ? "Tersedia" : "Penuh"}
                  </span>
                  <button
                    onClick={() => deleteJadwal(j.jadwal_id)}
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

  const s = stats || {
    ranking: "-",
    skorAHP: 0,
    pengalaman: 1,
    lisensi: 1,
    prestasi: 1,
    biaya: 1,
    skorKomponen: { pengalaman: 0, lisensi: 0, prestasi: 0, biaya: 0 },
  };

  const komponen = [
    {
      label: "Pengalaman",
      bobot: "35%",
      nilai: PENGALAMAN_LABEL[s.pengalaman] || "-",
      progress: s.skorKomponen?.pengalaman ?? (s.pengalaman || 0) / 5,
      color: "from-primary-500 to-primary-700",
    },
    {
      label: "Lisensi",
      bobot: "25%",
      nilai: LISENSI_LABEL[s.lisensi] || "-",
      progress: s.skorKomponen?.lisensi ?? (s.lisensi || 0) / 5,
      color: "from-indigo-500 to-indigo-700",
    },
    {
      label: "Prestasi",
      bobot: "25%",
      nilai: PRESTASI_LABEL[s.prestasi] || "-",
      progress: s.skorKomponen?.prestasi ?? (s.prestasi || 0) / 5,
      color: "from-cyan-400 to-cyan-600",
    },
    {
      label: "Biaya",
      bobot: "15%",
      nilai: BIAYA_LABEL[s.biaya] || "-",
      progress: s.skorKomponen?.biaya ?? (s.biaya || 0) / 5,
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
              {typeof s.skorAHP === "number" ? s.skorAHP.toFixed(2) : "0.00"}
            </p>
            <p className="text-sm text-amber-500 font-bold mt-2">
              {s.ranking && s.ranking !== "-"
                ? `🏆 Ranking #${s.ranking} Nasional`
                : "Belum masuk ranking"}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center">
              <p className="text-xs text-slate-400 mb-1">Total Booking</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {s.totalBooking ?? 0}
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center">
              <p className="text-xs text-slate-400 mb-1">Total Siswa</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {s.totalSiswa ?? 0}
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center">
              <p className="text-xs text-slate-400 mb-1">Booking Bulan Ini</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {s.bookingBulanIni ?? 0}
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-center">
              <p className="text-xs text-slate-400 mb-1">Status Akun</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize">
                {s.statusVerifikasi ?? "pending"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
